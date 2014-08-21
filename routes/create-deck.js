var util = require('util');

/*
 * GET create deck page
 */

exports.form = function(req, res, next) {
  req.models.Class.list(function(error, classes) {
    if (error) {
      return next(error);
    }
    req.models.Archetype.list(function(error, archetypes) {
      if (error) {
        return next(error);
      }
      console.log('classes is ' + classes);
      console.log('archetypes is ' + archetypes);
      res.render('create-deck', {
        classes: classes,
        archetypes: archetypes
      });
    });
  });
};

exports.create = function(req, res, next) {
  console.log('req.body is ' + util.inspect(req.body));
  if (!req.body.name || !req.body.class || !req.body.archetype) {
    // Should redirect back to form with validation filled out
    res.end('Missing an important form field');
  }
  req.models.Archetype.find({name: req.body.archetype}, function(error, archetypes) {
    if (error) {
      return next(error);
    }
    var archetype = archetypes[0];
    if (!archetype) {
      res.end("You chose a broken archetype");
    }
    console.log('archetype is ' + util.inspect(archetype));
    var deck = {
      user: "michael.beenen@gmail.com",
      name: req.body.name,
      archetype: archetype._id
    };
    req.models.Deck.create(deck, function(error) {
      if (error) {
        return next(error);
      }
      res.redirect('/create-deck?success=1');
    });
  });
};

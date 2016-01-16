var util = require('util');

/*
 * GET create game page
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
      //console.log('classes is ' + classes);
      //console.log('archetypes is ' + archetypes);
      //console.log('req.query.deck is ' + req.query.deck);
      archetypes.forEach(function(archetype) {
        if (archetype._id == req.query.playerArchetype) {
          //console.log('found deck');
          archetype.selected = true;
        }
      });
      //console.log('decks is ' + util.inspect(decks));
      res.render('create-game', {
        classes: classes,
        archetypes: archetypes
      });
    });
  });
};

exports.create = function(req, res, next) {
  //console.log('req.body is ' + util.inspect(req.body));
  // Do some form validation
  if (!req.body.playerArchetype || !req.body.opponentArchetype || !req.body.result) {
    res.end('Missing an important form field');
  }

  req.models.Archetype.findOne({_id: req.body.opponentArchetype}, function(error, opponentArchetype) {
    if (error) {
      return next(error);
    }
    if (!opponentArchetype) {
      return next(new Error("You chose a broken opponent archetype"));
    }
    //console.log('opponentArchetype is ' + util.inspect(opponentArchetype));
    req.models.Archetype.findOne({_id: req.body.playerArchetype}, function(error, playerArchetype) {
      if (error) {
        return next(error);
      }
      if (!playerArchetype) {
        return next(new Error("You chose a broken player archetype"));
      }
      //console.log('deck is ' + util.inspect(playerArchetype));

      var game = {
        playerArchetype: playerArchetype._id,
        opponentArchetype: opponentArchetype._id,
        result: req.body.result,
        date: new Date()
      };
      req.models.Game.create(game, function(error) {
        if (error) {
          return next(error);
        }
        res.redirect('/create-game?success=1&playerArchetype='+playerArchetype._id);
      });
    });
  });
};

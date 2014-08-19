var util = require('util');

/*
 * GET create game page
 */

exports.form = function(req, res, next) {
  req.models.Class.find({}, function(error, classes) {
    if (error) {
      return next(error);
    }
    req.models.Archetype.find({}, function(error, archetypes) {
      if (error) {
        return next(error);
      }
      req.models.Deck.find({}, function(error, decks) {
        if (error) {
          return next(error);
        }
        console.log('classes is ' + classes);
        console.log('archetypes is ' + archetypes);
        console.log('decks is ' + decks);
        res.render('create-game', {
          classes: classes,
          archetypes: archetypes,
          decks: decks
        });
      });
    });
  });
};

exports.create = function(req, res, next) {
  console.log('req.body is ' + util.inspect(req.body));
  // Do some form validation
  if (!req.body.deck || !req.body.opponentDeck || !req.body.rank || !req.body.turn || !req.body.result) {
    res.end('Missing an important form field');
  }

  req.models.Archetype.find({name: req.body.opponentDeck}, function(error, archetypes) {
    if (error) {
      return next(error);
    }
    var archetype = archetypes[0];
    if (!archetype) {
      return next(new Error("You chose a broken archetype"));
    }
    console.log('archetype is ' + util.inspect(archetype));
    req.models.Deck.find({name: req.body.deck}, function(error, decks) {
      if (error) {
        return next(error);
      }
      var deck = decks[0];
      if (!deck) {
        return next(new Error("You chose a broken deck"));
      }
      console.log('deck is ' + util.inspect(deck));

      var game = {
        deck: deck._id,
        opponentArchetype: archetype._id,
        result: req.body.result,
        coin: req.body.coin,
        rank: req.body.rank,
        date: new Date(),
        turn: req.body.turn,
        notes: req.body.notes,
        tags: req.body.tags
      };
      req.models.Game.create(game, function(error) {
        if (error) {
          return next(error);
        }
        res.redirect('/create-game?success=1');
      });
    });
  });
};

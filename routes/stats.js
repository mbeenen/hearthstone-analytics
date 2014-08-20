var util = require('util');

/*
 * GET create deck page
 */

exports.view = function(req, res, next) {
  req.models.Deck.find({}, function(error, decks) {
    if (error) {
      return next(error);
    }
    if (!req.query.deck) {
      // We don't have a filter set, just render the view
      res.render('stats', {
        decks: decks
      });
      return;
    }

    req.models.Deck.findOne({name: req.query.deck}, function(error, deck) {
      console.log('deck is ' + util.inspect(deck));
      if (error) {
        return next(error);
      }
      if (!deck) {
        return next(new Error("You chose a broken deck"));
      }
      req.models.Game.find({deck: deck._id})
        .populate('deck')
        .exec(function (error, games) {
          if (error) {
            return next(error);
          }
          console.log('games is ' + util.inspect(games));
          req.models.Archetype.find({}, function(error, archetypes) {
            if (error) {
              return next(error);
            }
            console.log('archetypes is ' + util.inspect(archetypes));
            var statsMap = {};
            archetypes.forEach(function(archetype, index) {
              var archetypeKey = archetype.class + '-' + archetype.name;
              statsMap[archetype._id] = {
                name: archetypeKey,
                deckStats: {}
              };
              statsMap[archetype._id]['deckStats'][deck._id] = {
                name: deck.name,
                games: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                winRate: 0
              };
            });
            games.forEach(function(game) {
              var gameDeck = game.deck._id;
              var opponentArchetype = game.opponentArchetype;
              var archetypeDeckStats = statsMap[opponentArchetype]['deckStats'][gameDeck];
              archetypeDeckStats.games++;
              switch(game.result) {
              case 0:
                archetypeDeckStats.losses++;
                break;
              case 1:
                archetypeDeckStats.draws++;
                break;
              case 2:
                archetypeDeckStats.wins++;
                break;
              default:
                break;
              }
              archetypeDeckStats.winRate = (archetypeDeckStats.wins) / (archetypeDeckStats.games - archetypeDeckStats.draws);
            });
            
            console.log('stats map is ' + util.inspect(statsMap, false, 5));
            res.render('stats', {
              decks: decks,
              statsMap: statsMap
            });
          });
        });
    });
  });
};

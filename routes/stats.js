var util = require('util');
var numeral = require('numeral');

/*
 * GET create deck page
 */

exports.view = function(req, res, next) {
  req.models.Deck.list(function(error, decks) {
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
      var gameQuery = req.models.Game.find({deck: deck._id})
            .populate('deck')
            .populate('opponentArchetype');
      if (req.query.days) {
        var queryDate = new Date();
        queryDate.setDate(queryDate.getDate() + (-1 * req.query.days));
        gameQuery.where('date').gt(queryDate);
      }
      gameQuery.exec(function (error, games) {
        if (error) {
          return next(error);
        }
        console.log('games is ' + util.inspect(games));
        req.models.Archetype.list(function(error, archetypes) {
          if (error) {
            return next(error);
          }
          console.log('archetypes is ' + util.inspect(archetypes));
          var statsMap = {
            All: {
              name: 'All',
              deckStats: {}
            }
          };
          statsMap['All']['deckStats'][deck._id] = {
            name: deck.name,
            games: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            winRate: "N/A"
          };
          games.forEach(function(game) {
            var gameDeck = game.deck._id;
            var opponentArchetype = game.opponentArchetype;
            var archetypeDeckStats = statsMap[opponentArchetype._id];
            if (!archetypeDeckStats) {
              statsMap[opponentArchetype._id] = {
                name: opponentArchetype.class + '-' + opponentArchetype.name,
                deckStats: {}
              };
            }
            archetypeDeckStats = statsMap[opponentArchetype._id]['deckStats'];
            if (!archetypeDeckStats[gameDeck]) {
              archetypeDeckStats[gameDeck] = {
                name: game.deck.name,
                games: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                winRate: "N/A"
              };
            }
            archetypeDeckStats = statsMap[opponentArchetype._id]['deckStats'][gameDeck];
            var totalDeckStats = statsMap['All']['deckStats'][gameDeck];
            totalDeckStats.games++;
            archetypeDeckStats.games++;
            switch(game.result) {
            case 0:
              totalDeckStats.losses++;
              archetypeDeckStats.losses++;
              break;
            case 1:
              totalDeckStats.draws++;
              archetypeDeckStats.draws++;
              break;
            case 2:
              totalDeckStats.wins++;
              archetypeDeckStats.wins++;
              break;
            default:
              break;
            }
            archetypeDeckStats.winRate = numeral((archetypeDeckStats.wins) / (archetypeDeckStats.games - archetypeDeckStats.draws)).format('0.00');
            totalDeckStats.winRate = numeral((totalDeckStats.wins) / (totalDeckStats.games - totalDeckStats.draws)).format('0.00');
          });
          console.log('statsMap is ' + util.inspect(statsMap));
          var statsArray = [];
          for (entry in statsMap) {
            if(statsMap.hasOwnProperty(entry)) {
              statsArray.push(statsMap[entry]);
            }
          }
          console.log('stats array is ' + util.inspect(statsArray));
          statsArray.sort(function(a,b) {
            return a.name.localeCompare(b.name);
          });
          console.log('stats array is ' + util.inspect(statsArray));
          res.render('stats', {
            decks: decks,
            statsMap: statsArray
          });
        });
      });
    });
  });
};

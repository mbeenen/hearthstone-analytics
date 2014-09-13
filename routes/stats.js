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

    var statsDeck;
    if (req.query.deck) {
      decks.forEach(function(deck) {
        if (deck.name == req.query.deck) {
          statsDeck = deck;
        }
      });
    }
    console.log('statsDeck is ' + util.inspect(statsDeck));
    var gameQuery;
    if (statsDeck) {
      console.log('looking for specific deck');
      gameQuery = req.models.Game.find({deck: statsDeck._id});
    } else {
      gameQuery = req.models.Game.find();
    }
    gameQuery.populate('deck').populate('opponentArchetype');
    if (req.query.days) {
      var queryDate = new Date();
      queryDate.setDate(queryDate.getDate() + (-1 * req.query.days));
      gameQuery.where('date').gt(queryDate);
    }
    gameQuery.exec(function (error, games) {
      if (error) {
        return next(error);
      }
      // console.log('games is ' + util.inspect(games));
      req.models.Archetype.list(function(error, archetypes) {
        if (error) {
          return next(error);
        }
        //console.log('archetypes is ' + util.inspect(archetypes));
        var statsMap = {
          All: {
            name: 'All',
            deckStats: {}
          }
        };
        games.forEach(function(game) {
          var gameDeck = game.deck;
          if (!statsMap['All']['deckStats'][game.deck._id]) {
            statsMap['All']['deckStats'][gameDeck._id] = {
              name: gameDeck.name,
              games: 0,
              wins: 0,
              losses: 0,
              draws: 0,
              winRate: "N/A"
            };
          }
          var opponentArchetype = game.opponentArchetype;
          var archetypeDeckStats = statsMap[opponentArchetype._id];
          if (!archetypeDeckStats) {
            statsMap[opponentArchetype._id] = {
              name: opponentArchetype.class + '-' + opponentArchetype.name,
              deckStats: {}
            };
          }
          archetypeDeckStats = statsMap[opponentArchetype._id]['deckStats'];
          if (!archetypeDeckStats[gameDeck._id]) {
            archetypeDeckStats[gameDeck._id] = {
              name: game.deck.name,
              games: 0,
              wins: 0,
              losses: 0,
              draws: 0,
              winRate: "N/A"
            };
          }
          archetypeDeckStats = statsMap[opponentArchetype._id]['deckStats'][gameDeck._id];
          var totalDeckStats = statsMap['All']['deckStats'][gameDeck._id];
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
        //console.log('statsMap is ' + util.inspect(statsMap));
        var statsArray = [];
        for (entry in statsMap) {
          if(statsMap.hasOwnProperty(entry)) {
            statsArray.push(statsMap[entry]);
          }
        }
        //console.log('stats array is ' + util.inspect(statsArray));
        statsArray.sort(function(a,b) {
          return a.name.localeCompare(b.name);
        });
        //console.log('stats array is ' + util.inspect(statsArray));
        res.render('stats', {
          decks: decks,
          statsMap: statsArray
        });
      });
    });
  });
};

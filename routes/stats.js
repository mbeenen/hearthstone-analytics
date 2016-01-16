var util = require('util');
var numeral = require('numeral');

/*
 * GET create deck page
 */

exports.view = function(req, res, next) {
  var deckMap = {};
  var gameQuery;
  if (req.query.playerArchetype) {
    console.log('looking for specific deck ' + req.query.playerArchetype);
    gameQuery = req.models.Game.find({playerArchetype: req.query.playerArchetype});
  } else {
    gameQuery = req.models.Game.find();
  }

  gameQuery.populate('playerArchetype').populate('opponentArchetype');
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
      // console.log('archetypes is ' + util.inspect(archetypes));
      var statsMap = {
        All: {
          name: 'All',
          playerArchetypeStats: {
            All : {
              class: 'All',
              name: 'All',
              games: 0,
              wins: 0,
              losses: 0,
              draws: 0,
              winRate: "N/A"
            }
          }
        }
      };
      games.forEach(function(game) {
        var gamePlayerArchetype = game.playerArchetype;
        var gamePlayerArchetypeLabel = gamePlayerArchetype.class + ' - ' + gamePlayerArchetype.name;
        if (!statsMap['All']['playerArchetypeStats'][game.playerArchetype._id]) {
          statsMap['All']['playerArchetypeStats'][gamePlayerArchetype._id] = {
            name: gamePlayerArchetypeLabel,
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
            name: opponentArchetype.class + ' - ' + opponentArchetype.name,
            playerArchetypeStats: {
              All : {
                name: 'All',
                games: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                winRate: "N/A"
              }
            }
          };
        }
        archetypeDeckStats = statsMap[opponentArchetype._id]['playerArchetypeStats'];
        if (!archetypeDeckStats[gamePlayerArchetype._id]) {
          archetypeDeckStats[gamePlayerArchetype._id] = {
            name: gamePlayerArchetypeLabel,
            games: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            winRate: "N/A"
          };
        }
        var allStats = statsMap['All']['playerArchetypeStats']['All'];
        var opponentArchetypeAllStats = statsMap[opponentArchetype._id]['playerArchetypeStats']['All'];
        opponentArchetypeGameArchetypeStats = statsMap[opponentArchetype._id]['playerArchetypeStats'][gamePlayerArchetype._id];
        var gameArchetypeAllStats = statsMap['All']['playerArchetypeStats'][gamePlayerArchetype._id];
        allStats.games++;
        gameArchetypeAllStats.games++;
        opponentArchetypeAllStats.games++;
        opponentArchetypeGameArchetypeStats.games++;
        switch(game.result) {
        case 0:
          allStats.losses++;
          gameArchetypeAllStats.losses++;
          opponentArchetypeGameArchetypeStats.losses++;
          opponentArchetypeAllStats.losses++;
          break;
        case 1:
          allStats.draws++;
          gameArchetypeAllStats.draws++;
          opponentArchetypeGameArchetypeStats.draws++;
          opponentArchetypeAllStats.draws++;
          break;
        case 2:
          allStats.wins++;
          gameArchetypeAllStats.wins++;
          opponentArchetypeGameArchetypeStats.wins++;
          opponentArchetypeAllStats.wins++;
          break;
        default:
          break;
        }
        opponentArchetypeGameArchetypeStats.winRate = numeral((opponentArchetypeGameArchetypeStats.wins) / (opponentArchetypeGameArchetypeStats.games - opponentArchetypeGameArchetypeStats.draws)).format('0.00');
        opponentArchetypeAllStats.winRate = numeral((opponentArchetypeAllStats.wins) / (opponentArchetypeAllStats.games - opponentArchetypeAllStats.draws)).format('0.00');
        gameArchetypeAllStats.winRate = numeral((gameArchetypeAllStats.wins) / (gameArchetypeAllStats.games - gameArchetypeAllStats.draws)).format('0.00');
        allStats.winRate = numeral((allStats.wins) / (allStats.games - allStats.draws)).format('0.00');
      });
      // console.log('statsMap is ' + util.inspect(statsMap));
      var statsArray = [];
      for (entry in statsMap) {
        if(statsMap.hasOwnProperty(entry)) {
          statsArray.push(statsMap[entry]);
        }
      }
      // console.log('stats array is ' + util.inspect(statsArray));
      statsArray.sort(function(a,b) {
        return a.name.localeCompare(b.name);
      });
      console.log('stats array is ' + util.inspect(statsArray));
      res.render('stats', {
        archetypes: archetypes,
        statsMap: statsArray
      });
    });
  });
};

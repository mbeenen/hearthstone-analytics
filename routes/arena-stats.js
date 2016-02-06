var util = require('util');
var numeral = require('numeral');

/*
 * GET create deck page
 */

exports.view = function(req, res, next) {
  var deckMap = {};
  var gameQuery;
  if (req.query.playerClass) {
    console.log('looking for specific class ' + req.query.playerClass);
    gameQuery = req.models.ArenaGame.find({playerClass: req.query.playerClass});
  } else {
    gameQuery = req.models.ArenaGame.find();
  }

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
    req.models.Class.list(function(error, classes) {
      if (error) {
        return next(error);
      }
      var statsMap = {
        All: {
          name: 'All',
          playerClassStats: {
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
        var gamePlayerClass = game.playerClass;
        if (!statsMap['All']['playerClassStats'][game.playerClass]) {
          statsMap['All']['playerClassStats'][game.playerClass] = {
            name: game.playerClass,
            games: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            winRate: "N/A"
          };
        }
        var opponentClass = game.opponentClass;
        var opponentClassStats = statsMap[opponentClass];
        if (!opponentClassStats) {
          statsMap[opponentClass] = {
            name: opponentClass,
            playerClassStats: {
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
        var classDeckStats = statsMap[opponentClass]['playerClassStats'];
        if (!classDeckStats[gamePlayerClass]) {
          classDeckStats[gamePlayerClass] = {
            name: gamePlayerClass,
            games: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            winRate: "N/A"
          };
        }
        var allStats = statsMap['All']['playerClassStats']['All'];
        var opponentClassAllStats = statsMap[opponentClass]['playerClassStats']['All'];
        opponentClassGameClassStats = statsMap[opponentClass]['playerClassStats'][gamePlayerClass];
        var gameClassAllStats = statsMap['All']['playerClassStats'][gamePlayerClass];
        allStats.games++;
        gameClassAllStats.games++;
        opponentClassAllStats.games++;
        opponentClassGameClassStats.games++;
        switch(game.result) {
        case 0:
          allStats.losses++;
          gameClassAllStats.losses++;
          opponentClassGameClassStats.losses++;
          opponentClassAllStats.losses++;
          break;
        case 1:
          allStats.draws++;
          gameClassAllStats.draws++;
          opponentClassGameClassStats.draws++;
          opponentClassAllStats.draws++;
          break;
        case 2:
          allStats.wins++;
          gameClassAllStats.wins++;
          opponentClassGameClassStats.wins++;
          opponentClassAllStats.wins++;
          break;
        default:
          break;
        }
        opponentClassGameClassStats.winRate = numeral((opponentClassGameClassStats.wins) / (opponentClassGameClassStats.games - opponentClassGameClassStats.draws)).format('0.00');
        opponentClassAllStats.winRate = numeral((opponentClassAllStats.wins) / (opponentClassAllStats.games - opponentClassAllStats.draws)).format('0.00');
        gameClassAllStats.winRate = numeral((gameClassAllStats.wins) / (gameClassAllStats.games - gameClassAllStats.draws)).format('0.00');
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
      res.render('arena-stats', {
        classes: classes,
        statsMap: statsArray
      });
    });
  });
};

exports.arenaStats = require('./arena-stats');
exports.createGame = require('./create-game');
exports.createArenaGame = require('./create-arena-game');
exports.createArchetype = require('./create-archetype');
exports.stats = require('./stats');

/*
 * GET home page.
 */

exports.index = function(req, res, next){
  //console.log('using index route');
  res.render('home');
};

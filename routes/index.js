exports.createDeck = require('./create-deck');
exports.createGame = require('./create-game');
exports.createArchetype = require('./create-archetype');
exports.stats = require('./stats');

/*
 * GET home page.
 */

exports.index = function(req, res, next){
  //console.log('using index route');
  res.render('home');
};

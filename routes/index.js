exports.createDeck = require('./create-deck');

/*
 * GET home page.
 */

exports.index = function(req, res, next){
  console.log('using index route');
  res.render('home');
};

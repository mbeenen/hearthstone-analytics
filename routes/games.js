var util = require('util');

exports.list = function(req, res, next) {
  req.models.Deck.list(function(error, decks) {
    if (error) {
      return next(error);
    }
    if (!req.query.deck) {
      res.render('games', {
        decks: decks
      });
      return;
    }
    var gameQuery = req.models.Game.find({deck: deck._id})
          .populate('deck')
          .populate('opponentArchetype');
    if (req.query.days) {
      var queryDate = new Date();
      queryDate.setDate(queryDate.getDate() + (-1 * req.query.days));
      gameQuery.where('date').gt(queryDate);
    }
  });
};

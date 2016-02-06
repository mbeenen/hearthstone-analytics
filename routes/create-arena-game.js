var util = require('util');

/*
 * GET create game page
 */

exports.form = function(req, res, next) {
  req.models.Class.list(function(error, classes) {
    if (error) {
      return next(error);
    }
    classes.forEach(function(clazz) {
      if (clazz._id == req.query.playerClass) {
        clazz.selected = true;
      }
    });
    res.render('create-arena-game', {
      classes: classes
    });
  });
};

exports.create = function(req, res, next) {
  if (!req.body.playerClass || !req.body.opponentClass || !req.body.result) {
    res.end('Missing an important form field');
  }

  req.models.Class.findOne({_id: req.body.opponentClass}, function(error, opponentClass) {
    if (error) {
      return next(error);
    }
    if (!opponentClass) {
      return next(new Error("You chose a broken opponent class"));
    }
    req.models.Class.findOne({_id: req.body.playerClass}, function(error, playerClass) {
      if (error) {
        return next(error);
      }
      if (!playerClass) {
        return next(new Error("You chose a broken player archetype"));
      }

      var game = {
        playerClass: playerClass._id,
        opponentClass: opponentClass._id,
        result: req.body.result,
        date: new Date()
      };
      req.models.ArenaGame.create(game, function(error) {
        if (error) {
          return next(error);
        }
        res.redirect('/create-arena-game?success=1&playerClass='+playerClass._id);
      });
    });
  });
};

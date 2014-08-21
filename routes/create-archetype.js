var util = require('util');

exports.form = function(req, res, next) {
  req.models.Class.find({}, function(error, classes) {
    if (error) {
      return next(error);
    }
    res.render('create-archetype', {
      classes: classes
    });
  });
};

exports.create = function(req, res, next) {
  if (!req.body.name || !req.body.class) {
    // Do some form validation
    res.end('Missing important form field');
  }
  var archetype = {
    name: req.body.name,
    class: req.body.class
  };
  req.models.Archetype.create(archetype, function(error) {
    if (error) {
      return next(error);
    }
    res.redirect('/create-archetype?success=1');
  });
};

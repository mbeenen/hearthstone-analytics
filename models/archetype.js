var mongoose = require('mongoose');

var archetypeSchema = new mongoose.Schema({
  class: {
    type: String,
    ref: 'Class',
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

archetypeSchema.static({
  list: function(callback) {
    this.find({}, null, {sort: {class: 1, name: 1}}, callback);
  }
});

module.exports = mongoose.model('Archetype', archetypeSchema);

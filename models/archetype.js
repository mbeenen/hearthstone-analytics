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

module.exports = mongoose.model('Archetype', archetypeSchema);

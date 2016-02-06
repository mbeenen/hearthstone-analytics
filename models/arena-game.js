var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var gameSchema = new Schema({
  playerClass: {
    type: String,
    ref: 'Class',
    required: true
  },
  opponentClass: {
    type: String,
    ref: 'Class',
    required: true
  },
  result: {
    type: Number,
    required: true,
    validate: [
      function(value) {
        return value >= 0 && value <= 2;
      },
      'Result must be between 0 and 2'
    ]
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('ArenaGame', gameSchema);

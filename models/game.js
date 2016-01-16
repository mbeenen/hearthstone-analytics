var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var gameSchema = new Schema({
  playerArchetype: {
    type: Schema.Types.ObjectId,
    ref: 'Archetype',
    required: true
  },
  opponentArchetype: {
    type: Schema.Types.ObjectId,
    ref: 'Archetype',
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

module.exports = mongoose.model('Game', gameSchema);

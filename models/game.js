var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var gameSchema = new Schema({
  deck: {
    type: Schema.Types.ObjectId,
    ref: 'Deck',
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
  coin: {
    type: Boolean,
    default: false
  },
  rank: {
    type: Number,
    required: true,
    validate: [
      function(value) {
        return value >= 0 && value <= 25;
      },
      'Rank must be between 0 and 25'
    ]
  },
  date: {
    type: Date,
    required: true
  },
  turn: {
    type: Number,
    validate: [
      function(value) {
        return value >= 1 && value <= 10;
      }
    ],
    required: true
  },
  notes: {
    type: String,
    validate: [
      function(value) {
        return value.length <= 600;
      },
      'Notes are too long (600 max)'
    ]
  },
  tags: {
    type: String,
    validate: [
      function(value) {
        return value.length <= 100;
      },
      'tags are too long (100 max)'
    ]
  }
});

module.exports = mongoose.model('Game', gameSchema);

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var deckSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate: [
      function(value) {
        return value.length <= 120;
      },
      'Title is too long (120 max)'
    ]
  },
  archetype: {
    type: Schema.Types.ObjectId,
    ref: 'Archetype',
    required: true
  },
  _creator: {
    type: String,
    ref: 'User'
  }
});

deckSchema.static({
  list: function(callback) {
    this.find({}, null, {sort: {name: 1}}, callback);
  }
});

module.exports = mongoose.model('Deck', deckSchema);


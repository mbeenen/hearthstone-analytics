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
deckSchema.virtual('selected').get(function() {
  return this._selected;
});

deckSchema.virtual('selected').set(function(selected) {
  return this._selected = selected;
});
deckSchema.set('toObject', {
  getters: true
});
deckSchema.static({
  list: function(callback) {
    this.find({}, null, {sort: {name: 1}}, callback);
  }
});

module.exports = mongoose.model('Deck', deckSchema);


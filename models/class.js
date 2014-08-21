var mongoose = require('mongoose');

var classSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  }
});

classSchema.static({
  list: function(callback) {
    this.find({}, null, {sort: {_id: 1}}, callback);
  }
});

module.exports = mongoose.model('Class', classSchema);

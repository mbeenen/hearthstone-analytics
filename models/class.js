var mongoose = require('mongoose');

var classSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Class', classSchema);

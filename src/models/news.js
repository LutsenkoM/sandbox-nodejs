const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
    required: true
  }
}, {
  timestamps: true
});

const News = mongoose.model('News', newsSchema);

module.exports = News;

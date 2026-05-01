const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  bookValuePerShare: {
    type: Number,
    required: true,
  },
  lastFetchedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('Asset', AssetSchema);
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chat: [{
    role: String, // 'user' or 'ai'
    content: String,
    timestamp: { type: Date, default: Date.now },
  }],
  code: {
    jsx: String,
    css: String,
  },
  uiState: Object,
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema); 
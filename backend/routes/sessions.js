const express = require('express');
const Session = require('../models/Session');
const auth = require('../middleware/auth');

const router = express.Router();

// List all sessions for user
router.get('/', auth, async (req, res) => {
  const sessions = await Session.find({ user: req.user.userId }).sort({ updatedAt: -1 });
  res.json(sessions);
});

// Create new session
router.post('/', auth, async (req, res) => {
  const session = await Session.create({ user: req.user.userId, chat: [], code: { jsx: '', css: '' }, uiState: {} });
  res.status(201).json(session);
});

// Get a specific session
router.get('/:id', auth, async (req, res) => {
  const session = await Session.findOne({ _id: req.params.id, user: req.user.userId });
  if (!session) return res.status(404).json({ message: 'Session not found' });
  res.json(session);
});

// Update session (chat/code/uiState)
router.put('/:id', auth, async (req, res) => {
  const { chat, code, uiState } = req.body;
  const session = await Session.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    { chat, code, uiState },
    { new: true }
  );
  if (!session) return res.status(404).json({ message: 'Session not found' });
  res.json(session);
});

// Optional: Delete session
router.delete('/:id', auth, async (req, res) => {
  const session = await Session.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
  if (!session) return res.status(404).json({ message: 'Session not found' });
  res.json({ message: 'Session deleted' });
});

module.exports = router; 
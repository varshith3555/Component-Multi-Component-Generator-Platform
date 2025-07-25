const express = require('express');
const auth = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// POST /api/ai/generate
router.post('/generate', auth, async (req, res) => {
  const { prompt, code, chat } = req.body;
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/gpt-4o', // or llama3, etc.
        messages: [
          ...((chat || []).map(msg => ({ role: msg.role, content: msg.content }))),
          { role: 'user', content: prompt },
        ],
        // Optionally, you can send code context as system message
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // Expecting AI to return code in response. You may need to parse/format as needed.
    res.json({ ai: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: 'AI request failed', error: err.message });
  }
});

module.exports = router; 
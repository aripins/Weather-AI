const express = require('express');
const router = express.Router();
const { callPythonAPI } = require('../utils/pythonApi');
const db = require('../config/database');

router.post('/ask', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    // Save chat history to database
    if (db) {
      const query = 'INSERT INTO chat_history (question, context) VALUES (?, ?)';
      db.execute(query, [question, JSON.stringify(context)]);
    }

    const response = await callPythonAPI('/chatbot/ask', {
      question,
      context
    });
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process chatbot request' });
  }
});

module.exports = router;
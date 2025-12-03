const express = require('express');
const router = express.Router();
const { callPythonAPI } = require('../utils/pythonApi');
const db = require('../config/database');

// Get general weather prediction
router.get('/general', async (req, res) => {
  try {
    const response = await callPythonAPI('/predict/default');
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get weather prediction' });
  }
});

// Get weather by coordinates
router.get('/by-location', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    // Save search history to database
    if (db) {
      const query = 'INSERT INTO search_history (type, query, lat, lon) VALUES (?, ?, ?, ?)';
      db.execute(query, ['location', `lat:${lat},lon:${lon}`, lat, lon]);
    }

    const response = await callPythonAPI('/predict/coords', { lat, lon });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get weather prediction' });
  }
});

// Get weather by location name
router.get('/by-name', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Location name required' });
    }

    // Save search history to database
    if (db) {
      const query = 'INSERT INTO search_history (type, query) VALUES (?, ?)';
      db.execute(query, ['name', location]);
    }

    const response = await callPythonAPI('/predict/location-name', { location });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get weather prediction' });
  }
});

// Get weather by manual input
router.post('/manual-input', async (req, res) => {
  try {
    const { temperature, humidity, pressure, wind_speed, rainfall } = req.body;
    
    const response = await callPythonAPI('/predict/manual', {
      temperature,
      humidity,
      pressure,
      wind_speed,
      rainfall
    });
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get weather prediction' });
  }
});

module.exports = router;
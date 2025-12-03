const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/weather', require('./routes/weather'));
app.use('/api/chatbot', require('./routes/chatbot'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Weather AI Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
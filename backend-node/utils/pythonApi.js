const axios = require('axios');

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

const callPythonAPI = async (endpoint, data = null) => {
  try {
    const config = {
      method: data ? 'post' : 'get',
      url: `${PYTHON_API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Python API Error:', error.message);
    throw new Error('Python API communication failed');
  }
};

module.exports = { callPythonAPI };
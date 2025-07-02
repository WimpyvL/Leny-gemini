const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const MEDICAL_AI_URL = process.env.MEDICAL_AI_URL || 'http://localhost:8000';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Leny Medical Backend',
    timestamp: new Date().toISOString()
  });
});


// Medical AI proxy endpoints
app.post('/api/medical/query', async (req, res) => {
  try {
    console.log('Received medical query:', req.body);
    
    const response = await axios.post(`${MEDICAL_AI_URL}/query`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    console.log('Medical AI response received');
    res.json(response.data);
    
  } catch (error) {
    console.error('Medical AI error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ 
        error: 'Medical AI service unavailable',
        message: 'Please ensure the Python medical AI service is running on port 8000'
      });
    } else if (error.response) {
      res.status(error.response.status).json({
        error: 'Medical AI processing error',
        message: error.response.data?.detail || error.message
      });
    } else {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message
      });
    }
  }
});

app.post('/api/medical/classify', async (req, res) => {
  try {
    const { text } = req.body;
    
    const response = await axios.post(`${MEDICAL_AI_URL}/classify`, null, {
      params: { text },
      timeout: 10000
    });
    
    res.json(response.data);
    
  } catch (error) {
    console.error('Classification error:', error.message);
    res.status(500).json({ 
      error: 'Classification failed',
      message: error.message
    });
  }
});

app.get('/api/medical/specialties', async (req, res) => {
  try {
    const response = await axios.get(`${MEDICAL_AI_URL}/specialties`);
    res.json(response.data);
  } catch (error) {
    console.error('Specialties error:', error.message);
    res.status(500).json({ 
      error: 'Failed to get specialties',
      message: error.message
    });
  }
});

app.get('/api/medical/context-types', async (req, res) => {
  try {
    const response = await axios.get(`${MEDICAL_AI_URL}/context-types`);
    res.json(response.data);
  } catch (error) {
    console.error('Context types error:', error.message);
    res.status(500).json({ 
      error: 'Failed to get context types',
      message: error.message
    });
  }
});

// Fallback for medical AI unavailable
app.use('/api/medical/*', (req, res) => {
  res.status(503).json({
    error: 'Medical AI service unavailable',
    message: 'The medical AI service is currently offline. Please try again later.',
    fallback: true
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Leny Medical Backend running on port ${PORT}`);
  console.log(`📡 Proxying to Medical AI at ${MEDICAL_AI_URL}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

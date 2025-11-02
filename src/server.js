require('dotenv').config();
const express = require('express');
const cors = require('cors');
const quotesRouter = require('./routes/quotes');
const averageRouter = require('./routes/average');
const slippageRouter = require('./routes/slippage');
const db = require('./db/connection');
require('./utils/cache'); // Initialize cache

const app = express();
const REGION = process.env.REGION || 'AR';

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/quotes', quotesRouter);
app.use('/average', averageRouter);
app.use('/slippage', slippageRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    region: REGION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Currency Backend API',
    region: REGION,
    endpoints: {
      quotes: '/quotes',
      average: '/average',
      slippage: '/slippage',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Region: ${REGION}`);
  console.log(`📊 Endpoints:`);
  console.log(`   GET http://localhost:${PORT}/quotes - Fetch USD quotes`);
  console.log(`   GET http://localhost:${PORT}/average - Get average prices`);
  console.log(`   GET http://localhost:${PORT}/slippage - Calculate slippage`);
  console.log(`   GET http://localhost:${PORT}/health - Health check`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

module.exports = app;


const express = require('express');
const corsOptions = require('./config/cors');
const cors = require('cors');
const { errorHandler } = require('./middlewares/error-handler');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'active',
      timestamp: new Date().toISOString()
    }
  });
});

// User Routes
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested resource was not found on this server'
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;

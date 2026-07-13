const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const corsOptions = require('./config/cors');
const { errorHandler } = require('./middlewares/error-handler');

const userRoutes = require('./routes/user.routes');
const playerRoutes = require('./routes/player.routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.status(200).json({
    success: true,
    data: {
      status: 'active',
      database: states[dbState] || 'unknown',
      timestamp: new Date().toISOString()
    }
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);

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

const express = require('express');
const cors = require('cors');
const globalErrorHandler = require('./middleware/errorHandler');
const { AppError } = require('./utils/errors');

const app = express();

// Trust proxy if behind reverse proxy (for production)
app.set('trust proxy', 1);

// Security and parsing middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/laptops', require('./routes/laptops'));
app.use('/api/orders', require('./routes/orders'));

// Handle undefined routes - this must come after all defined routes
app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
});

// Global error handling middleware - this must be the last middleware
app.use(globalErrorHandler);

module.exports = app;

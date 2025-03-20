const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Import middleware
const { requestLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

// Request logger middleware
app.use(requestLogger);

// Mount routes
app.use('/api/orders', orderRoutes);
app.use('/api', userRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Order Management API' });
});

// Error handler middleware (should be last)
app.use(errorHandler);

module.exports = app;
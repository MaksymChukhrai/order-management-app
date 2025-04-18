//backend\server.js
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');

// Connect to database
connectDB();

app.use('/api', require('./routes/userRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});



// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
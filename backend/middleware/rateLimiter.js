const rateLimit = require('express-rate-limit');
const logger = require('./logger');

// Create a rate limiter - 10 requests per minute per user
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // You can use a combination of IP and userId (if available)
    return req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           (req.body && req.body.userId) || 
           (req.params && req.params.userId);
  },
  handler: (req, res, next) => {
    logger.warn(`Rate limit exceeded for ${req.ip}`);
    res.status(429).json({
      message: 'Too many requests, please try again later.'
    });
  }
});

module.exports = apiLimiter;
const express = require('express');
const { createOrder, getUserOrders } = require('../controllers/orderController');
const apiLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting to all order routes
router.use(apiLimiter);

router.route('/').post(createOrder);
router.route('/:userId').get(getUserOrders);

module.exports = router;
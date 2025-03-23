// backend\controllers\orderController.js
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const logger = require('../middleware/logger');
const { withTransaction } = require('../utils/transactions');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity === undefined) {
      return next(new Error('Please provide userId, productId and quantity'));
    }

    // Check if quantity is a positive integer
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return next(new Error('Quantity must be greater than 0'));
    }

    // Execute the order creation within a transaction
    const order = await withTransaction(async (session) => {
      // Find user and product (with session)
      const user = await User.findById(userId).session(session);
      const product = await Product.findById(productId).session(session);

      if (!user) return next(new Error('User not found'));
      if (!product) return next(new Error('Product not found'));

      // Calculate total price
      const totalPrice = product.price * quantity;

      // Check if user has enough balance
      if (user.balance < totalPrice) {
        return next(new Error('Insufficient balance'));
      }

      // Check if product has enough stock
      if (product.stock < quantity) {
        return next(new Error('Product out of stock'));
      }

      // Deduct balance and update product stock
      user.balance -= totalPrice;
      product.stock -= quantity;
      await user.save({ session });
      await product.save({ session });

      // Create order
      const newOrder = await Order.create(
        [{ userId, productId, quantity, totalPrice }],
        { session }
      );

      return newOrder[0];
    });

    logger.info(`Order created: ${order._id}`);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for a user
// @route   GET /api/orders/:userId
// @access  Public
const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return next(new Error('User not found'));

    const orders = await Order.find({ userId })
      .populate('productId', 'name price')
      .populate('userId', 'name email') 
      .sort('-createdAt');

    if (!orders.length) {
      logger.info(`No orders found for user: ${userId}`);
    } else {
      logger.info(`Orders retrieved for user ${userId}: ${orders.length} orders`);
    }

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
};

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
      res.status(400);
      throw new Error('Please provide userId, productId and quantity');
    }

    // Check if quantity is a positive integer
    if (!Number.isInteger(quantity) || quantity <= 0) {
      res.status(400);
      throw new Error('Quantity must be greater than 0');
    }

    // Execute the order creation within a transaction
    const order = await withTransaction(async (session) => {
      // Find user and product (with session)
      const user = await User.findById(userId).session(session);
      const product = await Product.findById(productId).session(session);

      // Check if user and product exist
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }

      if (!product) {
        res.status(404);
        throw new Error('Product not found');
      }

      // Calculate total price
      const totalPrice = product.price * quantity;

      // Check if user has enough balance
      if (user.balance < totalPrice) {
        res.status(400);
        throw new Error('Insufficient balance');
      }

      // Check if product has enough stock
      if (product.stock < quantity) {
        res.status(400);
        throw new Error('Product out of stock');
      }

      // Deduct balance and update product stock
      user.balance -= totalPrice;
      product.stock -= quantity;
      await user.save({ session });
      await product.save({ session });

      // Create order
      const newOrder = await Order.create([
        {
          userId,
          productId,
          quantity,
          totalPrice,
        },
      ], { session });

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

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const orders = await Order.find({ userId })
      .populate('productId', 'name price')
      .sort('-createdAt');

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
};

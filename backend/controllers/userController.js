const User = require('../models/User');
const Product = require('../models/Product');
const logger = require('../middleware/logger');

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res, next) => {
  try {
    const { name, email, balance } = req.body;

    // Check if user with this email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      balance: balance || 100
    });

    logger.info(`User created: ${user._id}`);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res, next) => {
  try {
    const { name, price, stock } = req.body;

    const product = await Product.create({
      name,
      price,
      stock
    });

    logger.info(`Product created: ${product._id}`);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  createProduct,
  getProducts
};
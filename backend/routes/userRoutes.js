const express = require('express');
const { 
  createUser, 
  getUsers, 
  createProduct, 
  getProducts 
} = require('../controllers/userController');

const router = express.Router();

// User routes
router.route('/users').post(createUser).get(getUsers);

// Product routes
router.route('/products').post(createProduct).get(getProducts);

module.exports = router;
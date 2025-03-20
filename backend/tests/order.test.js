const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const request = supertest(app);

// Mock DB connection
beforeAll(async () => {
  const url = process.env.MONGO_URI || 'mongodb://localhost:27017/order-management-test';
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear database after tests
afterAll(async () => {
  await User.deleteMany();
  await Product.deleteMany();
  await Order.deleteMany();
  await mongoose.connection.close();
});

describe('Order API', () => {
  let userId;
  let productId;

  beforeEach(async () => {
    // Clear collections before each test
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    // Create a test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      balance: 100
    });
    userId = user._id;

    // Create a test product
    const product = await Product.create({
      name: 'Test Product',
      price: 10,
      stock: 20
    });
    productId = product._id;
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const res = await request
        .post('/api/orders')
        .send({
          userId,
          productId,
          quantity: 2
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.userId).toBe(userId.toString());
      expect(res.body.productId).toBe(productId.toString());
      expect(res.body.quantity).toBe(2);
      expect(res.body.totalPrice).toBe(20);

      // Check if user balance is updated
      const updatedUser = await User.findById(userId);
      expect(updatedUser.balance).toBe(80);

      // Check if product stock is updated
      const updatedProduct = await Product.findById(productId);
      expect(updatedProduct.stock).toBe(18);
    });

    it('should return 400 if user has insufficient balance', async () => {
      const res = await request
        .post('/api/orders')
        .send({
          userId,
          productId,
          quantity: 11
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Insufficient balance');
      
      // Check that user balance and product stock remain unchanged
      const user = await User.findById(userId);
      const product = await Product.findById(productId);
      expect(user.balance).toBe(100);
      expect(product.stock).toBe(20);
    });

    it('should return 400 if product is out of stock', async () => {
      const res = await request
        .post('/api/orders')
        .send({
          userId,
          productId,
          quantity: 21
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('out of stock');
      
      // Check that user balance and product stock remain unchanged
      const user = await User.findById(userId);
      const product = await Product.findById(productId);
      expect(user.balance).toBe(100);
      expect(product.stock).toBe(20);
    });

    it('should return 404 if user is not found', async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const res = await request
        .post('/api/orders')
        .send({
          userId: fakeUserId,
          productId,
          quantity: 1
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toContain('User not found');
    });

    it('should return 404 if product is not found', async () => {
      const fakeProductId = new mongoose.Types.ObjectId();
      const res = await request
        .post('/api/orders')
        .send({
          userId,
          productId: fakeProductId,
          quantity: 1
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toContain('Product not found');
    });
  });

  describe('GET /api/orders/:userId', () => {
    it('should get orders for a user', async () => {
      // Create a test order
      await Order.create({
        userId,
        productId,
        quantity: 2,
        totalPrice: 20
      });

      const res = await request.get(`/api/orders/${userId}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].userId).toBe(userId.toString());
    });

    it('should return 404 if user is not found', async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const res = await request.get(`/api/orders/${fakeUserId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toContain('User not found');
    });
  });

  describe('Rate Limiting', () => {
    it('should limit API requests', async () => {
      // Make 11 requests (exceeding the limit)
      for (let i = 0; i < 10; i++) {
        await request.get(`/api/orders/${userId}`);
      }

      // The 11th request should be rate limited
      const res = await request.get(`/api/orders/${userId}`);
      expect(res.statusCode).toBe(429);
      expect(res.body.message).toContain('Too many requests');
    });
  });
});
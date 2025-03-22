// backend/routes/orderRoutes.js

const express = require('express');
const mongoose = require('mongoose'); 
const { createOrder, getUserOrders } = require('../controllers/orderController');
const apiLimiter = require('../middleware/rateLimiter');
// Импортируем необходимые модели
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

// Apply rate limiting to all order routes
router.use(apiLimiter);

router.route('/').post(createOrder);
router.route('/:userId').get(getUserOrders);

// Маршрут для сброса заказов пользователя и восстановления баланса
router.delete('/reset/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Начинаем транзакцию
      const session = await mongoose.startSession();
      session.startTransaction();
  
      try {
        // Найти все заказы пользователя
        const orders = await Order.find({ userId }).session(session);
        
        // Для каждого заказа восстановить запасы и вернуть деньги пользователю
        for (const order of orders) {
          // Восстановление запасов продукта
          await Product.findByIdAndUpdate(
            order.productId,
            { $inc: { stock: order.quantity } },
            { session }
          );
          
          // Возвращение денег пользователю
          await User.findByIdAndUpdate(
            userId,
            { $inc: { balance: order.totalPrice } },
            { session }
          );
        }
        
        // Удаление всех заказов пользователя
        await Order.deleteMany({ userId }).session(session);
        
        // Фиксируем транзакцию
        await session.commitTransaction();
        
        res.status(200).json({ message: 'User orders have been reset successfully' });
      } catch (error) {
        // В случае ошибки откатываем транзакцию
        await session.abortTransaction();
        throw error;
      } finally {
        // Завершение сессии
        session.endSession();
      }
    } catch (error) {
      console.error('Error resetting user orders:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
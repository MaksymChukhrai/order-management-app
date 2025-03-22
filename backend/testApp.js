const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose'); // Добавляем импорт mongoose

// Load environment variables
dotenv.config();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Импортируем исходные маршруты
const orderRoutesOriginal = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

// Создаем Express приложение
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Создаем свежий роутер для заказов БЕЗ ограничителя скорости
const orderRouter = express.Router();

// Копируем маршруты из оригинального роутера (без middleware)
orderRouter.post('/', require('./controllers/orderController').createOrder);
orderRouter.get('/:userId', require('./controllers/orderController').getUserOrders);

// Маршрут для сброса заказов пользователя
orderRouter.delete('/reset/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Получаем модели напрямую
    const Order = require('./models/Order');
    const Product = require('./models/Product');
    const User = require('./models/User');
    
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

// Монтируем маршруты
app.use('/api/orders', orderRouter);
app.use('/api', userRoutes);

// Базовый маршрут
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Order Management API' });
});

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Добавляем метод для получения отдельного пользователя
app.get('/api/users/:id', async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Добавляем метод для обновления пользователя
app.put('/api/users/:id', async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
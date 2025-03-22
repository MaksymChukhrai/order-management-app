const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../testApp');
const User = require('../models/User');

// Мокаем middleware logger
jest.mock('../middleware/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

// Настройка подключения к тестовой базе данных перед всеми тестами
beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/order-management-test';
  await mongoose.connect(mongoUri);
});

// Очистка базы данных перед каждым тестом
beforeEach(async () => {
  await User.deleteMany({});
});

// Отключение от базы данных после всех тестов
afterAll(async () => {
  await mongoose.connection.close();
});

// Группа тестов для пользователей
describe('User API', () => {
  
  // Тест создания пользователя
  test('should create a new user with valid data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      balance: 200
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.balance).toBe(userData.balance);
  });

  // Тест получения всех пользователей
  test('should get all users', async () => {
    // Создаем нескольких пользователей в базе
    await User.create([
      { name: 'User 1', email: 'user1@example.com', balance: 100 },
      { name: 'User 2', email: 'user2@example.com', balance: 200 }
    ]);

    const response = await request(app)
      .get('/api/users')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('email');
    expect(response.body[0]).toHaveProperty('balance');
  });

  // Тест получения пользователя по ID
  test('should get a user by ID', async () => {
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      balance: 300
    });

    const response = await request(app)
      .get(`/api/users/${user._id}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(user.name);
    expect(response.body.email).toBe(user.email);
    expect(response.body.balance).toBe(user.balance);
  });

  // Тест обновления пользователя
  test('should update a user', async () => {
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      balance: 100
    });

    const updatedData = {
      name: 'John Updated',
      balance: 150
    };

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.balance).toBe(updatedData.balance);
    // Email не должен измениться, т.к. мы его не обновляли
    expect(response.body.email).toBe(user.email);
  });

  // Тест валидации при создании пользователя
  test('should not create a user without required fields', async () => {
    const userData = {
      // Отсутствуют обязательные поля
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(500); // Используем 500, как в вашем API

    expect(response.body).toHaveProperty('message');
    // Проверяем наличие пользователей в базе
    const users = await User.find({});
    expect(users.length).toBe(0);
  });

  // Тест уникальности email
  test('should not create a user with duplicate email', async () => {
    // Создаем пользователя с определенным email
    await User.create({
      name: 'First User',
      email: 'duplicate@example.com',
      balance: 100
    });

    // Пытаемся создать еще одного пользователя с тем же email
    const userData = {
      name: 'Second User',
      email: 'duplicate@example.com', // Дублирующийся email
      balance: 200
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(400); // Оставляем 400, если ваш контроллер возвращает 400 для дубликата email

    expect(response.body).toHaveProperty('message');
    // Обновляем проверку сообщения
    expect(response.body.message).toContain('User with this email already exists');

    // Проверяем, что в базе только один пользователь
    const users = await User.find({});
    expect(users.length).toBe(1);
  });
});
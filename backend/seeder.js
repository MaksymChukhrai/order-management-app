const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const connectDB = require("./config/db");
// const { v4: uuidv4 } = require("uuid");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Очистка базы данных перед заполнением
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();

    // Добавляем тестовых пользователей
    const users = await User.insertMany([
      {  _id: new mongoose.Types.ObjectId(), name: "John Doe", email: "john.doe@example.com", balance: 300 },
      {  _id: new mongoose.Types.ObjectId(), name: "Jane Smith", email: "jane.smith@example.com", balance: 150 },
      {  _id: new mongoose.Types.ObjectId(), name: "Alice Johnson", email: "alice.johnson@example.com", balance: 200 },
      {  _id: new mongoose.Types.ObjectId(), name: "Bob Brown", email: "bob.brown@example.com", balance: 300 },
      {  _id: new mongoose.Types.ObjectId(), name: "Charlie Wilson", email: "charlie.wilson@example.com", balance: 500 },
    ]);

    // Добавляем тестовые продукты
    const products = await Product.insertMany([
      {  _id: new mongoose.Types.ObjectId(), name: "Battery", price: 1, stock: 1000 },
      {  _id: new mongoose.Types.ObjectId(), name: "Charger", price: 20, stock: 500 },
      {  _id: new mongoose.Types.ObjectId(), name: "Headphones", price: 50, stock: 200 },
      {  _id: new mongoose.Types.ObjectId(), name: "Phone", price: 700, stock: 10 },
      {  _id: new mongoose.Types.ObjectId(), name: "Laptop", price: 1200, stock: 5 },
      {  _id: new mongoose.Types.ObjectId(), name: "Monitor", price: 300, stock: 15 },
      {  _id: new mongoose.Types.ObjectId(), name: "Keyboard", price: 80, stock: 50 },
      {  _id: new mongoose.Types.ObjectId(), name: "Mouse", price: 40, stock: 60 },
    ]);

    console.log("✅ База данных успешно заполнена!");
    console.log("👥 Пользователи:", users);
    console.log("🛒 Продукты:", products);
    process.exit();
  } catch (error) {
    console.error(`❌ Ошибка при заполнении: ${error}`);
    process.exit(1);
  }
};

seedData();

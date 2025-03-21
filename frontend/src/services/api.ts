// frontend/src/services/api.ts
import axios from 'axios';
import { User, Product, Order } from '../types';

// Создаем instance axios с базовым URL
export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Экспортируем функции для работы с API
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const getUser = async (userId: string): Promise<User> => {
  const response = await api.get<User>(`/users/${userId}`);
  return response.data;
};

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

export const getOrders = async (userId: string): Promise<Order[]> => {
  const response = await api.get<Order[]>(`/orders/${userId}`);
  return response.data;
};

export const createOrder = async (orderData: any): Promise<Order> => {
  const response = await api.post<Order>('/orders', orderData);
  return response.data;
};

// Добавим новую функцию для сброса пользовательских заказов
export const resetUserOrders = async (userId: string): Promise<void> => {
  await api.post(`/users/${userId}/reset-orders`);
};
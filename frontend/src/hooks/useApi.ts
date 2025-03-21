// frontend/src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { User, Product, Order, CreateOrderDto } from '../types';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (): Promise<User[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<User[]>('/users');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch users';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async (userId: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch user';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch products';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async (userId: string): Promise<Order[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/orders/${userId}`);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch orders';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData: CreateOrderDto): Promise<Order> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create order';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Добавим функцию для сброса заказов пользователя
  const resetUserOrders = useCallback(async (userId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post(`/users/${userId}/reset-orders`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to reset orders';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    fetchUsers,
    fetchUser,
    fetchProducts,
    fetchOrders,
    createOrder,
    resetUserOrders
  };
};
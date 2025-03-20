import axios, { AxiosError } from 'axios';
import { User, Product, Order, CreateOrderRequest, ApiError } from '../types';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>('/users');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data.message || 'Failed to get users');
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>('/products');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data.message || 'Failed to get products');
  }
};

export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  try {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data.message || 'Failed to create order');
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const response = await api.get<Order[]>(`/orders/${userId}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data.message || 'Failed to get user orders');
  }
};
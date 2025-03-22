// Константы для тестов
export const TEST_API_URL = 'http://localhost:5000';

// Мок данные для продуктов
export const mockProducts = [
  { _id: 'prod1', name: 'Test Product', price: 100, stock: 10 },
  { _id: 'prod2', name: 'Another Product', price: 200, stock: 5 }
];

// Мок данные для пользователей
export const mockUsers = [
  { _id: 'user1', name: 'John Doe', email: 'john@example.com', balance: 500 },
  { _id: 'user2', name: 'Jane Smith', email: 'jane@example.com', balance: 300 }
];

// Мок данные для заказов
export const mockOrders = [
  {
    _id: 'order1',
    userId: 'user1',
    productId: { _id: 'prod1', name: 'Test Product' },
    quantity: 2,
    totalPrice: 200,
    createdAt: '2023-01-01T10:00:00Z'
  }
];

// Хелпер для мокирования axios
export const setupAxiosMock = (mockAxios: any) => {
  // Очистить моки
  mockAxios.get.mockClear();
  mockAxios.post.mockClear();
  
  // Настроить ответы для различных запросов
  mockAxios.get.mockImplementation((url: string) => {
    if (url.includes('/products')) {
      return Promise.resolve({ data: mockProducts });
    }
    if (url.includes('/users')) {
      return Promise.resolve({ data: mockUsers });
    }
    if (url.includes('/orders')) {
      return Promise.resolve({ data: mockOrders });
    }
    return Promise.reject(new Error('URL not mocked'));
  });
  
  // Мок для создания заказа
  mockAxios.post.mockImplementation((url: string, data: any) => {
    if (url.includes('/orders')) {
      return Promise.resolve({ 
        data: { 
          _id: 'new-order', 
          ...data, 
          totalPrice: data.quantity * 100 // Упрощенный расчет
        }
      });
    }
    return Promise.reject(new Error('URL not mocked'));
  });
};
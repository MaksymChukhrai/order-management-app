export interface User {
    _id: string;
    name: string;
    email: string;
    balance: number;
    createdAt?: string;
    updatedAt?: string;
  }
  export interface UserSelectorProps {
    selectedUser: string;
    onSelectUser: (userId: string) => void;
}
  
  export interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Order {
    _id: string;
    userId: string;
    productId: string | Product;
    quantity: number;
    totalPrice: number;
    createdAt: string;
  }
  
  export interface CreateOrderRequest {
    userId: string;
    productId: string;
    quantity: number;
  }
  
  export interface ApiError {
    message: string;
    stack?: string;
  }
// Типы для контекста пользователя
export interface UserContextType {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  changeUser: (userId: string) => void;
  refreshCurrentUser: () => Promise<void>;
  updateUserBalance: (newBalance: number) => void; 
}
export interface CreateOrderDto {
  userId: string;
  productId: string;
  quantity: number;
}
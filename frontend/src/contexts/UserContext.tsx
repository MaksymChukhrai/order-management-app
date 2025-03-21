// frontend/src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User, UserContextType } from '../types';

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Загрузка списка пользователей
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Обновляем URL API, убедившись, что он указывает на правильный бэкенд
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('Fetching users from:', `${apiUrl}/api/users`);
        
        const response = await axios.get<User[]>(`${apiUrl}/api/users`);
        console.log('Users response:', response.data);
        
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          // Установим первого пользователя по умолчанию
          if (response.data.length > 0 && !currentUser) {
            setCurrentUser(response.data[0]);
          }
        } else {
          console.error('Users data is not an array:', response.data);
          // Установка мокового списка пользователей для отладки, если API недоступен
          const mockUsers: User[] = [
            { _id: '1', name: 'John Doe', email: 'john.doe@example.com', balance: 100 },
            { _id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', balance: 200 }
          ];
          setUsers(mockUsers);
          setCurrentUser(mockUsers[0]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        // Установка мокового списка пользователей для отладки, если API недоступен
        const mockUsers: User[] = [
          { _id: '1', name: 'John Doe', email: 'john.doe@example.com', balance: 100 },
          { _id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', balance: 200 }
        ];
        setUsers(mockUsers);
        setCurrentUser(mockUsers[0]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const changeUser = (userId: string) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setCurrentUser(user);
      console.log('User changed to:', user.name);
    }
  };

  // Предоставляем моковые данные, если реальные не загрузились
  const contextValue = {
    currentUser,
    users: Array.isArray(users) ? users : [],
    loading,
    changeUser
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
// frontend/src/contexts/UserContext.tsx (обновленная версия)
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserContextType } from '../types';
import { getUsers } from '../services/api';

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
      try {
        setLoading(true);
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        
        // Проверяем localStorage на наличие сохраненного пользователя
        const savedUserId = localStorage.getItem('currentUserId');
        
        if (savedUserId && fetchedUsers.length > 0) {
          const savedUser = fetchedUsers.find(u => u._id === savedUserId);
          if (savedUser) {
            setCurrentUser(savedUser);
          } else {
            // Если сохраненного пользователя не найдено, берем первого
            setCurrentUser(fetchedUsers[0]);
          }
        } else if (fetchedUsers.length > 0) {
          // Если нет сохраненного пользователя, берем первого из списка
          setCurrentUser(fetchedUsers[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const changeUser = (userId: string) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setCurrentUser(user);
      // Сохраняем выбранного пользователя в localStorage
      localStorage.setItem('currentUserId', userId);
    }
  };

  // Функция для обновления текущего пользователя (его баланса и т.д.)
  const refreshCurrentUser = async () => {
    if (currentUser) {
      try {
        setLoading(true);
        const updatedUsers = await getUsers();
        setUsers(updatedUsers);
        
        const updatedUser = updatedUsers.find(u => u._id === currentUser._id);
        if (updatedUser) {
          setCurrentUser(updatedUser);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error refreshing user:', error);
        setLoading(false);
      }
    }
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      users, 
      loading, 
      changeUser,
      refreshCurrentUser 
    }}>
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
// AppProvider.tsx
import React, { useState, useEffect, ReactNode, useCallback } from "react";
import { User, Product } from "../types";
import { getUsers, getProducts } from "../services/api";
import { AppContext } from "./AppContext";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, productsData] = await Promise.all([
        getUsers(),
        getProducts(),
      ]);
      setUsers(usersData);
      setProducts(productsData);
      if (!currentUser && usersData.length > 0) {
        setCurrentUser(usersData[0]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const refreshUser = useCallback(async () => {
    if (currentUser) {
      try {
        const updatedUser = await fetch(`/api/users/${currentUser._id}`).then(
          (res) => res.json()
        );
        setCurrentUser(updatedUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to refresh user");
      }
    }
  }, [currentUser]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AppContext.Provider
      value={{
        users,
        products,
        currentUser,
        setCurrentUser,
        loading,
        error,
        refreshUser,
        refreshData, 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

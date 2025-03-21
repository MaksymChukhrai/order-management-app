// frontend/src/pages/OrdersPage.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { Order } from '../types';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Обновляем URL API, убедившись, что он указывает на правильный бэкенд
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('Fetching orders for user:', currentUser._id);
        
        const response = await axios.get<Order[]>(`${apiUrl}/api/orders/${currentUser._id}`);
        console.log('Orders response:', response.data);
        
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error('Orders data is not an array:', response.data);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]); // Перезагрузка при смене пользователя

  if (!currentUser) {
    return (
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography>Please select a user</Typography>
      </Paper>
    );
  }

  // Безопасный доступ к свойству balance
  const userBalance = currentUser && typeof currentUser.balance === 'number' 
    ? currentUser.balance.toFixed(2) 
    : '0.00';

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        {currentUser.name || 'User'}
      </Typography>
      <Typography variant="subtitle1">{currentUser.email || 'No email'}</Typography>
      
      <Typography variant="h6" sx={{ mt: 2 }}>
        Current Balance
      </Typography>
      <Typography 
        variant="h4" 
        color={currentUser && currentUser.balance > 0 ? 'primary' : 'error'}
      >
        ${userBalance}
      </Typography>
      
      <Typography variant="h6" sx={{ mt: 3 }}>
        Order History
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Typography>No orders found</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                // Обрабатываем случай, когда productId может быть объектом или строкой
                const productName = typeof order.productId === 'object' && order.productId ? 
                  order.productId.name : 'Unknown product';
                  
                return (
                  <TableRow key={order._id}>
                    <TableCell>{productName}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>${typeof order.totalPrice === 'number' ? order.totalPrice.toFixed(2) : order.totalPrice}</TableCell>
                    <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Unknown date'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default OrdersPage;
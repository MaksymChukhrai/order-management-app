// frontend/src/pages/OrdersPage.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { Order, Product } from '../types';

interface PopulatedOrder extends Omit<Order, 'productId'> {
  productId: Product;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<PopulatedOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        const response = await axios.get<PopulatedOrder[]>(`/api/orders/${currentUser._id}`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]); // Перезагрузка при смене пользователя

  if (!currentUser) {
    return <Typography>Please select a user</Typography>;
  }

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        {currentUser.name}
      </Typography>
      <Typography variant="subtitle1">{currentUser.email}</Typography>
      
      <Typography variant="h6" sx={{ mt: 2 }}>
        Current Balance
      </Typography>
      <Typography variant="h4" color={currentUser.balance > 0 ? 'primary' : 'error'}>
        ${currentUser.balance.toFixed(2)}
      </Typography>
      
      <Typography variant="h6" sx={{ mt: 3 }}>
        Order History
      </Typography>
      
      {loading ? (
        <Typography>Loading orders...</Typography>
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
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.productId.name}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default OrdersPage;
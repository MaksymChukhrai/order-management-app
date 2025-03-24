import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { Order } from "../types";
import { resetUserOrders } from "../services/api";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const { currentUser, updateUserBalance } = useUser();

  const fetchOrders = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Обновляем URL API, убедившись, что он указывает на правильный бэкенд
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await axios.get<Order[]>(
        `${apiUrl}/api/orders/${currentUser._id}`
      );

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error("Orders data is not an array:", response.data);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser]); // Перезагрузка при смене пользователя

  const handleResetOrders = async () => {
    if (!currentUser) return;

    setResetLoading(true);
    try {
      // Вызываем API для сброса заказов
      await resetUserOrders(currentUser._id);

      // Обновляем список заказов
      setOrders([]);

      // Используем seeder.js для определения начального баланса
      let initialBalance = 100; // значение по умолчанию из User.js

      // Проверяем имя пользователя чтобы определить начальный баланс из seeder.js
      if (currentUser.name === "John Doe") initialBalance = 300;
      else if (currentUser.name === "Jane Smith") initialBalance = 150;
      else if (currentUser.name === "Alice Johnson") initialBalance = 200;
      else if (currentUser.name === "Bob Brown") initialBalance = 300;
      else if (currentUser.name === "Charlie Wilson") initialBalance = 500;

      // Обновляем баланс пользователя
      updateUserBalance(initialBalance);

      // Показываем сообщение об успехе
      setSnackbarMessage("Orders have been reset successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error resetting orders:", error);
      setSnackbarMessage("Failed to reset orders. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setResetLoading(false);
      setOpenDialog(false);
    }
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!currentUser) {
    return (
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography>Please select a user</Typography>
      </Paper>
    );
  }

  // Безопасный доступ к свойству balance
  const userBalance =
    currentUser && typeof currentUser.balance === "number"
      ? currentUser.balance.toFixed(2)
      : "0.00";

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        {currentUser.name || "User"}
      </Typography>
      <Typography variant="subtitle1">
        {currentUser.email || "No email"}
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Current Balance
      </Typography>
      <Typography
        variant="h4"
        color={currentUser && currentUser.balance > 0 ? "primary" : "error"}
      >
        ${userBalance}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Typography variant="h6">Order History</Typography>
        {orders.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleDialogOpen}
            disabled={resetLoading}
          >
            {resetLoading ? <CircularProgress size={24} /> : "Reset All Orders"}
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
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
                const productName =
                  typeof order.productId === "object" && order.productId
                    ? order.productId.name
                    : "Unknown product";

                return (
                  <TableRow key={order._id}>
                    <TableCell>{productName}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      $
                      {typeof order.totalPrice === "number"
                        ? order.totalPrice.toFixed(2)
                        : order.totalPrice}
                    </TableCell>
                    <TableCell>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "Unknown date"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Диалоговое окно подтверждения сброса заказов */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Reset All Orders</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset all orders for this user? This will:
            <ul>
              <li>Delete all order history</li>
              <li>Restore original balance</li>
              <li>Return items to inventory</li>
            </ul>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleResetOrders}
            color="error"
            disabled={resetLoading}
          >
            {resetLoading ? <CircularProgress size={24} /> : "Reset All Orders"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar для уведомлений */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default OrdersPage;

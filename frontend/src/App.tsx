// frontend/src/App.tsx
import { useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { UserProvider } from './contexts/UserContext';
import UserSelector from './components/UserSelector';
import OrderForm from './components/OrderForm';
import OrdersPage from './pages/OrdersPage';

function App() {
  // Функция для принудительного обновления истории заказов
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  const handleOrderCreated = () => {
    // Инкремент триггера вызовет перерисовку компонентов, использующих его
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <UserProvider>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Order Management System
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Select User
              </Typography>
              <UserSelector />
            </Paper>
            
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h5" gutterBottom>
                Place New Order
              </Typography>
              <OrderForm onOrderCreated={handleOrderCreated} />
            </Paper>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <OrdersPage key={refreshTrigger} /> {/* Использование ключа для принудительного обновления */}
          </Box>
        </Box>
      </Container>
    </UserProvider>
  );
}

export default App;
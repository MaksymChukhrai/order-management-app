import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppProvider';
import Header from './components/Header';
import CreateOrderPage from './pages/CreateOrderPage';
import OrdersPage from './pages/OrdersPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="py-8">
            <Routes>
              <Route path="/" element={<CreateOrderPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;

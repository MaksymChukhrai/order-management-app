import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/useAppContext';
import { useApi } from '../hooks/useApi';
import OrderTable from '../components/OrderTable';
import ErrorAlert from '../components/ErrorAlert';
import { Order } from '../types';

const OrdersPage: React.FC = () => {
  const { currentUser } = useAppContext();
  const { fetchOrders } = useApi();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadOrders = async () => {
      if (!currentUser) {
        setOrders([]);
        return;
      }
  
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOrders(currentUser._id);
        setOrders(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load orders');
        }
      } finally {
        setLoading(false);
      }
    };
  
    loadOrders();
  }, [currentUser, fetchOrders]);
  


  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {!currentUser ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
          No user is currently selected. Please select a user to view orders.
        </div>
      ) : (
        <>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{currentUser.name}</h2>
                <p className="text-gray-500">{currentUser.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="text-xl font-bold">${currentUser.balance.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold">Order History</h2>
            </div>

            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
            <OrderTable orders={orders} loading={loading} error={error} />
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
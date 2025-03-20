import React, { useEffect, useState } from 'react';
import { Order } from '../types';

const OrderTable: React.FC<{ selectedUser: string }> = ({ selectedUser }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/orders/${selectedUser}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        console.log("Fetched Orders:", data);
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedUser]);

  if (loading) {
    return <div className="text-center py-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-4 text-gray-500">No orders found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">Order ID</th>
            <th className="py-2 px-4 border-b text-left">Product</th>
            <th className="py-2 px-4 border-b text-right">Quantity</th>
            <th className="py-2 px-4 border-b text-right">Total Price</th>
            <th className="py-2 px-4 border-b text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{order._id.substring(0, 8)}...</td>
              <td className="py-2 px-4 border-b">
                {typeof order.productId === 'object' && 'name' in order.productId
                  ? order.productId.name
                  : 'N/A'}
              </td>
              <td className="py-2 px-4 border-b text-right">{order.quantity}</td>
              <td className="py-2 px-4 border-b text-right">${order.totalPrice.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">
                {new Date(order.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;

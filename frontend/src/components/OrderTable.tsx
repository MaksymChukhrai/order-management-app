import React from 'react';
import { Order } from '../types';

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, loading, error }) => {
  if (loading) {
    return <div className="text-center py-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-4 text-gray-500">No orders found</div>;
  }

  console.log("Rendering orders, count:", orders.length);
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

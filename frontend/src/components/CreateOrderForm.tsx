import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAppContext } from '../contexts/useAppContext';
import UserSelector from './UserSelector';
import ProductSelector from './ProductSelector';
import ErrorAlert from './ErrorAlert';

const CreateOrderForm: React.FC = () => {
  const { currentUser, refreshUser } = useAppContext();
  const { createOrder } = useApi();
  const [selectedUser, setSelectedUser] = useState<string>(currentUser?._id || '');
  const [productId, setProductId] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const totalPrice = price * (quantity || 0);

  // 🔥 Синхронизируем selectedUser с currentUser при изменении
  useEffect(() => {
    if (currentUser) {
      setSelectedUser(currentUser._id);
    }
  }, [currentUser]);

  const handleProductChange = (id: string, productPrice: number) => {
    setProductId(id);
    setPrice(productPrice);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity('');
    } else {
      const parsedValue = parseInt(value, 10);
      setQuantity(parsedValue >= 0 ? parsedValue : 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!selectedUser) {
      setError('No user selected');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await createOrder({
        userId: selectedUser,
        productId,
        quantity,
      });

      setSuccess(true);
      setQuantity(1);
      
      // 🔥 Обновляем баланс выбранного пользователя после заказа
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          Order created successfully!
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccess(false)}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* 🔥 Передаем selectedUser, но теперь он синхронизирован с currentUser */}
        <UserSelector selectedUser={selectedUser} onSelectUser={setSelectedUser} />
        <ProductSelector onChange={handleProductChange} value={productId} />
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity || ''}
            onChange={handleQuantityChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-6 p-3 bg-gray-50 rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Price:</span>
            <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
          </div>
          {currentUser && totalPrice > currentUser.balance && (
            <p className="text-red-500 text-sm mt-2">Insufficient balance for this order</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !selectedUser || totalPrice > (currentUser?.balance || 0)}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            (loading || !selectedUser || totalPrice > (currentUser?.balance || 0)) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Processing...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
};

export default CreateOrderForm;


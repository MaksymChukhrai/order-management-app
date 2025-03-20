import React from 'react';
import { useAppContext } from '../contexts/useAppContext';
import CreateOrderForm from '../components/CreateOrderForm';
import ErrorAlert from '../components/ErrorAlert';

const CreateOrderPage: React.FC = () => {
  const { currentUser, error } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Order</h1>
      
      {error && <ErrorAlert message={error} />}
      
      {!currentUser ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
          No user is currently selected. Please select a user to create an order.
        </div>
      ) : (
        <CreateOrderForm />
      )}
    </div>
  );
};

export default CreateOrderPage;
// frontend/src/components/OrderForm.tsx
import React, { useState, useEffect } from 'react';
import { Button, FormControl, InputLabel, Select, MenuItem, TextField, Alert, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { Product } from '../types';

interface OrderFormProps {
  onOrderCreated?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onOrderCreated }) => {
  const { currentUser } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (event: SelectChangeEvent<string>) => {
    setSelectedProduct(event.target.value);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value) || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Please select a user');
      return;
    }
    
    if (!selectedProduct) {
      setError('Please select a product');
      return;
    }
    
    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.post('/api/orders', {
        userId: currentUser._id,
        productId: selectedProduct,
        quantity
      });
      
      setSuccess('Order placed successfully!');
      setSelectedProduct('');
      setQuantity(1);
      
      // Вызываем колбэк для обновления родительского компонента
      if (typeof onOrderCreated === 'function') {
        onOrderCreated();
      }
    } catch (err: any) {
      if (err.response) {
        // Обработка ошибок API
        if (err.response.status === 429) {
          setError('Rate limit exceeded. Please try again later.');
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('An error occurred while placing your order.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Product</InputLabel>
        <Select
          value={selectedProduct}
          onChange={handleProductChange}
        >
          {products.map((product) => (
            <MenuItem key={product._id} value={product._id}>
              {product.name} - ${product.price.toFixed(2)} (In stock: {product.stock})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <TextField
        fullWidth
        margin="normal"
        label="Quantity"
        type="number"
        value={quantity}
        onChange={handleQuantityChange}
        InputProps={{ inputProps: { min: 1 } }}
      />
      
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        fullWidth 
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Place Order'}
      </Button>
    </form>
  );
};

export default OrderForm;
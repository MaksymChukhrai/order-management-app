// frontend/src/components/OrderForm.tsx
import React, { useState, useEffect } from 'react';
import { Button, FormControl, InputLabel, Select, MenuItem, TextField, Alert, SelectChangeEvent, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { Product } from '../types';

const OrderForm: React.FC<{ onOrderCreated: () => void }> = ({ onOrderCreated }) => {
  const { currentUser } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        // Обновляем URL API, убедившись, что он указывает на правильный бэкенд
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('Attempting to fetch products from:', `${apiUrl}/api/products`);
        
        const response = await axios.get<Product[]>(`${apiUrl}/api/products`);
        console.log('Products response:', response.data);
        
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Products data is not an array:', response.data);
          // Мокаем данные для отладки, если API недоступен
          setProducts([
            { _id: '1', name: 'Sample Product 1', price: 10, stock: 10 },
            { _id: '2', name: 'Sample Product 2', price: 20, stock: 5 }
          ]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        // Мокаем данные для отладки, если API недоступен
        setProducts([
          { _id: '1', name: 'Sample Product 1', price: 10, stock: 10 },
          { _id: '2', name: 'Sample Product 2', price: 20, stock: 5 }
        ]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (event: SelectChangeEvent<string>) => {
    setSelectedProduct(event.target.value);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value) || 1);
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
      // Обновляем URL API, убедившись, что он указывает на правильный бэкенд
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      await axios.post(`${apiUrl}/api/orders`, {
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
      console.error('Order creation error:', err);
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

  if (loadingProducts) {
    return <CircularProgress />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Product</InputLabel>
        <Select
          value={selectedProduct}
          onChange={handleProductChange}
        >
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <MenuItem key={product._id} value={product._id}>
                {product.name} - ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price} (In stock: {product.stock})
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No products available</MenuItem>
          )}
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
        disabled={loading || !selectedProduct}
      >
        {loading ? <CircularProgress size={24} /> : 'Place Order'}
      </Button>
    </form>
  );
};

export default OrderForm;
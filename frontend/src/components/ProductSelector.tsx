import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { Product } from '../types';

type ProductSelectorProps = {
  onChange: (productId: string, price: number) => void;
  value?: string;
};

const ProductSelector: React.FC<ProductSelectorProps> = ({ onChange, value }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchProducts } = useApi();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        // Select the first product by default if no value is provided
        if (!value && data.length > 0) {
          onChange(data[0]._id, data[0].price);
        }
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [fetchProducts, onChange, value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const selectedProduct = products.find(p => p._id === productId);
    if (selectedProduct) {
      onChange(productId, selectedProduct.price);
    }
  };

  if (loading) return <div className="text-gray-500">Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (products.length === 0) return <div className="text-gray-500">No products available</div>;

  return (
    <div className="mb-4">
      <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
        Select Product
      </label>
      <select
        id="product"
        value={value || ''}
        onChange={handleChange}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name} - ${product.price} ({product.stock} in stock)
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductSelector;
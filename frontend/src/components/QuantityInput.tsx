import React from 'react';
import { TextField } from '@mui/material';

export interface QuantityInputProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  max: number;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ quantity, onQuantityChange, max }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (isNaN(value)) {
      onQuantityChange(0);
    } else if (value > max) {
      onQuantityChange(max);
    } else {
      onQuantityChange(value);
    }
  };

  return (
    <TextField
      fullWidth
      label="Quantity"
      type="number"
      value={quantity}
      onChange={handleChange}
      inputProps={{ min: 1, max }}
      helperText={max > 0 ? `Available stock: ${max}` : 'Out of stock'}
      error={max === 0}
      sx={{ mb: 2 }}
    />
  );
};

export default QuantityInput;
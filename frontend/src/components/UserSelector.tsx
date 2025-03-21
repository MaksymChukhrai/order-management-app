// frontend/src/components/UserSelector.tsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useUser } from '../contexts/UserContext';

const UserSelector: React.FC = () => {
  const { currentUser, users, loading, changeUser } = useUser();
  
  if (loading) {
    return <div>Loading users...</div>;
  }
  
  // Проверка, что users - это массив
  if (!Array.isArray(users) || users.length === 0) {
    return <div>No users available</div>;
  }

  const handleChange = (event: SelectChangeEvent<string>) => {
    changeUser(event.target.value);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Select User</InputLabel>
      <Select
        value={currentUser?._id || ''}
        onChange={handleChange}
      >
        {users.map((user) => (
          <MenuItem key={user._id} value={user._id}>
            {user.name} ({user.email}) - Balance: ${user.balance.toFixed(2)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default UserSelector;
// frontend/src/components/UserSelector.tsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useUser } from '../contexts/UserContext';

const UserSelector: React.FC = () => {
  const { currentUser, users, changeUser } = useUser();
  
  if (!currentUser || users.length === 0) {
    return <div>Loading users...</div>;
  }

  const handleChange = (event: SelectChangeEvent<string>) => {
    changeUser(event.target.value);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Select User</InputLabel>
      <Select
        value={currentUser._id}
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
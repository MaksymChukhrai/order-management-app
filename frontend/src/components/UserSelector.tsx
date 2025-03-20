import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { getUsers } from '../services/api';
import { UserSelectorProps } from '../types';



const UserSelector: React.FC<UserSelectorProps> = ({ selectedUser, onSelectUser }) => {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <label htmlFor="user" className="block text-sm font-medium text-gray-700">
        Select User:
      </label>
      <select
        id="user"
        value={selectedUser}
        onChange={(e) => onSelectUser(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
      >
        <option value="">Choose a user</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSelector;

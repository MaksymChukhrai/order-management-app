import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Order Management System</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link 
                to="/" 
                className={`hover:text-gray-300 ${location.pathname === '/' ? 'text-white underline' : 'text-gray-300'}`}
              >
                Create Order
              </Link>
            </li>
            <li>
              <Link 
                to="/orders" 
                className={`hover:text-gray-300 ${location.pathname === '/orders' ? 'text-white underline' : 'text-gray-300'}`}
              >
                My Orders
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
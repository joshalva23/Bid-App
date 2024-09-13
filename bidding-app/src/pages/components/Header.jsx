// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bidding App</h1>
        <nav>
          {user?.name && <span className="text-white">Welcome, {user.name}</span>}
          {user?.name && (
            <button
              onClick={onLogout}
              className="ml-4 text-white hover:text-gray-200"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

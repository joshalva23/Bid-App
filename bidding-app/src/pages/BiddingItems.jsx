// src/pages/BiddingItems.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import ItemCard from './components/ItemCard';

const BiddingItems = () => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DNS}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (err) {
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchBiddingItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_DNS}/api/items-in-bidding`);
        setItems(response.data.items);
        console.log(response.data.items);
      } catch (err) {
        console.error('Error fetching bidding items:', err);
      }
    };
    fetchProfile();
    fetchBiddingItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={handleLogout} />

      <main className="container mx-auto p-4">
        <button
          onClick={() => navigate('/home')}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Return to Dashboard
        </button>

        <h2 className="text-xl font-semibold mb-4">Items Currently in Bidding</h2>
        {items.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p>No items in bidding currently</p>
        )}
      </main>
    </div>
  );
};

export default BiddingItems;

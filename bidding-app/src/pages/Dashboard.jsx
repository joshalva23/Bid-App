// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import ItemForm from './components/ItemForm';
import ItemCard from './components/ItemCard';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_DNS}/api/items`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(response.data.items);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };

    fetchProfile();
    fetchItems();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCreateItemToggle = () => {
    setShowCreateItem(!showCreateItem);
    setEditItem(null); // Reset edit item when toggling create form
  };

  const handleEditItem = (item) => {
    setEditItem(item);
    setShowEditItem(true);
    setShowCreateItem(false); // Hide create form when editing
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BACKEND_DNS}/api/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems(items.filter(item => item.id !== itemId)); // Update items list after deletion
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      let response;
  
      if (editItem) {
        // Update existing item
        response = await axios.put(`${import.meta.env.VITE_BACKEND_DNS}/api/items/${editItem.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        const updatedItem = response.data.item;
        setShowEditItem(false);
        setEditItem(null);
  
        // Update item in the items state
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
      } else {
        // Create new item
        response = await axios.post(`${import.meta.env.VITE_BACKEND_DNS}/api/items`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        const newItem = response.data.item;
        setShowCreateItem(false);
  
        // Add new item to the items state
        setItems((prevItems) => [...prevItems, newItem]);
      }
    } catch (err) {
      console.error('Error creating/updating item:', err);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={handleLogout} />

      <main className="container mx-auto p-4">
        <button
          onClick={handleCreateItemToggle}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {showCreateItem ? 'Hide Form' : 'Create Item'}
        </button>
        &nbsp;
        <button
          onClick={() => navigate('/bidding-items')}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          View Items in Bidding
        </button>

        {showCreateItem && <ItemForm onSubmit={handleSubmit} onCancel={() => setShowCreateItem(false)} />}
        {showEditItem && <ItemForm item={editItem} onSubmit={handleSubmit} onCancel={() => setShowEditItem(false)} />}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Available Items</h2>
          {items.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {items.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  enableEdit={true}
                  enableDelete={true}
                />
              ))}
            </div>
          ) : (
            <p>No items available</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

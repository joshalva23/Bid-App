// src/components/ItemForm.js
import React, { useState, useEffect } from 'react';

const ItemForm = ({ item, onSubmit, onCancel }) => {
  const [itemName, setItemName] = useState(item?.name || '');
  const [itemDescription, setItemDescription] = useState(item?.description || '');
  const [startingBid, setStartingBid] = useState(item?.starting_bid || '');
  const [endDate, setEndDate] = useState(item?.end_date || '');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (item) {
      setItemName(item.name);
      setItemDescription(item.description);
      setStartingBid(item.starting_bid);
      setEndDate(item.end_date);
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', itemName);
    formData.append('description', itemDescription);
    formData.append('starting_bid', startingBid);
    formData.append('end_date', endDate);
    if (image) {
      formData.append('image', image);
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-4 border rounded shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-4">{item ? 'Edit Item' : 'Create New Item'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description:</label>
          <textarea
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Starting Bid:</label>
          <input
            type="number"
            step="0.01"
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Image:</label>
          <input
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {item ? 'Update Item' : 'Create Item'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ItemForm;

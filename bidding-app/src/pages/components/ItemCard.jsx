import React from 'react';

const ItemCard = ({ item, onEdit, onDelete, enableEdit = false, enableDelete = false }) => {
  return (
    <div className="item-card p-4 border rounded shadow">
      <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
      {item.image ? (
        <img
          src={`${import.meta.env.VITE_BACKEND_DNS}/uploads/${item.image}`}
          alt={item.name}
          className="w-full h-48 object-cover mb-2"
        />
      ) : (
        <img
          src={`${import.meta.env.VITE_BACKEND_DNS}/uploads/default.jpg`}
          alt={item.name}
          className="w-full h-48 object-cover mb-2"
        />
      )}
      <p className="mb-2">{item.description}</p>
      <p className="mb-2">Starting Bid: Rs.{item.starting_bid}</p>
      <p className="mb-2">End Date: {new Date(item.end_date).toLocaleString()}</p>
      {(enableEdit || enableDelete) && (
        <div className="flex justify-between">
          {enableEdit && (
            <button
              onClick={() => onEdit(item)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          )}
          {enableDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemCard;

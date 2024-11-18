// AddItem.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddItem = ({ items, setItems }) => {
  const [itemData, setItemData] = useState({
    image: '',
    title: '',
    text: '',
    options: '',
    expiryDate: '',
    expiryTime: '',
  });

  const navigate = useNavigate();

  // onChange handler to update state as the user types
  const handleChange = (e) => {
    setItemData({
      ...itemData,
      [e.target.name]: e.target.value,
    });
  };

  // onSubmit handler to prevent default behavior and add item to the list
  const handleSubmit = (e) => {
    e.preventDefault();

    // Get current date and time for when the bet was posted
    const currentDate = new Date();
    const postedDate = currentDate.toLocaleDateString();
    const postedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Create a new item with a unique id
    const newItem = {
      id: items.length + 1,
      image:
        itemData.image || 'https://via.placeholder.com/300',
      title: itemData.title,
      date: postedDate,
      time: postedTime,
      expiryDate: itemData.expiryDate,
      expiryTime: itemData.expiryTime,
      text: itemData.text,
      options: itemData.options.split(',').map((option) => option.trim()),
    };

    // Add the new item to the list
    setItems([...items, newItem]);

    // Clear input fields after submission
    setItemData({
      image: '',
      title: '',
      text: '',
      options: '',
      expiryDate: '',
      expiryTime: '',
    });

    // Redirect to Home page to see the new item
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Image URL:</label>
          <input
            type="text"
            name="image"
            value={itemData.image}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Title:</label>
          <input
            type="text"
            name="title"
            value={itemData.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description:</label>
          <textarea
            name="text"
            value={itemData.text}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 h-24 resize-none"
          ></textarea>
        </div>
        <div>
          <label className="block font-medium mb-1">
            Options (separated by commas):
          </label>
          <input
            type="text"
            name="options"
            value={itemData.options}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., Over, Under"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Event Start Date:</label>
          <input
            type="date"
            name="expiryDate"
            value={itemData.expiryDate}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Event Start Time:</label>
          <input
            type="time"
            name="expiryTime"
            value={itemData.expiryTime}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItem;

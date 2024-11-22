// AddItem.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddItem = ({ items, setItems }) => {
  const [itemData, setItemData] = useState({
    image: '',
    title: '',
    description: '',
    options: '',
    expiryDate: '',
    expiryTime: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setItemData({
      ...itemData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/api/items',
        {
          title: itemData.title,
          description: itemData.description,
          options: itemData.options,
          expiryDate: itemData.expiryDate,
          expiryTime: itemData.expiryTime,
          image: itemData.image,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert('Bet posted successfully!');
      setItems([...items, response.data]);
      setItemData({
        title: '',
        description: '',
        options: '',
        expiryDate: '',
        expiryTime: '',
        image: '',
      });
    } catch (error) {
      console.error('Error adding item:', error.response?.data || error.message);
      alert('Failed to post the bet. Please try again.');
    }
  };
  

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Add Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Image URL:</label>
          <input
            type="text"
            name="image"
            value={itemData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Title:</label>
          <input
            type="text"
            name="title"
            value={itemData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description:</label>
          <textarea
            name="description"
            value={itemData.description}
            onChange={handleChange}
            required
            className="w-full h-24 px-3 py-2 border rounded resize-none"
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Options (separated by commas):
          </label>
          <input
            type="text"
            name="options"
            value={itemData.options}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g., Over, Under"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Event Start Date:</label>
          <input
            type="date"
            name="expiryDate"
            value={itemData.expiryDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Event Start Time:</label>
          <input
            type="time"
            name="expiryTime"
            value={itemData.expiryTime}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItem;


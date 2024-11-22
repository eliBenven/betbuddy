// Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = ({ isLoggedIn }) => {
  const [items, setItems] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Fetch items
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    // Fetch user role
    const fetchUserRole = () => {
      const role = localStorage.getItem('role');
      setUserRole(role || ''); // Default to an empty role if not logged in
    };

    fetchItems();
    fetchUserRole();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/items/${id}`, {
        headers: { Authorization: token },
      });
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Welcome to Bet Buddy</h2>
      {!isLoggedIn && (
        <div className="mb-4">
          <p>
            Please{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>{' '}
            or{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Signup
            </Link>{' '}
            to start placing your bets.
          </p>
        </div>
      )}
      {isLoggedIn ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="relative p-4 transition border rounded-lg shadow hover:shadow-lg"
            >
              <img
                src={item.image || 'https://via.placeholder.com/300'}
                alt={item.title}
                className="object-cover w-full h-48 mb-4 rounded-md"
              />
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="mb-1 text-gray-600">
                <strong>Posted on:</strong>{' '}
                {new Date(item.createdDate).toLocaleDateString()} at{' '}
                {new Date(item.createdDate).toLocaleTimeString()}
              </p>
              <p className="mb-2">{item.description}</p>
              <div className="flex mb-8 space-x-2">
                {item.options.map((option, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="absolute text-sm text-gray-500 bottom-2 right-2">
                Expires on{' '}
                {new Date(item.expiryDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                at {item.expiryTime}
              </div>
              {userRole === 'admin' && (
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center">
          <p className="text-gray-600">Please log in to see available bets.</p>
        </div>
      )}
    </div>
  );
};

export default Home;

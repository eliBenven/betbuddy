// Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlusCircle } from 'react-icons/fa';
import Login from './Login';

const Home = ({ isLoggedIn }) => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchItemsAndUser = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch items
        const itemsResponse = await axios.get('http://localhost:5001/api/items', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch user details
        const userResponse = await axios.get('http://localhost:5001/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Log user data for debugging
        console.log('User data:', userResponse.data);

        // Update states
        const openItems = itemsResponse.data.filter((item) => item.status !== 'settled');
        setItems(openItems);
        setUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching items or user:', error.message);
      }
    };

    fetchItemsAndUser();
  }, []);

  // Handle loading state
  if (!user) {
    return (<div className="landing-page">
      <div className="container flex-col px-4 py-8 mx-auto">
        <h1 className="mb-4 text-4xl font-bold text-center">Welcome to BetBuddy</h1>
        <img src="assets/logo.png" alt="BetBuddy Logo" className="mx-auto" width={150} height={150} />
        <p className="mt-8 mb-8 text-center text-gray-600">
          Join now to place bets and win big!
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Register
          </Link>
        </div>
      </div>
    </div>);
  }

  const handlePlaceBet = async (itemId, choice) => {
    const amount = parseFloat(
      prompt(`How much do you want to bet on "${choice}"?`)
    );
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Invalid amount. Please enter a positive number.');
      return;
    }
  
    if (user.balance < amount) {
      alert('Insufficient balance. You cannot bet more than your available balance.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5001/api/items/${itemId}/place`,
        { choice, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert(`Bet placed successfully! You bet $${amount} on "${choice}".`);
  
      // Fetch the updated user data
      const userResponse = await axios.get('http://localhost:5001/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data); // Update the user state with the new data
    } catch (error) {
      console.error('Error placing bet:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to place bet.');
    }
  };
  

  return (
    <div className="space-y-4">
      {user && (
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded shadow">
          <span className="text-xl font-bold">Welcome, {user.username}</span>
          <span className="text-lg font-semibold text-green-600">
            Balance: $
            {user.balance !== undefined ? user.balance.toFixed(2) : '0.00'}
          </span>
        </div>
      )}
      <Link
        to="/add-item"
        className="flex items-center justify-center w-12 h-12 text-white bg-blue-500 rounded-full shadow-lg hover:bg-blue-600"
        title="New Post"
      >
        <FaPlusCircle size={24} />
      </Link>
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-500">No items available. Create a new post!</p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="p-4 transition bg-white rounded shadow hover:shadow-lg"
            >
              <div className="flex items-center mb-2">
                <img
                  src={item.image || 'https://via.placeholder.com/150'}
                  alt={item.title}
                  className="w-12 h-12 mr-3 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    Posted by: {item.creator?.username || 'Unknown'}
                  </p>
                </div>
              </div>
              <p className="mb-2">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handlePlaceBet(item._id, option)}
                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Bet on {option}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Expires on {new Date(item.expiryDate).toLocaleDateString()} at{' '}
                {item.expiryTime}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

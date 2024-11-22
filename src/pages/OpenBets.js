import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OpenBets = () => {
  const [bets, setBets] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/items', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
  
    fetchItems();
  }, []);
  

  const handlePlaceBet = async (betId, choice) => {
    const amount = parseFloat(prompt(`How much do you want to bet on "${choice}"?`));
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Invalid amount. Please enter a positive number.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/api/bets/${betId}/place`,
        { choice, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Bet placed successfully! You bet $${amount} on "${choice}".`);
    } catch (error) {
      console.error('Error placing bet:', error.response?.data || error);
      alert(error.response?.data?.error || 'Failed to place bet.');
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Open Bets</h2>
      {bets.length === 0 ? (
        <p>No open bets available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bets.map((bet) => (
            <div key={bet._id} className="p-4 border rounded shadow">
              <h3 className="mb-2 text-xl font-semibold">{bet.title}</h3>
              <p className="mb-2">{bet.description}</p>
              <p className="mb-2 text-gray-600">
                <strong>Expires:</strong> {new Date(bet.expiryDate).toLocaleDateString()} at {bet.expiryTime}
              </p>
              <div className="flex flex-col space-y-2">
                {bet.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handlePlaceBet(bet._id, option)}
                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Bet on {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenBets;

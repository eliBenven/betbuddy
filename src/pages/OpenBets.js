import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OpenBets = () => {
  const [openBets, setOpenBets] = useState([]);

  useEffect(() => {
    const fetchOpenBets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/open-bets', {
          headers: { Authorization: token },
        });
        setOpenBets(response.data);
      } catch (error) {
        console.error('Error fetching open bets:', error);
      }
    };

    fetchOpenBets();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Open Bets</h2>
      {openBets.length === 0 ? (
        <p>No open bets available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {openBets.map((bet) => (
            <div key={bet._id} className="p-4 border rounded shadow">
              <h3 className="mb-2 text-xl font-semibold">{bet.title}</h3>
              <p>{bet.description}</p>
              <p className="text-gray-600">
                Expires on {new Date(bet.expiryDate).toLocaleDateString()} at{' '}
                {bet.expiryTime}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenBets;

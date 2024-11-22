import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BetHistory = () => {
  const [betHistory, setBetHistory] = useState([]);

  useEffect(() => {
    const fetchBetHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/bet-history', {
          headers: { Authorization: token },
        });
        setBetHistory(response.data);
      } catch (error) {
        console.error('Error fetching bet history:', error);
      }
    };

    fetchBetHistory();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Bet History</h2>
      {betHistory.length === 0 ? (
        <p>No bet history available.</p>
      ) : (
        <ul className="list-disc list-inside">
          {betHistory.map((bet) => (
            <li key={bet._id}>
              <strong>{bet.title}</strong>: {bet.result}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BetHistory;

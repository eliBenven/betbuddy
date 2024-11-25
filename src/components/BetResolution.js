import React, { useState } from 'react';
import axios from 'axios';

const BetResolution = ({ betId }) => {
  const [winner, setWinner] = useState('');
  const [message, setMessage] = useState('');

  const handleResolve = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/api/bets/${betId}/resolve`,
        { winner },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Bet resolved successfully!');
    } catch (error) {
      console.error('Error resolving bet:', error.response?.data || error.message);
      setMessage('Failed to resolve bet.');
    }
  };

  return (
    <div>
      <h2>Resolve Bet</h2>
      <select value={winner} onChange={(e) => setWinner(e.target.value)} className="px-2 py-1 border rounded">
        <option value="">Select Winner</option>
        <option value="Over">Over</option>
        <option value="Under">Under</option>
      </select>
      <button onClick={handleResolve} className="px-4 py-2 ml-2 text-white bg-green-500 rounded">
        Resolve
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BetResolution;

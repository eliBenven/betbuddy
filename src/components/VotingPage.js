import React, { useState } from 'react';
import axios from 'axios';

const VotingPage = ({ betId }) => {
  const [message, setMessage] = useState('');

  const handleVote = async (action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/api/bets/${betId}/vote`,
        { action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`Vote recorded as ${action}!`);
    } catch (error) {
      console.error('Error voting:', error.response?.data || error.message);
      setMessage('Failed to record vote.');
    }
  };

  return (
    <div>
      <h2>Vote on Bet Resolution</h2>
      <button onClick={() => handleVote('approve')} className="px-4 py-2 mr-2 text-white bg-blue-500 rounded">
        Approve
      </button>
      <button onClick={() => handleVote('veto')} className="px-4 py-2 text-white bg-red-500 rounded">
        Veto
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VotingPage;

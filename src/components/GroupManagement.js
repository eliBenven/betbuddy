import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupManagement = ({ groupId }) => {
  const [group, setGroup] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5001/api/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroup(response.data);
      } catch (error) {
        console.error('Error fetching group details:', error.response?.data || error.message);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleInvite = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/api/groups/${groupId}/invite`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('User invited successfully!');
    } catch (error) {
      console.error('Error inviting user:', error.response?.data || error.message);
      setMessage('Failed to invite user.');
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Manage Group</h2>
      {group && <h3>{group.name}</h3>}
      <div>
        <h4>Invite Member</h4>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email"
          className="px-2 py-1 border rounded"
        />
        <button onClick={handleInvite} className="px-4 py-2 ml-2 text-white bg-blue-500 rounded">
          Invite
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default GroupManagement;

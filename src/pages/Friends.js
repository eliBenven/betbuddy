import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [newFriendEmail, setNewFriendEmail] = useState('');

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/friends', {
          headers: { Authorization: token },
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/api/friends',
        { email: newFriendEmail },
        { headers: { Authorization: token } }
      );
      setFriends([...friends, response.data]);
      setNewFriendEmail('');
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Friends</h2>
      <div className="mb-4">
        <input
          type="email"
          placeholder="Friend's email"
          value={newFriendEmail}
          onChange={(e) => setNewFriendEmail(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <button
          onClick={handleAddFriend}
          className="px-4 py-2 ml-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Add Friend
        </button>
      </div>
      <ul className="list-disc list-inside">
        {friends.map((friend) => (
          <li key={friend._id}>{friend.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;

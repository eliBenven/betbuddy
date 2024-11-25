import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GroupDashboard = ({ groupId }) => {
  const [group, setGroup] = useState(null);
  const [bets, setBets] = useState([]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const groupResponse = await axios.get(`http://localhost:5001/api/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroup(groupResponse.data);

        const betsResponse = await axios.get(`http://localhost:5001/api/groups/${groupId}/bets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBets(betsResponse.data);
      } catch (error) {
        console.error('Error fetching group details:', error.response?.data || error.message);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">{group?.name || 'Group Dashboard'}</h2>
      <p>{group?.description}</p>

      <h3 className="mt-4 mb-2 text-xl font-semibold">Members</h3>
      {group?.members.map((member) => (
        <div key={member.user}>
          {member.username} ({member.role})
        </div>
      ))}

      <h3 className="mt-4 mb-2 text-xl font-semibold">Bets</h3>
      {bets.map((bet) => (
        <div key={bet._id} className="p-4 border rounded shadow">
          <h4>{bet.title}</h4>
          <p>{bet.description}</p>
          <p>Status: {bet.status}</p>
        </div>
      ))}
    </div>
  );
};

export default GroupDashboard;

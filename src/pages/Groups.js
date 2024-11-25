import React from 'react';
import { Link } from 'react-router-dom';

const GroupDashboard = ({ groups }) => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Your Groups</h2>
      {groups.length === 0 ? (
        <p>You are not part of any groups yet. Create or join one to get started!</p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group._id} className="p-4 border rounded shadow">
              <h3 className="text-xl font-semibold">{group.name}</h3>
              <p>{group.description}</p>
              <Link to={`/groups/${group._id}`} className="text-blue-500 hover:underline">
                View Group
              </Link>
              <Link to={`/groups/${group._id}/manage`} className="ml-4 text-blue-500 hover:underline">
                Manage Group
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupDashboard;

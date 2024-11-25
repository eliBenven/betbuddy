// AdminManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminManagement = () => {
  const [items, setItems] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchItemsAndUser = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch user info to check if admin
        const userResponse = await axios.get('http://localhost:5001/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(userResponse.data.role);

        if (userResponse.data.role !== 'admin') {
          alert('Access denied. Admins only.');
          return;
        }

        // Fetch all items
        const itemsResponse = await axios.get('http://localhost:5001/api/items', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setItems(itemsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
      }
    };

    fetchItemsAndUser();
  }, []);

  const updateItemResult = async (itemId, winner) => {
    try {
      const token = localStorage.getItem('token');

      // Update the item's result and status to "settled"
      const itemResponse = await axios.put(
        `http://localhost:5001/api/items/${itemId}/result`,
        { winner },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ensure the item result is updated
      if (itemResponse.data.item.status !== 'settled') {
        throw new Error('Failed to update item status.');
      }

      // Fetch associated bets for the item
      const betsResponse = await axios.get('http://localhost:5001/api/bets', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const associatedBets = betsResponse.data.filter(
        (bet) => bet.title === itemResponse.data.item.title // Match by title or any linking field
      );

      // Update each associated bet's result and status
      await Promise.all(
        associatedBets.map((bet) =>
          axios.put(
            `http://localhost:5001/api/bets/${bet._id}/result`,
            { winner },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      alert('Item and associated bets settled successfully!');

      // Update local state to reflect changes
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, status: 'settled', result: { winner } } : item
        )
      );
    } catch (error) {
      console.error('Error updating item result:', error.response?.data || error.message);
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Item deleted successfully!');
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-center">Admin Management</h2>
      {userRole !== 'admin' ? (
        <p className="text-center text-red-500">Access denied. Admins only.</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">No items available for management.</p>
      ) : (
        <table className="w-full border border-collapse border-gray-300">
          <thead>
            <tr>
              <th className="p-3 border border-gray-300">Item Title</th>
              <th className="p-3 border border-gray-300">Winner</th>
              <th className="p-3 border border-gray-300">Status</th>
              <th className="p-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="p-3 border border-gray-300">{item.title}</td>
                <td className="p-3 border border-gray-300">
                  <select
                    className="p-1 border rounded"
                    onChange={(e) => updateItemResult(item._id, e.target.value)}
                    defaultValue={item.result?.winner || ''}
                  >
                    <option value="" disabled>
                      {item.result?.winner ? 'Change Winner' : 'Select Winner'}
                    </option>
                    {item.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 border border-gray-300">
                  {item.status === 'settled' ? (
                    <span className="text-green-600">Settled</span>
                  ) : (
                    <span className="text-yellow-500">Pending</span>
                  )}
                </td>
                <td className="p-3 border border-gray-300">
                  <button
                    className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-800"
                    onClick={() => deleteItem(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminManagement;

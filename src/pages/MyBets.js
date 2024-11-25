// MyBets.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyBets = () => {
  const [bets, setBets] = useState([]);
  const [userStats, setUserStats] = useState({
    pendingCount: 0,
    completedCount: 0,
    wins: 0,
    losses: 0,
    totalWinnings: 0,
    totalLosses: 0,
  });

  const fetchUserBets = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch user info including betHistory
      const userResponse = await axios.get('http://localhost:5001/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = userResponse.data;

      // Log the user data for debugging
      console.log('User data:', user);

      const bets = user.betHistory || [];
      setBets(bets);

      // Calculate stats
      const stats = {
        pendingCount: 0,
        completedCount: 0,
        wins: 0,
        losses: 0,
        totalWinnings: 0,
        totalLosses: 0,
      };

      bets.forEach((bet) => {
        if (bet.result === 'pending') {
          stats.pendingCount++;
        } else if (bet.result === 'won') {
          stats.completedCount++;
          stats.wins++;
          stats.totalWinnings += bet.amount * 2; // Assuming 1:1 payout
        } else if (bet.result === 'lost') {
          stats.completedCount++;
          stats.losses++;
          stats.totalLosses += bet.amount;
        }
      });

      setUserStats(stats);
    } catch (error) {
      console.error('Error fetching user bets:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchUserBets();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-center">My Bets</h2>

      {/* User Stats */}
      <div className="grid grid-cols-2 gap-4 p-6 mb-8 bg-gray-100 rounded-lg shadow-md sm:grid-cols-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Pending Bets</p>
          <p className="text-xl font-bold text-gray-900">{userStats.pendingCount}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Completed Bets</p>
          <p className="text-xl font-bold text-gray-900">{userStats.completedCount}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Wins</p>
          <p className="text-xl font-bold text-green-600">{userStats.wins}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Losses</p>
          <p className="text-xl font-bold text-red-600">{userStats.losses}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Winnings</p>
          <p className="text-xl font-bold text-green-600">
            ${userStats.totalWinnings.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Losses</p>
          <p className="text-xl font-bold text-red-600">
            ${userStats.totalLosses.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Net Balance</p>
          <p
            className={`text-xl font-bold ${
              userStats.totalWinnings - userStats.totalLosses >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            ${(userStats.totalWinnings - userStats.totalLosses).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Bets List */}
      {bets.length === 0 ? (
        <p className="text-center text-gray-500">No bets to display.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bets.map((bet) => {
            const isWin = bet.result === 'won';
            const isLoss = bet.result === 'lost';

            return (
              <div
                key={bet._id || bet.item?._id || Math.random()}
                className={`p-6 bg-white border rounded-lg shadow-lg ${
                  bet.result === 'pending'
                    ? 'border-yellow-400'
                    : isWin
                    ? 'border-green-400'
                    : isLoss
                    ? 'border-red-400'
                    : 'border-gray-200'
                }`}
              >
                <h3 className="mb-2 text-lg font-bold">
                  {bet.item?.title || 'Bet on Item'}
                </h3>
                <p className="text-sm text-gray-500">
                  {bet.item?.description || 'No description available.'}
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium">
                    <strong>Bet Amount:</strong> ${bet.amount || 0}
                  </p>
                  <p className="text-sm font-medium">
                    <strong>Your Choice:</strong> {bet.choice || 'N/A'}
                  </p>
                  <p className="text-sm font-medium">
                    <strong>Status:</strong>{' '}
                    <span
                      className={`px-2 py-1 rounded ${
                        bet.result === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : isWin
                          ? 'bg-green-100 text-green-600'
                          : isLoss
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {bet.result === 'pending'
                        ? 'Pending'
                        : isWin
                        ? 'Won'
                        : isLoss
                        ? 'Lost'
                        : 'Unknown'}
                    </span>
                  </p>
                  {bet.result !== 'pending' && (
                    <p className="text-sm font-medium">
                      <strong>{isWin ? 'Winnings' : 'Losses'}:</strong> $
                      {bet.amount || 0}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBets;

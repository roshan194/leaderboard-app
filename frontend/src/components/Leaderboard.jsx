import React from 'react';

function Leaderboard({ users }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={user._id}
            className="leaderboard-row flex justify-between items-center p-2 bg-gray-100 rounded"
          >
            <span className="font-medium">
              #{index + 1} {user.name}
            </span>
            <span>{user.totalPoints} points</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
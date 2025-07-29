import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClaimHistory({ userId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await axios.get(`http://localhost:5001/api/history/${userId}`);
      setHistory(response.data);
    };
    if (userId) fetchHistory();
  }, [userId]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">Claim History</h2>
      {history.length === 0 ? (
        <p>No claims yet</p>
      ) : (
        <div className="space-y-2">
          {history.map((claim) => (
            <div key={claim._id} className="p-2 bg-gray-100 rounded">
              <span>
                {new Date(claim.timestamp).toLocaleString()} - {claim.pointsClaimed} points
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClaimHistory;
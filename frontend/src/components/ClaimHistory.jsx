import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClaimHistory({ userId }) {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  // Use the same environment variable as App.jsx with fallback
  const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        setHistory([]);
        setError('No user selected');
        return;
      }
      try {
        const response = await axios.get(`${BACKEND_URL}/api/history/${userId}`);
        setHistory(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching claim history:', error);
        setError('Failed to load claim history');
      }
    };

    fetchHistory();
  }, [userId, BACKEND_URL]); // Include BACKEND_URL as a dependency if it could change

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">Claim History</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : history.length === 0 ? (
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

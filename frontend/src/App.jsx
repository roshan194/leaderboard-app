import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Leaderboard from './components/Leaderboard';
import UserSelector from './components/UserSelector';
import ClaimHistory from './components/ClaimHistory';


const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
const socket = io(BACKEND_URL);

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [lastClaim, setLastClaim] = useState(null);

  useEffect(() => {
    // Fetch initial leaderboard
    fetchLeaderboard();

    // Listen for leaderboard updates
    socket.on('leaderboardUpdate', (updatedLeaderboard) => {
      setUsers(updatedLeaderboard);
    });

    return () => socket.off('leaderboardUpdate');
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const handleClaim = async () => {
    if (!selectedUser) return;
    try {
      const response = await axios.post(`${BACKEND_URL}/api/claim`, { userId: selectedUser });
      setLastClaim(`Claimed ${response.data.pointsClaimed} points for ${response.data.user.name}`);
    } catch (error) {
      console.error('Error claiming points:', error);
    }
  };

  const addUser = async (name) => {
    try {
      await axios.post(`${BACKEND_URL}/api/users`, { name });
      fetchLeaderboard();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Leaderboard App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UserSelector
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            addUser={addUser}
            handleClaim={handleClaim}
            lastClaim={lastClaim}
          />
          {selectedUser && <ClaimHistory userId={selectedUser} />}
        </div>
        <Leaderboard users={users} />
      </div>
    </div>
  );
}

export default App;
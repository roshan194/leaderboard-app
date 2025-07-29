import React, { useState } from 'react';

function UserSelector({ users, selectedUser, setSelectedUser, addUser, handleClaim, lastClaim }) {
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = (e) => {
    e.preventDefault();
    if (newUserName.trim()) {
      addUser(newUserName);
      setNewUserName('');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
      <form onSubmit={handleAddUser} className="mb-4">
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="Enter new user name"
          className="border p-2 rounded w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </form>
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleClaim}
        disabled={!selectedUser}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        Claim Points
      </button>
      {lastClaim && (
        <p className="mt-2 text-green-600">{lastClaim}</p>
      )}
    </div>
  );
}

export default UserSelector;
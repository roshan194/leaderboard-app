const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ClaimHistory = require('../models/ClaimHistory');

// Get all users (leaderboard)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new user
router.post('/users', async (req, res) => {
  try {
    const { name } = req.body;
    const user = new User({ name });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Claim points
router.post('/claim', async (req, res) => {
  try {
    const { userId } = req.body;
    const pointsClaimed = Math.floor(Math.random() * 10) + 1;
    
    // Update user points
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalPoints: pointsClaimed } },
      { new: true }
    );

    // Save claim history
    const claim = new ClaimHistory({ userId, pointsClaimed });
    await claim.save();

    // Get updated leaderboard
    const leaderboard = await User.find().sort({ totalPoints: -1 });

    // Emit leaderboard update to all connected clients
    req.app.get('io').emit('leaderboardUpdate', leaderboard);

    res.json({ user, pointsClaimed, leaderboard });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get claim history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const history = await ClaimHistory.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .populate('userId', 'name');
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

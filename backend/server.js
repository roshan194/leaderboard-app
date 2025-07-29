const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const apiRoutes = require('./routes/api');
const User = require('./models/User');

require('dotenv').config();

const app = express();
const server = http.createServer(app); // Comment out or remove for Vercel
const io = new Server({
  cors: {
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', '*'], // Dynamic for deployment
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', '*'],
  methods: ['GET', 'POST']
}));
app.use(express.json());
app.use('/api', apiRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Seed initial users
    const initialUsers = ['Rahul', 'Kamal', 'Sanak', 'Priya', 'Vikram', 'Anita', 'Suresh', 'Meena', 'Ravi', 'Deepa'];
    User.countDocuments().then(count => {
      if (count === 0) {
        initialUsers.forEach(name => {
          new User({ name }).save();
        });
      }
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO connection (simulated for serverless)
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Broadcast leaderboard updates (Vercel workaround)
app.set('io', io);

// Export for Vercel
module.exports = app;

// Remove or comment out the following for Vercel
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const apiRoutes = require('./routes/api');
const User = require('./models/User');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Get allowed frontend URL from .env (or fallback to localhost for dev)
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS middleware for REST APIs
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST'],
  credentials: true // if you ever use cookies/auth
}));

// Parse JSON request bodies
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Seed initial users if database is empty
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

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // for testing or if needed elsewhere

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes
app.get('/api/polls', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Sample Poll',
      description: 'This is a sample poll',
      options: [
        { id: '1', text: 'Option 1', votes: 5 },
        { id: '2', text: 'Option 2', votes: 3 }
      ],
      totalVotes: 8
    }
  ]);
});

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
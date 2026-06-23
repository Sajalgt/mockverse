require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const createTestRoutes = require('./routes/testRoutes');
const { setupSocket } = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // POC ke liye open rakha hai, production mein restrict karte
  },
});

app.use(cors());
app.use(express.json());

// Routes mount karo, io ko pass karte hue
app.use('/api', createTestRoutes(io));

// Socket connection setup
setupSocket(io);

// Health check route (server chal raha hai ya nahi check karne ke liye)
app.get('/', (req, res) => {
  res.send('MockVerse backend is running');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} par`);
});
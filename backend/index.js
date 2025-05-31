require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io")

const app = express();
// Create HTTP server from Express app
const server = http.createServer(app);

// Attach socket.io to HTTP server
const io = new Server(server,  {
  cors: {
    origin: 'http://localhost:5173', // React client
    credentials: true
  }
});


// Now you can use 'io' to listen for connections
io.on('connection', (socket) => {
  console.log('Client connected');
  console.log('Socket ID', socket.id)

  socket.on('message', (data) => {
    console.log('Message received:', data);
    // Broadcast to everyone (including sender)
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

//Routes
  

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
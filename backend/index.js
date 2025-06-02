require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io")
const formatResponse = require('./utils/responseFormatter');

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
io.on('connection', (socket) => { // its a socket monitoring feature
  console.log('Client connected');
  console.log('Socket ID', socket.id)

  socket.on('message', (data) => {
    console.log('Message received:', data);
    const { text, sender, file } = data;

    // Error Handling
    const error = {}
    if(!text && !file){
      error.text = 'Please enter a message'
    }
    
    if(Object.keys(error).length > 0){
      const errorResponse = formatResponse({
        success: false,
        message: 'Validation Error',
        error: error,
      })
      socket.emit('message', errorResponse);
      return
    }
          
    data.text = `You Said: ${text}`
    data.sender = 'server'

    // On success
    const successResponse = formatResponse({
      success: true,
      message: 'Message sent successfully',
      data: data
    });

    //Send to the connected socket onlys
    socket.emit('message', successResponse);
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
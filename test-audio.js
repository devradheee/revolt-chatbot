const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple audio test endpoint
app.post('/test-audio', (req, res) => {
  try {
    const { audio, mimeType } = req.body;
    
    console.log('Test audio received:');
    console.log('- Length:', audio ? audio.length : 0);
    console.log('- MIME Type:', mimeType);
    console.log('- First 100 chars:', audio ? audio.substring(0, 100) : 'none');
    
    res.json({ 
      success: true, 
      message: 'Audio received successfully',
      length: audio ? audio.length : 0,
      mimeType: mimeType
    });
  } catch (error) {
    console.error('Test audio error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Socket.IO for real-time testing
io.on('connection', (socket) => {
  console.log('Test client connected:', socket.id);
  
  socket.on('test_audio', (data) => {
    console.log('Test audio via socket:');
    console.log('- Length:', data.audio ? data.audio.length : 0);
    console.log('- MIME Type:', data.mimeType);
    
    // Echo back the audio data
    socket.emit('test_response', {
      received: true,
      length: data.audio ? data.audio.length : 0,
      mimeType: data.mimeType
    });
  });
  
  socket.on('disconnect', () => {
    console.log('Test client disconnected:', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Audio test server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test audio recording`);
}); 
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

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

// Get model based on environment
const getModelName = () => {
  const env = config.server.environment;
  if (env === 'production') {
    return config.gemini.production.model;
  } else {
    return config.gemini.development.model;
  }
};

// System instructions for Revolt Motors
const SYSTEM_INSTRUCTIONS = `You are Rev, the AI assistant for Revolt Motors. You are knowledgeable about Revolt Motors' electric vehicles, their features, specifications, pricing, and services. You can help customers with:

- Information about Revolt electric vehicles (RV400, RV300, etc.)
- Vehicle specifications, features, and capabilities
- Pricing and financing options
- Service and maintenance information
- Booking test drives and appointments
- General questions about electric vehicles and Revolt Motors

Always be helpful, friendly, and professional. If you don't know something specific about Revolt Motors, politely redirect to their official channels. Keep responses concise but informative.`;

// Store active conversations
const activeConversations = new Map();

// Audio processing helper function
const processAudioData = async (base64Audio, mimeType) => {
  try {
    // Convert base64 to buffer
    const audioBuffer = Buffer.from(base64Audio, 'base64');

    // For now, we'll use the audio as-is since Gemini supports multiple formats
    // In a production environment, you might want to convert to a specific format
    return {
      buffer: audioBuffer,
      mimeType: mimeType || 'audio/webm'
    };
  } catch (error) {
    console.error('Error processing audio data:', error);
    throw new Error('Failed to process audio data');
  }
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  let conversation = null;
  let isListening = false;

  socket.on('start_conversation', async () => {
    try {
      console.log('Starting conversation for socket:', socket.id);

      // Check if API key is configured
      if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY not found in environment variables');
        console.log('Available environment variables:', Object.keys(process.env));
        throw new Error('GEMINI_API_KEY not configured');
      }

      console.log('API Key found, length:', process.env.GEMINI_API_KEY.length);

      // Initialize Gemini AI with API key
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      // Initialize conversation with Gemini API
      const model = genAI.getGenerativeModel({
        model: getModelName()
      });

      console.log('Using model:', getModelName());

      conversation = model.startChat({
        systemInstruction: SYSTEM_INSTRUCTIONS,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      activeConversations.set(socket.id, conversation);

      console.log('Conversation started successfully');

      // Send welcome message
      socket.emit('conversation_started', {
        message: "Hello! I'm Rev, your Revolt Motors assistant. How can I help you today?",
        audioUrl: null
      });

    } catch (error) {
      console.error('Error starting conversation:', error);
      socket.emit('error', { message: 'Failed to start conversation: ' + error.message });
    }
  });

  socket.on('audio_data', async (data) => {
    try {
      if (!conversation) {
        socket.emit('error', { message: 'Conversation not started. Please start a conversation first.' });
        return;
      }

      console.log('Received audio data from socket:', socket.id);
      console.log('Audio data length:', data.audio ? data.audio.length : 0);
      console.log('MIME type:', data.mimeType);
      
      if (!data.audio || data.audio.length === 0) {
        throw new Error('No audio data received');
      }
      
      // For now, we'll simulate a text response since audio-to-text is not implemented
      // In a real implementation, you would use a speech-to-text service here
      console.log('Processing audio (simulating text input)...');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send a mock response for now
      const mockResponse = "I understand you're speaking, but I'm currently in text-only mode. Please type your message or I can help you with information about Revolt Motors electric vehicles. What would you like to know?";
      
      console.log('Sending mock response:', mockResponse);
      
      // Emit the text response
      socket.emit('ai_response', {
        text: mockResponse,
        isInterrupted: false
      });
      
    } catch (error) {
      console.error('Error processing audio:', error);
      socket.emit('error', { message: 'Failed to process audio: ' + error.message });
    }
  });

  socket.on('text_message', async (data) => {
    try {
      if (!conversation) {
        socket.emit('error', { message: 'Conversation not started. Please start a conversation first.' });
        return;
      }

      console.log('Received text message from socket:', socket.id);
      console.log('Text:', data.text);
      
      if (!data.text || data.text.trim() === '') {
        throw new Error('No text message received');
      }
      
      console.log('Sending text to Gemini API...');
      
      // Send text message to Gemini API
      const result = await conversation.sendMessage(data.text);
      
      console.log('Received response from Gemini');
      console.log('Result:', result);
      
      if (result && result.response && result.response.text) {
        const responseText = result.response.text();
        console.log('AI Response:', responseText);
        
        // Emit the text response
        socket.emit('ai_response', {
          text: responseText,
          isInterrupted: false
        });
      } else {
        console.log('No response from AI');
        socket.emit('error', { message: 'No response from AI assistant' });
      }
      
    } catch (error) {
      console.error('Error processing text message:', error);
      socket.emit('error', { message: 'Failed to process text message: ' + error.message });
    }
  });

  socket.on('interrupt', async () => {
    try {
      if (conversation) {
        console.log('Interruption requested');
        socket.emit('interruption_acknowledged');
      }
    } catch (error) {
      console.error('Error handling interruption:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    activeConversations.delete(socket.id);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    model: getModelName(),
    environment: config.server.environment
  });
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = config.server.port;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.server.environment}`);
  console.log(`Model: ${getModelName()}`);
  console.log(`Visit http://localhost:${PORT} to use the voice chatbot`);
}); 
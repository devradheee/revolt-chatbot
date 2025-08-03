# Rev - Revolt Motors Voice Assistant

A real-time conversational voice interface using the Gemini Live API, replicating the functionality of the Revolt Motors chatbot.

## Features

- 🎤 **Real-time Voice Communication**: Natural conversation with the AI assistant
- 🔄 **Interruption Support**: Users can interrupt the AI while it's speaking
- 🌍 **Multi-language Support**: Built-in support for various languages
- ⚡ **Low Latency**: Optimized for 1-2 second response times
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations

## Architecture

This application uses a **server-to-server architecture** as required by the Gemini Live API:

- **Backend**: Node.js/Express server with Socket.IO for real-time communication
- **Frontend**: Modern HTML5/CSS3/JavaScript with Web Audio API
- **AI**: Google Gemini Live API with native audio dialog model
- **Communication**: WebSocket-based real-time audio streaming

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google AI Studio API key
- Modern web browser with microphone access

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/devradheee/revolt-chatbot
cd revolt-chatbot
```

### 2. Start the Application

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 3. Access the Application

Open your browser and navigate to:
```

```

## Usage

1. **Start Conversation**: Click the "Start Conversation" button to initialize the AI
2. **Voice Chat**: Hold the microphone button to speak, release to send
3. **Interrupt**: Click the stop button or start speaking again to interrupt the AI
4. **View Messages**: All conversations are displayed in the chat interface

## API Configuration

### Model Selection

The application is configured to use the native audio dialog model:
- **Production**: `gemini-2.5-flash-preview-native-audio-dialog`
- **Development**: `gemini-2.0-flash-live-001` (for testing to avoid rate limits)

To switch models, update the model name in `server.js`:

```javascript
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-live-001" // For development
});
```


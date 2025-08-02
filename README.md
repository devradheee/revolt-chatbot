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
git clone <your-repository-url>
cd revolt-voice-chatbot
```

### 4. Start the Application

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
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

### System Instructions

The AI is configured with specific instructions for Revolt Motors:

```
You are Rev, the AI assistant for Revolt Motors. You are knowledgeable about Revolt Motors' electric vehicles, their features, specifications, pricing, and services. You can help customers with:

- Information about Revolt electric vehicles (RV400, RV300, etc.)
- Vehicle specifications, features, and capabilities
- Pricing and financing options
- Service and maintenance information
- Booking test drives and appointments
- General questions about electric vehicles and Revolt Motors

Always be helpful, friendly, and professional. If you don't know something specific about Revolt Motors, politely redirect to their official channels. Keep responses concise but informative.
```

## Technical Implementation

### Server-Side Features

- **Socket.IO Integration**: Real-time bidirectional communication
- **Audio Processing**: Base64 encoding/decoding for audio transmission
- **Error Handling**: Comprehensive error handling and user feedback
- **Conversation Management**: Active conversation tracking and cleanup

### Client-Side Features

- **Web Audio API**: High-quality audio recording and playback
- **MediaRecorder**: Efficient audio capture with WebM format
- **Touch Support**: Mobile-friendly touch events
- **Visual Feedback**: Wave animations and status indicators

### Interruption Handling

The application implements robust interruption support:

1. **User-initiated**: Stop button or new voice input
2. **Server-side**: Socket.IO events for interruption signals
3. **AI Response**: Gemini Live API handles interruptions natively
4. **UI Feedback**: Visual and audio feedback for interruption states

## Development Notes

### Rate Limits

The Gemini Live API has strict rate limits on the free tier:
- **Native Audio Dialog**: Limited requests per day
- **Alternative Models**: Use `gemini-2.0-flash-live-001` for development
- **Testing**: Use the interactive playground for API testing

### Audio Format

- **Input**: WebM with Opus codec (16kHz, mono)
- **Output**: Base64 encoded audio from Gemini
- **Playback**: Browser-native audio playback

### Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Limited support (may need polyfills)
- **Mobile**: iOS Safari and Android Chrome supported

## Troubleshooting

### Common Issues

1. **Microphone Access Denied**
   - Ensure HTTPS or localhost
   - Check browser permissions
   - Try refreshing the page

2. **API Key Errors**
   - Verify API key in `.env` file
   - Check API key permissions
   - Ensure sufficient quota

3. **Audio Not Playing**
   - Check browser audio settings
   - Verify audio format compatibility
   - Check console for errors

4. **Connection Issues**
   - Verify server is running
   - Check Socket.IO connection
   - Review network connectivity

### Debug Mode

Enable debug logging by setting:
```javascript
// In server.js
console.log('Debug mode enabled');
```

## Performance Optimization

- **Audio Compression**: Optimized audio format for transmission
- **Connection Pooling**: Efficient Socket.IO connection management
- **Memory Management**: Proper cleanup of audio resources
- **Caching**: Browser-level audio caching for responses

## Security Considerations

- **API Key Protection**: Environment variables for sensitive data
- **HTTPS Required**: Production deployment requires SSL
- **Input Validation**: Server-side audio validation
- **Rate Limiting**: Built-in request throttling

## Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
```bash
npm start
```

### Environment Variables
- `GEMINI_API_KEY`: Your Gemini API key
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the troubleshooting section
- Review the Gemini Live API documentation
- Contact the development team

---

**Note**: This application is designed to replicate the functionality of the Revolt Motors chatbot. For production use, ensure compliance with Google's API terms of service and Revolt Motors' branding guidelines. 
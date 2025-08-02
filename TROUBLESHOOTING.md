# Audio Troubleshooting Guide

## Common Issues and Solutions

### 1. Microphone Not Working

**Symptoms:**
- Cannot access microphone
- "Microphone access denied" error
- No audio recording

**Solutions:**
1. **Check Browser Permissions:**
   - Click the microphone icon in the browser address bar
   - Ensure microphone access is allowed
   - Refresh the page after granting permissions

2. **Check System Microphone:**
   - Ensure microphone is not muted in system settings
   - Test microphone in other applications
   - Check if microphone is set as default input device

3. **Browser Compatibility:**
   - Use Chrome, Firefox, or Edge (latest versions)
   - Ensure HTTPS is used (required for microphone access)

### 2. Audio Recording Issues

**Symptoms:**
- Recording starts but no audio data
- Empty audio files
- Recording stops immediately

**Solutions:**
1. **Check Audio Format Support:**
   - Open the test page: `http://localhost:3000/test-audio.html`
   - Click "Test Audio Formats" to see supported formats
   - Ensure your browser supports the required audio formats

2. **Audio Quality Settings:**
   - Try different sample rates (16kHz recommended)
   - Check if echo cancellation is enabled
   - Ensure noise suppression is working

3. **Browser-Specific Issues:**
   - **Chrome:** Check if microphone is blocked in settings
   - **Firefox:** Allow microphone access in about:preferences
   - **Safari:** May require additional permissions

### 3. Server Connection Issues

**Symptoms:**
- "Failed to start conversation" error
- No response from AI
- Connection timeouts

**Solutions:**
1. **Check API Key:**
   - Ensure `GEMINI_API_KEY` is set in `.env` file
   - Verify API key is valid and has proper permissions
   - Check API quota limits

2. **Server Status:**
   - Check if server is running: `http://localhost:3000/health`
   - Look for error messages in server console
   - Ensure all dependencies are installed

3. **Network Issues:**
   - Check firewall settings
   - Ensure port 3000 is not blocked
   - Try different network connection

### 4. AI Response Issues

**Symptoms:**
- AI doesn't respond to voice input
- Text responses but no audio
- Interrupted responses

**Solutions:**
1. **Check Gemini API:**
   - Verify API key has access to voice models
   - Check if using correct model name
   - Ensure API supports audio input

2. **Audio Format Compatibility:**
   - Ensure audio format is supported by Gemini
   - Check audio file size limits
   - Verify base64 encoding is correct

3. **Model Configuration:**
   - Check if using correct model for voice capabilities
   - Verify system instructions are properly formatted
   - Ensure conversation is properly initialized

## Testing Steps

### Step 1: Basic Audio Test
1. Open `http://localhost:3000/test-audio.html`
2. Click "Test Microphone Access"
3. Grant microphone permissions if prompted
4. Check if microphone access is successful

### Step 2: Recording Test
1. Click "Start Recording"
2. Speak for a few seconds
3. Click "Stop Recording"
4. Check if audio data is captured

### Step 3: Server Test
1. Click "Test Server Connection"
2. Verify server responds correctly
3. Check for any error messages

### Step 4: Format Test
1. Click "Test Audio Formats"
2. Note which formats are supported
3. Ensure required formats are available

## Debug Information

### Console Logs
Check browser console (F12) for:
- Microphone access errors
- Audio recording issues
- Network connection problems
- API response errors

### Server Logs
Check server console for:
- Connection attempts
- Audio processing errors
- API call failures
- Model initialization issues

### Common Error Messages

**"Microphone access denied"**
- Check browser permissions
- Ensure HTTPS is used
- Try different browser

**"No supported audio format found"**
- Update browser to latest version
- Check audio codec support
- Try different audio settings

**"Failed to start conversation"**
- Check API key configuration
- Verify server is running
- Check network connection

**"No response from AI assistant"**
- Check API quota
- Verify model configuration
- Check audio format compatibility

## Environment Setup

### Required Environment Variables
```bash
GEMINI_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
```

### Installation Steps
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`
3. Add your Gemini API key
4. Start server: `npm start`

### Browser Requirements
- Chrome 80+ or Firefox 75+ or Edge 80+
- HTTPS required for microphone access
- JavaScript enabled
- WebRTC support

## Advanced Troubleshooting

### Audio Format Conversion
If audio format issues persist, the application can be modified to:
1. Convert audio to WAV format before sending
2. Use different audio codecs
3. Implement audio preprocessing

### Network Issues
For network-related problems:
1. Check proxy settings
2. Verify firewall configuration
3. Test with different network
4. Use VPN if necessary

### Performance Issues
For performance problems:
1. Reduce audio quality settings
2. Implement audio compression
3. Add connection pooling
4. Optimize server resources

## Getting Help

If issues persist:
1. Check the debug logs in browser console
2. Review server logs for error messages
3. Test with the provided test page
4. Verify all requirements are met
5. Contact support with specific error messages 
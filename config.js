module.exports = {
  // Gemini API Configuration
  gemini: {
    // Production model (has rate limits)
    production: {
      model: "gemini-2.5-flash-preview-native-audio-dialog",
      description: "Native audio dialog model with full voice capabilities"
    },
    
    // Development model (higher rate limits for testing)
    development: {
      model: "gemini-2.0-flash-live-001",
      description: "Flash live model for development and testing"
    },
    
    // Alternative model for testing
    testing: {
      model: "gemini-live-2.5-flash-preview",
      description: "Alternative preview model for testing"
    }
  },
  
  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    environment: process.env.NODE_ENV || 'development'
  },
  
  // Audio Configuration
  audio: {
    sampleRate: 16000,
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
    mimeType: 'audio/webm;codecs=opus'
  },
  
  // UI Configuration
  ui: {
    maxMessageLength: 1000,
    autoScroll: true,
    showWaveAnimation: true,
    enableTouchSupport: true
  }
}; 
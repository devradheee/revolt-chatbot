module.exports = {
  // Gemini API Configuration
  gemini: {
    // Production model (has rate limits)
    production: {
      model: "gemini-1.5-flash",
      description: "Flash model for production use"
    },
    
    // Development model (higher rate limits for testing)
    development: {
      model: "gemini-1.5-flash",
      description: "Flash model for development and testing"
    },
    
    // Alternative model for testing
    testing: {
      model: "gemini-1.5-flash",
      description: "Alternative model for testing"
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
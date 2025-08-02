const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Setting up Revolt Voice Chatbot...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from template...');
  try {
    fs.copyFileSync('env.example', '.env');
    console.log('✅ .env file created successfully');
    console.log('⚠️  Please edit .env file and add your Gemini API key');
  } catch (error) {
    console.log('❌ Error creating .env file:', error.message);
  }
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.log('❌ Error installing dependencies:', error.message);
}

console.log('\n🎯 Setup completed!');
console.log('\n📝 Next steps:');
console.log('1. Edit .env file and add your Gemini API key');
console.log('2. Run: npm run dev');
console.log('3. Open http://localhost:3001 in your browser');
console.log('\n🔑 Get your API key from: https://aistudio.google.com'); 
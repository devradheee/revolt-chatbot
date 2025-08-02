const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Revolt Voice Chatbot Setup...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'server.js',
  'config.js',
  'public/index.html',
  'public/styles.css',
  'public/script.js',
  'README.md',
  'env.example'
];

console.log('📁 Checking required files:');
let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Check package.json dependencies
console.log('\n📦 Checking package.json dependencies:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    'express',
    'socket.io',
    'cors',
    'dotenv',
    '@google/generative-ai'
  ];

  requiredDeps.forEach(dep => {
    const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
    console.log(`  ${hasDep ? '✅' : '❌'} ${dep}`);
  });
} catch (error) {
  console.log('  ❌ Error reading package.json');
}

// Check environment setup
console.log('\n🔧 Checking environment setup:');
const envExampleExists = fs.existsSync('env.example');
console.log(`  ${envExampleExists ? '✅' : '❌'} env.example file exists`);

// Check configuration
console.log('\n⚙️  Checking configuration:');
try {
  const config = require('./config');
  console.log(`  ✅ Configuration loaded successfully`);
  console.log(`  📊 Environment: ${config.server.environment}`);
  console.log(`  🎯 Model: ${config.gemini.development.model}`);
} catch (error) {
  console.log(`  ❌ Error loading configuration: ${error.message}`);
}

// Check public directory structure
console.log('\n📂 Checking public directory structure:');
const publicDir = 'public';
if (fs.existsSync(publicDir)) {
  const publicFiles = fs.readdirSync(publicDir);
  console.log(`  ✅ Public directory exists with ${publicFiles.length} files`);
  publicFiles.forEach(file => {
    console.log(`    📄 ${file}`);
  });
} else {
  console.log('  ❌ Public directory missing');
}

// Summary
console.log('\n📋 Setup Summary:');
if (allFilesExist) {
  console.log('  ✅ All required files are present');
  console.log('  🚀 Ready to install dependencies and start the application');
  console.log('\n📝 Next steps:');
  console.log('  1. Run: npm install');
  console.log('  2. Copy env.example to .env and add your Gemini API key');
  console.log('  3. Run: npm run dev');
  console.log('  4. Open http://localhost:3001 in your browser');
} else {
  console.log('  ❌ Some required files are missing');
  console.log('  🔧 Please check the file structure and try again');
}

console.log('\n🎯 Setup test completed!'); 
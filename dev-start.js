const { spawn } = require('child_process');
const path = require('path');

// Start Vite dev server
const viteProcess = spawn('npx', ['vite', '--port', '3000', '--host', '0.0.0.0'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'pipe',
  env: { ...process.env, FORCE_COLOR: '1' }
});

// Start Express API server
const expressProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'pipe',
  env: { ...process.env, NODE_ENV: 'development', FORCE_COLOR: '1' }
});

// Handle Vite output
viteProcess.stdout.on('data', (data) => {
  console.log(`[VITE] ${data.toString().trim()}`);
});

viteProcess.stderr.on('data', (data) => {
  console.log(`[VITE ERROR] ${data.toString().trim()}`);
});

// Handle Express output
expressProcess.stdout.on('data', (data) => {
  console.log(`[API] ${data.toString().trim()}`);
});

expressProcess.stderr.on('data', (data) => {
  console.log(`[API ERROR] ${data.toString().trim()}`);
});

// Handle process exit
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  viteProcess.kill('SIGINT');
  expressProcess.kill('SIGINT');
  process.exit(0);
});

console.log('🚀 Starting development servers...');
console.log('📱 Frontend (Vite): http://localhost:3000');
console.log('🔧 API (Express): http://localhost:5000');
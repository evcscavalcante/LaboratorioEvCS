import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(express.static('client/dist'));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: port
  });
});

// Mock API endpoints for testing
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Admin User', role: 'ADMIN', active: true },
    { id: 2, name: 'Test User', role: 'TECHNICIAN', active: true }
  ]);
});

app.get('/api/organizations', (req, res) => {
  res.json([
    { id: 1, name: 'Laboratório Central', active: true },
    { id: 2, name: 'Filial Norte', active: true }
  ]);
});

// Density tests endpoints
app.get('/api/density-in-situ-tests', (req, res) => {
  res.json([]);
});

app.get('/api/real-density-tests', (req, res) => {
  res.json([]);
});

app.get('/api/max-min-density-tests', (req, res) => {
  res.json([]);
});

// Serve React app
app.get('*', (req, res) => {
  const clientPath = path.join(process.cwd(), 'client', 'dist');
  res.sendFile(path.join(clientPath, 'index.html'));
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`PID: ${process.pid}`);
  console.log('Server is ready and accepting connections');
});

// Keep alive
setInterval(() => {
  console.log(`Server heartbeat - PID: ${process.pid}`);
}, 60000);

// Error handling
server.on('error', (err: any) => {
  console.error('Server error:', err);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
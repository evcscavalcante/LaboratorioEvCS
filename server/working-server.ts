import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Mock authentication middleware
const mockAuth = (req: any, res: any, next: any) => {
  req.user = { claims: { sub: "admin" } };
  req.isAuthenticated = () => true;
  next();
};

// Mock user data
const mockUsers = new Map([
  ["admin", {
    id: "admin",
    email: "admin@sistema.com", 
    firstName: "Admin",
    lastName: "User",
    role: "ADMIN",
    active: true,
    organizationId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }]
]);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: 5000
  });
});

// API Routes
app.get('/api/auth/user', mockAuth, (req: any, res) => {
  const userId = req.user.claims.sub;
  const user = mockUsers.get(userId);
  res.json(user || null);
});

app.get("/api/users", mockAuth, (req, res) => {
  const users = Array.from(mockUsers.values());
  res.json(users);
});

app.post("/api/users", mockAuth, (req, res) => {
  const userData = req.body;
  const userId = String(Date.now());
  const user = {
    id: userId,
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockUsers.set(userId, user);
  res.status(201).json(user);
});

app.patch("/api/users/:id", mockAuth, (req, res) => {
  const userId = req.params.id;
  const updates = req.body;
  const user = mockUsers.get(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const updatedUser = { ...user, ...updates, updatedAt: new Date() };
  mockUsers.set(userId, updatedUser);
  res.json(updatedUser);
});

app.delete("/api/users/:id", mockAuth, (req, res) => {
  const userId = req.params.id;
  if (mockUsers.delete(userId)) {
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.get("/api/organizations", (req, res) => {
  const mockOrgs = [
    { id: 1, name: "Laboratório Principal", active: true, createdAt: new Date() },
    { id: 2, name: "Filial Norte", active: true, createdAt: new Date() }
  ];
  res.json(mockOrgs);
});

app.get("/api/organizations/user-counts", (req, res) => {
  res.json({ 1: 15, 2: 8 });
});

// Laboratory test routes
app.get("/api/density-in-situ", mockAuth, (req, res) => {
  res.json([]);
});

app.post("/api/density-in-situ", mockAuth, (req, res) => {
  const testData = { id: Date.now(), ...req.body, createdAt: new Date() };
  res.status(201).json(testData);
});

app.get("/api/real-density", mockAuth, (req, res) => {
  res.json([]);
});

app.post("/api/real-density", mockAuth, (req, res) => {
  const testData = { id: Date.now(), ...req.body, createdAt: new Date() };
  res.status(201).json(testData);
});

app.get("/api/max-min-density", mockAuth, (req, res) => {
  res.json([]);
});

app.post("/api/max-min-density", mockAuth, (req, res) => {
  const testData = { id: Date.now(), ...req.body, createdAt: new Date() };
  res.status(201).json(testData);
});

// Serve static files from client directory
const clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));

// Catch-all handler for SPA routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  const indexPath = path.join(clientPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Server error');
    }
  });
});

// Start server
const port = 5000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Time: ${new Date().toISOString()}`);
});

// Handle server errors
server.on('error', (err: any) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

export default app;
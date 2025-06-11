import express from "express";
import path from "path";
import { registerRoutes } from './routes.js';

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

// Mock auth middleware
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

// API Routes
app.get('/api/auth/user', mockAuth, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = mockUsers.get(userId);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

app.get("/api/users", mockAuth, async (req, res) => {
  try {
    const users = Array.from(mockUsers.values());
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.post("/api/users", mockAuth, async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" });
  }
});

app.patch("/api/users/:id", mockAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const user = mockUsers.get(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    mockUsers.set(userId, updatedUser);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

app.delete("/api/users/:id", mockAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    if (mockUsers.delete(userId)) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

app.get("/api/organizations", async (req, res) => {
  try {
    const mockOrgs = [
      { id: 1, name: "Laboratório Principal", active: true, createdAt: new Date() },
      { id: 2, name: "Filial Norte", active: true, createdAt: new Date() }
    ];
    res.json(mockOrgs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch organizations" });
  }
});

app.get("/api/organizations/user-counts", async (req, res) => {
  try {
    const countsMap = { 1: 15, 2: 8 };
    res.json(countsMap);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user counts" });
  }
});

app.get("/api/density-in-situ", mockAuth, async (req, res) => {
  res.json([]);
});

app.post("/api/density-in-situ", mockAuth, async (req, res) => {
  try {
    const testData = { id: Date.now(), ...req.body, createdAt: new Date() };
    res.status(201).json(testData);
  } catch (error) {
    res.status(500).json({ message: "Failed to create test" });
  }
});

app.get("/api/real-density", mockAuth, async (req, res) => {
  res.json([]);
});

app.post("/api/real-density", mockAuth, async (req, res) => {
  try {
    const testData = { id: Date.now(), ...req.body, createdAt: new Date() };
    res.status(201).json(testData);
  } catch (error) {
    res.status(500).json({ message: "Failed to create test" });
  }
});

app.get("/api/max-min-density", mockAuth, async (req, res) => {
  res.json([]);
});

app.post("/api/max-min-density", mockAuth, async (req, res) => {
  try {
    const testData = { id: Date.now(), ...req.body, createdAt: new Date() };
    res.status(201).json(testData);
  } catch (error) {
    res.status(500).json({ message: "Failed to create test" });
  }
});

// Health check endpoint - must be before other routes
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: 5000
  });
});

// Serve static files
const clientPath = path.join(process.cwd(), 'client', 'dist');
app.use(express.static(clientPath));

// SPA routing - must be last
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/health')) {
    res.sendFile(path.join(clientPath, 'index.html'));
  }
});

const port = 5000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Process ID: ${process.pid}`);
  console.log(`Server ready to accept connections`);
});

// Handle server errors
server.on('error', (err: any) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  }
});

// Keep process alive with periodic health check
const keepAlive = setInterval(() => {
  // Heartbeat to prevent process termination in cloud environments
  if (server.listening) {
    console.log(`Server still active - PID: ${process.pid} - Port: ${port}`);
  }
}, 60000);

// Ensure server stays responsive
server.on('connection', (socket) => {
  socket.setTimeout(120000); // 2 minute timeout
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.error('Stack:', err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
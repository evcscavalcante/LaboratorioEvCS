import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  const userId = req.user.claims.sub;
  const user = mockUsers.get(userId);
  res.json(user);
});

app.get("/api/users", mockAuth, async (req, res) => {
  const users = Array.from(mockUsers.values());
  res.json(users);
});

app.get("/api/organizations", async (req, res) => {
  const mockOrgs = [
    { id: 1, name: "Laboratório Principal", active: true, createdAt: new Date() },
    { id: 2, name: "Filial Norte", active: true, createdAt: new Date() }
  ];
  res.json(mockOrgs);
});

app.get("/api/organizations/user-counts", async (req, res) => {
  res.json({ 1: 15, 2: 8 });
});

app.get("/api/density-in-situ", mockAuth, async (req, res) => {
  res.json([]);
});

app.post("/api/density-in-situ", mockAuth, async (req, res) => {
  const testData = { id: Date.now(), ...req.body, createdAt: new Date() };
  res.status(201).json(testData);
});

app.get("/api/real-density", mockAuth, async (req, res) => {
  res.json([]);
});

app.post("/api/real-density", mockAuth, async (req, res) => {
  const testData = { id: Date.now(), ...req.body, createdAt: new Date() };
  res.status(201).json(testData);
});

app.get("/api/max-min-density", mockAuth, async (req, res) => {
  res.json([]);
});

app.post("/api/max-min-density", mockAuth, async (req, res) => {
  const testData = { id: Date.now(), ...req.body, createdAt: new Date() };
  res.status(201).json(testData);
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve static files
const clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));

// SPA routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientPath, 'index.html'));
  }
});

const port = 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});
import express from "express";
import { createServer } from "http";

const app = express();
app.use(express.json());

// Mock authentication middleware for testing
const mockAuth = (req: any, res: any, next: any) => {
  req.user = {
    claims: { sub: "admin" }
  };
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
    organizationId: 1
  }]
]);

// Auth routes
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

// Users routes
app.get("/api/users", mockAuth, async (req, res) => {
  try {
    const users = Array.from(mockUsers.values());
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Organizations routes
app.get("/api/organizations", async (req, res) => {
  try {
    const mockOrgs = [
      { id: 1, name: "Laboratório Principal", active: true },
      { id: 2, name: "Filial Norte", active: true }
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

// Test routes for laboratory functionality
app.get("/api/density-in-situ", mockAuth, async (req, res) => {
  res.json([]);
});

app.get("/api/real-density", mockAuth, async (req, res) => {
  res.json([]);
});

app.get("/api/max-min-density", mockAuth, async (req, res) => {
  res.json([]);
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve static files (frontend)
app.use(express.static("dist"));

// Fallback for SPA routing
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "dist" });
});

const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`[express] serving on port ${PORT}`);
});
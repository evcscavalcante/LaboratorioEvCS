import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from 'url';
import { createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Organizations routes
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

// Laboratory test routes
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

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = createServer(app);

  // Setup Vite in development mode for proper frontend serving
  if (process.env.NODE_ENV === "development") {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
        root: path.join(__dirname, '../'),
      });

      app.use(vite.middlewares);

      // Handle SPA routing
      app.use('*', async (req, res, next) => {
        if (req.originalUrl.startsWith('/api')) {
          return next();
        }

        try {
          const url = req.originalUrl;
          const template = await vite.transformIndexHtml(url, `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Laboratório Ev.C.S - Sistema Geotécnico</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/client/src/main.tsx"></script>
</body>
</html>
          `);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    } catch (error) {
      console.error('Failed to setup Vite:', error);
      process.exit(1);
    }
  }

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error('Server error:', err);
    res.status(status).json({ message });
  });

  const port = 5000;

  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
    console.log(`Server is ready and listening on port ${port}`);
    console.log(`Frontend available at http://localhost:${port}`);
  });

  // Handle server errors
  server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });
})();
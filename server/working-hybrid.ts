import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import session from "express-session";
import hybridAuthRoutes, { verifyFirebaseToken } from "./auth-firebase-hybrid";
import { registerRoutes } from "./routes";
import { registerPaymentRoutes } from "./payment-routes";
import { setupVite, serveStatic } from "./vite";
import MemoryStore from "memorystore";
import { simpleOrgManager, requireRole } from "./simple-org-management";
import { db } from "./db";
import { subscriptionPlans, users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Session TTL
  const sessionTtl = 24 * 60 * 60 * 1000; // 24 hours

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Session configuration
  const MemoryStoreSession = MemoryStore(session);
  app.use(session({
    store: new MemoryStoreSession({
      checkPeriod: sessionTtl
    }),
    secret: process.env.SESSION_SECRET || "fallback-secret-for-development",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: sessionTtl,
    },
  }));

  // Firebase Authentication routes - API routes FIRST
  app.use('/api', hybridAuthRoutes);

  // Current user endpoint (protected by Firebase token)
  app.get('/api/auth/user', verifyFirebaseToken, (req: Request, res: Response) => {
    res.json({ user: req.user });
  });

  // Subscription plans (public access)
  app.get("/api/subscription/plans", async (req: Request, res: Response) => {
    try {
      const plans = await db.select().from(subscriptionPlans);
      res.json(plans);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      res.status(500).json({ message: "Error fetching subscription plans" });
    }
  });

  // User permissions (protected route)
  app.get("/api/user/permissions", verifyFirebaseToken, (req: Request, res: Response) => {
    const user = req.user as any;
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    res.json({
      userId: user.id,
      role: user.role,
      permissions: user.permissions || [],
      organizationId: user.organizationId
    });
  });

  // Admin users endpoint (ADMIN only)
  app.get("/api/admin/users", verifyFirebaseToken, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
      const allUsers = await db.select().from(users);
      res.json(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Developer system info (DEVELOPER only) 
  app.get("/api/developer/system-info", verifyFirebaseToken, requireRole('DEVELOPER'), (req: Request, res: Response) => {
    res.json({
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      features: [
        "Firebase Authentication",
        "PostgreSQL Database", 
        "Organization Management",
        "Payment Integration"
      ]
    });
  });

  // Payment configuration
  app.get('/api/payment/config', (req: Request, res: Response) => {
    res.json({
      providers: ['pagseguro', 'mercadopago'],
      currency: 'BRL',
      methods: ['pix', 'credit_card', 'boleto']
    });
  });

  // Register additional routes
  await registerRoutes(app);
  await registerPaymentRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ message: "Internal server error" });
  });

  // Setup Vite AFTER all API routes are defined
  try {
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
  } catch (error) {
    console.error('Error setting up Vite:', error);
  }

  const PORT = parseInt(process.env.PORT || "5000", 10);
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor híbrido iniciado na porta ${PORT}`);
    console.log(`🔥 Firebase Authentication (Frontend)`);
    console.log(`🐘 PostgreSQL Database (Backend)`);
    console.log(`🔐 Autenticação híbrida configurada`);
  });

  return { app, server };
}

startServer().catch(console.error);
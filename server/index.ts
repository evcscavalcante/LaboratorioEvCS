import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import session from "express-session";
import hybridAuthRoutes, { verifyFirebaseToken } from "./auth-firebase-hybrid";
import { registerRoutes } from "./routes";
import { registerPaymentRoutes } from "./payment-routes";
import { setupVite, serveStatic } from "./vite";
import MemoryStore from "memorystore";

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

// Import simplified organization management
import { simpleOrgManager, requireRole } from "./simple-org-management";
import { db } from "./db";
import { subscriptionPlans, users } from "@shared/schema";
import { eq } from "drizzle-orm";

// Subscription plans (public access)
app.get("/api/subscription/plans", async (req: Request, res: Response) => {
  try {
    const plans = await simpleOrgManager.getSubscriptionPlans();
    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// User role and permissions info
app.get("/api/user/permissions", verifyFirebaseToken, (req: Request, res: Response) => {
  const user = req.user as any;
  res.json({
    currentRole: user.role,
    availableRoles: ['DEVELOPER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPERVISOR', 'TECHNICIAN', 'VIEWER'],
    permissions: {
      canManageUsers: simpleOrgManager.hasPermission(user.role, 'ADMIN'),
      canAccessDeveloperTools: simpleOrgManager.hasPermission(user.role, 'DEVELOPER'),
      canManageOrganization: simpleOrgManager.hasPermission(user.role, 'MANAGER'),
      canSuperviseTests: simpleOrgManager.hasPermission(user.role, 'SUPERVISOR'),
      canPerformTests: simpleOrgManager.hasPermission(user.role, 'TECHNICIAN')
    }
  });
});

// Admin routes (hierarchical access)
app.get("/api/admin/users", verifyFirebaseToken, requireRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Developer only routes
app.get("/api/developer/system-info", verifyFirebaseToken, requireRole('DEVELOPER'), (req: Request, res: Response) => {
  res.json({
    environment: process.env.NODE_ENV,
    version: "1.0.0",
    database: "PostgreSQL",
    authentication: "Firebase Hybrid",
    systemHealth: "operational",
    features: ["Hybrid Authentication", "Organization Management", "Payment Integration"]
  });
});

// Payment configuration endpoint
app.get('/api/payment/config', (req: Request, res: Response) => {
  res.json({
    providers: [
      {
        id: "pagseguro",
        name: "PagSeguro",
        methods: ["credit_card", "pix", "boleto"]
      },
      {
        id: "mercadopago", 
        name: "Mercado Pago",
        methods: ["credit_card", "pix", "boleto"]
      }
    ],
    paymentTypes: [
      { id: "credit_card", name: "Cartão de Crédito" },
      { id: "pix", name: "PIX" },
      { id: "boleto", name: "Boleto Bancário" }
    ]
  });
});

// Register main application routes with authentication
registerRoutes(app);

// Register payment routes
registerPaymentRoutes(app);

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: "Internal server error" });
});

// Setup Vite AFTER all API routes are defined
if (app.get("env") === "development") {
  setupVite(app, server);
} else {
  serveStatic(app);
}

const PORT = parseInt(process.env.PORT || "5000", 10);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor híbrido iniciado na porta ${PORT}`);
  console.log(`🔥 Firebase Authentication (Frontend)`);
  console.log(`🐘 PostgreSQL Database (Backend)`);
  console.log(`🔐 Autenticação híbrida configurada`);
});

export { app, server };
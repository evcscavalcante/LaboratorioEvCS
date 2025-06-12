import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import session from "express-session";
import hybridAuthRoutes, { verifyFirebaseToken, requireRole } from "./auth-firebase-hybrid";
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

// Import organization management
import { organizationManager, requireMinimumRole, checkOrganizationLimits } from "./organization-management";
import { UserRoles, RoleHierarchy, subscriptionPlans, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Organization and plan management routes
app.get("/api/organizations", verifyFirebaseToken, requireMinimumRole(UserRoles.ADMIN), async (req: Request, res: Response) => {
  try {
    const organizations = await organizationManager.getOrganizationsWithPlans();
    res.json(organizations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/subscription/plans", async (req: Request, res: Response) => {
  try {
    const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.active, true));
    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/organization/limits", verifyFirebaseToken, checkOrganizationLimits, (req: Request, res: Response) => {
  res.json(req.organizationLimits);
});

// User role management
app.get("/api/user/roles", verifyFirebaseToken, (req: Request, res: Response) => {
  const user = req.user as any;
  res.json({
    currentRole: user.role,
    availableRoles: Object.values(UserRoles),
    roleHierarchy: RoleHierarchy,
    permissions: {
      canManageOrganization: organizationManager.canManageOrganization(user.role),
      canCreateOrganization: organizationManager.canCreateOrganization(user.role),
      canModifyPlans: organizationManager.canModifyPlans(user.role)
    }
  });
});

// Admin routes (hierarchical access)
app.get("/api/admin/users", verifyFirebaseToken, requireMinimumRole(UserRoles.ADMIN), async (req: Request, res: Response) => {
  try {
    const users = await db.select().from(users);
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Developer only routes
app.get("/api/developer/system-info", verifyFirebaseToken, requireMinimumRole(UserRoles.DEVELOPER), (req: Request, res: Response) => {
  res.json({
    environment: process.env.NODE_ENV,
    version: "1.0.0",
    database: "PostgreSQL",
    authentication: "Firebase Hybrid",
    totalOrganizations: "dynamic",
    systemHealth: "operational"
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
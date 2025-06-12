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

// Firebase Authentication routes - BEFORE Vite setup
app.use('/api', hybridAuthRoutes);

// Current user endpoint (protected by Firebase token)
app.get('/api/auth/user', verifyFirebaseToken, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

// Admin routes (only for ADMINs)
app.get("/api/admin/users", verifyFirebaseToken, requireRole(['ADMIN']), (req: Request, res: Response) => {
  res.json([
    { id: 1, name: "Admin User", role: "ADMIN" },
    { id: 2, name: "Manager User", role: "MANAGER" },
    { id: 3, name: "Supervisor User", role: "SUPERVISOR" },
    { id: 4, name: "Technician User", role: "TECHNICIAN" }
  ]);
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
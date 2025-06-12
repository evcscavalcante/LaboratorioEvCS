import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import session from "express-session";
import connectPg from "connect-pg-simple";
import authRoutes, { isAuthenticated, requireRole } from "./auth-complete";
import { initializeDefaultUsers } from "./init-default-users";
import { registerRoutes } from "./routes";
import { registerPaymentRoutes } from "./payment-routes";
import { setupVite, serveStatic } from "./vite";

const app = express();
const server = createServer(app);

// Session TTL
const sessionTtl = 24 * 60 * 60 * 1000; // 24 hours

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
const PostgresStore = connectPg(session);
app.use(session({
  store: new PostgresStore({
    conString: process.env.DATABASE_URL,
    tableName: "user_sessions",
    createTableIfMissing: true,
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

// Initialize default users on startup
initializeDefaultUsers();

// Authentication routes
app.use(authRoutes);

// Mercado Pago Configuration
const MERCADO_PAGO_ACCESS_TOKEN = 'APP_USR-7d9c3772-5ece-433a-bd1b-2aa3e69c1863';
const MERCADO_PAGO_PUBLIC_KEY = 'APP_USR-49306117834096-061114-3b017dc53c5db61ee27eb900797c610e-130749701';

// Current user endpoint (protected)
app.get('/api/auth/user', isAuthenticated, (req: Request, res: Response) => {
  if (req.session && req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: 'Usuário não autenticado' });
  }
});

// Register main application routes
registerRoutes(app);

// Register payment routes
registerPaymentRoutes(app);

// Admin-only routes
app.get("/api/admin/users", requireRole(['ADMIN']), (req: Request, res: Response) => {
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
    mercadoPagoPublicKey: MERCADO_PAGO_PUBLIC_KEY
  });
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: "Internal server error" });
});

// Setup Vite for development or serve static files for production
if (app.get("env") === "development") {
  setupVite(app, server);
} else {
  serveStatic(app);
}

const PORT = parseInt(process.env.PORT || "5000", 10);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor iniciado na porta ${PORT}`);
  console.log(`📊 Autenticação PostgreSQL ativa`);
  console.log(`🔐 Credenciais padrão disponíveis para todos os níveis`);
});

export { app, server };
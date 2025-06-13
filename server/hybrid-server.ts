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

// Session configuration (para dados adicionais se necessário)
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

// Firebase Authentication routes
app.use(hybridAuthRoutes);

// API routes protegidas por Firebase Token
app.get('/api/auth/user', verifyFirebaseToken, (req: Request, res: Response) => {
  res.json(req.user);
});

app.get("/api/admin/users", verifyFirebaseToken, requireRole(['ADMIN']), (req: Request, res: Response) => {
  // Lista usuários do sistema (pode vir do Firebase Admin ou PostgreSQL)
  res.json([
    { id: 1, name: "Admin User", role: "ADMIN" },
    { id: 2, name: "Manager User", role: "MANAGER" },
    { id: 3, name: "Supervisor User", role: "SUPERVISOR" },
    { id: 4, name: "Technician User", role: "TECHNICIAN" }
  ]);
});

// Routes dos ensaios laboratoriais (PostgreSQL)
registerRoutes(app);
registerPaymentRoutes(app);

// Configuração de pagamentos
app.get('/api/payment/config', (req: Request, res: Response) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    mercadoPagoKey: process.env.MERCADO_PAGO_PUBLIC_KEY || '',
    pixEnabled: true,
    boletoEnabled: true,
    creditCardEnabled: true
  });
});

// Setup Vite em desenvolvimento
if (process.env.NODE_ENV === "development") {
  setupVite(app, server);
} else {
  serveStatic(app);
}

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error(`[${new Date().toISOString()}] Error ${status}: ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }
  
  res.status(status).json({ message });
});

const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor híbrido iniciado na porta ${PORT}`);
  console.log(`🔥 Firebase Authentication (Frontend)`);
  console.log(`🐘 PostgreSQL Database (Backend)`);
  console.log(`🔐 Autenticação híbrida configurada`);
});
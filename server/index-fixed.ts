import express from "express";
import path from "path";

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
    email: "admin@laboratorio-evcs.com", 
    firstName: "Admin",
    lastName: "Sistema",
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

app.post('/api/logout', mockAuth, async (req, res) => {
  res.json({ success: true });
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

// Payment system routes
app.get('/api/subscription/plans', async (req, res) => {
  const plans = [
    {
      id: '1',
      name: 'Básico',
      description: 'Ideal para laboratórios pequenos',
      basePrice: '800.00',
      maxUsers: 3,
      maxEnsaios: 100,
      features: ['Ensaios básicos', 'Relatórios padrão', 'Suporte por email'],
      active: true
    },
    {
      id: '2', 
      name: 'Profissional',
      description: 'Para laboratórios médios',
      basePrice: '1500.00',
      maxUsers: 10,
      maxEnsaios: 500,
      features: ['Todos os ensaios', 'Relatórios avançados', 'Analytics', 'Suporte prioritário'],
      active: true
    },
    {
      id: '3',
      name: 'Enterprise', 
      description: 'Para grandes laboratórios',
      basePrice: '2500.00',
      maxUsers: null,
      maxEnsaios: null,
      features: ['Funcionalidades completas', 'API access', 'Suporte 24/7', 'Customizações'],
      active: true
    }
  ];
  res.json(plans);
});

app.get('/api/subscription/cycles', async (req, res) => {
  const cycles = [
    { id: '1', name: 'Mensal', months: 1, discountPercent: '0', active: true },
    { id: '2', name: 'Semestral', months: 6, discountPercent: '10', active: true },
    { id: '3', name: 'Anual', months: 12, discountPercent: '20', active: true }
  ];
  res.json(cycles);
});

app.post('/api/subscription/calculate-price', async (req, res) => {
  const { basePrice, cycleDiscountPercent, additionalUsers } = req.body;
  const userCost = (additionalUsers || 0) * 200;
  const subtotal = basePrice + userCost;
  const discount = subtotal * ((cycleDiscountPercent || 0) / 100);
  const finalPrice = subtotal - discount;
  
  res.json({ basePrice, userCost, subtotal, discount, finalPrice });
});

app.get('/api/subscription/current', async (req, res) => {
  const subscription = {
    id: '1',
    status: 'active',
    planId: '2',
    cycleId: '1',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  };
  res.json(subscription);
});

app.post('/api/subscription/create', async (req, res) => {
  const { planId, cycleId, trialDays } = req.body;
  const subscription = {
    id: `sub_${Date.now()}`,
    planId,
    cycleId,
    status: trialDays ? 'trialing' : 'active',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    trialEnd: trialDays ? new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000) : null,
    createdAt: new Date()
  };
  res.json(subscription);
});

app.post('/api/payment/invoices', async (req, res) => {
  const { subscriptionId, amount, description } = req.body;
  const invoice = {
    id: `inv_${Date.now()}`,
    subscriptionId,
    amount: amount.toString(),
    total: (amount * 1.05).toString(),
    status: 'open',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    invoiceNumber: `INV-${Date.now()}`,
    description: description || 'Assinatura do sistema',
    createdAt: new Date()
  };
  res.json(invoice);
});

app.post('/api/payment/pix', async (req, res) => {
  const { invoiceId, customerData } = req.body;
  const pixCode = `00020126580014br.gov.bcb.pix0136${customerData.email}520400005303986540${Math.random() * 1000}5802BR5925LABORATORIO EVCS LTDA6009SAO PAULO62070503***6304`;
  
  res.json({
    success: true,
    transactionId: `pix_${Date.now()}`,
    pixQrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    pixCopyPaste: pixCode,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000)
  });
});

app.post('/api/payment/boleto', async (req, res) => {
  const { invoiceId, customerData } = req.body;
  
  res.json({
    success: true,
    transactionId: `boleto_${Date.now()}`,
    boletoUrl: `https://pagseguro.uol.com.br/checkout/boleto/print.html?code=mock_${Date.now()}`,
    boletoBarcode: `23791234567890123456789012345678901234567890`,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  });
});

app.get('/api/payment/methods', async (req, res) => {
  res.json([]);
});

app.get('/api/payment/invoices', async (req, res) => {
  const invoices = [
    {
      id: '1',
      invoiceNumber: 'INV-12345',
      amount: '1500.00',
      status: 'paid',
      dueDate: new Date('2025-01-15'),
      paidAt: new Date('2025-01-10'),
      description: 'Janeiro 2025 - Plano Profissional'
    },
    {
      id: '2', 
      invoiceNumber: 'INV-12344',
      amount: '1500.00',
      status: 'paid',
      dueDate: new Date('2024-12-15'),
      paidAt: new Date('2024-12-10'),
      description: 'Dezembro 2024 - Plano Profissional'
    }
  ];
  res.json(invoices);
});

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

export default server;
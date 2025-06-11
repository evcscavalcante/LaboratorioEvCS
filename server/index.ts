import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";

const app = express();
const server = createServer(app);

// Basic middleware
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
    email: "admin@laboratorio-evcs.com", 
    firstName: "Administrador",
    lastName: "Sistema",
    role: "ADMIN",
    active: true,
    organizationId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }]
]);

// Auth routes
app.get('/api/auth/user', mockAuth, (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = mockUsers.get(userId);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

app.post('/api/logout', (req, res) => {
  res.json({ success: true });
});

// Users routes
app.get("/api/users", mockAuth, (req, res) => {
  try {
    const users = Array.from(mockUsers.values());
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.post("/api/users", mockAuth, (req, res) => {
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

app.patch("/api/users/:id", mockAuth, (req, res) => {
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

app.delete("/api/users/:id", mockAuth, (req, res) => {
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
app.get("/api/organizations", (req, res) => {
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

app.get("/api/organizations/user-counts", (req, res) => {
  try {
    const countsMap = { 1: 15, 2: 8 };
    res.json(countsMap);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user counts" });
  }
});

// Laboratory test routes
app.get("/api/density-in-situ", mockAuth, (req, res) => {
  res.json([]);
});

app.post("/api/density-in-situ", mockAuth, (req, res) => {
  try {
    const testData = { id: Date.now(), ...req.body, createdAt: new Date() };
    res.status(201).json(testData);
  } catch (error) {
    res.status(500).json({ message: "Failed to create test" });
  }
});

app.get("/api/real-density", mockAuth, (req, res) => {
  res.json([]);
});

app.post("/api/real-density", mockAuth, (req, res) => {
  try {
    const testData = { id: Date.now(), ...req.body, createdAt: new Date() };
    res.status(201).json(testData);
  } catch (error) {
    res.status(500).json({ message: "Failed to create test" });
  }
});

app.get("/api/max-min-density", mockAuth, (req, res) => {
  res.json([]);
});

app.post("/api/max-min-density", mockAuth, (req, res) => {
  try {
    const testData = { id: Date.now(), ...req.body, createdAt: new Date() };
    res.status(201).json(testData);
  } catch (error) {
    res.status(500).json({ message: "Failed to create test" });
  }
});

// Subscription system routes
app.get('/api/subscription/plans', (req, res) => {
  const plans = [
    {
      id: '1',
      name: 'Básico',
      description: 'Ideal para laboratórios pequenos com até 3 usuários',
      basePrice: '800.00',
      maxUsers: 3,
      maxEnsaios: 100,
      features: [
        'Ensaios básicos de densidade',
        'Relatórios padrão em PDF',
        'Suporte por email',
        'Backup automático'
      ],
      active: true
    },
    {
      id: '2',
      name: 'Profissional',
      description: 'Para laboratórios médios com funcionalidades avançadas',
      basePrice: '1500.00',
      maxUsers: 10,
      maxEnsaios: 500,
      features: [
        'Todos os tipos de ensaio',
        'Relatórios avançados personalizáveis',
        'Dashboard de analytics',
        'Suporte prioritário por telefone',
        'Integração com equipamentos',
        'API para sistemas externos'
      ],
      active: true
    },
    {
      id: '3',
      name: 'Enterprise',
      description: 'Solução completa para grandes laboratórios',
      basePrice: '2500.00',
      maxUsers: null,
      maxEnsaios: null,
      features: [
        'Funcionalidades completas ilimitadas',
        'Customizações específicas',
        'Suporte 24/7 dedicado',
        'Treinamento da equipe',
        'Consultoria técnica especializada',
        'SLA garantido de 99.9%'
      ],
      active: true
    }
  ];
  res.json(plans);
});

app.get('/api/subscription/cycles', (req, res) => {
  const cycles = [
    {
      id: '1',
      name: 'Mensal',
      months: 1,
      discountPercent: '0',
      active: true
    },
    {
      id: '2',
      name: 'Semestral',
      months: 6,
      discountPercent: '10',
      active: true
    },
    {
      id: '3',
      name: 'Anual',
      months: 12,
      discountPercent: '20',
      active: true
    }
  ];
  res.json(cycles);
});

app.post('/api/subscription/calculate-price', (req, res) => {
  const { basePrice, cycleDiscountPercent, additionalUsers } = req.body;
  
  const base = parseFloat(basePrice) || 0;
  const userCost = (additionalUsers || 0) * 200;
  const subtotal = base + userCost;
  const discountPercent = parseFloat(cycleDiscountPercent) || 0;
  const discount = subtotal * (discountPercent / 100);
  const finalPrice = subtotal - discount;
  
  res.json({
    basePrice: base,
    userCost,
    subtotal,
    discount,
    finalPrice,
    discountPercent
  });
});

app.get('/api/subscription/current', (req, res) => {
  const subscription = {
    id: '1',
    status: 'active',
    planId: '2',
    cycleId: '1',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  };
  res.json(subscription);
});

app.post('/api/subscription/create', (req, res) => {
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

// Payment routes  
app.get('/api/payment/methods', (req, res) => {
  res.json([
    {
      id: '1',
      type: 'credit_card',
      provider: 'pagseguro',
      lastFour: '1234',
      brand: 'visa',
      isDefault: true
    }
  ]);
});

app.get('/api/payment/invoices', (req, res) => {
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

app.post('/api/payment/invoices', (req, res) => {
  const { subscriptionId, amount, description } = req.body;
  
  const invoice = {
    id: `inv_${Date.now()}`,
    subscriptionId,
    amount: parseFloat(amount).toFixed(2),
    total: (parseFloat(amount) * 1.05).toFixed(2),
    status: 'open',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    invoiceNumber: `INV-${Date.now()}`,
    description: description || 'Assinatura Laboratório EV.C.S',
    createdAt: new Date()
  };
  
  res.json(invoice);
});

app.post('/api/payment/pix', (req, res) => {
  const { invoiceId, customerData } = req.body;
  
  const pixCode = `00020126580014br.gov.bcb.pix0136${customerData?.email || 'cliente'}@laboratorio-evcs.com520400005303986540${Math.floor(Math.random() * 1000)}5802BR5925LABORATORIO EVCS LTDA6009SAO PAULO62070503***6304`;
  
  res.json({
    success: true,
    transactionId: `pix_${Date.now()}`,
    pixQrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    pixCopyPaste: pixCode,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000)
  });
});

app.post('/api/payment/boleto', (req, res) => {
  const { invoiceId, customerData } = req.body;
  
  res.json({
    success: true,
    transactionId: `boleto_${Date.now()}`,
    boletoUrl: `https://sistema.laboratorio-evcs.com/boleto/mock_${Date.now()}`,
    boletoBarcode: `23791234567890123456789012345678901234567890`,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0"
  });
});

// Simple fallback for development
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/health')) {
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laboratório Ev.C.S - Sistema Geotécnico</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #2563eb; margin-bottom: 20px; }
          .status { background: #dcfce7; border: 1px solid #16a34a; color: #166534; padding: 12px; border-radius: 4px; margin: 20px 0; }
          .api-list { background: #f8fafc; padding: 20px; border-radius: 4px; margin: 20px 0; }
          .api-link { display: block; color: #2563eb; text-decoration: none; margin: 8px 0; padding: 8px; background: white; border-radius: 4px; border: 1px solid #e2e8f0; }
          .api-link:hover { background: #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🧪 Laboratório Ev.C.S</h1>
          <p>Sistema Geotécnico para Análise de Densidade do Solo</p>
          
          <div class="status">
            ✅ Servidor funcionando corretamente na porta 5000
          </div>
          
          <div class="api-list">
            <h3>APIs Disponíveis:</h3>
            <a href="/health" class="api-link">GET /health - Status do servidor</a>
            <a href="/api/auth/user" class="api-link">GET /api/auth/user - Usuário autenticado</a>
            <a href="/api/users" class="api-link">GET /api/users - Lista de usuários</a>
            <a href="/api/organizations" class="api-link">GET /api/organizations - Organizações</a>
            <a href="/api/subscription/plans" class="api-link">GET /api/subscription/plans - Planos de assinatura</a>
            <a href="/api/subscription/cycles" class="api-link">GET /api/subscription/cycles - Ciclos de cobrança</a>
            <a href="/api/density-in-situ" class="api-link">GET /api/density-in-situ - Ensaios densidade in situ</a>
            <a href="/api/real-density" class="api-link">GET /api/real-density - Ensaios densidade real</a>
            <a href="/api/max-min-density" class="api-link">GET /api/max-min-density - Ensaios densidade máx/mín</a>
          </div>
          
          <p><strong>Ambiente:</strong> ${process.env.NODE_ENV || 'development'}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
      </body>
      </html>
    `);
  }
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error('Server error:', err);
  res.status(status).json({ message });
});

const port = parseInt(process.env.PORT || '5000', 10);

server.listen(port, () => {
  console.log(`✅ Servidor rodando na porta ${port}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
  console.log(`🆔 Process ID: ${process.pid}`);
  console.log(`🚀 Sistema pronto para conexões`);
  console.log(`📍 Acesse: http://localhost:${port}`);
  
  // Test server accessibility
  setTimeout(() => {
    import('http').then(http => {
      const req = http.request(`http://localhost:${port}/health`, { method: 'GET' }, (res) => {
        console.log(`✓ Server health check passed: ${res.statusCode}`);
      });
      req.on('error', (err) => {
        console.log(`⚠ Server health check failed: ${err.message}`);
      });
      req.end();
    });
  }, 1000);
});

// Handle server errors
server.on('error', (err: any) => {
  console.error('❌ Erro no servidor:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${port} já está em uso`);
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('❌ Erro não tratado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada:', promise, 'motivo:', reason);
});

// Graceful shutdown
const shutdown = () => {
  console.log('🛑 Finalizando servidor...');
  server.close(() => {
    console.log('✅ Servidor finalizado com sucesso');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default server;
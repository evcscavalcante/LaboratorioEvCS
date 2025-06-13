import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = createServer(app);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from dist/public
const distPath = path.resolve(process.cwd(), 'dist/public');
app.use(express.static(distPath));

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
app.get('/api/users', mockAuth, (req, res) => {
  const users = Array.from(mockUsers.values());
  res.json(users);
});

app.post('/api/users', mockAuth, (req, res) => {
  const { email, firstName, lastName, role } = req.body;
  
  const user = {
    id: Date.now().toString(),
    email,
    firstName,
    lastName,
    role: role || "TECHNICIAN",
    active: true,
    organizationId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockUsers.set(user.id, user);
  res.json(user);
});

// Organizations routes
app.get('/api/organizations', mockAuth, (req, res) => {
  const organizations = [
    {
      id: 1,
      name: "Laboratório Ev.C.S",
      description: "Laboratório de Ensaios Geotécnicos",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  res.json(organizations);
});

// Laboratory test routes
app.get('/api/density-in-situ', mockAuth, (req, res) => {
  res.json([]);
});

app.post('/api/density-in-situ', mockAuth, (req, res) => {
  const test = {
    id: Date.now(),
    ...req.body,
    userId: req.user.claims.sub,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  res.json(test);
});

app.get('/api/real-density', mockAuth, (req, res) => {
  res.json([]);
});

app.post('/api/real-density', mockAuth, (req, res) => {
  const test = {
    id: Date.now(),
    ...req.body,
    userId: req.user.claims.sub,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  res.json(test);
});

app.get('/api/max-min-density', mockAuth, (req, res) => {
  res.json([]);
});

app.post('/api/max-min-density', mockAuth, (req, res) => {
  const test = {
    id: Date.now(),
    ...req.body,
    userId: req.user.claims.sub,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  res.json(test);
});

// Subscription routes
app.get('/api/subscription/plans', (req, res) => {
  const plans = [
    {
      id: '1',
      name: 'Básico',
      description: 'Plano ideal para pequenos laboratórios',
      basePrice: '299.00',
      maxUsers: 5,
      maxEnsaios: 100,
      features: [
        'Ensaios básicos de densidade',
        'Relatórios em PDF',
        'Suporte por email',
        'Backup automático'
      ],
      active: true
    },
    {
      id: '2',
      name: 'Profissional',
      description: 'Solução completa para laboratórios médios',
      basePrice: '599.00',
      maxUsers: 20,
      maxEnsaios: 500,
      features: [
        'Todos os tipos de ensaios',
        'Relatórios personalizados',
        'Suporte prioritário',
        'Integrações avançadas',
        'Analytics detalhado'
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

// Payment routes
app.post('/api/payment/invoices', (req, res) => {
  const { planId, cycleId, amount, description } = req.body;
  
  const invoice = {
    id: `inv_${Date.now()}`,
    planId,
    cycleId,
    amount: amount || '299.00',
    status: 'pending',
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

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/health')) {
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).send('Application not built. Run "npm run build" first.');
      }
    });
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

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor integrado rodando na porta ${port}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
  console.log(`🆔 Process ID: ${process.pid}`);
  console.log(`🚀 Frontend e Backend integrados`);
  console.log(`📍 Acesse: http://0.0.0.0:${port}`);
});

// Handle server errors
server.on('error', (err: any) => {
  console.error('❌ Erro no servidor:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${port} já está em uso`);
    process.exit(1);
  }
});
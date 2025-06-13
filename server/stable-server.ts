import express from "express";
import path from "path";

const app = express();

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Auth mock
const mockAuth = (req: any, res: any, next: any) => {
  req.user = { claims: { sub: "admin" } };
  next();
};

// Usuários mock
const users = new Map([
  ["admin", {
    id: "admin",
    email: "admin@laboratorio-evcs.com",
    firstName: "Administrador",
    lastName: "Sistema",
    role: "ADMIN",
    active: true
  }]
]);

// Rotas de autenticação
app.get('/api/auth/user', mockAuth, (req: any, res) => {
  const user = users.get(req.user.claims.sub);
  res.json(user || null);
});

app.post('/api/logout', (req, res) => {
  res.json({ success: true });
});

// Rotas de ensaios
app.get("/api/density-in-situ", mockAuth, (req, res) => {
  res.json([]);
});

app.post("/api/density-in-situ", mockAuth, (req, res) => {
  const test = { id: Date.now(), ...req.body, createdAt: new Date() };
  res.status(201).json(test);
});

app.get("/api/real-density", mockAuth, (req, res) => {
  res.json([]);
});

app.post("/api/real-density", mockAuth, (req, res) => {
  const test = { id: Date.now(), ...req.body, createdAt: new Date() };
  res.status(201).json(test);
});

app.get("/api/max-min-density", mockAuth, (req, res) => {
  res.json([]);
});

app.post("/api/max-min-density", mockAuth, (req, res) => {
  const test = { id: Date.now(), ...req.body, createdAt: new Date() };
  res.status(201).json(test);
});

// Sistema de assinaturas - Planos
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

// Ciclos de cobrança
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

// Calcular preço da assinatura
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

// Assinatura atual
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

// Criar assinatura
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

// Criar fatura
app.post('/api/payment/invoices', (req, res) => {
  const { subscriptionId, amount, description } = req.body;
  
  const invoice = {
    id: `inv_${Date.now()}`,
    subscriptionId,
    amount: parseFloat(amount).toFixed(2),
    total: (parseFloat(amount) * 1.05).toFixed(2), // 5% de impostos
    status: 'open',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    invoiceNumber: `INV-${Date.now()}`,
    description: description || 'Assinatura Laboratório EV.C.S',
    createdAt: new Date()
  };
  
  res.json(invoice);
});

// Pagamento PIX
app.post('/api/payment/pix', (req, res) => {
  const { invoiceId, customerData } = req.body;
  
  // Código PIX simulado (em produção seria gerado pela API do banco)
  const pixCode = `00020126580014br.gov.bcb.pix0136${customerData?.email || 'cliente'}@laboratorio-evcs.com520400005303986540${Math.floor(Math.random() * 1000)}5802BR5925LABORATORIO EVCS LTDA6009SAO PAULO62070503***6304`;
  
  res.json({
    success: true,
    transactionId: `pix_${Date.now()}`,
    pixQrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    pixCopyPaste: pixCode,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
  });
});

// Pagamento Boleto
app.post('/api/payment/boleto', (req, res) => {
  const { invoiceId, customerData } = req.body;
  
  res.json({
    success: true,
    transactionId: `boleto_${Date.now()}`,
    boletoUrl: `https://sistema.laboratorio-evcs.com/boleto/mock_${Date.now()}`,
    boletoBarcode: `23791234567890123456789012345678901234567890`,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 dias
  });
});

// Métodos de pagamento
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

// Histórico de faturas
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

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: 5000,
    version: "1.0.0"
  });
});

// Servir arquivos estáticos
const clientPath = path.join(process.cwd(), 'client', 'dist');
app.use(express.static(clientPath));

// SPA routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/health')) {
    res.sendFile(path.join(clientPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

const port = 5000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor rodando na porta ${port}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
  console.log(`🆔 Process ID: ${process.pid}`);
  console.log(`🚀 Sistema pronto para conexões`);
});

// Tratamento de erros
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
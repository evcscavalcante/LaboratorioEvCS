import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import session from "express-session";
import connectPg from "connect-pg-simple";
import authRoutes, { isAuthenticated, requireRole } from "./auth-complete";
import { initializeDefaultUsers } from "./init-default-users";
import { registerRoutes } from "./routes";
import { registerPaymentRoutes } from "./payment-routes";
import { setupVite, serveStatic } from "./vite";
import MemoryStore from "memorystore";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration with memory store for simplicity
const MemStore = MemoryStore(session);
const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

app.use(session({
  secret: process.env.SESSION_SECRET || 'laboratorio-evcs-secret-2025',
  store: new MemStore({
    checkPeriod: sessionTtl
  }),
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

// Register main application routes with authentication
registerRoutes(app);

// Register payment routes
registerPaymentRoutes(app);

// Mercado Pago Configuration
const MERCADO_PAGO_ACCESS_TOKEN = 'APP_USR-7d9c3772-5ece-433a-bd1b-2aa3e69c1863';
const MERCADO_PAGO_PUBLIC_KEY = 'APP_USR-49306117834096-061114-3b017dc53c5db61ee27eb900797c610e-130749701';
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

// API Routes
app.get('/api/auth/user', mockAuth, (req: any, res) => {
  const userId = req.user.claims.sub;
  const user = mockUsers.get(userId);
  res.json(user);
});

app.post('/api/logout', (req, res) => {
  res.json({ success: true });
});

app.get('/api/users', mockAuth, (req, res) => {
  const users = Array.from(mockUsers.values());
  res.json(users);
});

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

// Rotas de Ensaios
app.get('/api/density-in-situ', mockAuth, (req, res) => {
  res.json([]);
});

app.post('/api/density-in-situ', mockAuth, (req, res) => {
  console.log('Salvando ensaio de densidade in situ:', req.body);
  const ensaio = {
    id: Date.now(),
    ...req.body,
    userId: req.user.claims.sub,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  res.status(201).json({ 
    success: true, 
    message: 'Ensaio de densidade in situ salvo com sucesso',
    data: ensaio 
  });
});

app.get('/api/real-density', mockAuth, (req, res) => {
  res.json([]);
});

app.post('/api/real-density', mockAuth, (req, res) => {
  console.log('Salvando ensaio de densidade real:', req.body);
  const ensaio = {
    id: Date.now(),
    ...req.body,
    userId: req.user.claims.sub,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  res.status(201).json({ 
    success: true, 
    message: 'Ensaio de densidade real salvo com sucesso',
    data: ensaio 
  });
});

app.get('/api/max-min-density', mockAuth, (req, res) => {
  res.json([]);
});

app.post('/api/max-min-density', mockAuth, (req, res) => {
  console.log('Salvando ensaio de densidade máx/mín:', req.body);
  const ensaio = {
    id: Date.now(),
    ...req.body,
    userId: req.user.claims.sub,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  res.status(201).json({ 
    success: true, 
    message: 'Ensaio de densidade máx/mín salvo com sucesso',
    data: ensaio 
  });
});

// Rotas de Equipamentos
app.get('/api/equipamentos/capsulas', mockAuth, (req, res) => {
  const capsulas = [
    { id: 1, codigo: 'CAP-001', peso: 15.25, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 2, codigo: 'CAP-002', peso: 15.30, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 3, codigo: 'CAP-003', peso: 15.28, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 4, codigo: 'CAP-004', peso: 15.32, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 5, codigo: 'CAP-005', peso: 15.27, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 6, codigo: 'CAP-101', peso: 16.45, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 7, codigo: 'CAP-102', peso: 16.50, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 8, codigo: 'CAP-103', peso: 16.48, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 9, codigo: 'CAP-201', peso: 14.85, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 10, codigo: 'CAP-202', peso: 14.90, status: 'ATIVO', ultimaConferencia: '2025-01-15' }
  ];
  res.json(capsulas);
});

app.get('/api/equipamentos/cilindros', mockAuth, (req, res) => {
  const cilindros = [
    { id: 1, codigo: 'CIL-001', tipo: 'BISELADO', peso: 2850.5, volume: 999.8, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 2, codigo: 'CIL-002', tipo: 'BISELADO', peso: 2845.2, volume: 1000.2, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 3, codigo: 'CIL-003', tipo: 'PROCTOR', peso: 3250.8, volume: 944.5, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 4, codigo: 'CIL-004', tipo: 'PROCTOR', peso: 3248.9, volume: 943.8, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 5, codigo: 'CIL-005', tipo: 'CBR', peso: 4850.3, volume: 2124.5, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 6, codigo: 'CIL-006', tipo: 'CBR', peso: 4855.1, volume: 2125.8, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 7, codigo: 'CIL-101', tipo: 'VAZIOS_MINIMOS', peso: 1850.5, volume: 1000.0, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 8, codigo: 'CIL-102', tipo: 'VAZIOS_MINIMOS', peso: 1848.8, volume: 999.5, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 9, codigo: 'CIL-201', tipo: 'BISELADO', peso: 2852.3, volume: 1001.1, status: 'ATIVO', ultimaConferencia: '2025-01-15' },
    { id: 10, codigo: 'CIL-202', tipo: 'BISELADO', peso: 2847.6, volume: 998.9, status: 'ATIVO', ultimaConferencia: '2025-01-15' }
  ];
  res.json(cilindros);
});

app.post('/api/equipamentos/capsulas', mockAuth, (req, res) => {
  const novaCapsula = {
    id: Date.now(),
    ...req.body,
    status: 'ATIVO',
    ultimaConferencia: new Date().toISOString().split('T')[0]
  };
  res.status(201).json(novaCapsula);
});

app.post('/api/equipamentos/cilindros', mockAuth, (req, res) => {
  const novoCilindro = {
    id: Date.now(),
    ...req.body,
    status: 'ATIVO',
    ultimaConferencia: new Date().toISOString().split('T')[0]
  };
  res.status(201).json(novoCilindro);
});

app.put('/api/equipamentos/capsulas/:id', mockAuth, (req, res) => {
  const capsulaAtualizada = {
    id: parseInt(req.params.id),
    ...req.body
  };
  res.json(capsulaAtualizada);
});

app.put('/api/equipamentos/cilindros/:id', mockAuth, (req, res) => {
  const cilindroAtualizado = {
    id: parseInt(req.params.id),
    ...req.body
  };
  res.json(cilindroAtualizado);
});

app.delete('/api/equipamentos/capsulas/:id', mockAuth, (req, res) => {
  res.json({ success: true });
});

app.delete('/api/equipamentos/cilindros/:id', mockAuth, (req, res) => {
  res.json({ success: true });
});

// Payment and Subscription Routes
app.get('/api/subscription/plans', async (req, res) => {
  try {
    // Return empty plans - no synthetic data
    res.json([]);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Erro ao buscar planos' });
  }
});

app.get('/api/subscription/cycles', async (req, res) => {
  try {
    // Return empty cycles - no synthetic data
    res.json([]);
  } catch (error) {
    console.error('Error fetching cycles:', error);
    res.status(500).json({ error: 'Erro ao buscar ciclos' });
  }
});

app.post('/api/subscription/calculate-price', (req, res) => {
  const { basePrice, cycleDiscountPercent, additionalUsers } = req.body;
  
  const userCost = (additionalUsers || 0) * 200; // R$ 200 per additional user
  const subtotal = parseFloat(basePrice) + userCost;
  const discount = subtotal * ((cycleDiscountPercent || 0) / 100);
  const finalPrice = subtotal - discount;
  
  res.json({
    basePrice: parseFloat(basePrice),
    userCost,
    subtotal,
    discount,
    finalPrice,
    formattedPrice: `R$ ${finalPrice.toFixed(2).replace('.', ',')}`
  });
});

app.post('/api/subscription/create', mockAuth, (req, res) => {
  const { planId, cycleId, additionalUsers, paymentMethod } = req.body;
  
  // Mock subscription creation
  const subscription = {
    id: Date.now().toString(),
    organizationId: 1,
    planId,
    cycleId,
    additionalUsers: additionalUsers || 0,
    status: 'PENDING',
    startDate: new Date(),
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    paymentMethod
  };
  
  res.json(subscription);
});

app.get('/api/subscription/current', async (req, res) => {
  try {
    // Return empty subscription - no synthetic data
    res.json(null);
  } catch (error) {
    console.error('Error fetching current subscription:', error);
    res.status(500).json({ error: 'Erro ao buscar assinatura atual' });
  }
});

// Payment Methods
app.get('/api/payment/methods', mockAuth, (req, res) => {
  const methods = [
    {
      id: 'pix',
      name: 'PIX',
      type: 'INSTANT',
      enabled: true,
      description: 'Pagamento instantâneo via PIX'
    },
    {
      id: 'credit_card',
      name: 'Cartão de Crédito',
      type: 'CARD',
      enabled: true,
      description: 'Visa, Mastercard, Elo'
    },
    {
      id: 'boleto',
      name: 'Boleto Bancário',
      type: 'SLIP',
      enabled: true,
      description: 'Vencimento em 3 dias úteis'
    }
  ];
  res.json(methods);
});

app.post('/api/payment/process', mockAuth, (req, res) => {
  const { amount, method, planId, cycleId } = req.body;
  
  const payment = {
    id: Date.now().toString(),
    amount: parseFloat(amount),
    method,
    status: 'PENDING',
    createdAt: new Date(),
    planId,
    cycleId
  };
  
  // Simulate different payment flows
  if (method === 'pix') {
    payment.pixCode = 'PIX123456789ABCDEF';
    payment.qrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQR42mNkYPhfz0AAAAAXMMS0GAQAAAAAvD_BwAAAABJRU5ErkJggg==';
  } else if (method === 'boleto') {
    payment.boletoUrl = '/api/payment/boleto/' + payment.id;
    payment.dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  }
  
  res.json(payment);
});

app.post('/api/payment/pix', mockAuth, async (req, res) => {
  const { amount } = req.body;
  
  try {
    const paymentData = {
      transaction_amount: parseFloat(amount),
      description: 'Assinatura Laboratório Ev.C.S',
      payment_method_id: 'pix',
      payer: {
        email: req.user?.email || 'customer@example.com',
        first_name: 'Cliente',
        last_name: 'Laboratório'
      }
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const payment = await response.json();

    if (response.ok) {
      res.json({
        id: payment.id,
        amount: payment.transaction_amount,
        pixCode: payment.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
        expiresAt: payment.date_of_expiration,
        status: payment.status,
        mercadoPagoId: payment.id
      });
    } else {
      console.error('Mercado Pago Error:', payment);
      res.status(400).json({ error: 'Erro ao criar pagamento PIX', details: payment });
    }
  } catch (error) {
    console.error('PIX Payment Error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/payment/credit-card', mockAuth, async (req, res) => {
  const { amount, cardData } = req.body;
  
  try {
    const paymentData = {
      transaction_amount: parseFloat(amount),
      token: cardData.token, // Token gerado no frontend
      description: 'Assinatura Laboratório Ev.C.S',
      installments: cardData.installments || 1,
      payment_method_id: cardData.payment_method_id,
      issuer_id: cardData.issuer_id,
      payer: {
        email: req.user?.email || 'customer@example.com',
        identification: {
          type: cardData.identification?.type || 'CPF',
          number: cardData.identification?.number || '12345678901'
        }
      }
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const payment = await response.json();

    if (response.ok) {
      res.json({
        id: payment.id,
        amount: payment.transaction_amount,
        method: 'CREDIT_CARD',
        status: payment.status,
        transactionId: payment.id,
        installments: payment.installments,
        mercadoPagoId: payment.id,
        statusDetail: payment.status_detail
      });
    } else {
      console.error('Mercado Pago Credit Card Error:', payment);
      res.status(400).json({ error: 'Erro ao processar cartão de crédito', details: payment });
    }
  } catch (error) {
    console.error('Credit Card Payment Error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para obter chave pública do Mercado Pago
app.get('/api/payment/config', (req, res) => {
  res.json({
    mercadoPagoPublicKey: MERCADO_PAGO_PUBLIC_KEY,
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
  });
});

// Webhook para receber notificações do Mercado Pago
app.post('/api/webhooks/mercadopago', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const notification = req.body;
    console.log('Mercado Pago Webhook received:', notification);

    if (notification.type === 'payment') {
      const paymentId = notification.data.id;
      
      // Buscar dados do pagamento no Mercado Pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`
        }
      });
      
      const paymentData = await response.json();
      console.log('Payment status update:', paymentData.status);
      
      // Aqui você pode atualizar o status da assinatura no banco de dados
      // baseado no status do pagamento (approved, pending, rejected, etc.)
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Endpoint para verificar status de pagamento
app.get('/api/payment/status/:paymentId', mockAuth, async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`
      }
    });
    
    const payment = await response.json();
    
    res.json({
      id: payment.id,
      status: payment.status,
      statusDetail: payment.status_detail,
      amount: payment.transaction_amount
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ error: 'Erro ao verificar status do pagamento' });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve logo files - must be before Vite middleware
app.get('/logo-compact.svg', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(`<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <circle cx="30" cy="30" r="28" fill="url(#grad1)"/>
  <rect x="15" y="38" width="30" height="4" fill="#8b5a2b" opacity="0.9"/>
  <rect x="15" y="34" width="30" height="4" fill="#a0522d" opacity="0.9"/>
  <rect x="15" y="30" width="30" height="4" fill="#cd853f" opacity="0.9"/>
  <rect x="26" y="18" width="8" height="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="1"/>
  <rect x="27" y="19" width="6" height="10" fill="url(#grad2)" opacity="0.8"/>
  <line x1="34" y1="22" x2="36" y2="22" stroke="#ffffff" stroke-width="1"/>
  <line x1="34" y1="26" x2="36" y2="26" stroke="#ffffff" stroke-width="1"/>
  <text x="30" y="52" font-family="Arial Black, sans-serif" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">Ev.C.S</text>
</svg>`);
});

app.get('/logo.svg', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(`<svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <circle cx="40" cy="40" r="35" fill="url(#gradient1)" filter="url(#shadow)"/>
  <rect x="20" y="55" width="40" height="8" fill="#8b5a2b" opacity="0.8"/>
  <rect x="20" y="47" width="40" height="8" fill="#a0522d" opacity="0.8"/>
  <rect x="20" y="39" width="40" height="8" fill="#cd853f" opacity="0.8"/>
  <rect x="32" y="25" width="16" height="20" fill="#e5e7eb" stroke="#6b7280" stroke-width="2" rx="2"/>
  <rect x="34" y="27" width="12" height="16" fill="url(#gradient2)" opacity="0.7"/>
  <line x1="48" y1="30" x2="52" y2="30" stroke="#374151" stroke-width="1"/>
  <line x1="48" y1="35" x2="52" y2="35" stroke="#374151" stroke-width="1"/>
  <line x1="48" y1="40" x2="52" y2="40" stroke="#374151" stroke-width="1"/>
  <text x="90" y="30" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#1e40af">Ev.C.S</text>
  <text x="90" y="48" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">LABORATÓRIO GEOTÉCNICO</text>
  <text x="90" y="62" font-family="Arial, sans-serif" font-size="10" fill="#9ca3af">Ensaios • Análises • Soluções</text>
  <circle cx="170" cy="25" r="3" fill="#2563eb" opacity="0.6"/>
  <circle cx="180" cy="35" r="2" fill="#059669" opacity="0.6"/>
  <circle cx="175" cy="45" r="2.5" fill="#dc2626" opacity="0.6"/>
  <line x1="90" y1="75" x2="185" y2="75" stroke="url(#gradient1)" stroke-width="2"/>
</svg>`);
});

app.get('/favicon.svg', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(`<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="faviconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <circle cx="16" cy="16" r="15" fill="url(#faviconGrad)"/>
  <rect x="8" y="20" width="16" height="2" fill="#8b5a2b" opacity="0.9"/>
  <rect x="8" y="18" width="16" height="2" fill="#a0522d" opacity="0.9"/>
  <rect x="8" y="16" width="16" height="2" fill="#cd853f" opacity="0.9"/>
  <rect x="13" y="10" width="6" height="8" fill="#ffffff" stroke="#e5e7eb" stroke-width="0.5" rx="1"/>
  <rect x="14" y="11" width="4" height="6" fill="#059669" opacity="0.8"/>
  <line x1="19" y1="13" x2="20" y2="13" stroke="#ffffff" stroke-width="0.5"/>
  <line x1="19" y1="15" x2="20" y2="15" stroke="#ffffff" stroke-width="0.5"/>
  <text x="16" y="27" font-family="Arial Black" font-size="4" font-weight="bold" fill="#ffffff" text-anchor="middle">E</text>
</svg>`);
});

// Setup Vite for development
import { setupVite } from "./vite";
setupVite(app, server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Servidor funcionando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
  console.log(`📍 Acesse: http://0.0.0.0:${PORT}`);
});

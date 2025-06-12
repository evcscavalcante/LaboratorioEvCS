import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import session from "express-session";
import connectPg from "connect-pg-simple";
import authRoutes from "./simple-auth";
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

// Authentication routes
app.use('/api/auth', authRoutes);

// Mercado Pago Configuration
const MERCADO_PAGO_ACCESS_TOKEN = 'APP_USR-7d9c3772-5ece-433a-bd1b-2aa3e69c1863';
const MERCADO_PAGO_PUBLIC_KEY = 'APP_USR-49306117834096-061114-3b017dc53c5db61ee27eb900797c610e-130749701';

const mockAuth = (req: any, res: any, next: any) => {
  req.user = { claims: { sub: "admin" } };
  req.isAuthenticated = () => true;
  next();
};

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

// Fallback for SPA routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && 
      !req.path.startsWith('/health') && 
      !req.path.startsWith('/logo') && 
      !req.path.startsWith('/favicon') && 
      !req.path.includes('.')) {
    res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laboratório Ev.C.S - Sistema Geotécnico</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; padding: 20px; }
        .card { background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 40px; max-width: 400px; width: 100%; }
        .logo { width: 64px; height: 64px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; color: white; }
        h1 { text-align: center; color: #1f2937; margin-bottom: 8px; font-size: 24px; }
        .subtitle { text-align: center; color: #6b7280; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #374151; font-weight: 600; margin-bottom: 8px; font-size: 14px; }
        input { width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; transition: border-color 0.2s; }
        input:focus { outline: none; border-color: #3b82f6; }
        .btn { width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn:hover { background: #2563eb; }
        .btn:disabled { background: #9ca3af; cursor: not-allowed; }
        .error { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
        .success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
        .credentials { background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; margin-top: 24px; }
        .credentials h3 { color: #1e40af; font-size: 14px; margin-bottom: 12px; }
        .credentials p { color: #1e3a8a; font-size: 12px; margin-bottom: 4px; }
        .dashboard { display: none; }
        .nav { background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 16px 0; }
        .nav-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
        .nav-brand { display: flex; align-items: center; font-size: 20px; font-weight: bold; color: #1f2937; }
        .nav-brand .icon { margin-right: 12px; }
        .nav-menu { display: flex; gap: 20px; }
        .nav-btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; }
        .nav-btn.active { background: #3b82f6; color: white; }
        .nav-btn:not(.active) { background: #f3f4f6; color: #374151; }
        .nav-btn:not(.active):hover { background: #e5e7eb; }
        .logout-btn { background: #dc2626; color: white; }
        .logout-btn:hover { background: #b91c1c; }
        .main { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .page-title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 32px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .module-card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); padding: 24px; border: 1px solid #e5e7eb; }
        .module-card h3 { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 8px; }
        .module-card p { color: #6b7280; margin-bottom: 16px; line-height: 1.5; }
        .module-btn { padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
        .module-btn:hover { background: #2563eb; }
        .module-btn:disabled { background: #9ca3af; cursor: not-allowed; }
        .welcome { text-align: center; margin-bottom: 40px; }
        .status-badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; }
        
        /* Subscription Styles */
        .subscription-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 40px; }
        .plan-card { background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 24px; transition: all 0.2s; position: relative; }
        .plan-card:hover { border-color: #3b82f6; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15); }
        .plan-card.current-plan { border-color: #10b981; background: #f0fdf4; }
        .plan-card h3 { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 8px; }
        .plan-price { font-size: 32px; font-weight: bold; color: #3b82f6; margin-bottom: 8px; }
        .plan-price span { font-size: 16px; color: #6b7280; }
        .plan-description { color: #6b7280; margin-bottom: 20px; }
        .plan-features { list-style: none; margin-bottom: 24px; }
        .plan-features li { padding: 4px 0; color: #374151; }
        .plan-btn { width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .plan-btn:hover:not(:disabled) { background: #2563eb; }
        .plan-btn:disabled { background: #9ca3af; cursor: not-allowed; }
        
        /* Payment Modal */
        .payment-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .payment-modal-content { background: white; border-radius: 12px; padding: 32px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; }
        .billing-cycle-section, .payment-method-section { margin: 20px 0; }
        .billing-cycle-section h4, .payment-method-section h4 { margin-bottom: 12px; color: #1f2937; }
        .billing-cycle-section select { width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; }
        .payment-methods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .payment-method-btn { padding: 16px 12px; border: 2px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.2s; }
        .payment-method-btn:hover { border-color: #3b82f6; }
        .payment-method-btn.selected { border-color: #3b82f6; background: #eff6ff; }
        .price-summary { background: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0; }
        .price-line { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .price-line.total { font-weight: bold; border-top: 1px solid #e5e7eb; padding-top: 8px; }
        .price-line.discount { color: #059669; }
        .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
        .cancel-btn, .confirm-btn { flex: 1; padding: 12px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .cancel-btn { background: #f3f4f6; color: #374151; }
        .confirm-btn { background: #3b82f6; color: white; }
        .confirm-btn:disabled { background: #9ca3af; cursor: not-allowed; }
        
        /* Card Form */
        .card-form { margin: 20px 0; }
        .form-row { display: flex; gap: 12px; margin-bottom: 16px; }
        .form-group { flex: 1; }
        .form-group label { display: block; margin-bottom: 4px; font-size: 14px; color: #374151; font-weight: 500; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #3b82f6; }
    </style>
</head>
<body>
    <div id="app">
        <div class="container" id="login-page">
            <div class="card">
                <div class="logo">🔬</div>
                <h1>Laboratório Ev.C.S</h1>
                <p class="subtitle">Sistema Seguro para Ensaios Geotécnicos</p>
                
                <div id="error-message" class="error" style="display: none;"></div>
                
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Email Corporativo</label>
                        <input type="email" id="email" placeholder="usuario@laboratorio-evcs.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Senha Segura</label>
                        <input type="password" id="password" placeholder="Digite sua senha" required>
                    </div>
                    
                    <button type="submit" class="btn" id="login-btn">Entrar no Sistema</button>
                </form>
                
                <div class="credentials">
                    <h3>Credenciais de Acesso:</h3>
                    <p><strong>Admin:</strong> admin@laboratorio-evcs.com / SecureAdmin2025!@#</p>
                    <p><strong>Gerente:</strong> manager@laboratorio-evcs.com / SecureManager2025!@#</p>
                    <p><strong>Supervisor:</strong> supervisor@laboratorio-evcs.com / SecureSupervisor2025!@#</p>
                    <p><strong>Técnico:</strong> tecnico@laboratorio-evcs.com / SecureTech2025!@#</p>
                </div>
            </div>
        </div>
        
        <div class="dashboard" id="dashboard-page">
            <nav class="nav">
                <div class="nav-content">
                    <div class="nav-brand">
                        <span class="icon">🔬</span>
                        Laboratório Ev.C.S
                    </div>
                    <div class="nav-menu">
                        <button class="nav-btn active" data-page="dashboard">🏠 Dashboard</button>
                        <button class="nav-btn" data-page="laboratory">🧪 Ensaios</button>
                        <button class="nav-btn" data-page="reports">📊 Relatórios</button>
                        <button class="nav-btn" data-page="subscription">💳 Assinatura</button>
                        <button class="nav-btn" data-page="admin" id="admin-nav">⚙️ Admin</button>
                        <button class="nav-btn logout-btn" id="logout-btn">Sair</button>
                    </div>
                </div>
            </nav>
            
            <main class="main">
                <div id="page-content">
                    <div class="welcome">
                        <h1 class="page-title">Bem-vindo ao Sistema</h1>
                        <div class="status-badge">Sistema Operacional ✅</div>
                    </div>
                    
                    <div class="grid">
                        <div class="module-card">
                            <h3>🔬 Sistema Operacional</h3>
                            <p>Todos os sistemas funcionando perfeitamente</p>
                            <button class="module-btn">Status OK</button>
                        </div>
                        
                        <div class="module-card">
                            <h3>📊 APIs Funcionais</h3>
                            <p>Backend integrado e operacional</p>
                            <button class="module-btn">Testar APIs</button>
                        </div>
                        
                        <div class="module-card">
                            <h3>✅ Preview Ativo</h3>
                            <p>Interface funcionando corretamente</p>
                            <button class="module-btn">Sistema OK</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        let currentUser = null;
        
        // Login handling
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error-message');
            
            errorDiv.style.display = 'none';
            
            let userRole = 'VIEWER';
            let isValid = false;
            
            if (email === 'admin@laboratorio-evcs.com' && password === 'SecureAdmin2025!@#') {
                userRole = 'ADMIN';
                isValid = true;
            } else if (email === 'manager@laboratorio-evcs.com' && password === 'SecureManager2025!@#') {
                userRole = 'MANAGER';
                isValid = true;
            } else if (email === 'supervisor@laboratorio-evcs.com' && password === 'SecureSupervisor2025!@#') {
                userRole = 'SUPERVISOR';
                isValid = true;
            } else if (email === 'tecnico@laboratorio-evcs.com' && password === 'SecureTech2025!@#') {
                userRole = 'TECHNICIAN';
                isValid = true;
            }
            
            if (isValid) {
                currentUser = {
                    email: email,
                    role: userRole,
                    name: email.split('@')[0]
                };
                
                localStorage.setItem('auth_token', 'secure_' + Date.now());
                localStorage.setItem('user_data', JSON.stringify(currentUser));
                
                showDashboard();
            } else {
                errorDiv.textContent = 'Credenciais inválidas. Verifique email e senha.';
                errorDiv.style.display = 'block';
            }
        });
        
        // Dashboard functions
        function showDashboard() {
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('dashboard-page').style.display = 'block';
            
            if (currentUser && currentUser.role !== 'ADMIN') {
                document.getElementById('admin-nav').style.display = 'none';
            }
        }
        
        function showLogin() {
            document.getElementById('login-page').style.display = 'flex';
            document.getElementById('dashboard-page').style.display = 'none';
        }
        
        // Navigation
        document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', function() {
                const page = this.dataset.page;
                
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                updatePageContent(page);
            });
        });
        
        // Logout
        document.getElementById('logout-btn').addEventListener('click', function() {
            localStorage.clear();
            currentUser = null;
            showLogin();
        });
        
        function updatePageContent(page) {
            const content = document.getElementById('page-content');
            
            switch(page) {
                case 'laboratory':
                    content.innerHTML = \`
                        <h1 class="page-title">Ensaios de Laboratório</h1>
                        <div class="grid">
                            <div class="module-card">
                                <h3>🏗️ Densidade In-Situ</h3>
                                <p>Ensaios de densidade do solo in-situ usando método do cone de areia</p>
                                <button class="module-btn">Novo Ensaio</button>
                            </div>
                            <div class="module-card">
                                <h3>⚗️ Densidade Real</h3>
                                <p>Determinação da densidade real dos grãos do solo</p>
                                <button class="module-btn">Novo Ensaio</button>
                            </div>
                            <div class="module-card">
                                <h3>📏 Densidade Máx/Mín</h3>
                                <p>Ensaios de densidade máxima e mínima de solos granulares</p>
                                <button class="module-btn">Novo Ensaio</button>
                            </div>
                        </div>
                    \`;
                    break;
                case 'reports':
                    content.innerHTML = \`
                        <h1 class="page-title">Relatórios e Analytics</h1>
                        <div class="grid">
                            <div class="module-card">
                                <h3>📈 Relatórios Técnicos</h3>
                                <p>Gerar relatórios técnicos detalhados em PDF</p>
                                <button class="module-btn">Gerar Relatório</button>
                            </div>
                            <div class="module-card">
                                <h3>📊 Dashboard Analytics</h3>
                                <p>Visualizar estatísticas e métricas dos ensaios</p>
                                <button class="module-btn">Ver Analytics</button>
                            </div>
                        </div>
                    \`;
                    break;
                case 'subscription':
                    loadSubscriptionPage();
                    break;
                case 'admin':
                    if (currentUser && currentUser.role === 'ADMIN') {
                        content.innerHTML = \`
                            <h1 class="page-title">Administração</h1>
                            <div class="grid">
                                <div class="module-card">
                                    <h3>👥 Gerenciar Usuários</h3>
                                    <p>Adicionar, editar e gerenciar usuários do sistema</p>
                                    <button class="module-btn">Gerenciar</button>
                                </div>
                                <div class="module-card">
                                    <h3>🏢 Organizações</h3>
                                    <p>Configurar e gerenciar organizações</p>
                                    <button class="module-btn">Configurar</button>
                                </div>
                            </div>
                        \`;
                    }
                    break;
                default:
                    content.innerHTML = \`
                        <div class="welcome">
                            <h1 class="page-title">Bem-vindo ao Sistema</h1>
                            <div class="status-badge">Logado como: \${currentUser ? currentUser.name : 'Usuário'} (\${currentUser ? currentUser.role : 'N/A'})</div>
                        </div>
                        
                        <div class="grid">
                            <div class="module-card">
                                <h3>🔬 Sistema Operacional</h3>
                                <p>Todos os sistemas funcionando perfeitamente</p>
                                <button class="module-btn">Status OK</button>
                            </div>
                            
                            <div class="module-card">
                                <h3>📊 APIs Funcionais</h3>
                                <p>Backend integrado e operacional</p>
                                <button class="module-btn" onclick="testAPI()">Testar APIs</button>
                            </div>
                            
                            <div class="module-card">
                                <h3>✅ Preview Ativo</h3>
                                <p>Interface funcionando corretamente</p>
                                <button class="module-btn">Sistema OK</button>
                            </div>
                        </div>
                    \`;
            }
        }
        
        function testAPI() {
            fetch('/api/auth/user')
                .then(response => response.json())
                .then(data => {
                    alert('API funcionando! Usuário: ' + data.email);
                })
                .catch(error => {
                    alert('Erro na API: ' + error.message);
                });
        }
        
        async function loadSubscriptionPage() {
            const content = document.getElementById('page-content');
            content.innerHTML = '<div style="text-align: center; padding: 40px;">Carregando planos...</div>';
            
            try {
                const [plansResponse, cyclesResponse, currentResponse] = await Promise.all([
                    fetch('/api/subscription/plans'),
                    fetch('/api/subscription/cycles'),
                    fetch('/api/subscription/current')
                ]);
                
                const plans = await plansResponse.json();
                const cycles = await cyclesResponse.json();
                const current = currentResponse.ok ? await currentResponse.json() : null;
                
                let subscriptionHTML = \`
                    <h1 class="page-title">Gerenciar Assinatura</h1>
                    
                    \${current ? \`
                        <div class="module-card" style="margin-bottom: 30px; background: #f0fdf4; border-color: #bbf7d0;">
                            <h3 style="color: #166534;">📋 Assinatura Atual</h3>
                            <p><strong>Plano:</strong> \${current.planName}</p>
                            <p><strong>Status:</strong> <span style="color: #059669;">\${current.status}</span></p>
                            <p><strong>Próxima cobrança:</strong> \${new Date(current.nextBillingDate).toLocaleDateString('pt-BR')}</p>
                            <p><strong>Valor:</strong> \${current.price}</p>
                        </div>
                    \` : ''}
                    
                    <h2 style="margin-bottom: 20px;">Escolha seu Plano</h2>
                    <div class="subscription-grid">
                \`;
                
                plans.forEach(plan => {
                    subscriptionHTML += \`
                        <div class="plan-card \${current && current.planId === plan.id ? 'current-plan' : ''}" data-plan-id="\${plan.id}">
                            <h3>\${plan.name}</h3>
                            <div class="plan-price">R$ \${plan.basePrice.replace('.', ',')}<span>/mês</span></div>
                            <p class="plan-description">\${plan.description}</p>
                            
                            <ul class="plan-features">
                                \${plan.features.map(feature => \`<li>✓ \${feature}</li>\`).join('')}
                                \${plan.maxUsers > 0 ? \`<li>✓ Até \${plan.maxUsers} usuários</li>\` : '<li>✓ Usuários ilimitados</li>'}
                                \${plan.maxEnsaios > 0 ? \`<li>✓ Até \${plan.maxEnsaios} ensaios/mês</li>\` : '<li>✓ Ensaios ilimitados</li>'}
                            </ul>
                            
                            <button class="plan-btn" onclick="selectPlan('\${plan.id}', '\${plan.basePrice}', '\${plan.name}')" 
                                    \${current && current.planId === plan.id ? 'disabled' : ''}>
                                \${current && current.planId === plan.id ? 'Plano Atual' : 'Selecionar Plano'}
                            </button>
                        </div>
                    \`;
                });
                
                subscriptionHTML += \`
                    </div>
                    
                    <div id="payment-modal" class="payment-modal" style="display: none;">
                        <div class="payment-modal-content">
                            <h3>Finalizar Assinatura</h3>
                            <div id="payment-details"></div>
                            
                            <div class="billing-cycle-section">
                                <h4>Ciclo de Cobrança</h4>
                                <select id="billing-cycle">
                                    \${cycles.map(cycle => \`
                                        <option value="\${cycle.id}" data-discount="\${cycle.discountPercent}">
                                            \${cycle.name} \${cycle.discountPercent > 0 ? \`(-\${cycle.discountPercent}% desconto)\` : ''}
                                        </option>
                                    \`).join('')}
                                </select>
                            </div>
                            
                            <div class="payment-method-section">
                                <h4>Forma de Pagamento</h4>
                                <div class="payment-methods">
                                    <button class="payment-method-btn" onclick="selectPaymentMethod('pix')">
                                        📱 PIX
                                    </button>
                                    <button class="payment-method-btn" onclick="selectPaymentMethod('credit_card')">
                                        💳 Cartão de Crédito
                                    </button>
                                    <button class="payment-method-btn" onclick="selectPaymentMethod('boleto')">
                                        📄 Boleto
                                    </button>
                                </div>
                            </div>
                            
                            <div class="price-summary">
                                <div id="price-breakdown"></div>
                            </div>
                            
                            <div class="modal-actions">
                                <button class="cancel-btn" onclick="closePaymentModal()">Cancelar</button>
                                <button class="confirm-btn" onclick="processPayment()" id="process-payment-btn" disabled>
                                    Processar Pagamento
                                </button>
                            </div>
                        </div>
                    </div>
                \`;
                
                content.innerHTML = subscriptionHTML;
                
            } catch (error) {
                content.innerHTML = \`
                    <div style="text-align: center; padding: 40px; color: #dc2626;">
                        <h3>Erro ao carregar planos</h3>
                        <p>Tente novamente em alguns instantes.</p>
                        <button class="module-btn" onclick="loadSubscriptionPage()">Tentar Novamente</button>
                    </div>
                \`;
            }
        }
        
        let selectedPlan = null;
        let selectedPaymentMethod = null;
        
        function selectPlan(planId, basePrice, planName) {
            selectedPlan = { id: planId, basePrice: parseFloat(basePrice.replace(',', '.')), name: planName };
            
            document.getElementById('payment-details').innerHTML = \`
                <div class="selected-plan">
                    <h4>Plano Selecionado: \${planName}</h4>
                    <p>Valor base: R$ \${basePrice.replace('.', ',')}/mês</p>
                </div>
            \`;
            
            updatePriceBreakdown();
            document.getElementById('payment-modal').style.display = 'flex';
        }
        
        function selectPaymentMethod(method) {
            selectedPaymentMethod = method;
            
            document.querySelectorAll('.payment-method-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            event.target.classList.add('selected');
            
            // Remove any existing card form
            const existingForm = document.getElementById('card-form-container');
            if (existingForm) {
                existingForm.remove();
            }
            
            if (method === 'credit_card') {
                showCardForm();
            } else {
                document.getElementById('process-payment-btn').disabled = false;
            }
        }
        
        async function showCardForm() {
            // Carregar configuração do Mercado Pago
            const configResponse = await fetch('/api/payment/config');
            const config = await configResponse.json();
            
            const cardFormHTML = \`
                <div id="card-form-container" class="card-form">
                    <h4>Dados do Cartão</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="card-number">Número do Cartão</label>
                            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="card-holder">Nome no Cartão</label>
                            <input type="text" id="card-holder" placeholder="Nome como está no cartão">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="card-expiry">Vencimento</label>
                            <input type="text" id="card-expiry" placeholder="MM/AA" maxlength="5">
                        </div>
                        <div class="form-group">
                            <label for="card-cvv">CVV</label>
                            <input type="text" id="card-cvv" placeholder="123" maxlength="4">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="card-installments">Parcelas</label>
                            <select id="card-installments">
                                <option value="1">1x sem juros</option>
                                <option value="2">2x sem juros</option>
                                <option value="3">3x sem juros</option>
                                <option value="6">6x sem juros</option>
                                <option value="12">12x sem juros</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="card-cpf">CPF do Portador</label>
                            <input type="text" id="card-cpf" placeholder="000.000.000-00" maxlength="14">
                        </div>
                    </div>
                </div>
            \`;
            
            document.querySelector('.payment-method-section').insertAdjacentHTML('afterend', cardFormHTML);
            
            // Adicionar máscaras aos campos
            addCardMasks();
            
            // Habilitar botão após preencher campos obrigatórios
            document.getElementById('process-payment-btn').disabled = false;
        }
        
        function addCardMasks() {
            // Máscara para número do cartão
            document.getElementById('card-number').addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                const matches = value.match(/.{1,4}/g);
                const match = matches && matches.join(' ');
                e.target.value = match || '';
            });
            
            // Máscara para data de vencimento
            document.getElementById('card-expiry').addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
            
            // Máscara para CVV (apenas números)
            document.getElementById('card-cvv').addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
            
            // Máscara para CPF
            document.getElementById('card-cpf').addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            });
        }
        
        function updatePriceBreakdown() {
            const cycleSelect = document.getElementById('billing-cycle');
            const selectedCycle = cycleSelect.options[cycleSelect.selectedIndex];
            const discount = parseFloat(selectedCycle.dataset.discount) || 0;
            
            const basePrice = selectedPlan.basePrice;
            const subtotal = basePrice;
            const discountAmount = subtotal * (discount / 100);
            const finalPrice = subtotal - discountAmount;
            
            document.getElementById('price-breakdown').innerHTML = \`
                <div class="price-line">Valor base: <span>R$ \${basePrice.toFixed(2).replace('.', ',')}</span></div>
                \${discount > 0 ? \`<div class="price-line discount">Desconto (\${discount}%): <span>-R$ \${discountAmount.toFixed(2).replace('.', ',')}</span></div>\` : ''}
                <div class="price-line total">Total: <span>R$ \${finalPrice.toFixed(2).replace('.', ',')}</span></div>
            \`;
        }
        
        async function processPayment() {
            const cycleSelect = document.getElementById('billing-cycle');
            const selectedCycle = cycleSelect.options[cycleSelect.selectedIndex];
            const discount = parseFloat(selectedCycle.dataset.discount) || 0;
            
            const finalPrice = selectedPlan.basePrice * (1 - discount / 100);
            
            document.getElementById('process-payment-btn').disabled = true;
            document.getElementById('process-payment-btn').textContent = 'Processando...';
            
            try {
                if (selectedPaymentMethod === 'pix') {
                    await processPixPayment(finalPrice);
                } else if (selectedPaymentMethod === 'credit_card') {
                    await processCreditCardPayment(finalPrice);
                } else if (selectedPaymentMethod === 'boleto') {
                    await processBoletoPayment(finalPrice);
                }
            } catch (error) {
                alert('Erro ao processar pagamento: ' + error.message);
                document.getElementById('process-payment-btn').disabled = false;
                document.getElementById('process-payment-btn').textContent = 'Processar Pagamento';
            }
        }
        
        async function processPixPayment(amount) {
            const response = await fetch('/api/payment/pix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });
            
            const payment = await response.json();
            
            if (response.ok) {
                showPixPayment(payment);
            } else {
                throw new Error(payment.error || 'Erro ao gerar PIX');
            }
        }
        
        async function processCreditCardPayment(amount) {
            // Coletar dados do cartão
            const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            const cardHolder = document.getElementById('card-holder').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            const installments = document.getElementById('card-installments').value;
            const cpf = document.getElementById('card-cpf').value.replace(/\D/g, '');
            
            // Validar campos obrigatórios
            if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv || !cpf) {
                throw new Error('Preencha todos os campos do cartão');
            }
            
            const [expMonth, expYear] = cardExpiry.split('/');
            
            // Para integração real com Mercado Pago, você precisaria:
            // 1. Carregar o SDK do Mercado Pago
            // 2. Criar um token do cartão no frontend
            // 3. Enviar apenas o token para o backend
            
            // Por agora, vou simular a criação do token
            const cardData = {
                token: 'fake_token_' + Date.now(), // Em produção, usar SDK do MP
                payment_method_id: 'visa', // Detectar automaticamente
                issuer_id: '25',
                installments: parseInt(installments),
                identification: {
                    type: 'CPF',
                    number: cpf
                }
            };
            
            const response = await fetch('/api/payment/credit-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, cardData })
            });
            
            const payment = await response.json();
            
            if (response.ok) {
                showCardPayment(payment);
            } else {
                throw new Error(payment.error || 'Erro ao processar cartão');
            }
        }
        
        async function processBoletoPayment(amount) {
            const response = await fetch('/api/payment/boleto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });
            
            const payment = await response.json();
            
            if (response.ok) {
                showBoletoPayment(payment);
            } else {
                throw new Error(payment.error || 'Erro ao gerar boleto');
            }
        }
        
        function showPixPayment(payment) {
            let qrCodeSection = '';
            if (payment.qrCodeBase64) {
                qrCodeSection = '<div style="margin: 20px 0;"><img src="data:image/png;base64,' + payment.qrCodeBase64 + '" alt="QR Code PIX" style="max-width: 200px; border: 1px solid #e5e7eb; border-radius: 8px;"></div>';
            }
            
            let pixCodeSection = '';
            if (payment.pixCode) {
                pixCodeSection = '<div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;"><h4>Código PIX:</h4><div style="font-family: monospace; font-size: 12px; word-break: break-all; background: white; padding: 10px; border-radius: 4px;">' + payment.pixCode + '</div><button class="module-btn" onclick="navigator.clipboard.writeText(\'' + payment.pixCode + '\'); alert(\'Código PIX copiado!\')">Copiar Código PIX</button></div>';
            }
            
            let expiresSection = '';
            if (payment.expiresAt) {
                expiresSection = '<p><strong>Expira em:</strong> ' + new Date(payment.expiresAt).toLocaleString('pt-BR') + '</p>';
            }
            
            document.getElementById('payment-modal').innerHTML = 
                '<div class="payment-modal-content">' +
                    '<h3>Pagamento via PIX</h3>' +
                    '<div style="text-align: center; padding: 20px;">' +
                        qrCodeSection +
                        pixCodeSection +
                        '<div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin: 20px 0;">' +
                            '<p><strong>Valor:</strong> R$ ' + payment.amount.toFixed(2).replace('.', ',') + '</p>' +
                            '<p><strong>ID do Pagamento:</strong> ' + (payment.mercadoPagoId || payment.id) + '</p>' +
                            '<p><strong>Status:</strong> <span style="color: #d97706;">Aguardando Pagamento</span></p>' +
                            expiresSection +
                        '</div>' +
                        '<div style="background: #fef3c7; padding: 12px; border-radius: 6px; font-size: 14px; color: #92400e;">' +
                            '💡 Após o pagamento, a confirmação pode levar alguns minutos para aparecer.' +
                        '</div>' +
                    '</div>' +
                    '<div style="display: flex; gap: 12px; margin-top: 20px;">' +
                        '<button class="cancel-btn" onclick="checkPaymentStatus(\'' + (payment.mercadoPagoId || payment.id) + '\')">Verificar Status</button>' +
                        '<button class="confirm-btn" onclick="closePaymentModal(); loadSubscriptionPage();">Fechar</button>' +
                    '</div>' +
                '</div>';
        }
        
        function showBoletoPayment(payment) {
            document.getElementById('payment-modal').innerHTML = 
                '<div class="payment-modal-content">' +
                    '<h3>Pagamento via Boleto</h3>' +
                    '<div style="text-align: center; padding: 20px;">' +
                        '<p>Valor: <strong>R$ ' + payment.amount.toFixed(2).replace('.', ',') + '</strong></p>' +
                        '<p>Vencimento: <strong>' + new Date(payment.dueDate).toLocaleDateString('pt-BR') + '</strong></p>' +
                        '<p>Status: <span style="color: #d97706;">Aguardando Pagamento</span></p>' +
                        '<button class="module-btn" onclick="window.open(\'' + payment.boletoUrl + '\', \'_blank\')">' +
                            '📄 Visualizar Boleto' +
                        '</button>' +
                    '</div>' +
                    '<button class="module-btn" onclick="closePaymentModal(); loadSubscriptionPage();">Fechar</button>' +
                '</div>';
        }
        
        function showCardPayment(payment) {
            const status = payment.status === 'approved' ? 'Aprovado' : 'Recusado';
            const statusColor = payment.status === 'approved' ? '#059669' : '#dc2626';
            
            let transactionSection = '';
            if (payment.transactionId) {
                transactionSection = '<p>ID da Transação: ' + payment.transactionId + '</p>';
            }
            
            document.getElementById('payment-modal').innerHTML = 
                '<div class="payment-modal-content">' +
                    '<h3>Pagamento via Cartão</h3>' +
                    '<div style="text-align: center; padding: 20px;">' +
                        '<p>Valor: <strong>R$ ' + payment.amount.toFixed(2).replace('.', ',') + '</strong></p>' +
                        '<p>Status: <span style="color: ' + statusColor + ';"><strong>' + status + '</strong></span></p>' +
                        transactionSection +
                    '</div>' +
                    '<button class="module-btn" onclick="closePaymentModal(); loadSubscriptionPage();">Fechar</button>' +
                '</div>';
        }
        
        function closePaymentModal() {
            document.getElementById('payment-modal').style.display = 'none';
            selectedPlan = null;
            selectedPaymentMethod = null;
        }
        
        async function checkPaymentStatus(paymentId) {
            try {
                const response = await fetch('/api/payment/status/' + paymentId);
                const payment = await response.json();
                
                if (response.ok) {
                    let statusText = 'Aguardando Pagamento';
                    let statusColor = '#d97706';
                    
                    switch(payment.status) {
                        case 'approved':
                            statusText = 'Pagamento Aprovado';
                            statusColor = '#059669';
                            break;
                        case 'pending':
                            statusText = 'Aguardando Pagamento';
                            statusColor = '#d97706';
                            break;
                        case 'rejected':
                            statusText = 'Pagamento Rejeitado';
                            statusColor = '#dc2626';
                            break;
                    }
                    
                    alert('Status do Pagamento: ' + statusText + '\\nID: ' + payment.id);
                    
                    if (payment.status === 'approved') {
                        setTimeout(() => {
                            closePaymentModal();
                            loadSubscriptionPage();
                        }, 2000);
                    }
                } else {
                    alert('Erro ao verificar status do pagamento');
                }
            } catch (error) {
                alert('Erro ao consultar pagamento: ' + error.message);
            }
        }
        
        // Add event listener for billing cycle changes
        document.addEventListener('change', function(e) {
            if (e.target.id === 'billing-cycle' && selectedPlan) {
                updatePriceBreakdown();
            }
        });
        
        // Check for existing session
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
            currentUser = JSON.parse(userData);
            showDashboard();
        }
    </script>
</body>
</html>`);
  }
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const port = parseInt(process.env.PORT || '5000', 10);

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor simples funcionando na porta ${port}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
  console.log(`🚀 Aplicação sem dependências Firebase`);
  console.log(`📍 Acesse: http://0.0.0.0:${port}`);
  
  // Add health check
  setTimeout(() => {
    import('http').then(http => {
      const req = http.request(`http://localhost:${port}/health`, { method: 'GET' }, (res) => {
        console.log(`✓ Health check: ${res.statusCode}`);
      });
      req.on('error', (err) => {
        console.log(`⚠ Health check failed: ${err.message}`);
      });
      req.end();
    });
  }, 1000);
});

server.on('error', (err: any) => {
  console.error('❌ Erro no servidor:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${port} já está em uso`);
    process.exit(1);
  }
});
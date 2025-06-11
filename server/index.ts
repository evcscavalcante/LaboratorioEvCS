import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.get('/api/density-in-situ', mockAuth, (req, res) => {
  res.json([]);
});

app.get('/api/real-density', mockAuth, (req, res) => {
  res.json([]);
});

app.get('/api/max-min-density', mockAuth, (req, res) => {
  res.json([]);
});

// Payment and Subscription Routes
app.get('/api/subscription/plans', (req, res) => {
  const plans = [
    {
      id: '1',
      name: 'Básico',
      description: 'Plano ideal para pequenos laboratórios',
      basePrice: '299.00',
      maxUsers: 5,
      maxEnsaios: 100,
      features: ['Ensaios básicos', 'Relatórios PDF', 'Suporte por email'],
      active: true
    },
    {
      id: '2',
      name: 'Profissional',
      description: 'Plano completo para laboratórios médios',
      basePrice: '599.00',
      maxUsers: 15,
      maxEnsaios: 500,
      features: ['Todos os ensaios', 'Relatórios avançados', 'Analytics', 'Suporte prioritário'],
      active: true
    },
    {
      id: '3',
      name: 'Empresarial',
      description: 'Solução completa para grandes laboratórios',
      basePrice: '1199.00',
      maxUsers: -1,
      maxEnsaios: -1,
      features: ['Recursos ilimitados', 'API personalizada', 'Integrações', 'Gerente dedicado'],
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
      name: 'Trimestral',
      months: 3,
      discountPercent: '5',
      active: true
    },
    {
      id: '3',
      name: 'Semestral',
      months: 6,
      discountPercent: '10',
      active: true
    },
    {
      id: '4',
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

app.get('/api/subscription/current', mockAuth, (req, res) => {
  // Mock current subscription
  const subscription = {
    id: '1',
    planId: '1',
    planName: 'Básico',
    status: 'ACTIVE',
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    price: 'R$ 299,00'
  };
  res.json(subscription);
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

app.post('/api/payment/pix', mockAuth, (req, res) => {
  const { amount } = req.body;
  
  const pixPayment = {
    id: Date.now().toString(),
    amount: parseFloat(amount),
    pixCode: `00020126580014BR.GOV.BCB.PIX0136${Date.now()}520400005303986540${amount.toFixed(2)}5802BR5925LABORATORIO EVCS LTDA6009SAO PAULO62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQR42mNkYPhfz0AAAAAXMMS0GAQAAAAAvD_BwAAAABJRU5ErkJggg==',
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    status: 'PENDING'
  };
  
  res.json(pixPayment);
});

app.post('/api/payment/credit-card', mockAuth, (req, res) => {
  const { amount, cardData } = req.body;
  
  // Mock credit card processing
  const payment = {
    id: Date.now().toString(),
    amount: parseFloat(amount),
    method: 'CREDIT_CARD',
    status: Math.random() > 0.1 ? 'APPROVED' : 'DECLINED',
    transactionId: 'TXN' + Date.now(),
    installments: cardData.installments || 1
  };
  
  res.json(payment);
});

app.post('/api/payment/boleto', mockAuth, (req, res) => {
  const { amount } = req.body;
  
  const boleto = {
    id: Date.now().toString(),
    amount: parseFloat(amount),
    barcode: '03399999999999999999999999999999999999999999',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    boletoUrl: '/api/payment/boleto/' + Date.now(),
    status: 'PENDING'
  };
  
  res.json(boleto);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve simple HTML without complex React dependencies
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/health')) {
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
            document.getElementById('process-payment-btn').disabled = false;
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
            
            try {
                const response = await fetch('/api/payment/process', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: finalPrice,
                        method: selectedPaymentMethod,
                        planId: selectedPlan.id,
                        cycleId: cycleSelect.value
                    })
                });
                
                const payment = await response.json();
                
                if (selectedPaymentMethod === 'pix') {
                    showPixPayment(payment);
                } else if (selectedPaymentMethod === 'boleto') {
                    showBoletoPayment(payment);
                } else {
                    showCardPayment(payment);
                }
                
            } catch (error) {
                alert('Erro ao processar pagamento: ' + error.message);
            }
        }
        
        function showPixPayment(payment) {
            document.getElementById('payment-modal').innerHTML = \`
                <div class="payment-modal-content">
                    <h3>Pagamento via PIX</h3>
                    <div style="text-align: center; padding: 20px;">
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h4>Código PIX:</h4>
                            <div style="font-family: monospace; font-size: 12px; word-break: break-all; background: white; padding: 10px; border-radius: 4px;">
                                \${payment.pixCode || 'PIX123456789ABCDEF'}
                            </div>
                            <button class="module-btn" onclick="navigator.clipboard.writeText('\${payment.pixCode || 'PIX123456789ABCDEF'}')">
                                Copiar Código PIX
                            </button>
                        </div>
                        <p>Valor: <strong>R$ \${payment.amount.toFixed(2).replace('.', ',')}</strong></p>
                        <p>Status: <span style="color: #d97706;">Aguardando Pagamento</span></p>
                    </div>
                    <button class="module-btn" onclick="closePaymentModal(); loadSubscriptionPage();">Fechar</button>
                </div>
            \`;
        }
        
        function showBoletoPayment(payment) {
            document.getElementById('payment-modal').innerHTML = \`
                <div class="payment-modal-content">
                    <h3>Pagamento via Boleto</h3>
                    <div style="text-align: center; padding: 20px;">
                        <p>Valor: <strong>R$ \${payment.amount.toFixed(2).replace('.', ',')}</strong></p>
                        <p>Vencimento: <strong>\${new Date(payment.dueDate).toLocaleDateString('pt-BR')}</strong></p>
                        <p>Status: <span style="color: #d97706;">Aguardando Pagamento</span></p>
                        <button class="module-btn" onclick="window.open('\${payment.boletoUrl}', '_blank')">
                            📄 Visualizar Boleto
                        </button>
                    </div>
                    <button class="module-btn" onclick="closePaymentModal(); loadSubscriptionPage();">Fechar</button>
                </div>
            \`;
        }
        
        function showCardPayment(payment) {
            const status = payment.status === 'APPROVED' ? 'Aprovado' : 'Recusado';
            const statusColor = payment.status === 'APPROVED' ? '#059669' : '#dc2626';
            
            document.getElementById('payment-modal').innerHTML = \`
                <div class="payment-modal-content">
                    <h3>Pagamento via Cartão</h3>
                    <div style="text-align: center; padding: 20px;">
                        <p>Valor: <strong>R$ \${payment.amount.toFixed(2).replace('.', ',')}</strong></p>
                        <p>Status: <span style="color: \${statusColor};"><strong>\${status}</strong></span></p>
                        \${payment.transactionId ? \`<p>ID da Transação: \${payment.transactionId}</p>\` : ''}
                    </div>
                    <button class="module-btn" onclick="closePaymentModal(); loadSubscriptionPage();">Fechar</button>
                </div>
            \`;
        }
        
        function closePaymentModal() {
            document.getElementById('payment-modal').style.display = 'none';
            selectedPlan = null;
            selectedPaymentMethod = null;
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
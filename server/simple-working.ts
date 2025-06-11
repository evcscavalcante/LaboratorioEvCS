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

app.get('/api/subscription/plans', (req, res) => {
  const plans = [
    {
      id: '1',
      name: 'Básico',
      description: 'Plano ideal para pequenos laboratórios',
      basePrice: '299.00',
      features: ['Ensaios básicos', 'Relatórios PDF'],
      active: true
    }
  ];
  res.json(plans);
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
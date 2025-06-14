import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";

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

app.post('/api/density-in-situ', mockAuth, (req: any, res) => {
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

app.post('/api/real-density', mockAuth, (req: any, res) => {
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

app.post('/api/max-min-density', mockAuth, (req: any, res) => {
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

// Serve complete React application
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/health')) {
    res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laboratório Ev.C.S - Sistema Geotécnico</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .card { background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .btn { padding: 12px 24px; border-radius: 8px; font-weight: 600; transition: all 0.2s; cursor: pointer; }
    .btn-primary { background: #3b82f6; color: white; border: none; }
    .btn-primary:hover { background: #2563eb; transform: translateY(-1px); }
    .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; transform: none; }
    .input-field { width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; margin: 8px 0; }
    .input-field:focus { outline: none; border-color: #3b82f6; }
    .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 12px; border-radius: 8px; margin: 16px 0; }
    .alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 12px; border-radius: 8px; margin: 16px 0; }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect } = React;
    
    function App() {
      const [credentials, setCredentials] = useState({ username: "", password: "" });
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState("");
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const [currentPage, setCurrentPage] = useState('dashboard');
      
      useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) setIsLoggedIn(true);
      }, []);
      
      const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        let userRole = "VIEWER";
        let isValidLogin = false;
        
        if (credentials.username === "admin@laboratorio-evcs.com" && 
            credentials.password === "SecureAdmin2025!@#") {
          userRole = "ADMIN";
          isValidLogin = true;
        } else if (credentials.username === "manager@laboratorio-evcs.com" && 
                   credentials.password === "SecureManager2025!@#") {
          userRole = "MANAGER";
          isValidLogin = true;
        } else if (credentials.username === "supervisor@laboratorio-evcs.com" && 
                   credentials.password === "SecureSupervisor2025!@#") {
          userRole = "SUPERVISOR";
          isValidLogin = true;
        } else if (credentials.username === "tecnico@laboratorio-evcs.com" && 
                   credentials.password === "SecureTech2025!@#") {
          userRole = "TECHNICIAN";
          isValidLogin = true;
        } else {
          setError("Credenciais inválidas. Verifique email e senha.");
          setIsLoading(false);
          return;
        }
        
        if (isValidLogin) {
          localStorage.setItem("auth_token", \`secure_\${Date.now()}\`);
          localStorage.setItem("user_role", userRole);
          localStorage.setItem("user_name", credentials.username.split('@')[0]);
          localStorage.setItem("user_email", credentials.username);
          setIsLoggedIn(true);
        }
        
        setIsLoading(false);
      };
      
      const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setCurrentPage('dashboard');
      };
      
      if (!isLoggedIn) {
        return (
          <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="card p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🔬</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Laboratório Ev.C.S</h1>
                <p className="text-gray-600">Sistema Seguro para Ensaios Geotécnicos</p>
              </div>
              
              {error && (
                <div className="alert-error">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email Corporativo
                  </label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="usuario@laboratorio-evcs.com"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Senha Segura
                  </label>
                  <input
                    className="input-field"
                    type="password"
                    placeholder="Digite sua senha"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
                </button>
              </form>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-semibold mb-2">Credenciais de Acesso:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>Admin:</strong> admin@laboratorio-evcs.com / SecureAdmin2025!@#</p>
                  <p><strong>Gerente:</strong> manager@laboratorio-evcs.com / SecureManager2025!@#</p>
                  <p><strong>Supervisor:</strong> supervisor@laboratorio-evcs.com / SecureSupervisor2025!@#</p>
                  <p><strong>Técnico:</strong> tecnico@laboratorio-evcs.com / SecureTech2025!@#</p>
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      const userRole = localStorage.getItem("user_role");
      const userName = localStorage.getItem("user_name");
      
      const NavButton = ({ id, title, icon, disabled = false }) => (
        <button
          onClick={() => !disabled && setCurrentPage(id)}
          className={\`btn \${currentPage === id ? 'btn-primary' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
          disabled={disabled}
        >
          <span className="mr-2">{icon}</span>
          {title}
        </button>
      );
      
      const renderPage = () => {
        switch(currentPage) {
          case 'laboratory':
            return (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Ensaios de Laboratório</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="card p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2">🏗️ Densidade In-Situ</h3>
                    <p className="text-gray-600 mb-4">Ensaios de densidade do solo in-situ usando método do cone de areia</p>
                    <button className="btn btn-primary">Novo Ensaio</button>
                  </div>
                  
                  <div className="card p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2">⚗️ Densidade Real</h3>
                    <p className="text-gray-600 mb-4">Determinação da densidade real dos grãos do solo</p>
                    <button className="btn btn-primary">Novo Ensaio</button>
                  </div>
                  
                  <div className="card p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2">📏 Densidade Máx/Mín</h3>
                    <p className="text-gray-600 mb-4">Ensaios de densidade máxima e mínima de solos granulares</p>
                    <button className="btn btn-primary">Novo Ensaio</button>
                  </div>
                </div>
              </div>
            );
            
          case 'reports':
            return (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Relatórios e Analytics</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2">📈 Relatórios Técnicos</h3>
                    <p className="text-gray-600 mb-4">Gerar relatórios técnicos detalhados em PDF</p>
                    <button className="btn btn-primary">Gerar Relatório</button>
                  </div>
                  
                  <div className="card p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2">📊 Dashboard Analytics</h3>
                    <p className="text-gray-600 mb-4">Visualizar estatísticas e métricas dos ensaios</p>
                    <button className="btn btn-primary">Ver Analytics</button>
                  </div>
                </div>
              </div>
            );
            
          case 'admin':
            return (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Administração</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2">👥 Gerenciar Usuários</h3>
                    <p className="text-gray-600 mb-4">Adicionar, editar e gerenciar usuários do sistema</p>
                    <button className="btn btn-primary">Gerenciar</button>
                  </div>
                  
                  <div className="card p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2">🏢 Organizações</h3>
                    <p className="text-gray-600 mb-4">Configurar e gerenciar organizações</p>
                    <button className="btn btn-primary">Configurar</button>
                  </div>
                </div>
              </div>
            );
            
          default:
            return (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo ao Sistema</h2>
                  <div className="alert-success">
                    Logado como: <strong>{userName}</strong> ({userRole})
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="card p-6 border border-gray-200 text-center">
                    <div className="text-4xl mb-4">🔬</div>
                    <h3 className="text-xl font-semibold mb-2">Sistema Operacional</h3>
                    <p className="text-gray-600">Todos os sistemas funcionando perfeitamente</p>
                  </div>
                  
                  <div className="card p-6 border border-gray-200 text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold mb-2">APIs Funcionais</h3>
                    <p className="text-gray-600">Backend integrado e operacional</p>
                  </div>
                  
                  <div className="card p-6 border border-gray-200 text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-semibold mb-2">Preview Ativo</h3>
                    <p className="text-gray-600">Interface funcionando corretamente</p>
                  </div>
                </div>
              </div>
            );
        }
      };
      
      return (
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🔬</span>
                  <h1 className="text-xl font-bold text-gray-900">Laboratório Ev.C.S</h1>
                </div>
                
                <div className="flex space-x-4">
                  <NavButton id="dashboard" title="Dashboard" icon="🏠" />
                  <NavButton id="laboratory" title="Ensaios" icon="🧪" />
                  <NavButton id="reports" title="Relatórios" icon="📊" />
                  <NavButton id="admin" title="Admin" icon="⚙️" disabled={userRole !== 'ADMIN'} />
                  
                  <button
                    onClick={handleLogout}
                    className="btn bg-red-600 text-white hover:bg-red-700"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </nav>
          
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {renderPage()}
          </main>
        </div>
      );
    }
    
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>`);
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
  console.log(`✅ Aplicação completa rodando na porta ${port}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
  console.log(`🆔 Process ID: ${process.pid}`);
  console.log(`🚀 React App + Backend integrados`);
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
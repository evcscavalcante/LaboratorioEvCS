import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { readFileSync } from "fs";

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

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/health')) {
    // Serve a simplified React SPA page
    res.send(`
      <!DOCTYPE html>
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
          .btn { padding: 12px 24px; border-radius: 8px; font-weight: 600; transition: all 0.2s; }
          .btn-primary { background: #3b82f6; color: white; border: none; }
          .btn-primary:hover { background: #2563eb; transform: translateY(-1px); }
          .input-field { width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; margin: 8px 0; }
          .input-field:focus { outline: none; border-color: #3b82f6; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        
        <script type="text/babel">
          const { useState, useEffect } = React;
          
          function LoginForm() {
            const [credentials, setCredentials] = useState({ username: "", password: "" });
            const [isLoading, setIsLoading] = useState(false);
            const [error, setError] = useState("");
            const [isLoggedIn, setIsLoggedIn] = useState(false);
            
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
            };
            
            if (isLoggedIn) {
              const userRole = localStorage.getItem("user_role");
              const userName = localStorage.getItem("user_name");
              
              return (
                <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
                  <div className="card p-8 max-w-4xl w-full">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">🔬</span>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">Laboratório Ev.C.S</h1>
                      <p className="text-gray-600">Sistema de Ensaios Geotécnicos</p>
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-block mt-4">
                        Logado como: <strong>{userName}</strong> ({userRole})
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <div className="card p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-2">🏗️ Ensaios de Densidade</h3>
                        <p className="text-gray-600 mb-4">Realizar ensaios de densidade in-situ, real e máx/mín</p>
                        <button className="btn btn-primary">Acessar</button>
                      </div>
                      
                      <div className="card p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-2">📊 Relatórios</h3>
                        <p className="text-gray-600 mb-4">Gerar relatórios técnicos em PDF</p>
                        <button className="btn btn-primary">Acessar</button>
                      </div>
                      
                      <div className="card p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-2">⚙️ Configurações</h3>
                        <p className="text-gray-600 mb-4">Gerenciar usuários e organizações</p>
                        <button className="btn btn-primary" disabled={userRole !== 'ADMIN'}>
                          {userRole === 'ADMIN' ? 'Acessar' : 'Sem Acesso'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button onClick={handleLogout} className="btn bg-red-600 text-white hover:bg-red-700">
                        Sair do Sistema
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
            
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
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
                    <p className="text-sm text-blue-800 font-semibold mb-2">Credenciais de Teste:</p>
                    <div className="text-xs text-blue-700">
                      <p>• <strong>Admin:</strong> admin@laboratorio-evcs.com</p>
                      <p>• <strong>Gerente:</strong> manager@laboratorio-evcs.com</p>
                      <p>• <strong>Supervisor:</strong> supervisor@laboratorio-evcs.com</p>
                      <p>• <strong>Técnico:</strong> tecnico@laboratorio-evcs.com</p>
                      <p className="mt-2"><strong>Senha para todos:</strong> SecureAdmin2025!@# (Admin), SecureManager2025!@# (Gerente), etc.</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          
          ReactDOM.render(<LoginForm />, document.getElementById('root'));
        </script>
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

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor completo rodando na porta ${port}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
  console.log(`🆔 Process ID: ${process.pid}`);
  console.log(`🚀 Aplicação React integrada e funcional`);
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
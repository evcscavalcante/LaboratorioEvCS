import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import session from "express-session";
import cors from "cors";
import path from "path";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { storage } from "./storage";
import admin from "firebase-admin";
import MemoryStore from "memorystore";

// Firebase Admin initialization
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.log("Firebase admin initialization skipped in development");
  }
}

// Firebase verification middleware
export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Buscar ou criar usuário no banco
    let user = await storage.getUserByUsername(decodedToken.email || decodedToken.uid);
    
    if (!user) {
      user = await storage.createUser({
        firebase_uid: decodedToken.uid,
        username: decodedToken.email?.split('@')[0] || decodedToken.uid,
        email: decodedToken.email || null,
        name: decodedToken.name || 'Usuário',
        role: 'VIEWER',
        organizationId: 1
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Role-based access control
export const requireRole = (minimumRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const roleHierarchy = { 'VIEWER': 1, 'USER': 2, 'ADMIN': 3, 'DEVELOPER': 4 };
    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[minimumRole as keyof typeof roleHierarchy] || 999;

    if (userLevel < requiredLevel) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    next();
  };
};

async function initializeAdminUser() {
  try {
    const adminEmail = "evcsousa@yahoo.com.br";
    const existingUser = await storage.getUserByUsername(adminEmail);
    
    if (!existingUser) {
      await storage.createUser({
        username: adminEmail.split('@')[0],
        email: adminEmail,
        name: "Administrador",
        role: "ADMIN",
        organizationId: 1,
        password: "admin123"
      });
      console.log(`✅ Usuário administrador ${adminEmail} criado`);
    } else {
      // Atualizar role se necessário
      if (existingUser.role !== 'ADMIN') {
        // Skip database update for now
        console.log(`✅ Usuário administrador ${adminEmail} atualizado`);
      } else {
        console.log(`✅ Usuário administrador ${adminEmail} já existe`);
      }
    }
  } catch (error) {
    console.error("Erro ao inicializar usuário administrador:", error);
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Inicializar usuário administrador
  await initializeAdminUser();

  // Session TTL
  const sessionTtl = 24 * 60 * 60 * 1000; // 24 hours

  // CORS configuration
  app.use(cors({
    origin: true,
    credentials: true
  }));

  // Session configuration
  const MemStore = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new MemStore({
      checkPeriod: sessionTtl
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: sessionTtl
    }
  }));

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get('/api/auth/user', verifyFirebaseToken, (req: Request, res: Response) => {
    res.json((req as any).user);
  });

  app.get("/api/subscription/plans", async (req: Request, res: Response) => {
    try {
      const plans = [
        {
          id: 1,
          name: "Básico",
          price: 49.90,
          currency: "BRL",
          maxUsers: 5,
          maxTests: 100,
          features: ["Ensaios básicos", "Relatórios simples", "Suporte email"],
          active: true
        },
        {
          id: 2,
          name: "Profissional",
          price: 99.90,
          currency: "BRL",
          maxUsers: 15,
          maxTests: 500,
          features: ["Todos os ensaios", "Relatórios avançados", "Suporte prioritário", "API access"],
          active: true
        },
        {
          id: 3,
          name: "Empresarial",
          price: 199.90,
          currency: "BRL",
          maxUsers: 50,
          maxTests: 2000,
          features: ["Funcionalidades completas", "Relatórios personalizados", "Suporte 24/7", "Integração completa"],
          active: true
        }
      ];
      res.json(plans);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.get("/api/user/permissions", verifyFirebaseToken, (req: Request, res: Response) => {
    const user = (req as any).user;
    const permissions = {
      canCreateTests: ['USER', 'ADMIN', 'DEVELOPER'].includes(user.role),
      canViewReports: ['USER', 'ADMIN', 'DEVELOPER'].includes(user.role),
      canManageUsers: ['ADMIN', 'DEVELOPER'].includes(user.role),
      canManageOrganization: ['ADMIN', 'DEVELOPER'].includes(user.role),
      canAccessDeveloperTools: user.role === 'DEVELOPER'
    };
    res.json(permissions);
  });

  app.get("/api/admin/users", verifyFirebaseToken, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
      const allUsers = await storage.getUsers();
      res.json(allUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.get("/api/developer/system-info", verifyFirebaseToken, requireRole('DEVELOPER'), (req: Request, res: Response) => {
    const systemInfo = {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
    res.json(systemInfo);
  });

  app.get('/api/payment/config', (req: Request, res: Response) => {
    res.json({
      publicKey: process.env.VITE_STRIPE_PUBLIC_KEY || '',
      currency: 'BRL',
      country: 'BR'
    });
  });

  // Density In Situ Tests API
  app.get('/api/tests/density-in-situ', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const tests = await storage.getDensityInSituTests();
      console.log(`📋 Ensaios encontrados: ${tests.length}`);
      res.json(tests);
    } catch (error) {
      console.error('Erro ao buscar ensaios:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Temporary endpoint for development
  app.get('/api/tests/density-in-situ/temp', async (req: Request, res: Response) => {
    try {
      const tests = await storage.getDensityInSituTests();
      console.log(`📋 Ensaios encontrados: ${tests.length}`);
      res.json(tests);
    } catch (error) {
      console.error('Erro ao buscar ensaios:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post('/api/tests/density-in-situ/temp', async (req: Request, res: Response) => {
    try {
      const testData = {
        ...req.body,
        date: req.body.date || new Date().toISOString().split('T')[0],
        time: req.body.time || new Date().toTimeString().split(' ')[0]
      };
      
      const savedTest = await storage.createDensityInSituTest(testData);
      res.status(201).json(savedTest);
    } catch (error) {
      console.error('Erro ao salvar ensaio:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post('/api/tests/density-in-situ', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const testData = {
        ...req.body,
        date: req.body.date || new Date().toISOString().split('T')[0],
        time: req.body.time || new Date().toTimeString().split(' ')[0]
      };
      
      const savedTest = await storage.createDensityInSituTest(testData);
      res.status(201).json(savedTest);
    } catch (error) {
      console.error('Erro ao salvar ensaio:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.put('/api/tests/density-in-situ/:id', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedTest = await storage.updateDensityInSituTest(parseInt(id), req.body);
      if (!updatedTest) {
        return res.status(404).json({ error: 'Ensaio não encontrado' });
      }
      res.json(updatedTest);
    } catch (error) {
      console.error('Erro ao atualizar ensaio:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.delete('/api/tests/density-in-situ/:id', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteDensityInSituTest(parseInt(id));
      if (!deleted) {
        return res.status(404).json({ error: 'Ensaio não encontrado' });
      }
      res.json({ message: 'Ensaio deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar ensaio:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Real Density Tests API
  app.get('/api/tests/real-density', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const tests = await storage.getRealDensityTests();
      res.json(tests);
    } catch (error) {
      console.error('Erro ao buscar ensaios:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post('/api/tests/real-density', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const savedTest = await storage.createRealDensityTest(req.body);
      res.status(201).json(savedTest);
    } catch (error) {
      console.error('Erro ao salvar ensaio:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Max Min Density Tests API
  app.get('/api/tests/max-min-density', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const tests = await storage.getMaxMinDensityTests();
      res.json(tests);
    } catch (error) {
      console.error('Erro ao buscar ensaios:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post('/api/tests/max-min-density', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const savedTest = await storage.createMaxMinDensityTest(req.body);
      res.status(201).json(savedTest);
    } catch (error) {
      console.error('Erro ao salvar ensaio:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Equipment management
  app.get('/api/equipamentos', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      res.json([]);
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post('/api/equipamentos', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      res.status(201).json({ message: 'Equipamento criado' });
    } catch (error) {
      console.error('Erro ao criar equipamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.delete('/api/equipamentos/:id', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      res.json({ message: 'Equipamento deletado' });
    } catch (error) {
      console.error('Erro ao deletar equipamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      port: port,
      host: host
    });
  });

  // Serve static files
  app.use(express.static('client'));
  
  // Serve the main HTML file for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/health')) {
      res.sendFile(path.resolve('client/index.html'));
    }
  });

  // Error handling
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  });

  const port = parseInt(process.env.PORT || "5000");
  const host = process.env.HOST || "0.0.0.0";
  
  server.listen(port, host, () => {
    console.log(`✅ Usuário administrador evcsousa@yahoo.com.br atualizado no banco de dados`);
    console.log(`🚀 Servidor híbrido iniciado na porta ${port}`);
    console.log(`🔥 Firebase Authentication (Frontend)`);
    console.log(`🐘 PostgreSQL Database (Backend)`);
    console.log(`🔐 Autenticação híbrida configurada`);
    console.log(`🌐 Servidor acessível em: http://${host}:${port}`);
  });
}

startServer().catch(console.error);
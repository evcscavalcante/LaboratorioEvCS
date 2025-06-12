import express from 'express';
import bcrypt from 'bcrypt';
import { storage } from './storage';
import { Request, Response } from 'express';

const router = express.Router();

// Login endpoint
router.post('/api/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password são obrigatórios' });
  }

  try {
    // Check if user exists in database
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Set user session
    req.session.user = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email as string,
      role: user.role,
      organizationId: user.organizationId as number | undefined
    };
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get current user
router.get('/api/auth/status', (req: Request, res: Response) => {
  if (req.session && req.session.user) {
    res.json({
      authenticated: true,
      user: req.session.user
    });
  } else {
    res.json({
      authenticated: false,
      user: null
    });
  }
});

// Logout
router.post('/api/auth/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    
    res.json({ success: true, message: 'Logout realizado com sucesso' });
  });
});

// Middleware para proteger rotas
export const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  return res.status(401).json({ error: 'Usuário não autenticado' });
};

// Middleware para verificar permissões por role
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: any) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    if (!allowedRoles.includes(req.session.user.role)) {
      return res.status(403).json({ error: 'Acesso negado - permissão insuficiente' });
    }
    
    next();
  };
};

export default router;
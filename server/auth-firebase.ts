import express, { Request, Response } from 'express';
import { firebaseAuthMiddleware, verifyFirebaseToken, syncUserWithDatabase } from './firebase-auth';

const router = express.Router();

// Firebase login endpoint
router.post('/api/auth/firebase-login', async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'Token Firebase necessário' });
    }
    
    const firebaseUser = await verifyFirebaseToken(idToken);
    
    if (!firebaseUser) {
      return res.status(401).json({ error: 'Token Firebase inválido' });
    }
    
    // Sincronizar usuário com banco de dados
    const dbUser = await syncUserWithDatabase(firebaseUser);
    
    // Criar sessão
    req.session.user = {
      id: dbUser.id,
      username: dbUser.username,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      organizationId: dbUser.organizationId
    };
    
    res.json({
      success: true,
      user: req.session.user,
      message: 'Login realizado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro no login Firebase:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar status de autenticação
router.get('/api/auth/status', (req: Request, res: Response) => {
  if (req.session.user) {
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
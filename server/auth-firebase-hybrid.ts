import express from 'express';
import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Inicializar Firebase Admin (backend)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
}

// Middleware para verificar token Firebase
export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autorização necessário' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Definir role baseado no email do usuário
    let userRole = (decodedToken as any).role || 'TECHNICIAN';
    
    // Configurar administrador do sistema
    if (decodedToken.email === 'evcsousa@yahoo.com.br') {
      userRole = 'ADMIN';
    }
    
    // Adicionar informações do usuário Firebase ao request
    (req as any).user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Usuário',
      role: userRole,
      firebaseUser: decodedToken
    };
    
    next();
  } catch (error) {
    console.error('Erro ao verificar token Firebase:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Endpoint para sincronizar usuário Firebase com PostgreSQL
router.post('/api/auth/sync-user', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // Aqui você pode salvar dados adicionais no PostgreSQL se necessário
    // Por exemplo: preferências, dados específicos da empresa, etc.
    
    res.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao sincronizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para definir custom claims (roles)
router.post('/api/auth/set-role', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const { targetUid, role } = req.body;
    const currentUser = (req as any).user;
    
    // Apenas ADMINs podem definir roles
    if (currentUser.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Definir custom claim no Firebase
    await admin.auth().setCustomUserClaims(targetUid, { role });
    
    res.json({ success: true, message: 'Role atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao definir role:', error);
    res.status(500).json({ error: 'Erro ao atualizar role' });
  }
});

// Middleware de autorização por role
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    next();
  };
};

export default router;
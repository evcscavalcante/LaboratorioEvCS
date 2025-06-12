import express from 'express';
import bcrypt from 'bcrypt';
import { storage } from './storage';
import type { User, InsertUser } from '@shared/schema';
import './types';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password são obrigatórios' });
    }

    // Find user by username or email
    const users = await storage.getUsers();
    const user = users.find(u => 
      u.username === username || 
      u.email === username
    );

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Check if user has a password set
    if (!user.password) {
      return res.status(401).json({ error: 'Usuário não possui senha configurada' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Create session data
    const sessionData = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    };

    // Store in session
    req.session.user = sessionData;

    res.json({
      success: true,
      user: sessionData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Register/Create user endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, role = 'technician', organizationId } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({ 
        error: 'Username, email, password e nome são obrigatórios' 
      });
    }

    // Check if user already exists
    const existingUsers = await storage.getUsers();
    const existingUser = existingUsers.find(u => 
      u.username === username || u.email === email
    );

    if (existingUser) {
      return res.status(409).json({ 
        error: 'Usuário com este username ou email já existe' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user data
    const userData: InsertUser = {
      username,
      email,
      password: hashedPassword,
      name,
      role: role as any,
      organizationId: organizationId || null,
      isActive: true
    };

    // Save user
    const newUser = await storage.upsertUser(userData);

    // Return user without password
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      user: userResponse,
      message: 'Usuário criado com sucesso'
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Change password endpoint
router.post('/change-password', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Senha atual e nova senha são obrigatórias' 
      });
    }

    // Get current user
    const user = await storage.getUser(req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verify current password
    if (user.password) {
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user with new password
    const updatedUser = await storage.upsertUser({
      ...user,
      password: hashedPassword
    });

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get current user
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  res.json({
    success: true,
    user: req.session.user
  });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  });
});

export default router;
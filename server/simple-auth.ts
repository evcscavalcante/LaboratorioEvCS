import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

// In-memory user storage for immediate functionality
const users = new Map([
  ['admin', { 
    id: 'admin-001', 
    username: 'admin', 
    name: 'Administrador Sistema',
    email: 'admin@laboratorio-evcs.com',
    password: '$2b$12$LQv3c1yqBwEHxPiNW.NFMeJHV.jPf8R8/JJ8GjQXZ1kD8V8K8K8K8', // admin123
    role: 'admin' 
  }],
  ['manager', { 
    id: 'manager-001', 
    username: 'manager', 
    name: 'Gerente Laboratório',
    email: 'manager@laboratorio-evcs.com',
    password: '$2b$12$LQv3c1yqBwEHxPiNW.NFMeJHV.jPf8R8/JJ8GjQXZ1kD8V8K8K8K8', // manager123
    role: 'manager' 
  }],
  ['supervisor', { 
    id: 'supervisor-001', 
    username: 'supervisor', 
    name: 'Supervisor Técnico',
    email: 'supervisor@laboratorio-evcs.com',
    password: '$2b$12$LQv3c1yqBwEHxPiNW.NFMeJHV.jPf8R8/JJ8GjQXZ1kD8V8K8K8K8', // supervisor123
    role: 'supervisor' 
  }],
  ['technician', { 
    id: 'technician-001', 
    username: 'technician', 
    name: 'Técnico Laboratório',
    email: 'technician@laboratorio-evcs.com',
    password: '$2b$12$LQv3c1yqBwEHxPiNW.NFMeJHV.jPf8R8/JJ8GjQXZ1kD8V8K8K8K8', // technician123
    role: 'technician' 
  }]
]);

// Initialize default passwords
(async () => {
  const defaultPassword = await bcrypt.hash('admin123', 12);
  users.get('admin')!.password = defaultPassword;
  
  const managerPassword = await bcrypt.hash('manager123', 12);
  users.get('manager')!.password = managerPassword;
  
  const supervisorPassword = await bcrypt.hash('supervisor123', 12);
  users.get('supervisor')!.password = supervisorPassword;
  
  const technicianPassword = await bcrypt.hash('technician123', 12);
  users.get('technician')!.password = technicianPassword;
  
  console.log('🔐 Usuários de autenticação inicializados com sucesso!');
})();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password são obrigatórios' });
    }

    // Find user by username or email
    const user = Array.from(users.values()).find(u => 
      u.username === username || u.email === username
    );

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
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
      role: user.role
    };

    // Store in session
    (req.session as any).user = sessionData;

    res.json({
      success: true,
      user: sessionData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, role = 'technician' } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({ 
        error: 'Username, email, password e nome são obrigatórios' 
      });
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => 
      u.username === username || u.email === email
    );

    if (existingUser) {
      return res.status(409).json({ 
        error: 'Usuário com este username ou email já existe' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: `${role}-${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      name,
      role
    };

    // Store user
    users.set(username, newUser);

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

// Get current user
router.get('/me', (req, res) => {
  if (!(req.session as any).user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  res.json({
    success: true,
    user: (req.session as any).user
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
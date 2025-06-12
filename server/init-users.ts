import bcrypt from 'bcrypt';
import { storage } from './storage';

// Initialize default users with proper authentication
export async function initializeDefaultUsers() {
  try {
    console.log('🔐 Inicializando usuários padrão...');

    const defaultUsers = [
      {
        id: 'admin-001',
        username: 'admin',
        email: 'admin@laboratorio-evcs.com',
        password: 'admin123',
        name: 'Administrador Sistema',
        role: 'admin' as const,
        isActive: true
      },
      {
        id: 'manager-001', 
        username: 'manager',
        email: 'manager@laboratorio-evcs.com',
        password: 'manager123',
        name: 'Gerente Laboratório',
        role: 'manager' as const,
        isActive: true
      },
      {
        id: 'supervisor-001',
        username: 'supervisor',
        email: 'supervisor@laboratorio-evcs.com', 
        password: 'supervisor123',
        name: 'Supervisor Técnico',
        role: 'supervisor' as const,
        isActive: true
      },
      {
        id: 'technician-001',
        username: 'technician',
        email: 'technician@laboratorio-evcs.com',
        password: 'technician123', 
        name: 'Técnico Laboratório',
        role: 'technician' as const,
        isActive: true
      }
    ];

    for (const userData of defaultUsers) {
      try {
        // Check if user already exists
        const existingUser = await storage.getUser(userData.id);
        if (existingUser) {
          console.log(`✓ Usuário ${userData.username} já existe`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create user
        const user = await storage.upsertUser({
          ...userData,
          password: hashedPassword
        });

        console.log(`✓ Usuário criado: ${userData.username} (${userData.role})`);
      } catch (error) {
        console.error(`Erro ao criar usuário ${userData.username}:`, error);
      }
    }

    console.log('🔐 Usuários padrão inicializados com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('Admin: admin / admin123');
    console.log('Manager: manager / manager123'); 
    console.log('Supervisor: supervisor / supervisor123');
    console.log('Technician: technician / technician123');

  } catch (error) {
    console.error('Erro ao inicializar usuários:', error);
  }
}
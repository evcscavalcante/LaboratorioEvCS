import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function initializeAdminUser() {
  try {
    const adminEmail = 'evcsousa@yahoo.com.br';
    
    // Verificar se o usuário admin já existe
    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail));
    
    if (existingAdmin.length === 0) {
      // Criar usuário administrador no banco
      await db.insert(users).values({
        email: adminEmail,
        name: 'EVC Sousa',
        role: 'ADMIN',
        active: true,
        organizationId: null // Admin do sistema não pertence a uma organização específica
      });
      
      console.log(`✅ Usuário administrador ${adminEmail} criado no banco de dados`);
    } else {
      // Atualizar role para ADMIN se já existir
      await db.update(users)
        .set({ role: 'ADMIN', active: true })
        .where(eq(users.email, adminEmail));
        
      console.log(`✅ Usuário administrador ${adminEmail} atualizado no banco de dados`);
    }
  } catch (error) {
    console.error('Erro ao inicializar usuário administrador:', error);
  }
}
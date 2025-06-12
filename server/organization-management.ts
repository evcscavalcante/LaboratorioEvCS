import { Request, Response } from "express";
import { db } from "./db";
import { organizations, subscriptionPlans, users, UserRoles, RoleHierarchy } from "@shared/schema";
import { eq, and, count, gte, sql } from "drizzle-orm";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      organizationLimits?: {
        canAddUsers: boolean;
        canAddTests: boolean;
        usersLeft: number;
        testsLeft: number;
      };
    }
  }
}

export interface OrganizationWithPlan {
  id: number;
  name: string;
  description?: string;
  cnpj?: string;
  subscriptionPlan?: {
    id: number;
    name: string;
    price: number;
    maxUsers: number;
    maxTests: number;
    features: string[];
  };
  subscriptionStatus: string;
  subscriptionExpiry?: Date;
  monthlyTestCount: number;
  userCount: number;
  active: boolean;
}

export class OrganizationManager {
  
  // Verificar limites do plano
  async checkPlanLimits(organizationId: number): Promise<{
    canAddUsers: boolean;
    canAddTests: boolean;
    usersLeft: number;
    testsLeft: number;
  }> {
    const [org] = await db
      .select({
        maxUsers: subscriptionPlans.maxUsers,
        maxTests: subscriptionPlans.maxTests,
        monthlyTestCount: organizations.monthlyTestCount
      })
      .from(organizations)
      .leftJoin(subscriptionPlans, eq(organizations.subscriptionPlanId, subscriptionPlans.id))
      .where(eq(organizations.id, organizationId));

    if (!org) {
      throw new Error('Organização não encontrada');
    }

    const [userCountResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.organizationId, organizationId));

    const currentUsers = userCountResult.count;
    const maxUsers = org.maxUsers || 5;
    const maxTests = org.maxTests || 100;
    const currentTests = org.monthlyTestCount || 0;

    return {
      canAddUsers: currentUsers < maxUsers,
      canAddTests: currentTests < maxTests,
      usersLeft: Math.max(0, maxUsers - currentUsers),
      testsLeft: Math.max(0, maxTests - currentTests)
    };
  }

  // Verificar se usuário pode executar ação baseado no role
  hasPermission(userRole: string, requiredRole: string): boolean {
    const userLevel = RoleHierarchy[userRole as keyof typeof RoleHierarchy] || 0;
    const requiredLevel = RoleHierarchy[requiredRole as keyof typeof RoleHierarchy] || 0;
    return userLevel >= requiredLevel;
  }

  // Verificar se usuário pode gerenciar organização
  canManageOrganization(userRole: string): boolean {
    return this.hasPermission(userRole, UserRoles.ADMIN);
  }

  // Verificar se usuário pode criar organizações
  canCreateOrganization(userRole: string): boolean {
    return this.hasPermission(userRole, UserRoles.SUPER_ADMIN);
  }

  // Verificar se usuário pode modificar planos
  canModifyPlans(userRole: string): boolean {
    return this.hasPermission(userRole, UserRoles.DEVELOPER);
  }

  // Incrementar contador de testes mensais
  async incrementTestCount(organizationId: number): Promise<boolean> {
    const limits = await this.checkPlanLimits(organizationId);
    
    if (!limits.canAddTests) {
      throw new Error('Limite de testes mensais excedido');
    }

    await db
      .update(organizations)
      .set({ 
        monthlyTestCount: sql`${organizations.monthlyTestCount} + 1`
      })
      .where(eq(organizations.id, organizationId));

    return true;
  }

  // Resetar contador mensal (executar via cron job)
  async resetMonthlyCounters(): Promise<void> {
    await db
      .update(organizations)
      .set({ monthlyTestCount: 0 });
  }

  // Obter organizações com detalhes do plano
  async getOrganizationsWithPlans(): Promise<OrganizationWithPlan[]> {
    const results = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        description: organizations.description,
        cnpj: organizations.cnpj,
        subscriptionStatus: organizations.subscriptionStatus,
        subscriptionExpiry: organizations.subscriptionExpiry,
        monthlyTestCount: organizations.monthlyTestCount,
        active: organizations.active,
        planId: subscriptionPlans.id,
        planName: subscriptionPlans.name,
        planPrice: subscriptionPlans.price,
        planMaxUsers: subscriptionPlans.maxUsers,
        planMaxTests: subscriptionPlans.maxTests,
        planFeatures: subscriptionPlans.features
      })
      .from(organizations)
      .leftJoin(subscriptionPlans, eq(organizations.subscriptionPlanId, subscriptionPlans.id));

    const orgsWithUserCount = await Promise.all(
      results.map(async (org) => {
        const [userCount] = await db
          .select({ count: count() })
          .from(users)
          .where(eq(users.organizationId, org.id));

        return {
          id: org.id,
          name: org.name,
          description: org.description,
          cnpj: org.cnpj,
          subscriptionPlan: org.planId ? {
            id: org.planId,
            name: org.planName,
            price: org.planPrice,
            maxUsers: org.planMaxUsers,
            maxTests: org.planMaxTests,
            features: org.planFeatures || []
          } : undefined,
          subscriptionStatus: org.subscriptionStatus,
          subscriptionExpiry: org.subscriptionExpiry,
          monthlyTestCount: org.monthlyTestCount,
          userCount: userCount.count,
          active: org.active
        } as OrganizationWithPlan;
      })
    );

    return orgsWithUserCount;
  }
}

export const organizationManager = new OrganizationManager();

// Middleware para verificar limites organizacionais
export const checkOrganizationLimits = async (req: Request, res: Response, next: any) => {
  const user = req.user as any;
  
  if (!user?.organizationId) {
    return res.status(400).json({ error: 'Usuário deve estar vinculado a uma organização' });
  }

  try {
    const limits = await organizationManager.checkPlanLimits(user.organizationId);
    req.organizationLimits = limits;
    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware para verificar permissões baseadas em role
export const requireMinimumRole = (minimumRole: string) => {
  return (req: Request, res: Response, next: any) => {
    const user = req.user as any;
    
    if (!user?.role) {
      return res.status(401).json({ error: 'Role do usuário não encontrado' });
    }

    if (!organizationManager.hasPermission(user.role, minimumRole)) {
      return res.status(403).json({ 
        error: `Acesso negado. Role mínimo requerido: ${minimumRole}` 
      });
    }

    next();
  };
};
import { Request, Response } from "express";
import { db } from "./db";
import { organizations, subscriptionPlans, users } from "@shared/schema";
import { eq } from "drizzle-orm";

// Simplified organization manager
export class SimpleOrganizationManager {
  
  // Check user permissions based on role hierarchy
  hasPermission(userRole: string, requiredRole: string): boolean {
    const hierarchy = {
      'DEVELOPER': 100,
      'SUPER_ADMIN': 90,
      'ADMIN': 80,
      'MANAGER': 60,
      'SUPERVISOR': 40,
      'TECHNICIAN': 20,
      'VIEWER': 10
    };
    
    const userLevel = hierarchy[userRole as keyof typeof hierarchy] || 0;
    const requiredLevel = hierarchy[requiredRole as keyof typeof hierarchy] || 0;
    return userLevel >= requiredLevel;
  }

  // Get organization info with plan details
  async getOrganizationInfo(orgId: number) {
    const [org] = await db
      .select()
      .from(organizations)
      .leftJoin(subscriptionPlans, eq(organizations.subscriptionPlanId, subscriptionPlans.id))
      .where(eq(organizations.id, orgId));
    
    return org;
  }

  // Get all subscription plans
  async getSubscriptionPlans() {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.active, true));
  }
}

export const simpleOrgManager = new SimpleOrganizationManager();

// Middleware to check role permissions
export const requireRole = (minimumRole: string) => {
  return (req: Request, res: Response, next: any) => {
    const user = req.user as any;
    
    if (!user?.role) {
      return res.status(401).json({ error: 'Role do usuário não encontrado' });
    }

    if (!simpleOrgManager.hasPermission(user.role, minimumRole)) {
      return res.status(403).json({ 
        error: `Acesso negado. Role mínimo requerido: ${minimumRole}`,
        currentRole: user.role,
        requiredRole: minimumRole
      });
    }

    next();
  };
};
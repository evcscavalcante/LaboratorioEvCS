import {
  type DensityInSituTest,
  type RealDensityTest,
  type MaxMinDensityTest,
  type InsertDensityInSituTest,
  type InsertRealDensityTest,
  type InsertMaxMinDensityTest,
  type User,
  type InsertUser
} from "@shared/schema";

export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  upsertUser(user: InsertUser): Promise<User>;

  // Density In Situ
  createDensityInSituTest(test: InsertDensityInSituTest): Promise<DensityInSituTest>;
  getDensityInSituTest(id: number): Promise<DensityInSituTest | undefined>;
  getDensityInSituTests(): Promise<DensityInSituTest[]>;
  updateDensityInSituTest(id: number, test: Partial<InsertDensityInSituTest>): Promise<DensityInSituTest | undefined>;
  deleteDensityInSituTest(id: number): Promise<boolean>;
  
  // Real Density
  createRealDensityTest(test: InsertRealDensityTest): Promise<RealDensityTest>;
  getRealDensityTest(id: number): Promise<RealDensityTest | undefined>;
  getRealDensityTests(): Promise<RealDensityTest[]>;
  updateRealDensityTest(id: number, test: Partial<InsertRealDensityTest>): Promise<RealDensityTest | undefined>;
  deleteRealDensityTest(id: number): Promise<boolean>;
  
  // Max Min Density
  createMaxMinDensityTest(test: InsertMaxMinDensityTest): Promise<MaxMinDensityTest>;
  getMaxMinDensityTest(id: number): Promise<MaxMinDensityTest | undefined>;
  getMaxMinDensityTests(): Promise<MaxMinDensityTest[]>;
  updateMaxMinDensityTest(id: number, test: Partial<InsertMaxMinDensityTest>): Promise<MaxMinDensityTest | undefined>;
  deleteMaxMinDensityTest(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private densityInSituTests: Map<number, any>;
  private realDensityTests: Map<number, any>;
  private maxMinDensityTests: Map<number, any>;
  private users: Map<string, any>;
  private currentId: number;

  constructor() {
    this.densityInSituTests = new Map();
    this.realDensityTests = new Map();
    this.maxMinDensityTests = new Map();
    this.users = new Map();
    this.currentId = 1;
    
    // Create admin user
    this.users.set("admin", {
      id: "admin",
      email: "admin@sistema.com",
      firstName: "Admin",
      lastName: "User",
      profileImageUrl: null,
      role: "ADMIN",
      active: true,
      organizationId: 1,
      permissions: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    });
  }

  // Density In Situ Methods
  async createDensityInSituTest(insertTest: any): Promise<any> {
    const id = this.currentId++;
    const test = { 
      id, 
      createdAt: new Date(),
      ...insertTest
    };
    this.densityInSituTests.set(id, test);
    return test;
  }

  async getDensityInSituTest(id: number): Promise<any> {
    return this.densityInSituTests.get(id);
  }

  async getDensityInSituTests(): Promise<any[]> {
    return Array.from(this.densityInSituTests.values());
  }

  async updateDensityInSituTest(id: number, updates: any): Promise<any> {
    const existing = this.densityInSituTests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.densityInSituTests.set(id, updated);
    return updated;
  }

  async deleteDensityInSituTest(id: number): Promise<boolean> {
    return this.densityInSituTests.delete(id);
  }

  // Real Density Methods
  async createRealDensityTest(insertTest: any): Promise<any> {
    const id = this.currentId++;
    const test = { 
      id, 
      createdAt: new Date(),
      ...insertTest
    };
    this.realDensityTests.set(id, test);
    return test;
  }

  async getRealDensityTest(id: number): Promise<any> {
    return this.realDensityTests.get(id);
  }

  async getRealDensityTests(): Promise<any[]> {
    return Array.from(this.realDensityTests.values());
  }

  async updateRealDensityTest(id: number, updates: any): Promise<any> {
    const existing = this.realDensityTests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.realDensityTests.set(id, updated);
    return updated;
  }

  async deleteRealDensityTest(id: number): Promise<boolean> {
    return this.realDensityTests.delete(id);
  }

  // Max Min Density Methods
  async createMaxMinDensityTest(insertTest: any): Promise<any> {
    const id = this.currentId++;
    const test = { 
      id, 
      createdAt: new Date(),
      ...insertTest
    };
    this.maxMinDensityTests.set(id, test);
    return test;
  }

  async getMaxMinDensityTest(id: number): Promise<any> {
    return this.maxMinDensityTests.get(id);
  }

  async getMaxMinDensityTests(): Promise<any[]> {
    return Array.from(this.maxMinDensityTests.values());
  }

  async updateMaxMinDensityTest(id: number, updates: any): Promise<any> {
    const existing = this.maxMinDensityTests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.maxMinDensityTests.set(id, updated);
    return updated;
  }

  async deleteMaxMinDensityTest(id: number): Promise<boolean> {
    return this.maxMinDensityTests.delete(id);
  }

  // User Management Methods
  async getUser(id: string): Promise<any> {
    return this.users.get(id);
  }

  async getUsers(): Promise<any[]> {
    return Array.from(this.users.values());
  }

  async upsertUser(userData: any): Promise<any> {
    const userId = userData.id || String(Date.now());
    const user = {
      id: userId,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      role: userData.role || 'VIEWER',
      active: userData.active !== undefined ? userData.active : true,
      organizationId: userData.organizationId || null,
      permissions: userData.permissions || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };
    
    this.users.set(user.id, user);
    return user;
  }
}

export const storage = new MemStorage();
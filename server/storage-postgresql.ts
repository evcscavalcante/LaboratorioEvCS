import { db } from "./db";
import { users, densityInSituTests, realDensityTests, maxMinDensityTests } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import {
  type DensityInSituTest,
  type InsertDensityInSituTest,
  type RealDensityTest,
  type InsertRealDensityTest,
  type MaxMinDensityTest,
  type InsertMaxMinDensityTest,
  type User,
  type InsertUser
} from "@shared/schema";

export interface IStorage {
  // User operations for Authentication
  getUser(id: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;
  createUser(user: any): Promise<User>;

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

export class PostgreSQLStorage implements IStorage {
  // User Management Methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(userData: any): Promise<User> {
    try {
      const [user] = await db.insert(users).values({
        id: userData.id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        organizationId: userData.organizationId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        isActive: userData.isActive,
        active: userData.active,
        permissions: userData.permissions,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null
      }).returning();
      
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    try {
      // Try to get existing user
      const existingUser = userData.id ? await this.getUser(userData.id) : null;
      
      if (existingUser) {
        // Update existing user
        const [updatedUser] = await db
          .update(users)
          .set({
            username: userData.username || existingUser.username,
            name: userData.name || existingUser.name,
            email: userData.email || existingUser.email,
            role: userData.role || existingUser.role,
            updatedAt: new Date()
          })
          .where(eq(users.id, userData.id!))
          .returning();
          
        return updatedUser;
      } else {
        // Create new user
        return await this.createUser(userData);
      }
    } catch (error) {
      console.error('Error upserting user:', error);
      throw error;
    }
  }

  // Density In Situ Methods
  async createDensityInSituTest(insertTest: InsertDensityInSituTest): Promise<DensityInSituTest> {
    try {
      const [test] = await db.insert(densityInSituTests).values(insertTest as any).returning();
      return test;
    } catch (error) {
      console.error('Error creating density in situ test:', error);
      throw error;
    }
  }

  async getDensityInSituTest(id: number): Promise<DensityInSituTest | undefined> {
    try {
      const [test] = await db.select().from(densityInSituTests).where(eq(densityInSituTests.id, id));
      return test || undefined;
    } catch (error) {
      console.error('Error getting density in situ test:', error);
      return undefined;
    }
  }

  async getDensityInSituTests(): Promise<DensityInSituTest[]> {
    try {
      return await db.select().from(densityInSituTests);
    } catch (error) {
      console.error('Error getting density in situ tests:', error);
      return [];
    }
  }

  async updateDensityInSituTest(id: number, updates: Partial<InsertDensityInSituTest>): Promise<DensityInSituTest | undefined> {
    try {
      const [updatedTest] = await db
        .update(densityInSituTests)
        .set(updates as any)
        .where(eq(densityInSituTests.id, id))
        .returning();
      return updatedTest || undefined;
    } catch (error) {
      console.error('Error updating density in situ test:', error);
      return undefined;
    }
  }

  async deleteDensityInSituTest(id: number): Promise<boolean> {
    try {
      await db.delete(densityInSituTests).where(eq(densityInSituTests.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting density in situ test:', error);
      return false;
    }
  }

  // Real Density Methods
  async createRealDensityTest(insertTest: InsertRealDensityTest): Promise<RealDensityTest> {
    try {
      const [test] = await db.insert(realDensityTests).values(insertTest as any).returning();
      return test;
    } catch (error) {
      console.error('Error creating real density test:', error);
      throw error;
    }
  }

  async getRealDensityTest(id: number): Promise<RealDensityTest | undefined> {
    try {
      const [test] = await db.select().from(realDensityTests).where(eq(realDensityTests.id, id));
      return test || undefined;
    } catch (error) {
      console.error('Error getting real density test:', error);
      return undefined;
    }
  }

  async getRealDensityTests(): Promise<RealDensityTest[]> {
    try {
      return await db.select().from(realDensityTests);
    } catch (error) {
      console.error('Error getting real density tests:', error);
      return [];
    }
  }

  async updateRealDensityTest(id: number, updates: Partial<InsertRealDensityTest>): Promise<RealDensityTest | undefined> {
    try {
      const [updatedTest] = await db
        .update(realDensityTests)
        .set(updates as any)
        .where(eq(realDensityTests.id, id))
        .returning();
      return updatedTest || undefined;
    } catch (error) {
      console.error('Error updating real density test:', error);
      return undefined;
    }
  }

  async deleteRealDensityTest(id: number): Promise<boolean> {
    try {
      await db.delete(realDensityTests).where(eq(realDensityTests.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting real density test:', error);
      return false;
    }
  }

  // Max Min Density Methods
  async createMaxMinDensityTest(insertTest: InsertMaxMinDensityTest): Promise<MaxMinDensityTest> {
    try {
      const [test] = await db.insert(maxMinDensityTests).values(insertTest as any).returning();
      return test;
    } catch (error) {
      console.error('Error creating max min density test:', error);
      throw error;
    }
  }

  async getMaxMinDensityTest(id: number): Promise<MaxMinDensityTest | undefined> {
    try {
      const [test] = await db.select().from(maxMinDensityTests).where(eq(maxMinDensityTests.id, id));
      return test || undefined;
    } catch (error) {
      console.error('Error getting max min density test:', error);
      return undefined;
    }
  }

  async getMaxMinDensityTests(): Promise<MaxMinDensityTest[]> {
    try {
      return await db.select().from(maxMinDensityTests);
    } catch (error) {
      console.error('Error getting max min density tests:', error);
      return [];
    }
  }

  async updateMaxMinDensityTest(id: number, updates: Partial<InsertMaxMinDensityTest>): Promise<MaxMinDensityTest | undefined> {
    try {
      const [updatedTest] = await db
        .update(maxMinDensityTests)
        .set(updates as any)
        .where(eq(maxMinDensityTests.id, id))
        .returning();
      return updatedTest || undefined;
    } catch (error) {
      console.error('Error updating max min density test:', error);
      return undefined;
    }
  }

  async deleteMaxMinDensityTest(id: number): Promise<boolean> {
    try {
      await db.delete(maxMinDensityTests).where(eq(maxMinDensityTests.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting max min density test:', error);
      return false;
    }
  }
}

export const storage = new PostgreSQLStorage();
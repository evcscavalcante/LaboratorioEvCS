import { 
  densityInSituTests,
  realDensityTests,
  maxMinDensityTests,
  type DensityInSituTest,
  type RealDensityTest,
  type MaxMinDensityTest,
  type InsertDensityInSituTest,
  type InsertRealDensityTest,
  type InsertMaxMinDensityTest
} from "@shared/schema";

export interface IStorage {
  // Density In Situ
  createDensityInSituTest(test: InsertDensityInSituTest): Promise<DensityInSituTest>;
  getDensityInSituTest(id: number): Promise<DensityInSituTest | undefined>;
  getDensityInSituTests(): Promise<DensityInSituTest[]>;
  updateDensityInSituTest(id: number, test: Partial<InsertDensityInSituTest>): Promise<DensityInSituTest | undefined>;
  
  // Real Density
  createRealDensityTest(test: InsertRealDensityTest): Promise<RealDensityTest>;
  getRealDensityTest(id: number): Promise<RealDensityTest | undefined>;
  getRealDensityTests(): Promise<RealDensityTest[]>;
  updateRealDensityTest(id: number, test: Partial<InsertRealDensityTest>): Promise<RealDensityTest | undefined>;
  
  // Max Min Density
  createMaxMinDensityTest(test: InsertMaxMinDensityTest): Promise<MaxMinDensityTest>;
  getMaxMinDensityTest(id: number): Promise<MaxMinDensityTest | undefined>;
  getMaxMinDensityTests(): Promise<MaxMinDensityTest[]>;
  updateMaxMinDensityTest(id: number, test: Partial<InsertMaxMinDensityTest>): Promise<MaxMinDensityTest | undefined>;
}

export class MemStorage implements IStorage {
  private densityInSituTests: Map<number, DensityInSituTest>;
  private realDensityTests: Map<number, RealDensityTest>;
  private maxMinDensityTests: Map<number, MaxMinDensityTest>;
  private currentId: number;

  constructor() {
    this.densityInSituTests = new Map();
    this.realDensityTests = new Map();
    this.maxMinDensityTests = new Map();
    this.currentId = 1;
  }

  // Density In Situ Methods
  async createDensityInSituTest(insertTest: InsertDensityInSituTest): Promise<DensityInSituTest> {
    const id = this.currentId++;
    const test: DensityInSituTest = { 
      ...insertTest,
      id, 
      createdAt: new Date(),
      time: insertTest.time || null
    };
    this.densityInSituTests.set(id, test);
    return test;
  }

  async getDensityInSituTest(id: number): Promise<DensityInSituTest | undefined> {
    return this.densityInSituTests.get(id);
  }

  async getDensityInSituTests(): Promise<DensityInSituTest[]> {
    return Array.from(this.densityInSituTests.values());
  }

  async updateDensityInSituTest(id: number, updates: Partial<InsertDensityInSituTest>): Promise<DensityInSituTest | undefined> {
    const existing = this.densityInSituTests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.densityInSituTests.set(id, updated);
    return updated;
  }

  // Real Density Methods
  async createRealDensityTest(insertTest: InsertRealDensityTest): Promise<RealDensityTest> {
    const id = this.currentId++;
    const test: RealDensityTest = { 
      ...insertTest, 
      id, 
      createdAt: new Date() 
    };
    this.realDensityTests.set(id, test);
    return test;
  }

  async getRealDensityTest(id: number): Promise<RealDensityTest | undefined> {
    return this.realDensityTests.get(id);
  }

  async getRealDensityTests(): Promise<RealDensityTest[]> {
    return Array.from(this.realDensityTests.values());
  }

  async updateRealDensityTest(id: number, updates: Partial<InsertRealDensityTest>): Promise<RealDensityTest | undefined> {
    const existing = this.realDensityTests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.realDensityTests.set(id, updated);
    return updated;
  }

  // Max Min Density Methods
  async createMaxMinDensityTest(insertTest: InsertMaxMinDensityTest): Promise<MaxMinDensityTest> {
    const id = this.currentId++;
    const test: MaxMinDensityTest = { 
      ...insertTest, 
      id, 
      createdAt: new Date() 
    };
    this.maxMinDensityTests.set(id, test);
    return test;
  }

  async getMaxMinDensityTest(id: number): Promise<MaxMinDensityTest | undefined> {
    return this.maxMinDensityTests.get(id);
  }

  async getMaxMinDensityTests(): Promise<MaxMinDensityTest[]> {
    return Array.from(this.maxMinDensityTests.values());
  }

  async updateMaxMinDensityTest(id: number, updates: Partial<InsertMaxMinDensityTest>): Promise<MaxMinDensityTest | undefined> {
    const existing = this.maxMinDensityTests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.maxMinDensityTests.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();

import type {
  DensityInSituTest,
  RealDensityTest,
  MaxMinDensityTest,
  InsertDensityInSituTest,
  InsertRealDensityTest,
  InsertMaxMinDensityTest
} from '@shared/schema';

class HybridStorage {
  private isOnline = navigator.onLine;

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private async saveData(collectionName: string, data: any): Promise<any> {
    const localKey = `labevcs_${collectionName}`;
    const stored = JSON.parse(localStorage.getItem(localKey) || '[]');
    
    const newItem = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    stored.push(newItem);
    localStorage.setItem(localKey, JSON.stringify(stored));
    
    return newItem;
  }

  private async loadData(collectionName: string): Promise<any[]> {
    const localKey = `labevcs_${collectionName}`;
    return JSON.parse(localStorage.getItem(localKey) || '[]');
  }

  // Density In Situ Tests
  async createDensityInSituTest(test: InsertDensityInSituTest): Promise<DensityInSituTest> {
    return this.saveData('densityInSituTests', test) as Promise<DensityInSituTest>;
  }

  async getDensityInSituTests(): Promise<DensityInSituTest[]> {
    return this.loadData('densityInSituTests') as Promise<DensityInSituTest[]>;
  }

  async getDensityInSituTest(id: number): Promise<DensityInSituTest | undefined> {
    const tests = await this.getDensityInSituTests();
    return tests.find(test => test.id === id);
  }

  async updateDensityInSituTest(id: number, updates: Partial<InsertDensityInSituTest>): Promise<DensityInSituTest | undefined> {
    const tests = await this.getDensityInSituTests();
    const index = tests.findIndex(test => test.id === id);
    
    if (index === -1) return undefined;
    
    tests[index] = { ...tests[index], ...updates };
    localStorage.setItem('labevcs_densityInSituTests', JSON.stringify(tests));
    
    return tests[index];
  }

  // Real Density Tests
  async createRealDensityTest(test: InsertRealDensityTest): Promise<RealDensityTest> {
    return this.saveData('realDensityTests', test) as Promise<RealDensityTest>;
  }

  async getRealDensityTests(): Promise<RealDensityTest[]> {
    return this.loadData('realDensityTests') as Promise<RealDensityTest[]>;
  }

  async getRealDensityTest(id: number): Promise<RealDensityTest | undefined> {
    const tests = await this.getRealDensityTests();
    return tests.find(test => test.id === id);
  }

  async updateRealDensityTest(id: number, updates: Partial<InsertRealDensityTest>): Promise<RealDensityTest | undefined> {
    const tests = await this.getRealDensityTests();
    const index = tests.findIndex(test => test.id === id);
    
    if (index === -1) return undefined;
    
    tests[index] = { ...tests[index], ...updates };
    localStorage.setItem('labevcs_realDensityTests', JSON.stringify(tests));
    
    return tests[index];
  }

  // Max Min Density Tests
  async createMaxMinDensityTest(test: InsertMaxMinDensityTest): Promise<MaxMinDensityTest> {
    return this.saveData('maxMinDensityTests', test) as Promise<MaxMinDensityTest>;
  }

  async getMaxMinDensityTests(): Promise<MaxMinDensityTest[]> {
    return this.loadData('maxMinDensityTests') as Promise<MaxMinDensityTest[]>;
  }

  async getMaxMinDensityTest(id: number): Promise<MaxMinDensityTest | undefined> {
    const tests = await this.getMaxMinDensityTests();
    return tests.find(test => test.id === id);
  }

  async updateMaxMinDensityTest(id: number, updates: Partial<InsertMaxMinDensityTest>): Promise<MaxMinDensityTest | undefined> {
    const tests = await this.getMaxMinDensityTests();
    const index = tests.findIndex(test => test.id === id);
    
    if (index === -1) return undefined;
    
    tests[index] = { ...tests[index], ...updates };
    localStorage.setItem('labevcs_maxMinDensityTests', JSON.stringify(tests));
    
    return tests[index];
  }
}

export const hybridStorage = new HybridStorage();
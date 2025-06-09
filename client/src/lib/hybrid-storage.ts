import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  enableIndexedDbPersistence 
} from 'firebase/firestore';
import type {
  DensityInSituTest,
  RealDensityTest,
  MaxMinDensityTest,
  InsertDensityInSituTest,
  InsertRealDensityTest,
  InsertMaxMinDensityTest
} from '@shared/schema';

// Firebase persistence is now handled in firebase.ts

class HybridStorage {
  private isOnline = navigator.onLine;

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingChanges();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private async syncPendingChanges() {
    if (!auth?.currentUser || !db) return;

    const pendingChanges = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    const synced: string[] = [];

    for (const change of pendingChanges) {
      try {
        const collectionPath = `users/${auth.currentUser.uid}/${change.collection}`;
        
        if (change.operation === 'create') {
          const collectionRef = collection(db, collectionPath);
          await addDoc(collectionRef, change.data);
          synced.push(change.id);
        } else if (change.operation === 'update') {
          const docRef = doc(db, collectionPath, change.docId);
          await updateDoc(docRef, change.data);
          synced.push(change.id);
        }
      } catch (error) {
        console.error('Sync error:', error);
      }
    }

    // Remove synced changes
    const remaining = pendingChanges.filter((change: any) => !synced.includes(change.id));
    localStorage.setItem('pendingSync', JSON.stringify(remaining));
  }

  private addToPendingSync(operation: 'create' | 'update', collectionName: string, data: any, docId?: string) {
    const pendingChanges = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    pendingChanges.push({
      id: Date.now().toString(),
      operation,
      collection: collectionName,
      data,
      docId,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('pendingSync', JSON.stringify(pendingChanges));
  }

  private getLocalKey(collectionName: string) {
    const userId = auth?.currentUser?.uid || 'anonymous';
    return `${collectionName}_${userId}`;
  }

  // Generic methods for any collection
  async saveData(collectionName: string, data: any, id?: number) {
    const localKey = this.getLocalKey(collectionName);
    const localData = JSON.parse(localStorage.getItem(localKey) || '[]');

    if (id) {
      // Update existing
      const index = localData.findIndex((item: any) => item.id === id);
      if (index >= 0) {
        localData[index] = { ...localData[index], ...data, updatedAt: new Date().toISOString() };
        localStorage.setItem(localKey, JSON.stringify(localData));

        if (this.isOnline && db && auth?.currentUser) {
          try {
            const collectionPath = `users/${auth.currentUser.uid}/${collectionName}`;
            const docRef = doc(db, collectionPath, id.toString());
            await updateDoc(docRef, data);
          } catch (error) {
            this.addToPendingSync('update', collectionName, data, id.toString());
          }
        } else {
          this.addToPendingSync('update', collectionName, data, id.toString());
        }

        return localData[index];
      }
    } else {
      // Create new
      const newId = Date.now();
      const newItem = { 
        ...data, 
        id: newId, 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localData.push(newItem);
      localStorage.setItem(localKey, JSON.stringify(localData));

      if (this.isOnline && db && auth?.currentUser) {
        try {
          const collectionPath = `users/${auth.currentUser.uid}/${collectionName}`;
          const collectionRef = collection(db, collectionPath);
          await addDoc(collectionRef, newItem);
        } catch (error) {
          this.addToPendingSync('create', collectionName, newItem);
        }
      } else {
        this.addToPendingSync('create', collectionName, newItem);
      }

      return newItem;
    }
  }

  async loadData(collectionName: string) {
    const localKey = this.getLocalKey(collectionName);

    if (this.isOnline && db && auth?.currentUser) {
      try {
        const collectionPath = `users/${auth.currentUser.uid}/${collectionName}`;
        const collectionRef = collection(db, collectionPath);
        const q = query(collectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const firebaseData = querySnapshot.docs.map(doc => ({
          id: parseInt(doc.id.slice(-8), 16) || Date.now(),
          ...doc.data()
        }));
        
        // Update local storage with Firebase data
        localStorage.setItem(localKey, JSON.stringify(firebaseData));
        return firebaseData;
      } catch (error) {
        console.error('Error loading from Firebase:', error);
        // Fallback to local storage
        return JSON.parse(localStorage.getItem(localKey) || '[]');
      }
    } else {
      // Load from local storage when offline
      return JSON.parse(localStorage.getItem(localKey) || '[]');
    }
  }

  // Specific methods for each test type
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
    return this.saveData('densityInSituTests', updates, id) as Promise<DensityInSituTest | undefined>;
  }

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
    return this.saveData('realDensityTests', updates, id) as Promise<RealDensityTest | undefined>;
  }

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
    return this.saveData('maxMinDensityTests', updates, id) as Promise<MaxMinDensityTest | undefined>;
  }
}

export const hybridStorage = new HybridStorage();
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  DensityInSituTest,
  RealDensityTest,
  MaxMinDensityTest,
  InsertDensityInSituTest,
  InsertRealDensityTest,
  InsertMaxMinDensityTest
} from '../../../shared/schema';

// Enable offline persistence
let persistenceEnabled = false;

const enablePersistence = async () => {
  if (!db || persistenceEnabled) return;
  
  try {
    await enableIndexedDbPersistence(db, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED
    });
    persistenceEnabled = true;
    console.log('Firebase offline persistence enabled');
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time');
    } else if (error.code === 'unimplemented') {
      console.warn('Browser does not support persistence');
    }
  }
};

// Initialize persistence
enablePersistence();

// Network status detection
let isOnline = navigator.onLine;
window.addEventListener('online', () => {
  isOnline = true;
  console.log('App is online - Firebase will sync data');
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('App is offline - Firebase will cache operations');
});

export class FirebaseStorage {
  private userId: string | null = null;

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  private getCollectionPath(collectionName: string) {
    if (!this.userId) {
      throw new Error('User must be authenticated to access data');
    }
    return `users/${this.userId}/${collectionName}`;
  }

  // Density In Situ Methods
  async createDensityInSituTest(test: InsertDensityInSituTest): Promise<DensityInSituTest> {
    if (!db) throw new Error('Firebase not initialized');
    
    const collectionRef = collection(db, this.getCollectionPath('densityInSituTests'));
    const testData = {
      ...test,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: isOnline ? 'synced' : 'pending'
    };
    
    const docRef = await addDoc(collectionRef, testData);
    return {
      id: parseInt(docRef.id.slice(-8), 16), // Convert to number for compatibility
      ...testData
    } as DensityInSituTest;
  }

  async getDensityInSituTests(): Promise<DensityInSituTest[]> {
    if (!db) return [];
    
    try {
      const collectionRef = collection(db, this.getCollectionPath('densityInSituTests'));
      const q = query(collectionRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id.slice(-8), 16),
        ...doc.data()
      })) as DensityInSituTest[];
    } catch (error) {
      console.error('Error fetching density in situ tests:', error);
      return [];
    }
  }

  async getDensityInSituTest(id: number): Promise<DensityInSituTest | undefined> {
    if (!db) return undefined;
    
    try {
      const collectionRef = collection(db, this.getCollectionPath('densityInSituTests'));
      const q = query(collectionRef, where('id', '==', id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return undefined;
      
      const doc = querySnapshot.docs[0];
      return {
        id: parseInt(doc.id.slice(-8), 16),
        ...doc.data()
      } as DensityInSituTest;
    } catch (error) {
      console.error('Error fetching density in situ test:', error);
      return undefined;
    }
  }

  async updateDensityInSituTest(id: number, updates: Partial<InsertDensityInSituTest>): Promise<DensityInSituTest | undefined> {
    if (!db) return undefined;
    
    try {
      const collectionRef = collection(db, this.getCollectionPath('densityInSituTests'));
      const q = query(collectionRef, where('id', '==', id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return undefined;
      
      const docRef = querySnapshot.docs[0].ref;
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
        syncStatus: isOnline ? 'synced' : 'pending'
      };
      
      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      return {
        id,
        ...updatedDoc.data()
      } as DensityInSituTest;
    } catch (error) {
      console.error('Error updating density in situ test:', error);
      return undefined;
    }
  }

  // Real Density Methods
  async createRealDensityTest(test: InsertRealDensityTest): Promise<RealDensityTest> {
    if (!db) throw new Error('Firebase not initialized');
    
    const collectionRef = collection(db, this.getCollectionPath('realDensityTests'));
    const testData = {
      ...test,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: isOnline ? 'synced' : 'pending'
    };
    
    const docRef = await addDoc(collectionRef, testData);
    return {
      id: parseInt(docRef.id.slice(-8), 16),
      ...testData
    } as RealDensityTest;
  }

  async getRealDensityTests(): Promise<RealDensityTest[]> {
    if (!db) return [];
    
    try {
      const collectionRef = collection(db, this.getCollectionPath('realDensityTests'));
      const q = query(collectionRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id.slice(-8), 16),
        ...doc.data()
      })) as RealDensityTest[];
    } catch (error) {
      console.error('Error fetching real density tests:', error);
      return [];
    }
  }

  async getRealDensityTest(id: number): Promise<RealDensityTest | undefined> {
    if (!db) return undefined;
    
    try {
      const collectionRef = collection(db, this.getCollectionPath('realDensityTests'));
      const q = query(collectionRef, where('id', '==', id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return undefined;
      
      const doc = querySnapshot.docs[0];
      return {
        id: parseInt(doc.id.slice(-8), 16),
        ...doc.data()
      } as RealDensityTest;
    } catch (error) {
      console.error('Error fetching real density test:', error);
      return undefined;
    }
  }

  async updateRealDensityTest(id: number, updates: Partial<InsertRealDensityTest>): Promise<RealDensityTest | undefined> {
    if (!db) return undefined;
    
    try {
      const collectionRef = collection(db, this.getCollectionPath('realDensityTests'));
      const q = query(collectionRef, where('id', '==', id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return undefined;
      
      const docRef = querySnapshot.docs[0].ref;
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
        syncStatus: isOnline ? 'synced' : 'pending'
      };
      
      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      return {
        id,
        ...updatedDoc.data()
      } as RealDensityTest;
    } catch (error) {
      console.error('Error updating real density test:', error);
      return undefined;
    }
  }

  // Max Min Density Methods
  async createMaxMinDensityTest(test: InsertMaxMinDensityTest): Promise<MaxMinDensityTest> {
    if (!db) throw new Error('Firebase not initialized');
    
    const collectionRef = collection(db, this.getCollectionPath('maxMinDensityTests'));
    const testData = {
      ...test,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: isOnline ? 'synced' : 'pending'
    };
    
    const docRef = await addDoc(collectionRef, testData);
    return {
      id: parseInt(docRef.id.slice(-8), 16),
      ...testData
    } as MaxMinDensityTest;
  }

  async getMaxMinDensityTests(): Promise<MaxMinDensityTest[]> {
    if (!db) return [];
    
    try {
      const collectionRef = collection(db, this.getCollectionPath('maxMinDensityTests'));
      const q = query(collectionRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id.slice(-8), 16),
        ...doc.data()
      })) as MaxMinDensityTest[];
    } catch (error) {
      console.error('Error fetching max min density tests:', error);
      return [];
    }
  }

  async getMaxMinDensityTest(id: number): Promise<MaxMinDensityTest | undefined> {
    if (!db) return undefined;
    
    try {
      const collectionRef = collection(db, this.getCollectionPath('maxMinDensityTests'));
      const q = query(collectionRef, where('id', '==', id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return undefined;
      
      const doc = querySnapshot.docs[0];
      return {
        id: parseInt(doc.id.slice(-8), 16),
        ...doc.data()
      } as MaxMinDensityTest;
    } catch (error) {
      console.error('Error fetching max min density test:', error);
      return undefined;
    }
  }

  async updateMaxMinDensityTest(id: number, updates: Partial<InsertMaxMinDensityTest>): Promise<MaxMinDensityTest | undefined> {
    if (!db) return undefined;
    
    try {
      const collectionRef = collection(db, this.getCollectionPath('maxMinDensityTests'));
      const q = query(collectionRef, where('id', '==', id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return undefined;
      
      const docRef = querySnapshot.docs[0].ref;
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
        syncStatus: isOnline ? 'synced' : 'pending'
      };
      
      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      return {
        id,
        ...updatedDoc.data()
      } as MaxMinDensityTest;
    } catch (error) {
      console.error('Error updating max min density test:', error);
      return undefined;
    }
  }

  // Real-time listeners for data synchronization
  onDensityInSituTestsChange(callback: (tests: DensityInSituTest[]) => void) {
    if (!db) return () => {};
    
    const collectionRef = collection(db, this.getCollectionPath('densityInSituTests'));
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const tests = snapshot.docs.map(doc => ({
        id: parseInt(doc.id.slice(-8), 16),
        ...doc.data()
      })) as DensityInSituTest[];
      callback(tests);
    }, (error) => {
      console.error('Error listening to density in situ tests:', error);
    });
  }

  onRealDensityTestsChange(callback: (tests: RealDensityTest[]) => void) {
    if (!db) return () => {};
    
    const collectionRef = collection(db, this.getCollectionPath('realDensityTests'));
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const tests = snapshot.docs.map(doc => ({
        id: parseInt(doc.id.slice(-8), 16),
        ...doc.data()
      })) as RealDensityTest[];
      callback(tests);
    }, (error) => {
      console.error('Error listening to real density tests:', error);
    });
  }

  onMaxMinDensityTestsChange(callback: (tests: MaxMinDensityTest[]) => void) {
    if (!db) return () => {};
    
    const collectionRef = collection(db, this.getCollectionPath('maxMinDensityTests'));
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const tests = snapshot.docs.map(doc => ({
        id: parseInt(doc.id.slice(-8), 16),
        ...doc.data()
      })) as MaxMinDensityTest[];
      callback(tests);
    }, (error) => {
      console.error('Error listening to max min density tests:', error);
    });
  }
}

export const firebaseStorage = new FirebaseStorage();
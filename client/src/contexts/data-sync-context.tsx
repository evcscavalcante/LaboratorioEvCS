import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  enableIndexedDbPersistence 
} from 'firebase/firestore';

interface DataSyncContextType {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncStatus: 'idle' | 'syncing' | 'error';
  pendingChanges: number;
}

const DataSyncContext = createContext<DataSyncContextType | undefined>(undefined);

export function useDataSync() {
  const context = useContext(DataSyncContext);
  if (context === undefined) {
    throw new Error('useDataSync must be used within a DataSyncProvider');
  }
  return context;
}

interface DataSyncProviderProps {
  children: React.ReactNode;
}

export function DataSyncProvider({ children }: DataSyncProviderProps) {
  const { currentUser } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [pendingChanges, setPendingChanges] = useState(0);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Connection restored - starting sync');
      if (currentUser && db) {
        syncPendingData();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('Connection lost - working offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser]);

  // Firebase persistence is handled in firebase.ts to avoid conflicts

  // Sync pending data when coming online
  const syncPendingData = async () => {
    if (!currentUser || !db || !isOnline) return;

    setIsSyncing(true);
    setSyncStatus('syncing');

    try {
      // Get pending changes from localStorage
      const pendingData = JSON.parse(localStorage.getItem('pendingSync') || '[]');
      
      for (const item of pendingData) {
        try {
          const collectionPath = `users/${currentUser.uid}/${item.collection}`;
          const collectionRef = collection(db, collectionPath);
          
          if (item.operation === 'create') {
            await addDoc(collectionRef, {
              ...item.data,
              syncedAt: new Date().toISOString()
            });
          } else if (item.operation === 'update') {
            const docRef = doc(db, collectionPath, item.docId);
            await updateDoc(docRef, {
              ...item.data,
              syncedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error syncing item:', error);
        }
      }

      // Clear pending changes after successful sync
      localStorage.removeItem('pendingSync');
      setPendingChanges(0);
      setLastSyncTime(new Date());
      setSyncStatus('idle');
      
      console.log('Data sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Add data to pending sync queue when offline
  const addToPendingSync = (operation: 'create' | 'update', collection: string, data: any, docId?: string) => {
    const pendingData = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    const newItem = {
      id: Date.now().toString(),
      operation,
      collection,
      data,
      docId,
      timestamp: new Date().toISOString()
    };
    
    pendingData.push(newItem);
    localStorage.setItem('pendingSync', JSON.stringify(pendingData));
    setPendingChanges(pendingData.length);
  };

  // Helper function to save data (works online/offline)
  const saveData = async (collection: string, data: any, id?: number) => {
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }

    // Always save to local storage for immediate access
    const localKey = `${collection}_${currentUser.uid}`;
    const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
    
    if (id) {
      // Update existing
      const index = localData.findIndex((item: any) => item.id === id);
      if (index >= 0) {
        localData[index] = { ...localData[index], ...data, updatedAt: new Date().toISOString() };
      }
      localStorage.setItem(localKey, JSON.stringify(localData));
      
      if (isOnline && db) {
        try {
          const collectionPath = `users/${currentUser.uid}/${collection}`;
          const docRef = doc(db, collectionPath, id.toString());
          await updateDoc(docRef, data);
        } catch (error) {
          addToPendingSync('update', collection, data, id.toString());
        }
      } else {
        addToPendingSync('update', collection, data, id.toString());
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
      
      if (isOnline && db) {
        try {
          const collectionPath = `users/${currentUser.uid}/${collection}`;
          const collectionRef = collection(db, collectionPath);
          await addDoc(collectionRef, newItem);
        } catch (error) {
          addToPendingSync('create', collection, newItem);
        }
      } else {
        addToPendingSync('create', collection, newItem);
      }
      
      return newItem;
    }
  };

  // Helper function to load data (prefers Firebase when online)
  const loadData = async (collectionName: string) => {
    if (!currentUser) return [];

    const localKey = `${collectionName}_${currentUser.uid}`;
    
    if (isOnline && db) {
      try {
        const collectionPath = `users/${currentUser.uid}/${collectionName}`;
        const collectionRef = collection(db, collectionPath);
        const q = query(collectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const firebaseData = querySnapshot.docs.map(doc => ({
          id: doc.id,
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
  };

  // Update pending changes count on mount
  useEffect(() => {
    const pendingData = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    setPendingChanges(pendingData.length);
  }, []);

  const value = {
    isOnline,
    isSyncing,
    lastSyncTime,
    syncStatus,
    pendingChanges,
    saveData,
    loadData,
    syncPendingData
  };

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
}

// Export helper functions for components to use
export { useDataSync as useDataSyncHelpers };
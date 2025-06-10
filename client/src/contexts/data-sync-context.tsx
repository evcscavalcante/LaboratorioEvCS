import React, { createContext, useContext, useEffect, useState } from 'react';

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
    throw new Error('useDataSync deve ser usado dentro de um DataSyncProvider');
  }
  return context;
}

interface DataSyncProviderProps {
  children: React.ReactNode;
}

export function DataSyncProvider({ children }: DataSyncProviderProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [pendingChanges, setPendingChanges] = useState(0);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Connection restored');
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
  }, []);

  const value = {
    isOnline,
    isSyncing,
    lastSyncTime,
    syncStatus,
    pendingChanges
  };

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
}
import { WifiOff, Cloud, CloudOff } from 'lucide-react';
import { Badge } from './badge';
import { useState, useEffect } from 'react';

export default function SyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check for pending changes
    const checkPending = () => {
      const pending = JSON.parse(localStorage.getItem('pendingSync') || '[]');
      setPendingChanges(pending.length);
    };
    
    checkPending();
    const interval = setInterval(checkPending, 1000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isOnline) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <WifiOff className="h-3 w-3" />
        Offline
        {pendingChanges > 0 && (
          <span className="bg-white text-red-600 px-1 rounded text-xs">
            {pendingChanges}
          </span>
        )}
      </Badge>
    );
  }

  if (pendingChanges > 0) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <CloudOff className="h-3 w-3" />
        {pendingChanges} pendente{pendingChanges > 1 ? 's' : ''}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Cloud className="h-3 w-3" />
      Online
    </Badge>
  );
}
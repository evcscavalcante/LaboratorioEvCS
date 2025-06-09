import { Wifi, WifiOff, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { Badge } from './badge';

interface SyncStatusProps {
  isOnline: boolean;
  isSyncing: boolean;
  pendingChanges: number;
  lastSyncTime?: Date | null;
}

export default function SyncStatus({ isOnline, isSyncing, pendingChanges, lastSyncTime }: SyncStatusProps) {
  if (isSyncing) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Sincronizando...
      </Badge>
    );
  }

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
      Sincronizado
      {lastSyncTime && (
        <span className="text-xs opacity-70">
          {lastSyncTime.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      )}
    </Badge>
  );
}
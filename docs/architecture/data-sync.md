# Sincronização Tripla de Dados

## Visão Geral

O sistema implementa uma arquitetura de sincronização tripla para garantir zero perda de dados e disponibilidade offline:

1. **IndexedDB** (Local) - Cache offline e performance
2. **PostgreSQL** (Backend) - Dados estruturados e consultas complexas  
3. **Firebase Firestore** (Tempo Real) - Sincronização em tempo real

## Fluxo de Sincronização

### Escrita de Dados
```typescript
// 1. Salvar localmente (IndexedDB)
await localDB.save(data);

// 2. Enviar para backend (PostgreSQL)
await api.post('/api/tests', data);

// 3. Sincronizar com Firestore
await firestore.collection('tests').add(data);
```

### Leitura de Dados
```typescript
// 1. Tentar cache local primeiro
let data = await localDB.get(id);

// 2. Se não existir, buscar no backend
if (!data) {
  data = await api.get(`/api/tests/${id}`);
  await localDB.save(data); // Cache local
}

// 3. Listener Firestore para atualizações
firestore.collection('tests').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'modified') {
      localDB.update(change.doc.data());
    }
  });
});
```

## Estratégias de Conflito

### Resolução por Timestamp
- Último a escrever vence (Last Write Wins)
- Timestamp UTC para consistência global
- Versionamento para auditoria

### Merge Inteligente
```typescript
function mergeTestData(local: TestData, remote: TestData): TestData {
  // Priorizar dados mais recentes por seção
  return {
    basicInfo: remote.updatedAt > local.updatedAt ? remote.basicInfo : local.basicInfo,
    calculations: mergeCalculations(local.calculations, remote.calculations),
    equipment: remote.equipment || local.equipment,
    lastModified: Math.max(remote.updatedAt, local.updatedAt)
  };
}
```

## Estados de Sincronização

### Indicadores Visuais
- ✅ **Sincronizado**: Dados consistentes em todas as fontes
- 🔄 **Sincronizando**: Upload/download em progresso
- ⚠️ **Conflito**: Requer intervenção manual
- 📶 **Offline**: Apenas dados locais disponíveis

### Interface de Status
```typescript
interface SyncStatus {
  state: 'synced' | 'syncing' | 'conflict' | 'offline';
  lastSync: Date;
  pendingChanges: number;
  conflicts: ConflictItem[];
}
```

## Implementação por Camadas

### Camada de Persistência Local
```typescript
class LocalStorage {
  private db: IDBDatabase;
  
  async save<T>(table: string, data: T): Promise<void> {
    const transaction = this.db.transaction([table], 'readwrite');
    const store = transaction.objectStore(table);
    await store.put({ ...data, _syncStatus: 'pending' });
  }
  
  async getPendingSync(table: string): Promise<any[]> {
    const store = this.db.transaction([table]).objectStore(table);
    const index = store.index('_syncStatus');
    return await index.getAll('pending');
  }
}
```

### Camada de API Backend
```typescript
class ApiClient {
  async syncBatch(changes: ChangeSet[]): Promise<SyncResponse> {
    return await this.post('/api/sync/batch', {
      changes,
      clientId: this.clientId,
      timestamp: new Date().toISOString()
    });
  }
  
  async getChangesAfter(timestamp: string): Promise<ChangeSet[]> {
    return await this.get(`/api/sync/changes?after=${timestamp}`);
  }
}
```

### Camada Firestore
```typescript
class FirestoreSync {
  private listeners: Map<string, () => void> = new Map();
  
  watchCollection(collection: string, callback: (changes: any[]) => void) {
    const unsubscribe = firestore
      .collection(collection)
      .where('organizationId', '==', this.orgId)
      .onSnapshot(snapshot => {
        const changes = snapshot.docChanges().map(change => ({
          type: change.type,
          id: change.doc.id,
          data: change.doc.data(),
          timestamp: change.doc.get('updatedAt')
        }));
        callback(changes);
      });
    
    this.listeners.set(collection, unsubscribe);
  }
}
```

## Otimizações de Performance

### Batch Operations
- Agrupar múltiplas operações em uma única transação
- Reduzir overhead de rede e database
- Processamento assíncrono em background

### Compressão de Dados
```typescript
function compressTestData(data: TestData): CompressedData {
  return {
    id: data.id,
    delta: calculateDelta(data, lastKnownState),
    checksum: generateChecksum(data)
  };
}
```

### Cache Inteligente
- TTL baseado em frequência de acesso
- Pré-carregamento de dados relacionados
- Invalidação cascata por dependências

## Monitoramento e Métricas

### Métricas de Sincronização
```typescript
interface SyncMetrics {
  syncLatency: number;        // ms para sincronizar
  conflictRate: number;       // % de operações com conflito
  offlineOperations: number;  // operações pendentes offline
  dataThroughput: number;     // bytes/segundo
}
```

### Alertas Automáticos
- Tempo de sincronização > 5 segundos
- Taxa de conflitos > 5%
- Dados offline > 24 horas
- Falhas de conectividade persistentes

## Recuperação de Desastres

### Backup Automático
- Snapshot diário do IndexedDB
- Export periódico para arquivo local
- Backup incremental no PostgreSQL

### Restauração
```typescript
async function restoreFromBackup(backupData: BackupData): Promise<void> {
  // 1. Limpar dados locais inconsistentes
  await localDB.clear();
  
  // 2. Restaurar dados do backup
  await localDB.importData(backupData.local);
  
  // 3. Sincronizar com backend
  await syncManager.fullSync();
  
  // 4. Verificar integridade
  await verifyDataIntegrity();
}
```

## Casos de Uso Específicos

### Trabalho Offline
- Captura de dados em campo sem conectividade
- Sincronização automática ao retornar à rede
- Indicadores visuais de status offline

### Colaboração Multi-usuário
- Edição simultânea com merge automático
- Notificações de mudanças em tempo real
- Histórico de alterações por usuário

### Migração de Dados
- Versionamento de schema
- Migração automática de dados legados
- Rollback em caso de falha

## Configuração e Debugging

### Configuração
```env
SYNC_BATCH_SIZE=50
SYNC_INTERVAL_MS=5000
CONFLICT_RESOLUTION_STRATEGY=timestamp
OFFLINE_CACHE_LIMIT_MB=100
FIRESTORE_PERSISTENCE=true
```

### Debug Mode
```typescript
const syncManager = new SyncManager({
  debug: true,
  logLevel: 'verbose',
  onConflict: (conflict) => console.warn('Sync conflict:', conflict),
  onError: (error) => console.error('Sync error:', error)
});
```
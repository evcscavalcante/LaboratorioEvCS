import { apiRequest } from "@/lib/queryClient";

interface SyncItem {
  id: string;
  type: 'equipamento' | 'densidade-in-situ' | 'densidade-real' | 'densidade-max-min';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  attempts: number;
  lastError?: string;
}

interface OfflineData {
  equipamentos: any[];
  densidadeInSitu: any[];
  densidadeReal: any[];
  densidadeMaxMin: any[];
  syncQueue: SyncItem[];
  lastSync: number;
}

class OfflineSyncManager {
  private dbName = 'GeotechnicalLabOfflineDB';
  private dbVersion = 2;
  private db: IDBDatabase | null = null;
  private isOnline = navigator.onLine;
  private syncInProgress = false;

  constructor() {
    this.initDB();
    this.setupOnlineListeners();
    // Tentativa de sincronização a cada 30 segundos quando online
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncWithServer();
      }
    }, 30000);
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store para equipamentos
        if (!db.objectStoreNames.contains('equipamentos')) {
          const equipamentosStore = db.createObjectStore('equipamentos', { keyPath: 'id' });
          equipamentosStore.createIndex('codigo', 'codigo', { unique: false });
          equipamentosStore.createIndex('tipo', 'tipo', { unique: false });
          equipamentosStore.createIndex('status', 'status', { unique: false });
        }

        // Store para fila de sincronização
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('type', 'type', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store para metadados
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }

        // Stores para ensaios
        if (!db.objectStoreNames.contains('densidadeInSitu')) {
          const store = db.createObjectStore('densidadeInSitu', { keyPath: 'id' });
          store.createIndex('registrationNumber', 'registrationNumber', { unique: false });
        }

        if (!db.objectStoreNames.contains('densidadeReal')) {
          const store = db.createObjectStore('densidadeReal', { keyPath: 'id' });
          store.createIndex('registrationNumber', 'registrationNumber', { unique: false });
        }

        if (!db.objectStoreNames.contains('densidadeMaxMin')) {
          const store = db.createObjectStore('densidadeMaxMin', { keyPath: 'id' });
          store.createIndex('registrationNumber', 'registrationNumber', { unique: false });
        }
      };
    });
  }

  private setupOnlineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Conexão restaurada - iniciando sincronização...');
      this.syncWithServer();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📱 Modo offline ativado');
    });
  }

  // Salvar equipamento localmente
  async saveEquipamentoOffline(equipamento: any): Promise<void> {
    if (!this.db) await this.initDB();

    const transaction = this.db!.transaction(['equipamentos', 'syncQueue'], 'readwrite');
    const equipamentosStore = transaction.objectStore('equipamentos');
    const syncStore = transaction.objectStore('syncQueue');

    // Salvar equipamento localmente
    await equipamentosStore.put(equipamento);

    // Adicionar à fila de sincronização
    const syncItem: SyncItem = {
      id: crypto.randomUUID(),
      type: 'equipamento',
      action: equipamento.id ? 'update' : 'create',
      data: equipamento,
      timestamp: Date.now(),
      attempts: 0
    };

    await syncStore.put(syncItem);
  }

  // Carregar equipamentos locais
  async loadEquipamentosOffline(): Promise<any[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['equipamentos'], 'readonly');
      const store = transaction.objectStore('equipamentos');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Deletar equipamento localmente
  async deleteEquipamentoOffline(equipamentoId: string): Promise<void> {
    if (!this.db) await this.initDB();

    const transaction = this.db!.transaction(['equipamentos', 'syncQueue'], 'readwrite');
    const equipamentosStore = transaction.objectStore('equipamentos');
    const syncStore = transaction.objectStore('syncQueue');

    // Remover localmente
    await equipamentosStore.delete(equipamentoId);

    // Adicionar à fila de sincronização
    const syncItem: SyncItem = {
      id: crypto.randomUUID(),
      type: 'equipamento',
      action: 'delete',
      data: { id: equipamentoId },
      timestamp: Date.now(),
      attempts: 0
    };

    await syncStore.put(syncItem);
  }

  // Sincronizar com servidor
  async syncWithServer(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;
    console.log('🔄 Iniciando sincronização...');

    try {
      await this.initDB();
      
      // 1. Baixar dados do servidor primeiro
      await this.downloadFromServer();
      
      // 2. Enviar dados pendentes para o servidor
      await this.uploadPendingChanges();
      
      console.log('✅ Sincronização concluída');
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async downloadFromServer(): Promise<void> {
    try {
      // Baixar equipamentos do servidor
      const response = await apiRequest('GET', '/api/equipamentos');
      const equipamentos = await response.json();

      if (equipamentos && Array.isArray(equipamentos)) {
        const transaction = this.db!.transaction(['equipamentos'], 'readwrite');
        const store = transaction.objectStore('equipamentos');
        
        // Atualizar dados locais com dados do servidor
        for (const equipamento of equipamentos) {
          await store.put(equipamento);
        }
      }
    } catch (error) {
      console.error('Erro ao baixar equipamentos:', error);
    }
  }

  private async uploadPendingChanges(): Promise<void> {
    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const syncStore = transaction.objectStore('syncQueue');
    const request = syncStore.getAll();

    request.onsuccess = async () => {
      const pendingItems = request.result;
      
      for (const item of pendingItems) {
        try {
          await this.syncItem(item);
          // Remover da fila após sucesso
          await syncStore.delete(item.id);
        } catch (error) {
          // Incrementar tentativas e atualizar erro
          item.attempts++;
          item.lastError = error instanceof Error ? error.message : 'Erro desconhecido';
          
          // Remover após 5 tentativas falhadas
          if (item.attempts >= 5) {
            console.error(`Item removido após 5 tentativas: ${item.id}`);
            await syncStore.delete(item.id);
          } else {
            await syncStore.put(item);
          }
        }
      }
    };
  }

  private async syncItem(item: SyncItem): Promise<void> {
    switch (item.type) {
      case 'equipamento':
        await this.syncEquipamento(item);
        break;
      case 'densidade-in-situ':
        await this.syncDensidadeInSitu(item);
        break;
      // Adicionar outros tipos conforme necessário
    }
  }

  private async syncEquipamento(item: SyncItem): Promise<void> {
    switch (item.action) {
      case 'create':
        await apiRequest('POST', '/api/equipamentos', item.data);
        break;
      case 'update':
        await apiRequest('PUT', `/api/equipamentos/${item.data.id}`, item.data);
        break;
      case 'delete':
        await apiRequest('DELETE', `/api/equipamentos/${item.data.id}`);
        break;
    }
  }

  private async syncDensidadeInSitu(item: SyncItem): Promise<void> {
    switch (item.action) {
      case 'create':
        await apiRequest('POST', '/api/tests/density-in-situ', item.data);
        break;
      case 'update':
        await apiRequest('PUT', `/api/tests/density-in-situ/${item.data.id}`, item.data);
        break;
      case 'delete':
        await apiRequest('DELETE', `/api/tests/density-in-situ/${item.data.id}`);
        break;
    }
  }

  // Verificar status de sincronização
  async getSyncStatus(): Promise<{ pending: number; lastSync: Date | null }> {
    if (!this.db) await this.initDB();

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['syncQueue', 'metadata'], 'readonly');
      const syncStore = transaction.objectStore('syncQueue');
      const metaStore = transaction.objectStore('metadata');

      const pendingRequest = syncStore.count();
      const lastSyncRequest = metaStore.get('lastSync');

      let pending = 0;
      let lastSync: Date | null = null;

      pendingRequest.onsuccess = () => {
        pending = pendingRequest.result;
      };

      lastSyncRequest.onsuccess = () => {
        if (lastSyncRequest.result) {
          lastSync = new Date(lastSyncRequest.result.value);
        }
      };

      transaction.oncomplete = () => {
        resolve({ pending, lastSync });
      };
    });
  }

  // Forçar sincronização manual
  async forcSync(): Promise<void> {
    if (this.isOnline) {
      await this.syncWithServer();
    } else {
      throw new Error('Sem conexão com a internet');
    }
  }

  // Limpar dados locais (usar com cuidado)
  async clearLocalData(): Promise<void> {
    if (!this.db) await this.initDB();

    const transaction = this.db!.transaction(['equipamentos', 'syncQueue', 'metadata'], 'readwrite');
    
    await transaction.objectStore('equipamentos').clear();
    await transaction.objectStore('syncQueue').clear();
    await transaction.objectStore('metadata').clear();
  }

  get connectionStatus() {
    return this.isOnline;
  }

  get isSyncing() {
    return this.syncInProgress;
  }
}

export const offlineSyncManager = new OfflineSyncManager();
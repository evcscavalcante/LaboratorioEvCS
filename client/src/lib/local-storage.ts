// Sistema de armazenamento local com IndexedDB para dados offline
interface LocalStorageDB {
  densityInSitu: any[];
  densityReal: any[];
  densityMaxMin: any[];
  balanceVerification: any[];
  userPreferences: any;
  syncQueue: any[];
}

class LocalDataManager {
  private dbName = 'GeotechnicalLabDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store para testes de densidade in situ
        if (!db.objectStoreNames.contains('densityInSitu')) {
          const store = db.createObjectStore('densityInSitu', { keyPath: 'id', autoIncrement: true });
          store.createIndex('identificacao', 'identificacao', { unique: false });
          store.createIndex('dataEnsaio', 'dataEnsaio', { unique: false });
          store.createIndex('localizacao', 'localizacao', { unique: false });
        }

        // Store para testes de densidade real
        if (!db.objectStoreNames.contains('densityReal')) {
          const store = db.createObjectStore('densityReal', { keyPath: 'id', autoIncrement: true });
          store.createIndex('identificacao', 'identificacao', { unique: false });
          store.createIndex('dataEnsaio', 'dataEnsaio', { unique: false });
        }

        // Store para testes de densidade máxima e mínima
        if (!db.objectStoreNames.contains('densityMaxMin')) {
          const store = db.createObjectStore('densityMaxMin', { keyPath: 'id', autoIncrement: true });
          store.createIndex('identificacao', 'identificacao', { unique: false });
          store.createIndex('dataEnsaio', 'dataEnsaio', { unique: false });
        }

        // Store para verificações de balança
        if (!db.objectStoreNames.contains('balanceVerification')) {
          const store = db.createObjectStore('balanceVerification', { keyPath: 'id', autoIncrement: true });
          store.createIndex('equipamento', 'equipamento', { unique: false });
          store.createIndex('dataVerificacao', 'dataVerificacao', { unique: false });
        }

        // Store para preferências do usuário
        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'key' });
        }

        // Store para fila de sincronização
        if (!db.objectStoreNames.contains('syncQueue')) {
          const store = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.initDB();
    }
    const transaction = this.db!.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  // Operações CRUD para densidade in situ
  async saveDensityInSitu(data: any): Promise<number> {
    const store = await this.getStore('densityInSitu', 'readwrite');
    const result = await new Promise<IDBValidKey>((resolve, reject) => {
      const request = store.add({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        synced: false
      });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    // Adicionar à fila de sincronização
    await this.addToSyncQueue('densityInSitu', 'create', { id: result, ...data });
    return result as number;
  }

  async getDensityInSituTests(): Promise<any[]> {
    const store = await this.getStore('densityInSitu');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateDensityInSitu(id: number, data: any): Promise<void> {
    const store = await this.getStore('densityInSitu', 'readwrite');
    const existing = await new Promise<any>((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (existing) {
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
        synced: false
      };
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(updated);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      await this.addToSyncQueue('densityInSitu', 'update', updated);
    }
  }

  async deleteDensityInSitu(id: number): Promise<void> {
    const store = await this.getStore('densityInSitu', 'readwrite');
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    await this.addToSyncQueue('densityInSitu', 'delete', { id });
  }

  // Operações similares para densidade real
  async saveDensityReal(data: any): Promise<number> {
    const store = await this.getStore('densityReal', 'readwrite');
    const result = await new Promise<IDBValidKey>((resolve, reject) => {
      const request = store.add({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        synced: false
      });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    await this.addToSyncQueue('densityReal', 'create', { id: result, ...data });
    return result as number;
  }

  async getDensityRealTests(): Promise<any[]> {
    const store = await this.getStore('densityReal');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Operações para densidade máxima e mínima
  async saveDensityMaxMin(data: any): Promise<number> {
    const store = await this.getStore('densityMaxMin', 'readwrite');
    const result = await new Promise<IDBValidKey>((resolve, reject) => {
      const request = store.add({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        synced: false
      });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    await this.addToSyncQueue('densityMaxMin', 'create', { id: result, ...data });
    return result as number;
  }

  async getDensityMaxMinTests(): Promise<any[]> {
    const store = await this.getStore('densityMaxMin');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Operações para verificações de balança
  async saveBalanceVerification(data: any): Promise<number> {
    const store = await this.getStore('balanceVerification', 'readwrite');
    const result = await new Promise<IDBValidKey>((resolve, reject) => {
      const request = store.add({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        synced: false
      });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    await this.addToSyncQueue('balanceVerification', 'create', { id: result, ...data });
    return result as number;
  }

  async getBalanceVerifications(): Promise<any[]> {
    const store = await this.getStore('balanceVerification');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Gerenciamento de preferências do usuário
  async saveUserPreference(key: string, value: any): Promise<void> {
    const store = await this.getStore('userPreferences', 'readwrite');
    await new Promise<void>((resolve, reject) => {
      const request = store.put({ key, value, updatedAt: new Date() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUserPreference(key: string): Promise<any> {
    const store = await this.getStore('userPreferences');
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }

  // Fila de sincronização
  private async addToSyncQueue(type: string, operation: string, data: any): Promise<void> {
    const store = await this.getStore('syncQueue', 'readwrite');
    await new Promise<void>((resolve, reject) => {
      const request = store.add({
        type,
        operation,
        data,
        timestamp: new Date(),
        attempts: 0,
        maxAttempts: 3
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSyncQueue(): Promise<any[]> {
    const store = await this.getStore('syncQueue');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearSyncQueue(): Promise<void> {
    const store = await this.getStore('syncQueue', 'readwrite');
    await new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async removeSyncQueueItem(id: number): Promise<void> {
    const store = await this.getStore('syncQueue', 'readwrite');
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Backup completo dos dados
  async createBackup(): Promise<string> {
    const densityInSitu = await this.getDensityInSituTests();
    const densityReal = await this.getDensityRealTests();
    const densityMaxMin = await this.getDensityMaxMinTests();
    const balanceVerifications = await this.getBalanceVerifications();

    const backup = {
      version: this.dbVersion,
      timestamp: new Date().toISOString(),
      data: {
        densityInSitu,
        densityReal,
        densityMaxMin,
        balanceVerifications
      }
    };

    return JSON.stringify(backup, null, 2);
  }

  async downloadBackup(): Promise<void> {
    const backupData = await this.createBackup();
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-laboratorio-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Restaurar backup
  async restoreBackup(backupData: string): Promise<void> {
    try {
      const backup = JSON.parse(backupData);
      
      if (!backup.data) {
        throw new Error('Formato de backup inválido');
      }

      // Limpar dados existentes
      await this.clearAllData();

      // Restaurar dados
      if (backup.data.densityInSitu) {
        for (const item of backup.data.densityInSitu) {
          const { id, ...data } = item;
          await this.saveDensityInSitu(data);
        }
      }

      if (backup.data.densityReal) {
        for (const item of backup.data.densityReal) {
          const { id, ...data } = item;
          await this.saveDensityReal(data);
        }
      }

      if (backup.data.densityMaxMin) {
        for (const item of backup.data.densityMaxMin) {
          const { id, ...data } = item;
          await this.saveDensityMaxMin(data);
        }
      }

      if (backup.data.balanceVerifications) {
        for (const item of backup.data.balanceVerifications) {
          const { id, ...data } = item;
          await this.saveBalanceVerification(data);
        }
      }

    } catch (error) {
      throw new Error(`Erro ao restaurar backup: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  private async clearAllData(): Promise<void> {
    const stores = ['densityInSitu', 'densityReal', 'densityMaxMin', 'balanceVerification'];
    
    for (const storeName of stores) {
      const store = await this.getStore(storeName, 'readwrite');
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  // Estatísticas dos dados
  async getDataStatistics(): Promise<any> {
    const densityInSitu = await this.getDensityInSituTests();
    const densityReal = await this.getDensityRealTests();
    const densityMaxMin = await this.getDensityMaxMinTests();
    const balanceVerifications = await this.getBalanceVerifications();

    return {
      totalTests: densityInSitu.length + densityReal.length + densityMaxMin.length,
      densityInSituCount: densityInSitu.length,
      densityRealCount: densityReal.length,
      densityMaxMinCount: densityMaxMin.length,
      balanceVerificationCount: balanceVerifications.length,
      lastUpdate: new Date().toISOString(),
      storageUsed: await this.calculateStorageUsed()
    };
  }

  private async calculateStorageUsed(): Promise<number> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  }

  // Métodos para gestão de cápsulas
  async getCapsulas(): Promise<any[]> {
    try {
      const data = localStorage.getItem('capsulas');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar cápsulas:', error);
      return [];
    }
  }

  async createCapsula(capsula: any): Promise<any> {
    try {
      const capsulas = await this.getCapsulas();
      const newCapsula = {
        ...capsula,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      capsulas.push(newCapsula);
      localStorage.setItem('capsulas', JSON.stringify(capsulas));
      return newCapsula;
    } catch (error) {
      console.error('Erro ao criar cápsula:', error);
      throw error;
    }
  }

  // Métodos para gestão de cilindros
  async getCilindros(): Promise<any[]> {
    try {
      const data = localStorage.getItem('cilindros');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar cilindros:', error);
      return [];
    }
  }

  async createCilindro(cilindro: any): Promise<any> {
    try {
      const cilindros = await this.getCilindros();
      const newCilindro = {
        ...cilindro,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      cilindros.push(newCilindro);
      localStorage.setItem('cilindros', JSON.stringify(cilindros));
      return newCilindro;
    } catch (error) {
      console.error('Erro ao criar cilindro:', error);
      throw error;
    }
  }

  // Métodos para conferências de equipamentos
  async getConferenciasEquipamentos(): Promise<any[]> {
    try {
      const data = localStorage.getItem('conferenciasEquipamentos');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar conferências:', error);
      return [];
    }
  }

  async createConferenciaEquipamento(conferencia: any): Promise<any> {
    try {
      const conferencias = await this.getConferenciasEquipamentos();
      const newConferencia = {
        ...conferencia,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      conferencias.push(newConferencia);
      localStorage.setItem('conferenciasEquipamentos', JSON.stringify(conferencias));
      return newConferencia;
    } catch (error) {
      console.error('Erro ao criar conferência:', error);
      throw error;
    }
  }
}

// Singleton instance
export const localDataManager = new LocalDataManager();

// Inicializar automaticamente
localDataManager.initDB().catch(console.error);

export default localDataManager;
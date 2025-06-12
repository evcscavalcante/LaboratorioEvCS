import { apiRequest } from "@/lib/queryClient";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração Firebase (já existente no projeto)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

interface TripleSyncItem {
  id: string;
  type: 'equipamento' | 'densidade-in-situ' | 'densidade-real' | 'densidade-max-min';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  userId?: string;
  synced: {
    indexeddb: boolean;
    postgresql: boolean;
    firebase: boolean;
  };
  attempts: {
    postgresql: number;
    firebase: number;
  };
  lastError?: {
    postgresql?: string;
    firebase?: string;
  };
}

class TripleSyncManager {
  private dbName = 'GeotechnicalLabTripleDB';
  private dbVersion = 3;
  private indexedDB: IDBDatabase | null = null;
  private isOnline = navigator.onLine;
  private syncInProgress = false;
  private currentUser: string | null = null;

  constructor() {
    this.initIndexedDB();
    this.setupOnlineListeners();
    this.setupFirebaseAuth();
    // Sincronização automática a cada 15 segundos
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncAll();
      }
    }, 15000);
  }

  private async initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.indexedDB = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store principal para dados
        if (!db.objectStoreNames.contains('equipamentos')) {
          const equipamentosStore = db.createObjectStore('equipamentos', { keyPath: 'id' });
          equipamentosStore.createIndex('codigo', 'codigo', { unique: false });
          equipamentosStore.createIndex('tipo', 'tipo', { unique: false });
          equipamentosStore.createIndex('userId', 'userId', { unique: false });
        }

        // Store para fila de sincronização
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('type', 'type', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('userId', 'userId', { unique: false });
        }

        // Stores para ensaios
        ['densidadeInSitu', 'densidadeReal', 'densidadeMaxMin'].forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('registrationNumber', 'registrationNumber', { unique: false });
            store.createIndex('userId', 'userId', { unique: false });
          }
        });

        // Store para metadados
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  private setupOnlineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Conexão restaurada - sincronizando com todas as fontes...');
      this.syncAll();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📱 Modo offline - salvando apenas localmente');
    });
  }

  private setupFirebaseAuth() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user?.uid || null;
      if (user) {
        console.log('🔐 Usuário autenticado - habilitando sincronização Firebase');
        this.syncAll();
      }
    });
  }

  // SALVAMENTO TRIPLO - Função principal
  async saveEquipamento(equipamento: any): Promise<void> {
    const syncItem: TripleSyncItem = {
      id: crypto.randomUUID(),
      type: 'equipamento',
      action: equipamento.id ? 'update' : 'create',
      data: {
        ...equipamento,
        id: equipamento.id || crypto.randomUUID(),
        userId: this.currentUser,
        updatedAt: new Date().toISOString()
      },
      timestamp: Date.now(),
      userId: this.currentUser || undefined,
      synced: {
        indexeddb: false,
        postgresql: false,
        firebase: false
      },
      attempts: {
        postgresql: 0,
        firebase: 0
      }
    };

    // 1. SALVAR NO INDEXEDDB (sempre primeiro)
    await this.saveToIndexedDB(syncItem);
    
    // 2. TENTAR POSTGRESQL (se online)
    if (this.isOnline) {
      await this.saveToPostgreSQL(syncItem);
    }
    
    // 3. TENTAR FIREBASE (se autenticado e online)
    if (this.isOnline && this.currentUser) {
      await this.saveToFirebase(syncItem);
    }

    // 4. ADICIONAR À FILA DE SINCRONIZAÇÃO SE NECESSÁRIO
    const needsSync = !syncItem.synced.postgresql || !syncItem.synced.firebase;
    if (needsSync) {
      await this.addToSyncQueue(syncItem);
    }
  }

  // Salvar no IndexedDB
  private async saveToIndexedDB(syncItem: TripleSyncItem): Promise<void> {
    try {
      if (!this.indexedDB) await this.initIndexedDB();

      const transaction = this.indexedDB!.transaction(['equipamentos'], 'readwrite');
      const store = transaction.objectStore('equipamentos');
      
      await store.put(syncItem.data);
      syncItem.synced.indexeddb = true;
      
      console.log('✅ Salvo no IndexedDB:', syncItem.data.codigo);
    } catch (error) {
      console.error('❌ Erro IndexedDB:', error);
      throw error;
    }
  }

  // Salvar no PostgreSQL
  private async saveToPostgreSQL(syncItem: TripleSyncItem): Promise<void> {
    try {
      const endpoint = syncItem.action === 'create' ? '/api/equipamentos' : `/api/equipamentos/${syncItem.data.id}`;
      const method = syncItem.action === 'create' ? 'POST' : 'PUT';
      
      await apiRequest(method, endpoint, syncItem.data);
      syncItem.synced.postgresql = true;
      
      console.log('✅ Salvo no PostgreSQL:', syncItem.data.codigo);
    } catch (error) {
      console.error('❌ Erro PostgreSQL:', error);
      syncItem.attempts.postgresql++;
      syncItem.lastError = { ...syncItem.lastError, postgresql: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  // Salvar no Firebase
  private async saveToFirebase(syncItem: TripleSyncItem): Promise<void> {
    try {
      if (!this.currentUser) throw new Error('Usuário não autenticado');

      const userCollection = collection(db, 'users', this.currentUser, 'equipamentos');
      const docRef = doc(userCollection, syncItem.data.id);
      
      await setDoc(docRef, {
        ...syncItem.data,
        firebaseSync: true,
        lastFirebaseUpdate: new Date().toISOString()
      });
      
      syncItem.synced.firebase = true;
      console.log('✅ Salvo no Firebase:', syncItem.data.codigo);
    } catch (error) {
      console.error('❌ Erro Firebase:', error);
      syncItem.attempts.firebase++;
      syncItem.lastError = { ...syncItem.lastError, firebase: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  // Adicionar à fila de sincronização
  private async addToSyncQueue(syncItem: TripleSyncItem): Promise<void> {
    if (!this.indexedDB) await this.initIndexedDB();

    const transaction = this.indexedDB!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    await store.put(syncItem);
  }

  // CARREGAMENTO INTELIGENTE - Prioridade: PostgreSQL > Firebase > IndexedDB
  async loadEquipamentos(): Promise<any[]> {
    try {
      // 1. TENTAR POSTGRESQL PRIMEIRO (dados mais atualizados)
      if (this.isOnline) {
        try {
          const response = await apiRequest('GET', '/api/equipamentos');
          const equipamentos = await response.json();
          
          if (equipamentos && Array.isArray(equipamentos)) {
            // Salvar no IndexedDB para cache
            await this.cacheToIndexedDB(equipamentos);
            console.log('📡 Dados carregados do PostgreSQL');
            return equipamentos;
          }
        } catch (error) {
          console.warn('⚠️ PostgreSQL indisponível, tentando Firebase...');
        }
      }

      // 2. TENTAR FIREBASE SE POSTGRESQL FALHAR
      if (this.isOnline && this.currentUser) {
        try {
          const equipamentos = await this.loadFromFirebase();
          if (equipamentos.length > 0) {
            await this.cacheToIndexedDB(equipamentos);
            console.log('🔥 Dados carregados do Firebase');
            return equipamentos;
          }
        } catch (error) {
          console.warn('⚠️ Firebase indisponível, usando cache local...');
        }
      }

      // 3. USAR INDEXEDDB COMO ÚLTIMO RECURSO
      const equipamentos = await this.loadFromIndexedDB();
      console.log('💾 Dados carregados do cache local');
      return equipamentos;

    } catch (error) {
      console.error('❌ Erro ao carregar equipamentos:', error);
      return [];
    }
  }

  private async loadFromFirebase(): Promise<any[]> {
    if (!this.currentUser) return [];

    const userCollection = collection(db, 'users', this.currentUser, 'equipamentos');
    const snapshot = await getDocs(userCollection);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  private async loadFromIndexedDB(): Promise<any[]> {
    if (!this.indexedDB) await this.initIndexedDB();

    return new Promise((resolve, reject) => {
      const transaction = this.indexedDB!.transaction(['equipamentos'], 'readonly');
      const store = transaction.objectStore('equipamentos');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  private async cacheToIndexedDB(equipamentos: any[]): Promise<void> {
    if (!this.indexedDB) await this.initIndexedDB();

    const transaction = this.indexedDB!.transaction(['equipamentos'], 'readwrite');
    const store = transaction.objectStore('equipamentos');
    
    for (const equipamento of equipamentos) {
      await store.put(equipamento);
    }
  }

  // EXCLUSÃO TRIPLA
  async deleteEquipamento(equipamentoId: string): Promise<void> {
    const syncItem: TripleSyncItem = {
      id: crypto.randomUUID(),
      type: 'equipamento',
      action: 'delete',
      data: { id: equipamentoId },
      timestamp: Date.now(),
      userId: this.currentUser || undefined,
      synced: {
        indexeddb: false,
        postgresql: false,
        firebase: false
      },
      attempts: {
        postgresql: 0,
        firebase: 0
      }
    };

    // 1. REMOVER DO INDEXEDDB
    await this.deleteFromIndexedDB(equipamentoId);
    syncItem.synced.indexeddb = true;

    // 2. REMOVER DO POSTGRESQL
    if (this.isOnline) {
      await this.deleteFromPostgreSQL(equipamentoId, syncItem);
    }

    // 3. REMOVER DO FIREBASE
    if (this.isOnline && this.currentUser) {
      await this.deleteFromFirebase(equipamentoId, syncItem);
    }

    // 4. ADICIONAR À FILA SE NECESSÁRIO
    const needsSync = !syncItem.synced.postgresql || !syncItem.synced.firebase;
    if (needsSync) {
      await this.addToSyncQueue(syncItem);
    }
  }

  private async deleteFromIndexedDB(equipamentoId: string): Promise<void> {
    if (!this.indexedDB) await this.initIndexedDB();

    const transaction = this.indexedDB!.transaction(['equipamentos'], 'readwrite');
    const store = transaction.objectStore('equipamentos');
    
    await store.delete(equipamentoId);
  }

  private async deleteFromPostgreSQL(equipamentoId: string, syncItem: TripleSyncItem): Promise<void> {
    try {
      await apiRequest('DELETE', `/api/equipamentos/${equipamentoId}`);
      syncItem.synced.postgresql = true;
    } catch (error) {
      syncItem.attempts.postgresql++;
      syncItem.lastError = { ...syncItem.lastError, postgresql: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  private async deleteFromFirebase(equipamentoId: string, syncItem: TripleSyncItem): Promise<void> {
    try {
      if (!this.currentUser) throw new Error('Usuário não autenticado');

      const docRef = doc(db, 'users', this.currentUser, 'equipamentos', equipamentoId);
      await deleteDoc(docRef);
      syncItem.synced.firebase = true;
    } catch (error) {
      syncItem.attempts.firebase++;
      syncItem.lastError = { ...syncItem.lastError, firebase: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  // SINCRONIZAÇÃO COMPLETA
  async syncAll(): Promise<void> {
    if (this.syncInProgress) return;

    this.syncInProgress = true;
    console.log('🔄 Iniciando sincronização tripla...');

    try {
      await this.initIndexedDB();
      await this.processSyncQueue();
      console.log('✅ Sincronização tripla concluída');
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processSyncQueue(): Promise<void> {
    if (!this.indexedDB) return;

    const transaction = this.indexedDB.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    const request = store.getAll();

    request.onsuccess = async () => {
      const pendingItems = request.result;
      
      for (const item of pendingItems) {
        let completed = true;

        // Tentar PostgreSQL se necessário
        if (!item.synced.postgresql && this.isOnline) {
          if (item.action === 'delete') {
            await this.deleteFromPostgreSQL(item.data.id, item);
          } else {
            await this.saveToPostgreSQL(item);
          }
        }

        // Tentar Firebase se necessário
        if (!item.synced.firebase && this.isOnline && this.currentUser) {
          if (item.action === 'delete') {
            await this.deleteFromFirebase(item.data.id, item);
          } else {
            await this.saveToFirebase(item);
          }
        }

        // Verificar se ainda há pendências
        completed = item.synced.postgresql && item.synced.firebase;

        if (completed) {
          await store.delete(item.id);
          console.log('✅ Item sincronizado removido da fila');
        } else {
          // Atualizar tentativas
          if (item.attempts.postgresql >= 5 && item.attempts.firebase >= 5) {
            console.error('❌ Item removido após muitas tentativas:', item.id);
            await store.delete(item.id);
          } else {
            await store.put(item);
          }
        }
      }
    };
  }

  // STATUS DO SISTEMA
  async getSystemStatus(): Promise<{
    online: boolean;
    authenticated: boolean;
    pendingSync: number;
    lastSync: Date | null;
    storageHealth: {
      indexedDB: boolean;
      postgresql: boolean;
      firebase: boolean;
    };
  }> {
    const pending = await this.getPendingSyncCount();
    
    return {
      online: this.isOnline,
      authenticated: !!this.currentUser,
      pendingSync: pending,
      lastSync: new Date(), // Simplificado
      storageHealth: {
        indexedDB: !!this.indexedDB,
        postgresql: this.isOnline,
        firebase: this.isOnline && !!this.currentUser
      }
    };
  }

  private async getPendingSyncCount(): Promise<number> {
    if (!this.indexedDB) await this.initIndexedDB();

    return new Promise((resolve) => {
      const transaction = this.indexedDB!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.count();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(0);
    });
  }

  // LIMPEZA DE EMERGÊNCIA
  async emergencyClean(): Promise<void> {
    if (!this.indexedDB) await this.initIndexedDB();

    const transaction = this.indexedDB!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    await store.clear();
    console.log('🧹 Fila de sincronização limpa');
  }

  // BACKUP MANUAL
  async createBackup(): Promise<any> {
    const equipamentos = await this.loadFromIndexedDB();
    const backup = {
      timestamp: new Date().toISOString(),
      equipamentos,
      metadata: {
        version: this.dbVersion,
        userAgent: navigator.userAgent
      }
    };

    // Salvar backup no Firebase se possível
    if (this.currentUser && this.isOnline) {
      const backupRef = doc(db, 'users', this.currentUser, 'backups', backup.timestamp);
      await setDoc(backupRef, backup);
    }

    return backup;
  }

  get connectionStatus() {
    return {
      online: this.isOnline,
      authenticated: !!this.currentUser,
      syncing: this.syncInProgress
    };
  }
}

export const tripleSyncManager = new TripleSyncManager();
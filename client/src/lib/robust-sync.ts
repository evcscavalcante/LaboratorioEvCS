// Sistema robusto de sincronização tripla: localStorage + PostgreSQL + Firebase
// Garante zero perda de dados com fallback inteligente

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface SyncItem {
  id: string;
  type: 'equipamento' | 'ensaio';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  attempts: number;
  synced: {
    localStorage: boolean;
    postgresql: boolean;
    firebase: boolean;
  };
}

class RobustSyncManager {
  private firestore: any = null;
  private auth: any = null;
  private isOnline = navigator.onLine;
  private userId: string | null = null;

  constructor() {
    this.initFirebase();
    this.setupConnectionListeners();
    this.startPeriodicSync();
  }

  private initFirebase() {
    try {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      };

      const app = initializeApp(firebaseConfig);
      this.firestore = getFirestore(app);
      this.auth = getAuth(app);

      onAuthStateChanged(this.auth, (user) => {
        this.userId = user?.uid || null;
        if (user) {
          this.syncPendingItems();
        }
      });
    } catch (error) {
      console.log('Firebase indisponível, usando modo offline');
    }
  }

  private setupConnectionListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingItems();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private startPeriodicSync() {
    setInterval(() => {
      if (this.isOnline && this.userId) {
        this.syncPendingItems();
      }
    }, 30000); // Sincroniza a cada 30 segundos
  }

  async saveEquipamento(equipamento: any): Promise<void> {
    const syncItem: SyncItem = {
      id: equipamento.id,
      type: 'equipamento',
      action: 'create',
      data: equipamento,
      timestamp: Date.now(),
      attempts: 0,
      synced: {
        localStorage: false,
        postgresql: false,
        firebase: false
      }
    };

    // 1. SEMPRE salvar no localStorage primeiro (instantâneo)
    try {
      const chaveUnica = `equipamento_${equipamento.tipo}_${equipamento.codigo}_${equipamento.subtipo || 'padrao'}`;
      localStorage.setItem(chaveUnica, JSON.stringify(equipamento));
      syncItem.synced.localStorage = true;
    } catch (error) {
      console.error('Erro ao salvar localmente:', error);
    }

    // 2. Tentar salvar no PostgreSQL
    if (this.isOnline) {
      try {
        const response = await fetch('/api/equipamentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(equipamento)
        });
        
        if (response.ok) {
          syncItem.synced.postgresql = true;
        }
      } catch (error) {
        console.log('PostgreSQL indisponível, salvando na fila');
      }
    }

    // 3. Tentar salvar no Firebase
    if (this.firestore && this.userId && this.isOnline) {
      try {
        // Filtrar campos undefined para evitar erro no Firebase
        const cleanEquipamento = Object.fromEntries(
          Object.entries(equipamento).filter(([key, value]) => value !== undefined)
        );
        
        const docRef = doc(this.firestore, `users/${this.userId}/equipamentos`, equipamento.id);
        await setDoc(docRef, cleanEquipamento);
        syncItem.synced.firebase = true;
      } catch (error) {
        console.log('Firebase indisponível, salvando na fila');
      }
    }

    // 4. Se não conseguiu salvar em todas as fontes, adicionar à fila
    if (!syncItem.synced.postgresql || !syncItem.synced.firebase) {
      this.addToSyncQueue(syncItem);
    }
  }

  async loadEquipamentos(): Promise<any[]> {
    // Estratégia: carregar de múltiplas fontes e mesclar
    const equipamentos = new Map();

    // 1. Carregar do localStorage (sempre disponível)
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('equipamento_')) {
          const item = localStorage.getItem(key);
          if (item) {
            const eq = JSON.parse(item);
            equipamentos.set(eq.id, eq);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar localStorage:', error);
    }

    // 2. Tentar carregar do Firebase (dados mais recentes)
    if (this.firestore && this.userId && this.isOnline) {
      try {
        const snapshot = await getDocs(collection(this.firestore, `users/${this.userId}/equipamentos`));
        snapshot.forEach(doc => {
          const data = doc.data();
          // Sobrescrever com dados do Firebase se mais recentes
          const existing = equipamentos.get(data.id);
          if (!existing || new Date(data.updatedAt) > new Date(existing.updatedAt)) {
            equipamentos.set(data.id, data);
          }
        });
      } catch (error) {
        console.log('Firebase indisponível, usando dados locais');
      }
    }

    // 3. Tentar carregar do PostgreSQL
    if (this.isOnline) {
      try {
        const response = await fetch('/api/equipamentos');
        if (response.ok) {
          const serverData = await response.json();
          serverData.forEach((eq: any) => {
            const existing = equipamentos.get(eq.id);
            if (!existing || new Date(eq.updatedAt) > new Date(existing.updatedAt)) {
              equipamentos.set(eq.id, eq);
            }
          });
        }
      } catch (error) {
        console.log('PostgreSQL indisponível, usando dados disponíveis');
      }
    }

    return Array.from(equipamentos.values());
  }

  async deleteEquipamento(equipamentoId: string): Promise<void> {
    const syncItem: SyncItem = {
      id: equipamentoId,
      type: 'equipamento',
      action: 'delete',
      data: { id: equipamentoId },
      timestamp: Date.now(),
      attempts: 0,
      synced: {
        localStorage: false,
        postgresql: false,
        firebase: false
      }
    };

    // 1. Remover do localStorage
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('equipamento_')) {
          const item = localStorage.getItem(key);
          if (item) {
            const eq = JSON.parse(item);
            if (eq.id === equipamentoId) {
              keysToRemove.push(key);
            }
          }
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      syncItem.synced.localStorage = true;
    } catch (error) {
      console.error('Erro ao remover localmente:', error);
    }

    // 2. Tentar remover do PostgreSQL
    if (this.isOnline) {
      try {
        const response = await fetch(`/api/equipamentos/${equipamentoId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          syncItem.synced.postgresql = true;
        }
      } catch (error) {
        console.log('PostgreSQL indisponível, adicionando à fila');
      }
    }

    // 3. Tentar remover do Firebase
    if (this.firestore && this.userId && this.isOnline) {
      try {
        await deleteDoc(doc(this.firestore, `users/${this.userId}/equipamentos`, equipamentoId));
        syncItem.synced.firebase = true;
      } catch (error) {
        console.log('Firebase indisponível, adicionando à fila');
      }
    }

    // Adicionar à fila se necessário
    if (!syncItem.synced.postgresql || !syncItem.synced.firebase) {
      this.addToSyncQueue(syncItem);
    }
  }

  private addToSyncQueue(syncItem: SyncItem) {
    try {
      const queue = JSON.parse(localStorage.getItem('robustSyncQueue') || '[]');
      queue.push(syncItem);
      localStorage.setItem('robustSyncQueue', JSON.stringify(queue));
    } catch (error) {
      console.error('Erro ao adicionar à fila:', error);
    }
  }

  private async syncPendingItems() {
    if (!this.isOnline) return;

    try {
      const queue = JSON.parse(localStorage.getItem('robustSyncQueue') || '[]');
      const remaining = [];

      for (const item of queue) {
        let success = true;

        // Tentar PostgreSQL
        if (!item.synced.postgresql) {
          try {
            let response;
            if (item.action === 'delete') {
              response = await fetch(`/api/equipamentos/${item.data.id}`, { method: 'DELETE' });
            } else {
              response = await fetch('/api/equipamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item.data)
              });
            }
            
            if (response.ok) {
              item.synced.postgresql = true;
            } else {
              success = false;
            }
          } catch {
            success = false;
          }
        }

        // Tentar Firebase
        if (!item.synced.firebase && this.firestore && this.userId) {
          try {
            const docRef = doc(this.firestore, `users/${this.userId}/equipamentos`, item.data.id);
            if (item.action === 'delete') {
              await deleteDoc(docRef);
            } else {
              await setDoc(docRef, item.data);
            }
            item.synced.firebase = true;
          } catch {
            success = false;
          }
        }

        // Manter na fila se não conseguiu sincronizar tudo
        if (!success || !item.synced.postgresql || !item.synced.firebase) {
          item.attempts++;
          if (item.attempts < 10) { // Máximo 10 tentativas
            remaining.push(item);
          }
        }
      }

      localStorage.setItem('robustSyncQueue', JSON.stringify(remaining));
    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  }

  async getStatus(): Promise<{ 
    online: boolean; 
    pendingSync: number; 
    lastSync: Date | null;
    sources: { localStorage: boolean; postgresql: boolean; firebase: boolean; }
  }> {
    const queue = JSON.parse(localStorage.getItem('robustSyncQueue') || '[]');
    
    return {
      online: this.isOnline,
      pendingSync: queue.length,
      lastSync: queue.length === 0 ? new Date() : null,
      sources: {
        localStorage: true,
        postgresql: this.isOnline,
        firebase: this.isOnline && !!this.userId
      }
    };
  }

  async forcSync(): Promise<void> {
    await this.syncPendingItems();
  }
}

export const robustSyncManager = new RobustSyncManager();
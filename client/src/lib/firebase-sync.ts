// Sistema de sincronização Firebase para equipamentos entre dispositivos
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';

interface FirebaseEquipamento {
  id: string;
  codigo: string;
  tipo: 'capsula' | 'cilindro';
  subtipo?: string;
  peso?: number;
  volume?: number;
  altura?: number;
  status: 'ativo' | 'inativo';
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

class FirebaseSyncManager {
  private firestore: any = null;
  private auth: any = null;
  private currentUser: User | null = null;
  private listeners: Array<() => void> = [];

  constructor() {
    this.initFirebase();
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

      // Verificar se já existe uma instância
      let app;
      try {
        app = initializeApp(firebaseConfig, 'equipamentos-sync');
      } catch (error: any) {
        if (error.code === 'app/duplicate-app') {
          // Usar a instância existente
          app = initializeApp(firebaseConfig);
        } else {
          throw error;
        }
      }
      
      this.firestore = getFirestore(app);
      this.auth = getAuth(app);

      onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        if (user) {
          console.log('✅ Firebase autenticado:', user.email);
          this.syncFromFirebase();
          // Notificar componentes sobre mudança de autenticação
          window.dispatchEvent(new CustomEvent('firebase-auth-changed', { detail: { authenticated: true, user } }));
        } else {
          console.log('❌ Firebase não autenticado');
          window.dispatchEvent(new CustomEvent('firebase-auth-changed', { detail: { authenticated: false, user: null } }));
        }
      });
    } catch (error) {
      console.error('Erro ao inicializar Firebase:', error);
    }
  }

  async authenticateWithEmail(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('✅ Autenticado no Firebase:', userCredential.user.email);
      return true;
    } catch (error) {
      console.error('Erro na autenticação Firebase:', error);
      return false;
    }
  }

  async saveEquipamento(equipamento: FirebaseEquipamento): Promise<boolean> {
    if (!this.currentUser || !this.firestore) {
      console.log('Firebase não disponível, salvando apenas localmente');
      return false;
    }

    try {
      const equipamentoData = {
        ...equipamento,
        userId: this.currentUser.uid,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(this.firestore, 'equipamentos', equipamento.id), equipamentoData);
      console.log('✅ Equipamento salvo no Firebase:', equipamento.codigo);
      return true;
    } catch (error) {
      console.error('Erro ao salvar no Firebase:', error);
      return false;
    }
  }

  async loadEquipamentos(): Promise<FirebaseEquipamento[]> {
    if (!this.currentUser || !this.firestore) {
      return [];
    }

    try {
      const q = query(
        collection(this.firestore, 'equipamentos'),
        orderBy('updatedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const equipamentos: FirebaseEquipamento[] = [];

      snapshot.forEach(doc => {
        const data = doc.data() as FirebaseEquipamento;
        // Apenas equipamentos do usuário atual
        if (data.userId === this.currentUser?.uid) {
          equipamentos.push(data);
        }
      });

      console.log(`✅ Carregados ${equipamentos.length} equipamentos do Firebase`);
      return equipamentos;
    } catch (error) {
      console.error('Erro ao carregar do Firebase:', error);
      return [];
    }
  }

  async deleteEquipamento(equipamentoId: string): Promise<boolean> {
    if (!this.currentUser || !this.firestore) {
      return false;
    }

    try {
      await deleteDoc(doc(this.firestore, 'equipamentos', equipamentoId));
      console.log('✅ Equipamento deletado do Firebase:', equipamentoId);
      return true;
    } catch (error) {
      console.error('Erro ao deletar do Firebase:', error);
      return false;
    }
  }

  // Sincronização em tempo real
  onEquipamentosChange(callback: (equipamentos: FirebaseEquipamento[]) => void): () => void {
    if (!this.currentUser || !this.firestore) {
      return () => {};
    }

    const q = query(
      collection(this.firestore, 'equipamentos'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const equipamentos: FirebaseEquipamento[] = [];
      
      snapshot.forEach(doc => {
        const data = doc.data() as FirebaseEquipamento;
        if (data.userId === this.currentUser?.uid) {
          equipamentos.push(data);
        }
      });

      console.log(`🔄 Equipamentos atualizados em tempo real: ${equipamentos.length}`);
      callback(equipamentos);
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  private async syncFromFirebase(): Promise<void> {
    try {
      const equipamentos = await this.loadEquipamentos();
      
      // Atualizar localStorage com dados do Firebase
      equipamentos.forEach(equipamento => {
        const chaveUnica = `equipamento_${equipamento.tipo}_${equipamento.codigo}_${equipamento.subtipo || 'padrao'}`;
        localStorage.setItem(chaveUnica, JSON.stringify(equipamento));
      });

      console.log('🔄 Sincronização do Firebase para localStorage concluída');
    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  }

  // Sincronizar localStorage para Firebase
  async syncToFirebase(): Promise<void> {
    if (!this.currentUser) {
      console.log('Usuário não autenticado, não é possível sincronizar');
      return;
    }

    try {
      const equipamentosLocal: FirebaseEquipamento[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('equipamento_')) {
          const item = localStorage.getItem(key);
          if (item) {
            const equipamento = JSON.parse(item) as FirebaseEquipamento;
            equipamentosLocal.push(equipamento);
          }
        }
      }

      // Enviar todos os equipamentos locais para o Firebase
      for (const equipamento of equipamentosLocal) {
        await this.saveEquipamento(equipamento);
      }

      console.log(`🔄 ${equipamentosLocal.length} equipamentos sincronizados para Firebase`);
    } catch (error) {
      console.error('Erro ao sincronizar para Firebase:', error);
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  cleanup(): void {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }
}

export const firebaseSyncManager = new FirebaseSyncManager();
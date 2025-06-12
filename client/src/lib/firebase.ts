import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'TECHNICIAN';
  organizationId?: string;
  createdAt: Date;
}

// Criar perfil de usuário no Firestore
export const createUserProfile = async (user: User, additionalData: Partial<UserProfile> = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    const { email, uid } = user;
    const createdAt = new Date();
    
    try {
      await setDoc(userRef, {
        uid,
        email,
        createdAt,
        name: additionalData.name || email?.split('@')[0] || 'Usuário',
        role: additionalData.role || 'TECHNICIAN',
        organizationId: additionalData.organizationId,
        ...additionalData
      });
    } catch (error) {
      console.error('Erro ao criar perfil do usuário:', error);
    }
  }
  
  return userRef;
};

// Buscar perfil do usuário
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    return null;
  }
};

// Login
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

// Registro
export const registerUser = async (email: string, password: string, name: string, role: UserProfile['role'] = 'TECHNICIAN') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user, { name, role });
    return userCredential.user;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro no logout:', error);
    throw error;
  }
};

// Monitor de autenticação
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
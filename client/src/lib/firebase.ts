import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';

// Limpar aspas extras das variáveis de ambiente
const cleanEnvVar = (value: string) => value?.replace(/^["']|["']$/g, '') || '';

const firebaseConfig = {
  apiKey: cleanEnvVar(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: `${cleanEnvVar(import.meta.env.VITE_FIREBASE_PROJECT_ID)}.firebaseapp.com`,
  projectId: cleanEnvVar(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: `${cleanEnvVar(import.meta.env.VITE_FIREBASE_PROJECT_ID)}.firebasestorage.app`,
  messagingSenderId: "130749701",
  appId: cleanEnvVar(import.meta.env.VITE_FIREBASE_APP_ID)
};

// Inicializar Firebase evitando duplicação
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Funções de autenticação
export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

// Observador de estado de autenticação
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export default app;
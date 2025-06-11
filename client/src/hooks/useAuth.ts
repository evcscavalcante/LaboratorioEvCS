import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  photoURL?: string;
}

// Define roles based on email addresses for secure access control
const getUserRole = (email: string): string => {
  const adminEmails = [
    'admin@laboratorio-evcs.com',
    'administrador@laboratorio-evcs.com'
  ];
  
  const managerEmails = [
    'manager@laboratorio-evcs.com',
    'gerente@laboratorio-evcs.com'
  ];
  
  const supervisorEmails = [
    'supervisor@laboratorio-evcs.com'
  ];
  
  if (adminEmails.includes(email.toLowerCase())) {
    return 'ADMIN';
  }
  
  if (managerEmails.includes(email.toLowerCase())) {
    return 'MANAGER';
  }
  
  if (supervisorEmails.includes(email.toLowerCase())) {
    return 'SUPERVISOR';
  }
  
  return 'TECHNICIAN';
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) {
        const userRole = getUserRole(firebaseUser.email);
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          role: userRole,
          photoURL: firebaseUser.photoURL || undefined
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      const { logout: firebaseLogout } = await import('@/lib/firebase');
      await firebaseLogout();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
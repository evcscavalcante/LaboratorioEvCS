import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, getIdToken } from 'firebase/auth';
import { onAuthStateChange } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  token: string | null;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  syncUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const syncUser = async () => {
    if (!user || !token) return;

    try {
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error('Erro ao sincronizar usuário:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Obter token Firebase
          const idToken = await getIdToken(firebaseUser);
          setToken(idToken);
          
          // Extrair informações do usuário Firebase
          const customClaims = (firebaseUser as any).reloadUserRecord?.customClaims || {};
          const profile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
            role: customClaims.role || 'TECHNICIAN'
          };
          
          setUserProfile(profile);
          
          // Sincronizar com backend PostgreSQL se necessário
          await syncUser();
        } catch (error) {
          console.error('Erro ao processar autenticação:', error);
        }
      } else {
        setUserProfile(null);
        setToken(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [user, token]);

  const hasRole = (role: string) => {
    return userProfile?.role === role;
  };

  const hasAnyRole = (roles: string[]) => {
    return userProfile?.role ? roles.includes(userProfile.role) : false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      token,
      hasRole,
      hasAnyRole,
      syncUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
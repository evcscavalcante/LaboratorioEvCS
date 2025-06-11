import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Secure role mapping based on authenticated email
const getUserRole = (email: string): string => {
  const emailLower = email.toLowerCase();
  
  if (emailLower === 'admin@laboratorio-evcs.com') return 'ADMIN';
  if (emailLower === 'manager@laboratorio-evcs.com') return 'MANAGER';
  if (emailLower === 'supervisor@laboratorio-evcs.com') return 'SUPERVISOR';
  if (emailLower === 'tecnico@laboratorio-evcs.com') return 'TECHNICIAN';
  
  return 'VIEWER'; // Most restrictive default
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      const userEmail = localStorage.getItem("user_email");
      const userName = localStorage.getItem("user_name");

      if (token && userEmail && token.startsWith('secure_')) {
        const userRole = getUserRole(userEmail);
        setUser({
          id: token,
          name: userName || userEmail.split('@')[0],
          email: userEmail,
          role: userRole
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
    
    // Listen for storage changes (multi-tab support)
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    setUser(null);
    window.location.reload();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
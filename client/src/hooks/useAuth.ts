import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  organizationId?: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const userData = localStorage.getItem("user_data");

        if (token && userData) {
          // Verify session with backend
          const response = await fetch('/api/auth/me', {
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              setUser(data.user);
            } else {
              // Use stored data as fallback
              const storedUser = JSON.parse(userData);
              setUser(storedUser);
            }
          } else {
            // Session expired, clear auth
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_data");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Try to use stored data
        const userData = localStorage.getItem("user_data");
        if (userData) {
          const storedUser = JSON.parse(userData);
          setUser(storedUser);
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
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
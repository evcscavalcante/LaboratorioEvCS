import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      const userName = localStorage.getItem("user_name");
      const userRole = localStorage.getItem("user_role");

      if (token && userName) {
        setUser({
          name: userName,
          role: userRole || "TECHNICIAN",
          isAuthenticated: true
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("auth_token");
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
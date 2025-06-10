import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import AuthContainer from './auth-container';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();

  // Permitir acesso temporário sem autenticação para demonstração
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  if (!apiKey || loading) {
    return <>{children}</>;
  }

  if (!currentUser) {
    return <AuthContainer />;
  }

  return <>{children}</>;
}
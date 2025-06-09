import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import AuthContainer from './auth-container';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  // Permitir acesso sem autenticação se a API key não estiver configurada
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  if (!apiKey || apiKey === "GOOGLE_API_KEY") {
    return <>{children}</>;
  }

  if (!currentUser) {
    return <AuthContainer />;
  }

  return <>{children}</>;
}
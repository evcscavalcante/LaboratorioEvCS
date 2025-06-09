import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import AuthContainer from './auth-container';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthContainer />;
  }

  return <>{children}</>;
}
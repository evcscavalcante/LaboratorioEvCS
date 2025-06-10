import React, { useState } from 'react';
import LoginForm from './login-form';
import SignupForm from './signup-form';
import ResetPasswordForm from './reset-password-form';

type AuthMode = 'login' | 'signup' | 'reset';

export default function AuthContainer() {
  const [mode, setMode] = useState<AuthMode>('login');

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToSignup={() => setMode('signup')}
            onSwitchToReset={() => setMode('reset')}
          />
        );
      case 'signup':
        return (
          <SignupForm
            onSwitchToLogin={() => setMode('login')}
          />
        );
      case 'reset':
        return (
          <ResetPasswordForm
            onSwitchToLogin={() => setMode('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderForm()}
      </div>
    </div>
  );
}
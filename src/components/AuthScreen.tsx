import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { Leaf, Recycle } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot-password';

interface AuthScreenProps {
  onLogin: (email: string) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Recycle className="w-12 h-12 text-green-600" />
            <Leaf className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-green-700 mb-2">Eco-Reportes de la City</h1>
          <p className="text-gray-600">Juntos por un planeta más limpio</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100">
          {mode === 'login' && (
            <LoginForm
              onLogin={onLogin}
              onRegisterClick={() => setMode('register')}
              onForgotPasswordClick={() => setMode('forgot-password')}
            />
          )}
          {mode === 'register' && (
            <RegisterForm
              onRegister={onLogin}
              onLoginClick={() => setMode('login')}
            />
          )}
          {mode === 'forgot-password' && (
            <ForgotPasswordForm
              onBackToLogin={() => setMode('login')}
            />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          🌍 Cuidemos nuestro planeta, un reporte a la vez
        </p>
      </div>
    </div>
  );
}

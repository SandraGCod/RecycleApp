import { useState } from 'react';
import { Mail, Lock, Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface LoginFormProps {
  onLogin: (email: string) => void;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

export function LoginForm({ onLogin, onRegisterClick, onForgotPasswordClick }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError('El correo electrónico es requerido');
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError('Ingresa un correo electrónico válido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('La contraseña es requerida');
      return false;
    }
    if (value.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      onLogin(email);
    }
  };

  return (
    <div>
      <h2 className="text-center text-gray-800 mb-6">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-gray-700 mb-2">
            Correo Electrónico
            <Tooltip content="Debe ser un correo electrónico válido (ej: usuario@ejemplo.com)">
              <Info className="inline w-4 h-4 ml-1 text-green-600 cursor-help" />
            </Tooltip>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                emailError ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="tu@email.com"
            />
          </div>
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-gray-700 mb-2">
            Contraseña
            <Tooltip content="Mínimo 8 caracteres, se recomienda incluir mayúsculas, minúsculas y números">
              <Info className="inline w-4 h-4 ml-1 text-green-600 cursor-help" />
            </Tooltip>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                passwordError ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="••••••••"
            />
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="text-green-600 hover:text-green-700 text-sm transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
        >
          Ingresar
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          ¿No tienes cuenta?{' '}
          <button
            onClick={onRegisterClick}
            className="text-green-600 hover:text-green-700 transition-colors"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}

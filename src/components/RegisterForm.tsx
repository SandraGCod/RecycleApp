import { useState } from 'react';
import { Mail, Lock, User, Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface RegisterFormProps {
  onRegister: (email: string) => void;
  onLoginClick: () => void;
}

export function RegisterForm({ onRegister, onLoginClick }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateName = (value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, name: 'El nombre es requerido' }));
      return false;
    }
    if (value.length < 2) {
      setErrors(prev => ({ ...prev, name: 'El nombre debe tener al menos 2 caracteres' }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: '' }));
    return true;
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setErrors(prev => ({ ...prev, email: 'El correo electrónico es requerido' }));
      return false;
    }
    if (!emailRegex.test(value)) {
      setErrors(prev => ({ ...prev, email: 'Ingresa un correo electrónico válido' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, password: 'La contraseña es requerida' }));
      return false;
    }
    if (value.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Mínimo 8 caracteres' }));
      return false;
    }
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setErrors(prev => ({ ...prev, password: 'Debe contener mayúsculas, minúsculas y números' }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: '' }));
    return true;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Confirma tu contraseña' }));
      return false;
    }
    if (value !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
      return false;
    }
    setErrors(prev => ({ ...prev, confirmPassword: '' }));
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      onRegister(email);
    }
  };

  return (
    <div>
      <h2 className="text-center text-gray-800 mb-6">Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-gray-700 mb-2">Nombre</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateName(e.target.value);
              }}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.name ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Tu nombre completo"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

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
                errors.email ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="tu@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-gray-700 mb-2">
            Contraseña
            <Tooltip content="Mínimo 8 caracteres, debe incluir mayúsculas, minúsculas y números">
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
                errors.password ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-gray-700 mb-2">Confirmar Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validateConfirmPassword(e.target.value);
              }}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
        >
          Crear Cuenta
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onLoginClick}
            className="text-green-600 hover:text-green-700 transition-colors"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}

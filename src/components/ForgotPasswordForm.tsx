import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  onSubmit?: (email: string) => void; 
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-gray-800 mb-4">Correo Enviado</h2>
        <p className="text-gray-600 mb-6">
          Hemos enviado las instrucciones para recuperar tu contraseña a <strong>{email}</strong>
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Revisa tu bandeja de entrada y sigue los pasos indicados.
        </p>
        <button
          onClick={onBackToLogin}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
        >
          Volver al Inicio de Sesión
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBackToLogin}
        className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>
      
      <h2 className="text-center text-gray-800 mb-3">Recuperar Contraseña</h2>
      <p className="text-center text-gray-600 mb-6">
        Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-2">Correo Electrónico</label>
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

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
        >
          Enviar Instrucciones
        </button>
      </form>
    </div>
  );
}

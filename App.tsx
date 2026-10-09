import { useEffect, useState } from 'react';
import { AuthScreen } from './src/components/AuthScreen';
import { Dashboard } from './src/components/Dashboard';
import { cerrarSesion, getToken, getUsuario } from './src/lib/api';

export default function App() {
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const usuario = getUsuario();
    return getToken() && usuario ? { email: usuario.correo } : null;
  });

  useEffect(() => {
    const alExpirar = () => setUser(null);
    window.addEventListener('sesion-expirada', alExpirar);
    return () => window.removeEventListener('sesion-expirada', alExpirar);
  }, []);

  const handleLogin = (email: string) => setUser({ email });

  const handleLogout = () => {
    cerrarSesion();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {!user ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
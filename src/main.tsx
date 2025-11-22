import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';

import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';

function App() {
  const [user, setUser] = useState<{ email: string } | null>(null);

  const handleLogin = (email: string) => {
    setUser({ email }); // Usuario logueado
  };

  const handleLogout = () => {
    setUser(null); // Cerrar sesión
  };

  return (
    <>
      {!user ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);

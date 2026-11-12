import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { restablecerClave, solicitarCodigo } from '../lib/api';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

type Paso = 'correo' | 'codigo' | 'listo';

const SEGUNDOS_PARA_REENVIAR = 60;

const CAMPO =
  'w-full min-h-12 rounded-xl border-2 border-tinta/15 bg-white px-4 text-tinta placeholder:text-tinta/40 focus:border-tinta focus:outline-none focus:ring-4 focus:ring-senal/70';
const BOTON_PRINCIPAL =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-tinta px-6 font-semibold text-white transition-colors hover:bg-tinta/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-senal/70 disabled:opacity-60';

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [paso, setPaso] = useState<Paso>('correo');
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [espera, setEspera] = useState(0);

  // Cuenta regresiva para poder pedir otro código
  useEffect(() => {
    if (espera <= 0) return;
    const id = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [espera]);

  const pedirCodigo = async () => {
    setCargando(true);
    setError(null);
    try {
      await solicitarCodigo(correo.trim());
      setPaso('codigo');
      setEspera(SEGUNDOS_PARA_REENVIAR);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar el código');
    } finally {
      setCargando(false);
    }
  };

  const enviarCorreo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      setError('Ingresa un correo electrónico válido');
      return;
    }
    void pedirCodigo();
  };

  const cambiarClave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^\d{6}$/.test(codigo)) {
      setError('El código tiene 6 dígitos');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      setError('La contraseña debe tener mayúsculas, minúsculas y números');
      return;
    }
    if (password !== confirmacion) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);
    try {
      await restablecerClave(correo.trim(), codigo, password);
      setPaso('listo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar la contraseña');
    } finally {
      setCargando(false);
    }
  };

  const volver = (
    <button
      type="button"
      onClick={onBackToLogin}
      className="mb-6 inline-flex items-center gap-2 rounded-lg py-1 text-sm font-medium text-tinta/70 hover:text-tinta focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-senal/70"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Volver al inicio de sesión
    </button>
  );

  const aviso = error && (
    <p role="alert" className="rounded-xl border border-alerta/20 bg-alerta/10 px-4 py-3 text-sm font-medium text-alerta">
      {error}
    </p>
  );

  /* ---------- Paso 3: listo ---------- */
  if (paso === 'listo') {
    return (
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="h-14 w-14 text-verde" aria-hidden="true" />
        </div>
        <h2 className="mb-3">Contraseña actualizada</h2>
        <p className="mb-6 text-tinta/70">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <button type="button" onClick={onBackToLogin} className={BOTON_PRINCIPAL}>
          Iniciar sesión
        </button>
      </div>
    );
  }

  /* ---------- Paso 2: código y nueva contraseña ---------- */
  if (paso === 'codigo') {
    return (
      <div>
        {volver}
        <h2 className="mb-2">Escribe el código</h2>
        <p className="mb-6 text-sm text-tinta/70">
          Si <strong className="font-semibold">{correo.trim()}</strong> está registrado, te enviamos un código de 6
          dígitos. Vence en 15 minutos. Revisa también la carpeta de spam.
        </p>

        <form onSubmit={cambiarClave} className="space-y-4" noValidate>
          <div>
            <label htmlFor="codigo" className="mb-2 block text-sm font-medium">
              Código de 6 dígitos
            </label>
            <input
              id="codigo"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              className={`${CAMPO} text-center font-display text-2xl tracking-[0.4em]`}
              placeholder="000000"
            />
          </div>

          <div>
            <label htmlFor="nueva" className="mb-2 block text-sm font-medium">
              Nueva contraseña
            </label>
            <input
              id="nueva"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={CAMPO}
              placeholder="Mínimo 8 caracteres"
            />
            <p className="mt-1 text-xs text-tinta/60">Con mayúsculas, minúsculas y números.</p>
          </div>

          <div>
            <label htmlFor="confirmar" className="mb-2 block text-sm font-medium">
              Confirma la contraseña
            </label>
            <input
              id="confirmar"
              type="password"
              autoComplete="new-password"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              className={CAMPO}
            />
          </div>

          {aviso}

          <button type="submit" disabled={cargando} className={BOTON_PRINCIPAL}>
            {cargando ? 'Guardando...' : 'Cambiar contraseña'}
          </button>

          <button
            type="button"
            onClick={() => void pedirCodigo()}
            disabled={cargando || espera > 0}
            className="min-h-12 w-full rounded-xl text-sm font-medium text-tinta/80 hover:text-tinta focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-senal/70 disabled:opacity-50"
          >
            {espera > 0 ? `Pedir otro código en ${espera} s` : 'Pedir otro código'}
          </button>
        </form>
      </div>
    );
  }

  /* ---------- Paso 1: correo ---------- */
  return (
    <div>
      {volver}
      <h2 className="mb-2">Recuperar contraseña</h2>
      <p className="mb-6 text-sm text-tinta/70">
        Escribe el correo con el que te registraste y te enviamos un código de 6 dígitos.
      </p>

      <form onSubmit={enviarCorreo} className="space-y-4" noValidate>
        <div>
          <label htmlFor="correo-recuperar" className="mb-2 block text-sm font-medium">
            Correo electrónico
          </label>
          <input
            id="correo-recuperar"
            type="email"
            autoComplete="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className={CAMPO}
            placeholder="tu@email.com"
          />
        </div>

        {aviso}

        <button type="submit" disabled={cargando} className={BOTON_PRINCIPAL}>
          {cargando ? 'Enviando...' : 'Enviar código'}
        </button>
      </form>
    </div>
  );
}

const API_URL = import.meta.env.VITE_API_URL as string;
const TOKEN_KEY = 'token';
const USER_KEY = 'usuario';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export interface Reporte {
  id: number;
  descripcion: string;
  fotoUrl: string | null;
  latitud: number;
  longitud: number;
  direccion: string | null;
  estado: 'PENDIENTE' | 'EN_GESTION' | 'RESUELTO';
  fechaCreacion: string;
  usuarioId: number;
  usuarioNombre: string;
}

export interface PuntoReciclaje {
  id: number;
  nombre: string;
  tipoMaterial: string;
  latitud: number;
  longitud: number;
  direccion: string | null;
  horario: string | null;
}

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export function getUsuario(): Usuario | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa tu conexión.');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (res.status === 401 && !path.startsWith('/api/auth/')) {
      cerrarSesion();
      window.dispatchEvent(new Event('sesion-expirada'));
      throw new Error('Tu sesión terminó. Inicia sesión de nuevo.');
    }
    const mensaje = body.error ?? Object.values(body).join(', ');
    throw new Error(mensaje || `Error ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export async function login(correo: string, password: string): Promise<Usuario> {
  const data = await request<{ token: string; usuario: Usuario }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ correo, password }),
  });
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
  return data.usuario;
}

export const registro = (nombre: string, correo: string, password: string) =>
  request<Usuario>('/api/auth/registro', {
    method: 'POST',
    body: JSON.stringify({ nombre, correo, password }),
  });

export const listarPuntos = (tipoMaterial?: string) =>
  request<PuntoReciclaje[]>(
    `/api/puntos-reciclaje${tipoMaterial ? `?tipoMaterial=${encodeURIComponent(tipoMaterial)}` : ''}`
  );

export const listarReportes = () => request<Reporte[]>('/api/reportes');

export const crearReporte = (datos: {
  descripcion: string;
  fotoUrl?: string;
  latitud: number;
  longitud: number;
  direccion?: string;
}) => request<Reporte>('/api/reportes', { method: 'POST', body: JSON.stringify(datos) });
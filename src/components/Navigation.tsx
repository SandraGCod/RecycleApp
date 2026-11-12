import { Map as MapIcon, Plus, BookOpen, LogOut, Leaf } from 'lucide-react';

type Vista = 'map' | 'report' | 'guides';

const TABS = [
  { id: 'map' as const, label: 'Mapa', icon: MapIcon, principal: false },
  { id: 'report' as const, label: 'Reportar', icon: Plus, principal: true },
  { id: 'guides' as const, label: 'Guías', icon: BookOpen, principal: false },
];

const FOCO = 'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-senal/70';

interface NavigationProps {
  user: { email: string } | null;
  currentView: Vista;
  onViewChange: (view: Vista) => void;
  onLogout: () => void;
}

/** Encabezado: marca, secciones (solo en pantallas anchas) y cuenta */
export function Navigation({ user, currentView, onViewChange, onLogout }: NavigationProps) {
  const inicial = user?.email?.charAt(0).toUpperCase() ?? '?';

  return (
    <header className="border-b border-tinta/10 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        {/* Marca */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-verde text-white">
            <Leaf className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-base font-semibold">Eco-Reportes</p>
            <p className="text-xs text-tinta/60">Bogotá</p>
          </div>
        </div>

        {/* Secciones en pantallas anchas */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Secciones">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const activo = currentView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onViewChange(tab.id)}
                aria-current={activo ? 'page' : undefined}
                className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${FOCO} ${
                  activo ? 'text-tinta' : 'text-tinta/60 hover:text-tinta'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
                {activo && <span className="absolute inset-x-3 -bottom-[9px] h-1 rounded-t-full bg-senal" />}
              </button>
            );
          })}
        </nav>

        {/* Cuenta */}
        <div className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-campo font-display text-sm font-semibold"
            aria-hidden="true"
          >
            {inicial}
          </span>
          <span className="hidden text-sm text-tinta/70 lg:inline">{user?.email}</span>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className={`flex h-10 items-center gap-2 rounded-lg px-2.5 text-tinta/70 transition-colors hover:bg-campo hover:text-tinta ${FOCO}`}
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            <span className="hidden text-sm font-medium md:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/** Barra inferior con iconos y texto: la forma habitual de navegar en el celular */
export function BarraInferior({
  currentView,
  onViewChange,
}: {
  currentView: Vista;
  onViewChange: (view: Vista) => void;
}) {
  return (
    <nav
      className="border-t border-tinta/10 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Secciones"
    >
      <div className="mx-auto grid max-w-md grid-cols-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const activo = currentView === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onViewChange(tab.id)}
              aria-current={activo ? 'page' : undefined}
              className={`relative flex min-h-16 flex-col items-center justify-center gap-1 pt-1 ${FOCO}`}
            >
              {activo && <span className="absolute top-0 h-1 w-10 rounded-b-full bg-senal" />}

              {tab.principal ? (
                <span className="flex h-8 w-14 items-center justify-center rounded-full bg-verde text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              ) : (
                <Icon className={`h-6 w-6 ${activo ? 'text-tinta' : 'text-tinta/55'}`} aria-hidden="true" />
              )}

              <span className={`text-xs ${activo ? 'font-semibold text-tinta' : 'font-medium text-tinta/60'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

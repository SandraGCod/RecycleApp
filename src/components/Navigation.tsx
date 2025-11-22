import { Map, FileText, BookOpen, LogOut, Leaf } from 'lucide-react';

interface NavigationProps {
  user: { email: string } | null;
  currentView: 'map' | 'report' | 'guides';
  onViewChange: (view: 'map' | 'report' | 'guides') => void;
  onLogout: () => void;
}

export function Navigation({ user, currentView, onViewChange, onLogout }: NavigationProps) {
  const navItems = [
    { id: 'map' as const, label: 'Mapa', icon: Map },
    { id: 'report' as const, label: 'Reportar', icon: FileText },
    { id: 'guides' as const, label: 'Guías', icon: BookOpen },
  ];

  return (
    <nav className="bg-white border-b-2 border-green-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-green-700">Eco-Reportes de la City</span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentView === item.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:inline text-sm">{user?.email}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

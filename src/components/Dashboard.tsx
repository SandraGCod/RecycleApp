import { useState } from 'react';
import { MapView } from './MapView';
import { ReportForm } from './ReportForm';
import { EducationalGuides } from './EducationalGuides';
import { Navigation } from './Navigation';

export interface Report {
  id: string;
  address: string;
  description: string;
  photo?: string;
  location: { lat: number; lng: number };
  date: string;
}

interface DashboardProps {
  user: { email: string } | null;
  onLogout: () => void;
}

// mock
const mockReports: Report[] = [
  {
    id: '1',
    address: 'Calle 72 #10-51, Bogotá',
    description: 'Acumulación de basura en la esquina, principalmente plásticos y residuos orgánicos.',
    location: { lat: 4.6533, lng: -74.0836 },
    date: '2025-11-14'
  },
  {
    id: '2',
    address: 'Carrera 15 #85-23, Bogotá',
    description: 'Contenedores desbordados, se requiere atención urgente.',
    location: { lat: 4.6697, lng: -74.0548 },
    date: '2025-11-13'
  },
  {
    id: '3',
    address: 'Avenida Caracas #45-12, Bogotá',
    description: 'Escombros y basura de construcción abandonados.',
    location: { lat: 4.6282, lng: -74.0659 },
    date: '2025-11-12'
  },
  {
    id: '4',
    address: 'Calle 26 #68-90, Bogotá',
    description: 'Basura dispersa en el parque, necesita limpieza.',
    location: { lat: 4.6486, lng: -74.1153 },
    date: '2025-11-11'
  }
];

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<'map' | 'report' | 'guides'>('map');
  const [reports, setReports] = useState<Report[]>(mockReports);

  const handleNewReport = (report: Report) => {
    setReports([report, ...reports]);
    setCurrentView('map');
  };

  return (
    <div className="h-screen flex flex-col">
      <Navigation
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={onLogout}
      />
      
      <main className="flex-1 overflow-hidden">
        {currentView === 'map' && <MapView reports={reports} />}
        {currentView === 'report' && <ReportForm onSubmit={handleNewReport} />}
        {currentView === 'guides' && <EducationalGuides />}
      </main>
    </div>
  );
}

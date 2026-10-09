import { useCallback, useEffect, useState } from 'react';
import { MapView } from './MapView';
import { ReportForm } from './ReportForm';
import { EducationalGuides } from './EducationalGuides';
import { Navigation } from './Navigation';
import {
  crearReporte,
  listarPuntos,
  listarReportes,
  type PuntoReciclaje,
  type Reporte,
} from '../lib/api';

export interface Report {
  id: string;
  address: string;
  description: string;
  photo?: string;
  location: { lat: number; lng: number };
  date: string;
  status?: 'PENDIENTE' | 'EN_GESTION' | 'RESUELTO';
}

interface DashboardProps {
  user: { email: string } | null;
  onLogout: () => void;
}

// Traduce la respuesta del backend al formato que ya usa la interfaz
const aReport = (r: Reporte): Report => ({
  id: String(r.id),
  address: r.direccion ?? 'Sin dirección',
  description: r.descripcion,
  photo: r.fotoUrl ?? undefined,
  location: { lat: r.latitud, lng: r.longitud },
  date: r.fechaCreacion.slice(0, 19),
  status: r.estado,
});

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<'map' | 'report' | 'guides'>('map');
  const [reports, setReports] = useState<Report[]>([]);
  const [points, setPoints] = useState<PuntoReciclaje[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    const [rep, pts] = await Promise.allSettled([listarReportes(), listarPuntos()]);

    if (rep.status === 'fulfilled') {
      setReports(rep.value.map(aReport));
      setError(null);
    } else {
      setError(rep.reason instanceof Error ? rep.reason.message : 'No se pudieron cargar los reportes');
    }

    if (pts.status === 'fulfilled') setPoints(pts.value);
  }, []);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const handleNewReport = async (report: Report) => {
    try {
      await crearReporte({
        descripcion: report.description,
        latitud: report.location.lat,
        longitud: report.location.lng,
        direccion: report.address,
      });
      await cargarDatos();
      setCurrentView('map');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear el reporte');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navigation
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={onLogout}
      />

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-2 border-b border-red-200">
          {error}
        </div>
      )}

      <main className="flex-1 overflow-hidden">
        {currentView === 'map' && <MapView reports={reports} points={points} />}
        {currentView === 'report' && <ReportForm onSubmit={handleNewReport} />}
        {currentView === 'guides' && <EducationalGuides />}
      </main>
    </div>
  );
}
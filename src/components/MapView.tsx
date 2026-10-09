import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Calendar } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { type Report } from './Dashboard';
import { type PuntoReciclaje } from '../lib/api';

type Estado = NonNullable<Report['status']>;

const COLOR_ESTADO: Record<Estado, string> = {
  PENDIENTE: '#ef4444',
  EN_GESTION: '#f59e0b',
  RESUELTO: '#22c55e',
};

const TEXTO_ESTADO: Record<Estado, string> = {
  PENDIENTE: 'Pendiente',
  EN_GESTION: 'En gestión',
  RESUELTO: 'Resuelto',
};

const COLOR_PUNTO = '#2563eb';
const BOGOTA: [number, number] = [4.711, -74.0721];

function AjustarVista({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) map.fitBounds(coords, { padding: [40, 40], maxZoom: 15 });
  }, [map, coords]);
  return null;
}

function Enfocar({ destino }: { destino: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (destino) map.flyTo(destino, Math.max(map.getZoom(), 15));
  }, [map, destino]);
  return null;
}

interface MapViewProps {
  reports?: Report[];
  points?: PuntoReciclaje[];
}

export function MapView({ reports = [], points = [] }: MapViewProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<PuntoReciclaje | null>(null);
  const [tab, setTab] = useState<'reportes' | 'puntos'>('reportes');

  const coords = useMemo<[number, number][]>(
    () => [
      ...reports.map((r) => [r.location.lat, r.location.lng] as [number, number]),
      ...points.map((p) => [p.latitud, p.longitud] as [number, number]),
    ],
    [reports, points]
  );

  const destino = useMemo<[number, number] | null>(() => {
    if (selectedReport) return [selectedReport.location.lat, selectedReport.location.lng];
    if (selectedPoint) return [selectedPoint.latitud, selectedPoint.longitud];
    return null;
  }, [selectedReport, selectedPoint]);

  const seleccionarReporte = (r: Report) => {
    setSelectedPoint(null);
    setSelectedReport(r);
  };

  const seleccionarPunto = (p: PuntoReciclaje) => {
    setSelectedReport(null);
    setSelectedPoint(p);
  };

  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* Mapa */}
      <div className="flex-1 relative isolate min-h-[300px]">
        <MapContainer center={BOGOTA} zoom={12} scrollWheelZoom className="absolute inset-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AjustarVista coords={coords} />
          <Enfocar destino={destino} />

          {reports.map((r) => {
            const estado = r.status ?? 'PENDIENTE';
            return (
              <CircleMarker
                key={`r-${r.id}`}
                center={[r.location.lat, r.location.lng]}
                radius={selectedReport?.id === r.id ? 14 : 10}
                pathOptions={{ color: '#ffffff', weight: 2, fillColor: COLOR_ESTADO[estado], fillOpacity: 0.95 }}
                eventHandlers={{ click: () => seleccionarReporte(r) }}
              />
            );
          })}

          {points.map((p) => (
            <CircleMarker
              key={`p-${p.id}`}
              center={[p.latitud, p.longitud]}
              radius={selectedPoint?.id === p.id ? 14 : 10}
              pathOptions={{ color: '#ffffff', weight: 2, fillColor: COLOR_PUNTO, fillOpacity: 0.95 }}
              eventHandlers={{ click: () => seleccionarPunto(p) }}
            />
          ))}
        </MapContainer>

        {/* Leyenda */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 rounded-lg shadow px-3 py-2 text-xs text-gray-700 space-y-1">
          {(Object.keys(COLOR_ESTADO) as Estado[]).map((e) => (
            <div key={e} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: COLOR_ESTADO[e] }} />
              {TEXTO_ESTADO[e]}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: COLOR_PUNTO }} />
            Punto de reciclaje
          </div>
        </div>
      </div>

      {/* Panel lateral */}
      <div className="w-full md:w-96 bg-white border-t-2 md:border-l-2 border-green-100 overflow-y-auto">
        <div className="p-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab('reportes')}
              className={`flex-1 py-2 rounded-lg text-sm border-2 ${
                tab === 'reportes' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'
              }`}
            >
              Reportes ({reports.length})
            </button>
            <button
              onClick={() => setTab('puntos')}
              className={`flex-1 py-2 rounded-lg text-sm border-2 ${
                tab === 'puntos' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'
              }`}
            >
              Reciclaje ({points.length})
            </button>
          </div>

          {selectedReport && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-green-700">Reporte seleccionado</h4>
                <button onClick={() => setSelectedReport(null)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              {selectedReport.photo && (
                <img src={selectedReport.photo} alt="Reporte" className="w-full h-40 object-cover rounded-lg mb-3" />
              )}
              <div className="space-y-2">
                <p className="text-gray-700 text-sm">{selectedReport.address}</p>
                <p className="text-gray-600 text-sm">{selectedReport.description}</p>
                <p className="text-sm" style={{ color: COLOR_ESTADO[selectedReport.status ?? 'PENDIENTE'] }}>
                  {TEXTO_ESTADO[selectedReport.status ?? 'PENDIENTE']}
                </p>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedReport.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          )}

          {selectedPoint && (
            <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-blue-700">{selectedPoint.nombre}</h4>
                <button onClick={() => setSelectedPoint(null)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">Material: {selectedPoint.tipoMaterial}</p>
                {selectedPoint.direccion && <p className="text-gray-600">{selectedPoint.direccion}</p>}
                {selectedPoint.horario && <p className="text-gray-500">{selectedPoint.horario}</p>}
              </div>
            </div>
          )}

          {tab === 'reportes' && (
            <div className="space-y-3">
              {reports.length === 0 && <p className="text-gray-500 text-sm">Aún no hay reportes.</p>}
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => seleccionarReporte(report)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    selectedReport?.id === report.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <p className="text-gray-800 text-sm mb-1 truncate">{report.address}</p>
                  <p className="text-gray-600 text-sm line-clamp-2">{report.description}</p>
                </button>
              ))}
            </div>
          )}

          {tab === 'puntos' && (
            <div className="space-y-3">
              {points.length === 0 && <p className="text-gray-500 text-sm">Aún no hay puntos de reciclaje.</p>}
              {points.map((p) => (
                <button
                  key={p.id}
                  onClick={() => seleccionarPunto(p)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    selectedPoint?.id === p.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <p className="text-gray-800 text-sm mb-1 truncate">{p.nombre}</p>
                  <p className="text-gray-600 text-sm">{p.tipoMaterial}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
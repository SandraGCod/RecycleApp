import { useState } from 'react';
import { MapPin, Calendar, Info } from 'lucide-react';
import { type Report } from './Dashboard';

interface MapViewProps {
  reports: Report[];
}

export function MapView({ reports }: MapViewProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* Map Area */}
      <div className="flex-1 relative bg-gradient-to-br from-green-50 to-blue-50 min-h-[300px]">
        {/* Simulated Map */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

        {/* Map Markers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl max-h-[600px]">
            {reports.map((report, index) => {
              const positions = [
                { top: '30%', left: '40%' },
                { top: '50%', left: '60%' },
                { top: '45%', left: '30%' },
                { top: '65%', left: '50%' },
              ];
              const position = positions[index % positions.length];

              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ top: position.top, left: position.left }}
                >
                  <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg animate-bounce" fill="currentColor" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-96 bg-white border-t-2 md:border-l-2 border-green-100 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-gray-800 mb-4">Reportes Recientes</h3>

          {selectedReport && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-green-700">Reporte Seleccionado</h4>
                <button onClick={() => setSelectedReport(null)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              {selectedReport.photo && <img src={selectedReport.photo} alt="Reporte" className="w-full h-40 object-cover rounded-lg mb-3" />}
              <div className="space-y-2">
                <p className="text-gray-700 text-sm">{selectedReport.address}</p>
                <p className="text-gray-600 text-sm">{selectedReport.description}</p>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedReport.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                  selectedReport?.id === report.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <p className="text-gray-800 text-sm mb-1 truncate">{report.address}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{report.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

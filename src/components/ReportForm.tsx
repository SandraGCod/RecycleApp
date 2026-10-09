import { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { MapPin, FileText, Image, LocateFixed, CheckCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { type Report } from './Dashboard';

type Coords = { lat: number; lng: number };
const BOGOTA: [number, number] = [4.711, -74.0721];

function TocarMapa({ onPick }: { onPick: (c: Coords) => void }) {
  useMapEvents({
    click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }),
  });
  return null;
}

function Centrar({ foco }: { foco: Coords | null }) {
  const map = useMap();
  useEffect(() => {
    if (foco) map.flyTo([foco.lat, foco.lng], Math.max(map.getZoom(), 16));
  }, [map, foco]);
  return null;
}

interface ReportFormProps {
  onSubmit: (report: Report) => Promise<void>;
  onDone: () => void;
}

export function ReportForm({ onSubmit, onDone }: ReportFormProps) {
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<Coords | null>(null);
  const [foco, setFoco] = useState<Coords | null>(null);
  const [localizando, setLocalizando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const usarMiUbicacion = async () => {
    setError(null);
    setLocalizando(true);
    try {
      if (Capacitor.isNativePlatform()) {
        const permiso = await Geolocation.requestPermissions();
        if (permiso.location !== 'granted' && permiso.coarseLocation !== 'granted') {
          throw new Error('Necesitamos permiso de ubicación para marcar el punto');
        }
      }
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setLocation(coords);
      setFoco(coords);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo obtener tu ubicación. Toca el mapa para marcarla.'
      );
    } finally {
      setLocalizando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!location) {
      setError('Marca la ubicación: usa tu ubicación actual o toca el mapa');
      return;
    }

    setEnviando(true);
    try {
      await onSubmit({
        id: '',
        address: address.trim(),
        description: description.trim(),
        photo: photo ?? undefined,
        location,
        date: new Date().toISOString(),
      });
      setSubmitted(true);
      setTimeout(onDone, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el reporte');
    } finally {
      setEnviando(false);
    }
  };

  if (submitted) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-green-700 mb-3">¡Reporte Enviado!</h2>
          <p className="text-gray-600 mb-2">Gracias por ayudar a mantener nuestra ciudad limpia.</p>
          <p className="text-gray-500 text-sm">Tu reporte ha sido registrado y ahora es visible en el mapa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100">
          <div className="mb-6">
            <h2 className="text-green-700 mb-2">Reportar Punto Crítico</h2>
            <p className="text-gray-600">Ayúdanos a identificar zonas que necesitan atención</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dirección */}
            <div>
              <label className="block text-gray-700 mb-2">
                Dirección <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  placeholder="Ej: Calle 72 #10-51, Bogotá"
                  required
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-gray-700 mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors resize-none"
                  rows={4}
                  maxLength={500}
                  placeholder="Describe el problema: tipo de basura, cantidad, condiciones..."
                  required
                />
              </div>
            </div>

            {/* Foto */}
            <div>
              <label className="block text-gray-700 mb-2">Fotografía (opcional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                {photo ? (
                  <div className="relative">
                    <img src={photo} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Toca para subir una foto</p>
                    <p className="text-gray-400 text-sm">PNG, JPG hasta 10MB</p>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-2">
                La foto todavía no se guarda en el servidor; se incluirá en una próxima versión.
              </p>
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-gray-700 mb-2">
                Ubicación <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={usarMiUbicacion}
                disabled={localizando}
                className="flex items-center gap-2 px-5 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-60"
              >
                <LocateFixed className="w-5 h-5" />
                {localizando ? 'Buscando tu ubicación...' : 'Usar mi ubicación actual'}
              </button>
              <p className="text-gray-500 text-sm mt-2">O toca el mapa para marcar el punto exacto.</p>

              <div className="mt-3 h-64 rounded-lg border-2 border-gray-200 overflow-hidden relative isolate">
                <MapContainer center={BOGOTA} zoom={12} className="absolute inset-0">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <TocarMapa onPick={setLocation} />
                  <Centrar foco={foco} />
                  {location && (
                    <CircleMarker
                      center={[location.lat, location.lng]}
                      radius={10}
                      pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#ef4444', fillOpacity: 0.95 }}
                    />
                  )}
                </MapContainer>
              </div>

              {location && (
                <p className="text-sm text-gray-500 mt-2">
                  Ubicación marcada: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {enviando ? 'Enviando...' : 'Enviar Reporte'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
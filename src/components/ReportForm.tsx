import { useState } from 'react';
import { MapPin, FileText, Image, Search, CheckCircle } from 'lucide-react';
import { type Report } from './Dashboard';

interface ReportFormProps {
  onSubmit: (report: Report) => void;
}

export function ReportForm({ onSubmit }: ReportFormProps) {
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationSearch = () => {
    // Simulate location search
    const randomLat = 4.6 + Math.random() * 0.1;
    const randomLng = -74.1 + Math.random() * 0.1;
    setLocation({ lat: randomLat, lng: randomLng });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address || !description) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const newReport: Report = {
      id: Date.now().toString(),
      address,
      description,
      photo: photo || undefined,
      location: location || { lat: 4.6533, lng: -74.0836 },
      date: new Date().toISOString().split('T')[0]
    };

    onSubmit(newReport);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setAddress('');
      setDescription('');
      setPhoto(null);
      setLocation(null);
      setSearchQuery('');
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-green-700 mb-3">¡Reporte Enviado!</h2>
          <p className="text-gray-600 mb-2">
            Gracias por ayudar a mantener nuestra ciudad limpia.
          </p>
          <p className="text-gray-500 text-sm">
            Tu reporte ha sido registrado y ahora es visible en el mapa.
          </p>
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
            <p className="text-gray-600">
              Ayúdanos a identificar zonas que necesitan atención
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address Field */}
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

            {/* Description Field */}
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
                  placeholder="Describe el problema: tipo de basura, cantidad, condiciones..."
                  required
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-gray-700 mb-2">
                Fotografía (opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                {photo ? (
                  <div className="relative">
                    <img
                      src={photo}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
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
                    <p className="text-gray-600 mb-2">Haz clic para subir una foto</p>
                    <p className="text-gray-400 text-sm">PNG, JPG hasta 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Location Search */}
            <div>
              <label className="block text-gray-700 mb-2">
                Buscar Ubicación en el Mapa
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                    placeholder="Buscar en el mapa..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleLocationSearch}
                  className="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Buscar
                </button>
              </div>
              
              {/* Simulated Map */}
              <div className="mt-4 h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border-2 border-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                {location ? (
                  <div className="relative z-10">
                    <MapPin className="w-12 h-12 text-red-500" fill="currentColor" />
                    <p className="text-sm text-gray-700 mt-2 bg-white px-3 py-1 rounded-lg shadow">
                      Ubicación seleccionada
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 z-10">
                    Busca una ubicación para marcarla en el mapa
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
            >
              Enviar Reporte
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

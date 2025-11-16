import Link from 'next/link';
import { Building2, MapPin, Tag, Landmark } from 'lucide-react';

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-800 font-medium">Gestiona tu marketplace</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/experiences"
            className="bg-white p-6 rounded-xl border-2 border-gray-300 hover:border-purple-500 hover:shadow-lg transition-all group"
          >
            <div className="bg-purple-100 text-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Experiencias</h2>
            <p className="text-gray-700">Gestiona tus tours y actividades</p>
          </Link>

          <Link
            href="/admin/cities"
            className="bg-white p-6 rounded-xl border-2 border-gray-300 hover:border-green-500 hover:shadow-lg transition-all group"
          >
            <div className="bg-green-100 text-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ciudades</h2>
            <p className="text-gray-700">Gestiona los destinos</p>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-white p-6 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all group"
          >
            <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Tag size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Categorías</h2>
            <p className="text-gray-700">Gestiona las categorías</p>
          </Link>

          <Link
            href="/admin/monuments"
            className="bg-white p-6 rounded-xl border-2 border-gray-300 hover:border-amber-500 hover:shadow-lg transition-all group"
          >
            <div className="bg-amber-100 text-amber-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Landmark size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Monumentos</h2>
            <p className="text-gray-700">Gestiona lugares emblemáticos</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

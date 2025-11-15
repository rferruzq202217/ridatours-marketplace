'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Package, MapPin, Grid3x3 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ experiences: 0, cities: 0, categories: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [exp, cit, cat] = await Promise.all([
      supabase.from('experiences').select('id', { count: 'exact', head: true }),
      supabase.from('cities').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true })
    ]);

    setStats({
      experiences: exp.count || 0,
      cities: cit.count || 0,
      categories: cat.count || 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona tu marketplace de experiencias</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Experiencias</p>
                <p className="text-3xl font-bold text-gray-900">{stats.experiences}</p>
              </div>
              <Package className="text-blue-600" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Ciudades</p>
                <p className="text-3xl font-bold text-gray-900">{stats.cities}</p>
              </div>
              <MapPin className="text-green-600" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Categorías</p>
                <p className="text-3xl font-bold text-gray-900">{stats.categories}</p>
              </div>
              <Grid3x3 className="text-purple-600" size={40} />
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/experiences" className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                <Package size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Experiencias</h2>
            </div>
            <p className="text-gray-600 mb-4">Gestiona tours, actividades y experiencias</p>
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <Plus size={20} />
              <span>Gestionar experiencias</span>
            </div>
          </Link>

          <Link href="/admin/cities" className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-green-500 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                <MapPin size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Ciudades</h2>
            </div>
            <p className="text-gray-600 mb-4">Añade y edita destinos disponibles</p>
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <Plus size={20} />
              <span>Gestionar ciudades</span>
            </div>
          </Link>

          <Link href="/admin/categories" className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-purple-500 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                <Grid3x3 size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Categorías</h2>
            </div>
            <p className="text-gray-600 mb-4">Organiza tus experiencias por tipo</p>
            <div className="flex items-center gap-2 text-purple-600 font-semibold">
              <Plus size={20} />
              <span>Gestionar categorías</span>
            </div>
          </Link>
        </div>

        {/* Acceso rápido a la home */}
        <div className="mt-8">
          <Link href="/es" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600">
            ← Volver al sitio web
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import MonumentCard from '@/components/MonumentCard';
import { romaMonuments } from '@/lib/monuments';
import { Landmark, Building2, Church, Palette, Star, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function RomaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'monumentos', name: 'Monumentos', icon: Landmark, count: 24 },
    { id: 'museos', name: 'Museos', icon: Palette, count: 18 },
    { id: 'tours', name: 'Tours', icon: Building2, count: 32 },
    { id: 'iglesias', name: 'Iglesias', icon: Church, count: 15 },
  ];

  const filteredMonuments = selectedCategory
    ? romaMonuments.filter(m => m.category.toLowerCase() === selectedCategory)
    : romaMonuments;

  return (
    <div className="min-h-screen bg-white">
      <Header lang="es" />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Inicio', href: '/es' }, { label: 'Roma' }]} />
          
          {/* Header con imagen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 mt-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Qué hacer en Roma
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Descubre la Ciudad Eterna con sus monumentos milenarios, arte incomparable y vibrante cultura. 
                Explora el Coliseo, los Museos Vaticanos, la Fontana di Trevi y muchos más lugares emblemáticos.
              </p>
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <span className="font-semibold">4.8</span>
                  <span className="text-sm">(45,234 opiniones)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  <span className="font-semibold">127 experiencias</span>
                </div>
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800" 
                alt="Roma" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          {/* Categorías */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explora por categoría</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50 shadow-lg' 
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Icon size={28} />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 text-sm">{category.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{category.count} opciones</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Header de resultados */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory 
                  ? categories.find(c => c.id === selectedCategory)?.name 
                  : 'Todas las experiencias en Roma'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">{filteredMonuments.length} actividades encontradas</p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Limpiar filtro
              </button>
            )}
          </div>

          {/* Grid de monumentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMonuments.map(monument => (
              <MonumentCard key={monument.id} monument={monument} lang="es" />
            ))}
          </div>

          {filteredMonuments.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600 mb-4">No hay experiencias en esta categoría</p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Ver todas las experiencias
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer lang="es" />
    </div>
  );
}

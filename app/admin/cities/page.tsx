'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface City {
  id: string;
  name: string;
  slug: string;
  country: string;
  image: string | null;
  description: string | null;
  tiqets_affiliate_link: string | null;
}

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    slug: '', 
    country: 'España', 
    image: '', 
    description: '',
    tiqets_affiliate_link: ''
  });

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');
    
    if (error) console.error('Error loading cities:', error);
    if (data) setCities(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSave = {
        name: formData.name,
        slug: formData.slug,
        country: formData.country,
        image: formData.image || null,
        description: formData.description || null,
        tiqets_affiliate_link: formData.tiqets_affiliate_link || null
      };

      if (editingId) {
        const { error } = await supabase
          .from('cities')
          .update(dataToSave)
          .eq('id', editingId);
        
        if (error) {
          alert('Error al actualizar: ' + error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('cities')
          .insert([dataToSave]);
        
        if (error) {
          alert('Error al crear: ' + error.message);
          return;
        }
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', slug: '', country: 'España', image: '', description: '', tiqets_affiliate_link: '' });
      loadCities();
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleEdit = (city: City) => {
    setFormData({ 
      name: city.name, 
      slug: city.slug, 
      country: city.country,
      image: city.image || '',
      description: city.description || '',
      tiqets_affiliate_link: city.tiqets_affiliate_link || ''
    });
    setEditingId(city.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta ciudad?')) {
      const { error } = await supabase.from('cities').delete().eq('id', id);
      if (error) {
        alert('Error al eliminar: ' + error.message);
        return;
      }
      loadCities();
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-2 font-semibold">
                <ArrowLeft size={20} />
                Volver al panel
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Ciudades</h1>
              <p className="text-gray-800 font-medium">Gestiona los destinos disponibles</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({ name: '', slug: '', country: 'España', image: '', description: '', tiqets_affiliate_link: '' });
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Nueva Ciudad
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingId ? 'Editar' : 'Nueva'} Ciudad</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) });
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">País</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Descripción de la ciudad que aparecerá en la página principal"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">URL de Imagen</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 font-medium"
                />
                <p className="text-sm text-gray-800 mt-1">Puedes usar Unsplash, copiar URL de imagen existente, etc.</p>
              </div>
              
              <div className="border-t-2 border-yellow-200 pt-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  🚀 Link Afiliado Tiqets (MVP Rápido)
                </label>
                <input
                  type="url"
                  value={formData.tiqets_affiliate_link}
                  onChange={(e) => setFormData({ ...formData, tiqets_affiliate_link: e.target.value })}
                  placeholder="https://www.tiqets.com/es/atracciones-cataluna-r75/?partner=rida_tours_llc-181548&tq_campaign=barcelona"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 font-medium"
                />
                <p className="text-sm text-yellow-800 bg-yellow-50 p-3 rounded mt-2">
                  💡 <strong>Si añades este link:</strong> La ciudad redirigirá directamente a Tiqets<br/>
                  <strong>Si lo dejas vacío:</strong> Usará la landing propia del marketplace
                </p>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', slug: '', country: 'España', image: '', description: '', tiqets_affiliate_link: '' });
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-2 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <div key={city.id} className="bg-white rounded-xl border-2 border-gray-300 overflow-hidden hover:shadow-lg transition-all">
              {city.image && (
                <div className="relative h-48">
                  <Image src={city.image} alt={city.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{city.name}</h3>
                <p className="text-sm text-gray-800 font-medium mb-1">{city.country}</p>
                <p className="text-sm text-gray-600 mb-2">/{city.slug}</p>
                {city.tiqets_affiliate_link && (
                  <p className="text-xs text-green-600 mb-2">🚀 Link directo a Tiqets</p>
                )}
                {city.description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{city.description}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(city)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1"
                  >
                    <Pencil size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(city.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {cities.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-12 text-center">
            <p className="text-gray-800 font-semibold">No hay ciudades creadas aún</p>
          </div>
        )}
      </div>
    </div>
  );
}

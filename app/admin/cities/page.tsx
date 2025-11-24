'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft, MapPin } from 'lucide-react';
import Image from 'next/image';

interface City {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  country_id: string | null;
  countries?: { name: string };
}

interface Country {
  id: string;
  name: string;
  continent: string;
}

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', image: '', country_id: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: citiesData } = await supabase.from('cities').select('*, countries(name)').order('name');
    if (citiesData) setCities(citiesData);

    const { data: countriesData } = await supabase.from('countries').select('id, name, continent').order('continent, name');
    if (countriesData) setCountries(countriesData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = { 
      name: formData.name, 
      slug: formData.slug, 
      image: formData.image || null,
      country_id: formData.country_id || null
    };

    if (editingId) {
      const { error } = await supabase.from('cities').update(dataToSave).eq('id', editingId);
      if (error) { alert('Error: ' + error.message); return; }
    } else {
      const { error } = await supabase.from('cities').insert([dataToSave]);
      if (error) { alert('Error: ' + error.message); return; }
    }
    setShowForm(false);
    resetForm();
    loadData();
  };

  const handleEdit = (city: City) => {
    setFormData({ name: city.name, slug: city.slug, image: city.image || '', country_id: city.country_id || '' });
    setEditingId(city.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta ciudad?')) {
      const { error } = await supabase.from('cities').delete().eq('id', id);
      if (error) { alert('Error: ' + error.message); return; }
      loadData();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', image: '', country_id: '' });
  };

  const generateSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  // Agrupar países por continente para el select
  const countriesByContinent = countries.reduce((acc, country) => {
    if (!acc[country.continent]) acc[country.continent] = [];
    acc[country.continent].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-semibold">
                <ArrowLeft size={20} /> Volver al panel
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Ciudades</h1>
              <p className="text-gray-600">Gestiona las ciudades del marketplace</p>
            </div>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
              <Plus size={20} /> Nueva Ciudad
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Editar' : 'Nueva'} Ciudad</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Nombre *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Slug *</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">País *</label>
                <select value={formData.country_id} onChange={(e) => setFormData({ ...formData, country_id: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900" required>
                  <option value="">Seleccionar país</option>
                  {Object.entries(countriesByContinent).map(([continent, countryList]) => (
                    <optgroup key={continent} label={continent}>
                      {countryList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">URL Imagen</label>
                <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">{editingId ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded-lg font-semibold">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((city) => (
            <div key={city.id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-all">
              {city.image && typeof city.image === 'string' && city.image.startsWith('http') && (
                <div className="relative h-32">
                  <Image src={city.image} alt={city.name} fill className="object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={16} className="text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">{city.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-1">/{city.slug}</p>
                <p className="text-xs text-blue-600 font-medium mb-4">{city.countries?.name || 'Sin país'}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(city)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold">Editar</button>
                  <button onClick={() => handleDelete(city.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cities.length === 0 && !showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-12 text-center">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No hay ciudades</p>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">Crear Ciudad</button>
          </div>
        )}
      </div>
    </div>
  );
}

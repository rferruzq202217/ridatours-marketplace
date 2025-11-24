'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft, Globe } from 'lucide-react';

interface Country {
  id: string;
  name: string;
  slug: string;
  code: string;
  continent: string;
  image: string | null;
}

const continents = ['Europa', 'América del Norte', 'América del Sur', 'Asia', 'Oceanía', 'África'];

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', code: '', continent: 'Europa', image: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('countries').select('*').order('continent, name');
    if (data) setCountries(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = { ...formData, image: formData.image || null };

    if (editingId) {
      const { error } = await supabase.from('countries').update(dataToSave).eq('id', editingId);
      if (error) { alert('Error: ' + error.message); return; }
    } else {
      const { error } = await supabase.from('countries').insert([dataToSave]);
      if (error) { alert('Error: ' + error.message); return; }
    }
    setShowForm(false);
    resetForm();
    loadData();
  };

  const handleEdit = (country: Country) => {
    setFormData({ name: country.name, slug: country.slug, code: country.code || '', continent: country.continent, image: country.image || '' });
    setEditingId(country.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este país? Las ciudades quedarán sin país asignado.')) {
      const { error } = await supabase.from('countries').delete().eq('id', id);
      if (error) { alert('Error: ' + error.message); return; }
      loadData();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', code: '', continent: 'Europa', image: '' });
  };

  const generateSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  // Agrupar por continente
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
              <h1 className="text-3xl font-bold text-gray-900">Países</h1>
              <p className="text-gray-600">Gestiona los países del marketplace</p>
            </div>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
              <Plus size={20} /> Nuevo País
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Editar' : 'Nuevo'} País</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Nombre *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Slug *</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Código ISO (2-3 letras)</label>
                  <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} maxLength={3} placeholder="ES, IT, FR..." className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Continente *</label>
                  <select value={formData.continent} onChange={(e) => setFormData({ ...formData, continent: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900" required>
                    {continents.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">URL Imagen</label>
                <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold">{editingId ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded-lg font-semibold">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {Object.entries(countriesByContinent).map(([continent, countryList]) => (
          <div key={continent} className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe size={24} className="text-green-600" />
              {continent}
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full ml-2">{countryList.length}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {countryList.map((country) => (
                <div key={country.id} className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{country.name}</h3>
                    {country.code && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{country.code}</span>}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">/{country.slug}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(country)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1">
                      <Pencil size={14} /> Editar
                    </button>
                    <button onClick={() => handleDelete(country.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1">
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {countries.length === 0 && !showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-12 text-center">
            <Globe size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No hay países creados</p>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">Crear País</button>
          </div>
        )}
      </div>
    </div>
  );
}

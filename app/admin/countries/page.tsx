'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft, Globe } from 'lucide-react';

interface Country {
  id: string;
  name: string;
  slug: string;
  continent: string;
  code: string;
  image: string | null;
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', continent: 'Europa', code: '', image: '' });

  useEffect(() => { loadCountries(); }, []);

  const loadCountries = async () => {
    const { data, error } = await supabase.from('countries').select('*').order('continent, name');
    if (error) console.error('Error loading countries:', error);
    if (data) setCountries(data);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSend = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      continent: formData.continent,
      code: formData.code || null,
      image: formData.image || null
    };

    if (editingId) {
      const { error } = await supabase.from('countries').update(dataToSend).eq('id', editingId);
      if (error) { alert('Error: ' + error.message); return; }
    } else {
      const { error } = await supabase.from('countries').insert([dataToSend]);
      if (error) { alert('Error: ' + error.message); return; }
    }
    setShowForm(false);
    resetForm();
    loadCountries();
  };

  const handleEdit = (country: Country) => {
    setFormData({ 
      name: country.name, 
      slug: country.slug || '',
      continent: country.continent,
      code: country.code || '',
      image: country.image || ''
    });
    setEditingId(country.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este país?')) {
      const { error } = await supabase.from('countries').delete().eq('id', id);
      if (error) { alert('Error: ' + error.message); return; }
      loadCountries();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', continent: 'Europa', code: '', image: '' });
  };

  const countriesByContinent = countries.reduce((acc, country) => {
    if (!acc[country.continent]) acc[country.continent] = [];
    acc[country.continent].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  if (showForm) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => { setShowForm(false); resetForm(); }} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft size={20} />
            Volver a Países
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Editar' : 'Nuevo'} País</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Nombre *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })} 
                    className={inputClass} 
                    placeholder="España"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Slug</label>
                  <input 
                    type="text" 
                    value={formData.slug} 
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                    className={inputClass} 
                    placeholder="espana"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Continente *</label>
                  <select 
                    value={formData.continent} 
                    onChange={(e) => setFormData({ ...formData, continent: e.target.value })} 
                    className={inputClass} 
                    required
                  >
                    <option value="Europa">Europa</option>
                    <option value="Asia">Asia</option>
                    <option value="África">África</option>
                    <option value="América del Norte">América del Norte</option>
                    <option value="América del Sur">América del Sur</option>
                    <option value="Oceanía">Oceanía</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Código (ISO)</label>
                  <input 
                    type="text" 
                    value={formData.code} 
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} 
                    className={inputClass} 
                    placeholder="ES"
                    maxLength={3}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Imagen (URL)</label>
                <input 
                  type="url" 
                  value={formData.image} 
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                  className={inputClass} 
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={20} />
          Volver al Panel Admin
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Países</h1>
            <p className="text-gray-600 mt-1">Gestiona los países disponibles ({countries.length})</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
            <Plus size={20} />
            Nuevo País
          </button>
        </div>

        {Object.keys(countriesByContinent).length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Globe size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No hay países creados</p>
            <button onClick={() => setShowForm(true)} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Crear primer país
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(countriesByContinent).sort().map(([continent, countryList]) => (
              <div key={continent} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe size={20} />
                  {continent}
                  <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">
                    {countryList.length}
                  </span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {countryList.map((country) => (
                    <div key={country.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between hover:bg-gray-100 transition-colors">
                      <div>
                        <span className="font-medium text-gray-900">{country.name}</span>
                        {country.code && <span className="text-xs text-gray-500 ml-2">({country.code})</span>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(country)} className="text-gray-600 hover:text-blue-600 transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(country.id)} className="text-gray-600 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

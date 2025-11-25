'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft, Globe } from 'lucide-react';

interface Country {
  id: string;
  name: string;
  continent: string;
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', continent: 'Europa' });

  useEffect(() => { loadCountries(); }, []);

  const loadCountries = async () => {
    const { data } = await supabase.from('countries').select('*').order('continent, name');
    if (data) setCountries(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await supabase.from('countries').update(formData).eq('id', editingId);
      if (error) { alert('Error: ' + error.message); return; }
    } else {
      const { error } = await supabase.from('countries').insert([formData]);
      if (error) { alert('Error: ' + error.message); return; }
    }
    setShowForm(false);
    resetForm();
    loadCountries();
  };

  const handleEdit = (country: Country) => {
    setFormData({ name: country.name, continent: country.continent });
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
    setFormData({ name: '', continent: 'Europa' });
  };

  const countriesByContinent = countries.reduce((acc, country) => {
    if (!acc[country.continent]) acc[country.continent] = [];
    acc[country.continent].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

  if (showForm) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/countries" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft size={20} />
            Volver a Países
          </Link>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Editar' : 'Nuevo'} País</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Nombre *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Continente *</label>
                <select value={formData.continent} onChange={(e) => setFormData({ ...formData, continent: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                  <option value="Europa">Europa</option>
                  <option value="Asia">Asia</option>
                  <option value="África">África</option>
                  <option value="América del Norte">América del Norte</option>
                  <option value="América del Sur">América del Sur</option>
                  <option value="Oceanía">Oceanía</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">{editingId ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
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
            <p className="text-gray-600 mt-1">Gestiona los países disponibles</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
            <Plus size={20} />
            Nuevo País
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(countriesByContinent).map(([continent, countryList]) => (
            <div key={continent} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe size={20} />
                {continent}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {countryList.map((country) => (
                  <div key={country.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between hover:bg-gray-100 transition-colors">
                    <span className="font-medium text-gray-900">{country.name}</span>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(country)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(country.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

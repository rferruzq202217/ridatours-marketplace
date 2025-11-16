'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface Monument {
  id: string;
  name: string;
  slug: string;
  city_id: string | null;
  description: string | null;
  image: string | null;
  cities?: { name: string };
  monument_categories?: Array<{ categories: { id: string; name: string } }>;
}

interface City {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function MonumentsPage() {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    city_id: '',
    description: '',
    image: '',
    selectedCategories: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: monumentsData } = await supabase
      .from('monuments')
      .select(`
        *,
        cities(name),
        monument_categories(categories(id, name))
      `)
      .order('name');
    
    if (monumentsData) setMonuments(monumentsData);

    const { data: citiesData } = await supabase
      .from('cities')
      .select('id, name, slug')
      .order('name');
    
    if (citiesData) setCities(citiesData);

    const { data: categoriesData } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name');
    
    if (categoriesData) setCategories(categoriesData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSave = {
        name: formData.name,
        slug: formData.slug,
        city_id: formData.city_id || null,
        description: formData.description || null,
        image: formData.image || null
      };

      let monumentId = editingId;

      if (editingId) {
        const { error } = await supabase
          .from('monuments')
          .update(dataToSave)
          .eq('id', editingId);
        
        if (error) {
          alert('Error al actualizar: ' + error.message);
          return;
        }

        await supabase
          .from('monument_categories')
          .delete()
          .eq('monument_id', editingId);
      } else {
        const { data: newMon, error } = await supabase
          .from('monuments')
          .insert([dataToSave])
          .select()
          .single();
        
        if (error) {
          alert('Error al crear: ' + error.message);
          return;
        }

        monumentId = newMon.id;
      }

      if (formData.selectedCategories.length > 0 && monumentId) {
        const categoryRelations = formData.selectedCategories.map(catId => ({
          monument_id: monumentId,
          category_id: catId
        }));

        const { error: catError } = await supabase
          .from('monument_categories')
          .insert(categoryRelations);

        if (catError) {
          alert('Error al asignar categorías: ' + catError.message);
          return;
        }
      }

      setShowForm(false);
      resetForm();
      loadData();
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Error inesperado');
    }
  };

  const handleEdit = (monument: Monument) => {
    const categoryIds = monument.monument_categories?.map(
      mc => mc.categories.id
    ) || [];

    setFormData({
      name: monument.name,
      slug: monument.slug,
      city_id: monument.city_id || '',
      description: monument.description || '',
      image: monument.image || '',
      selectedCategories: categoryIds
    });
    setEditingId(monument.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este monumento?')) {
      const { error } = await supabase.from('monuments').delete().eq('id', id);
      if (error) {
        alert('Error al eliminar: ' + error.message);
        return;
      }
      loadData();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      city_id: '',
      description: '',
      image: '',
      selectedCategories: []
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId]
    }));
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
              <h1 className="text-3xl font-bold text-gray-900">Monumentos</h1>
              <p className="text-gray-800 font-medium">Gestiona los lugares emblemáticos</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Nuevo Monumento
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Editar' : 'Nuevo'} Monumento</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Ciudad *</label>
                <select
                  value={formData.city_id}
                  onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                  required
                >
                  <option value="">Seleccionar ciudad</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Categorías (múltiples)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-amber-500 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                  placeholder="Descripción del monumento que aparecerá en su página"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">URL de Imagen</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold">
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-2 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monuments.map((monument) => {
            const categoryNames = monument.monument_categories?.map(
              mc => mc.categories.name
            ) || [];

            return (
              <div key={monument.id} className="bg-white rounded-xl border-2 border-gray-300 overflow-hidden hover:shadow-lg transition-all">
                {monument.image && (
                  <div className="relative h-48">
                    <Image src={monument.image} alt={monument.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{monument.name}</h3>
                  <p className="text-sm text-gray-800 font-medium mb-1">{monument.cities?.name || 'Sin ciudad'}</p>
                  {categoryNames.length > 0 && (
                    <p className="text-xs text-gray-600 mb-2">{categoryNames.join(', ')}</p>
                  )}
                  <p className="text-sm text-gray-600 mb-2">/{monument.slug}</p>
                  {monument.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">{monument.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(monument)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(monument.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {monuments.length === 0 && !showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-12 text-center">
            <p className="text-gray-800 font-semibold mb-4">No hay monumentos creados aún</p>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Crear Primer Monumento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

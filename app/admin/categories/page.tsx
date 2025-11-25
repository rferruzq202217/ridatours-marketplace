'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import IconPicker from '@/components/IconPicker';
import { AVAILABLE_ICONS } from '@/lib/icons';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    slug: '',
    icon_name: 'Landmark'
  });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) console.error('Error loading categories:', error);
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { error } = await supabase.from('categories').update({
          name: formData.name,
          slug: formData.slug,
          icon_name: formData.icon_name
        }).eq('id', editingId);
        
        if (error) {
          console.error('Error completo:', error);
          alert('Error al actualizar: ' + error.message);
          return;
        }
      } else {
        const { error } = await supabase.from('categories').insert([{
          name: formData.name,
          slug: formData.slug,
          icon_name: formData.icon_name
        }]);
        
        if (error) {
          console.error('Error completo:', error);
          alert('Error al crear: ' + error.message);
          return;
        }
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', slug: '', icon_name: 'Landmark' });
      loadCategories();
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({ 
      name: category.name, 
      slug: category.slug,
      icon_name: category.icon_name || 'Landmark'
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta categoría?')) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        alert('Error al eliminar: ' + error.message);
        return;
      }
      loadCategories();
    }
  };

  const generateSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  if (showForm) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/categories" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft size={20} />
            Volver a Categorías
          </Link>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Editar' : 'Nueva'} Categoría</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Nombre *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Slug *</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div>
                <IconPicker value={formData.icon_name} onChange={(iconName) => setFormData({ ...formData, icon_name: iconName })} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">{editingId ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ name: '', slug: '', icon_name: 'Landmark' }); }} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
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
            <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
            <p className="text-gray-600 mt-1">Gestiona las categorías de experiencias</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
            <Plus size={20} />
            Nueva Categoría
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const iconData = AVAILABLE_ICONS.find(i => i.name === category.icon_name) || AVAILABLE_ICONS[0];
            const IconComponent = iconData.icon;
            return (
              <div key={category.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <IconComponent size={32} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{category.slug}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(category)} className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil size={16} className="mx-auto" />
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} className="mx-auto" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

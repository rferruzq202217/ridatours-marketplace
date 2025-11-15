'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft, Star, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Experience {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  city_id: string | null;
  category_id: string | null;
  price: number;
  rating: number;
  reviews: number;
  duration: string | null;
  main_image: string | null;
  gallery: string[];
  widget_id: string | null;
  featured: boolean;
  active: boolean;
  cities?: { name: string };
  categories?: { name: string };
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

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    long_description: '',
    city_id: '',
    category_id: '',
    price: 0,
    rating: 4.5,
    reviews: 0,
    duration: '',
    main_image: '',
    gallery: '',
    widget_id: '',
    featured: false,
    active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Cargar experiencias
    const { data: expData } = await supabase
      .from('experiences')
      .select(`
        *,
        cities(name),
        categories(name)
      `)
      .order('created_at', { ascending: false });
    
    if (expData) setExperiences(expData);

    // Cargar ciudades
    const { data: citiesData } = await supabase
      .from('cities')
      .select('id, name, slug')
      .order('name');
    
    if (citiesData) setCities(citiesData);

    // Cargar categorías
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name');
    
    if (categoriesData) setCategories(categoriesData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convertir galería de string separado por comas a array
      const galleryArray = formData.gallery
        ? formData.gallery.split(',').map(url => url.trim()).filter(url => url)
        : [];

      const dataToSave = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description || null,
        long_description: formData.long_description || null,
        city_id: formData.city_id || null,
        category_id: formData.category_id || null,
        price: parseFloat(formData.price.toString()),
        rating: parseFloat(formData.rating.toString()),
        reviews: parseInt(formData.reviews.toString()),
        duration: formData.duration || null,
        main_image: formData.main_image || null,
        gallery: galleryArray,
        widget_id: formData.widget_id || null,
        featured: formData.featured,
        active: formData.active
      };

      if (editingId) {
        const { error } = await supabase
          .from('experiences')
          .update(dataToSave)
          .eq('id', editingId);
        
        if (error) {
          alert('Error al actualizar: ' + error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('experiences')
          .insert([dataToSave]);
        
        if (error) {
          alert('Error al crear: ' + error.message);
          return;
        }
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Error inesperado');
    }
  };

  const handleEdit = (exp: Experience) => {
    setFormData({
      title: exp.title,
      slug: exp.slug,
      description: exp.description || '',
      long_description: exp.long_description || '',
      city_id: exp.city_id || '',
      category_id: exp.category_id || '',
      price: exp.price,
      rating: exp.rating,
      reviews: exp.reviews,
      duration: exp.duration || '',
      main_image: exp.main_image || '',
      gallery: exp.gallery?.join(', ') || '',
      widget_id: exp.widget_id || '',
      featured: exp.featured,
      active: exp.active
    });
    setEditingId(exp.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta experiencia?')) {
      const { error } = await supabase.from('experiences').delete().eq('id', id);
      if (error) {
        alert('Error al eliminar: ' + error.message);
        return;
      }
      loadData();
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      long_description: '',
      city_id: '',
      category_id: '',
      price: 0,
      rating: 4.5,
      reviews: 0,
      duration: '',
      main_image: '',
      gallery: '',
      widget_id: '',
      featured: false,
      active: true
    });
  };

  const generateSlug = (title: string) => {
    return title
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
              <h1 className="text-3xl font-bold text-gray-900">Experiencias y Tours</h1>
              <p className="text-gray-800 font-medium">Gestiona tus productos del marketplace</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                resetForm();
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Nueva Experiencia
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Editar' : 'Nueva'} Experiencia</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Fila 1: Título */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                  required
                />
              </div>

              {/* Fila 2: Slug */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                  required
                />
              </div>

              {/* Fila 3: Ciudad y Categoría */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Ciudad *</label>
                  <select
                    value={formData.city_id}
                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                    required
                  >
                    <option value="">Seleccionar ciudad</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Categoría</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                  >
                    <option value="">Sin categoría</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fila 4: Descripción corta */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Descripción corta</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                  placeholder="Para tarjetas y listados"
                />
              </div>

              {/* Fila 5: Descripción larga */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Descripción larga</label>
                <textarea
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                  placeholder="Para la página del producto"
                />
              </div>

              {/* Fila 6: Precio, Rating, Reviews, Duración */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Precio (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Reviews</label>
                  <input
                    type="number"
                    value={formData.reviews}
                    onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Duración</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Ej: 2h, 3h 30m"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                  />
                </div>
              </div>

              {/* Fila 7: Imagen principal */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">URL Imagen Principal</label>
                <input
                  type="url"
                  value={formData.main_image}
                  onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                />
              </div>

              {/* Fila 8: Galería */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Galería (URLs separadas por comas)</label>
                <textarea
                  value={formData.gallery}
                  onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
                  rows={2}
                  placeholder="https://image1.jpg, https://image2.jpg, https://image3.jpg"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                />
              </div>

              {/* Fila 9: Widget ID */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Widget ID de Regiondo</label>
                <input
                  type="text"
                  value={formData.widget_id}
                  onChange={(e) => setFormData({ ...formData, widget_id: e.target.value })}
                  placeholder="07df3e12-8853-4549-8b62-13cb958e9562"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                />
              </div>

              {/* Fila 10: Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-bold text-gray-900">Destacado (badge -30%)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-bold text-gray-900">Activo (visible en web)</span>
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold">
                  {editingId ? 'Actualizar' : 'Crear'} Experiencia
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de experiencias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="bg-white rounded-xl border-2 border-gray-300 overflow-hidden hover:shadow-lg transition-all">
              {exp.main_image && (
                <div className="relative h-48">
                  <Image src={exp.main_image} alt={exp.title} fill className="object-cover" />
                  {exp.featured && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      DESTACADO
                    </div>
                  )}
                  {!exp.active && (
                    <div className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold">
                      INACTIVO
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <span className="font-semibold">{exp.cities?.name || 'Sin ciudad'}</span>
                  {exp.categories?.name && (
                    <>
                      <span>•</span>
                      <span>{exp.categories.name}</span>
                    </>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{exp.title}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-bold text-gray-900">{exp.rating}</span>
                    <span className="text-xs text-gray-600">({exp.reviews})</span>
                  </div>
                  {exp.duration && (
                    <span className="text-sm text-gray-600">{exp.duration}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div>
                    <div className="text-xs text-gray-600">Desde</div>
                    <div className="text-2xl font-bold text-purple-700">€{exp.price}</div>
                  </div>
                  {exp.gallery && exp.gallery.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <ImageIcon size={14} />
                      <span>{exp.gallery.length} fotos</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1"
                  >
                    <Pencil size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
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
        
        {experiences.length === 0 && !showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-12 text-center">
            <p className="text-gray-800 font-semibold mb-4">No hay experiencias creadas aún</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Crear Primera Experiencia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

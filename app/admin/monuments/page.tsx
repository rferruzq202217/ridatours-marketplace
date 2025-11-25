'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft, GripVertical } from 'lucide-react';
import Image from 'next/image';

interface Monument {
  id: string;
  name: string;
  slug: string;
  city_id: string | null;
  description: string | null;
  image: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  why_visit: string[] | null;
  what_to_see: string[] | null;
  practical_tips: string[] | null;
  faq: any | null;
  gallery: string[] | null;
  opening_hours: string | null;
  address: string | null;
  tickets_from: number | null;
  tiqets_venue_id: string | null;
  tiqets_campaign: string | null;
  tiqets_item_count: number | null;
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

interface Experience {
  id: string;
  title: string;
  city_id: string;
}

export default function MonumentsPage() {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    city_id: '',
    description: '',
    image: '',
    selectedCategories: [] as string[],
    hero_title: '',
    hero_subtitle: '',
    why_visit: '',
    what_to_see: '',
    practical_tips: '',
    faq: '',
    gallery: '',
    opening_hours: '',
    address: '',
    tickets_from: 0,
    tiqets_venue_id: '',
    tiqets_campaign: '',
    tiqets_item_count: 12,
    recommendedExperiences: [] as string[]
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

    const { data: experiencesData } = await supabase
      .from('experiences')
      .select('id, title, city_id')
      .eq('active', true)
      .order('title');
    
    if (experiencesData) setExperiences(experiencesData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const whyVisitArray = formData.why_visit
        ? formData.why_visit.split('\n').map(item => item.trim()).filter(item => item)
        : [];

      const whatToSeeArray = formData.what_to_see
        ? formData.what_to_see.split('\n').map(item => item.trim()).filter(item => item)
        : [];

      const tipsArray = formData.practical_tips
        ? formData.practical_tips.split('\n').map(item => item.trim()).filter(item => item)
        : [];

      const galleryArray = formData.gallery
        ? formData.gallery.split(',').map(url => url.trim()).filter(url => url)
        : [];

      let faqData = null;
      if (formData.faq.trim()) {
        try {
          faqData = JSON.parse(formData.faq);
        } catch (e) {
          alert('El FAQ debe ser JSON válido. Ejemplo: [{"question":"¿Horario?","answer":"9-17h"}]');
          return;
        }
      }

      const dataToSave = {
        name: formData.name,
        slug: formData.slug,
        city_id: formData.city_id || null,
        description: formData.description || null,
        image: formData.image || null,
        hero_title: formData.hero_title || null,
        hero_subtitle: formData.hero_subtitle || null,
        why_visit: whyVisitArray.length > 0 ? whyVisitArray : null,
        what_to_see: whatToSeeArray.length > 0 ? whatToSeeArray : null,
        practical_tips: tipsArray.length > 0 ? tipsArray : null,
        faq: faqData,
        gallery: galleryArray.length > 0 ? galleryArray : null,
        opening_hours: formData.opening_hours || null,
        address: formData.address || null,
        tickets_from: formData.tickets_from > 0 ? parseFloat(formData.tickets_from.toString()) : null,
        tiqets_venue_id: formData.tiqets_venue_id || null,
        tiqets_campaign: formData.tiqets_campaign || null,
        tiqets_item_count: formData.tiqets_item_count > 0 ? parseInt(formData.tiqets_item_count.toString()) : 12
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

        await supabase
          .from('monument_recommended_experiences')
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

      if (formData.recommendedExperiences.length > 0 && monumentId) {
        const recommendedRelations = formData.recommendedExperiences.map((expId, index) => ({
          monument_id: monumentId,
          experience_id: expId,
          display_order: index
        }));

        const { error: recError } = await supabase
          .from('monument_recommended_experiences')
          .insert(recommendedRelations);

        if (recError) {
          alert('Error al asignar experiencias recomendadas: ' + recError.message);
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

  const handleEdit = async (monument: Monument) => {
    const categoryIds = monument.monument_categories?.map(
      mc => mc.categories.id
    ) || [];

    const { data: recommended } = await supabase
      .from('monument_recommended_experiences')
      .select('experience_id')
      .eq('monument_id', monument.id)
      .order('display_order');

    const recommendedIds = recommended?.map(r => r.experience_id) || [];

    setFormData({
      name: monument.name,
      slug: monument.slug,
      city_id: monument.city_id || '',
      description: monument.description || '',
      image: monument.image || '',
      selectedCategories: categoryIds,
      hero_title: monument.hero_title || '',
      hero_subtitle: monument.hero_subtitle || '',
      why_visit: monument.why_visit?.join('\n') || '',
      what_to_see: monument.what_to_see?.join('\n') || '',
      practical_tips: monument.practical_tips?.join('\n') || '',
      faq: monument.faq ? JSON.stringify(monument.faq, null, 2) : '',
      gallery: monument.gallery?.join(', ') || '',
      opening_hours: monument.opening_hours || '',
      address: monument.address || '',
      tickets_from: monument.tickets_from || 0,
      tiqets_venue_id: monument.tiqets_venue_id || '',
      tiqets_campaign: monument.tiqets_campaign || '',
      tiqets_item_count: monument.tiqets_item_count || 12,
      recommendedExperiences: recommendedIds
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
      selectedCategories: [],
      hero_title: '',
      hero_subtitle: '',
      why_visit: '',
      what_to_see: '',
      practical_tips: '',
      faq: '',
      gallery: '',
      opening_hours: '',
      address: '',
      tickets_from: 0,
      tiqets_venue_id: '',
      tiqets_campaign: '',
      tiqets_item_count: 12,
      recommendedExperiences: []
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

  const toggleRecommendedExperience = (expId: string) => {
    setFormData(prev => ({
      ...prev,
      recommendedExperiences: prev.recommendedExperiences.includes(expId)
        ? prev.recommendedExperiences.filter(id => id !== expId)
        : [...prev.recommendedExperiences, expId]
    }));
  };

  const availableExperiences = formData.city_id
    ? experiences.filter(e => e.city_id === formData.city_id)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-semibold text-2xl">
                <span className="font-bold">RIDATOURS</span> /
                <ArrowLeft size={20} />
                Volver al panel
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Monumentos</h1>
              <p className="text-gray-600 mt-1">Gestiona los monumentos y atracciones</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Nuevo Monumento
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-6 mb-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Editar' : 'Nuevo'} Monumento</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* INFORMACIÓN BÁSICA */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Información Básica</h3>
                
                <div className="space-y-4">
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
                    <label className="block text-sm font-bold text-gray-900 mb-2">Descripción breve</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                      placeholder="Descripción corta que aparecerá en listados y tarjetas"
                    />
                  </div>
                </div>
              </div>

              {/* HERO SECTION */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sección Hero</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Título Hero</label>
                    <input
                      type="text"
                      value={formData.hero_title}
                      onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                      placeholder="Ej: Descubre el Coliseo Romano"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Subtítulo Hero</label>
                    <input
                      type="text"
                      value={formData.hero_subtitle}
                      onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                      placeholder="Ej: El anfiteatro más grande del mundo"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Precio desde (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.tickets_from}
                      onChange={(e) => setFormData({ ...formData, tickets_from: parseFloat(e.target.value) })}
                      placeholder="19.50"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* IMÁGENES */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Imágenes</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Imagen Principal</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Galería (URLs separadas por comas)</label>
                    <textarea
                      value={formData.gallery}
                      onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
                      rows={2}
                      placeholder="https://image1.jpg, https://image2.jpg, https://image3.jpg"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* CONTENIDO LANDING */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contenido de Landing</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">¿Por qué visitar? (uno por línea)</label>
                    <textarea
                      value={formData.why_visit}
                      onChange={(e) => setFormData({ ...formData, why_visit: e.target.value })}
                      rows={4}
                      placeholder="Patrimonio UNESCO&#10;Arquitectura impresionante&#10;Historia milenaria"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Qué ver (uno por línea)</label>
                    <textarea
                      value={formData.what_to_see}
                      onChange={(e) => setFormData({ ...formData, what_to_see: e.target.value })}
                      rows={4}
                      placeholder="La Arena&#10;El Hipogeo&#10;Los pisos superiores"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Consejos prácticos (uno por línea)</label>
                    <textarea
                      value={formData.practical_tips}
                      onChange={(e) => setFormData({ ...formData, practical_tips: e.target.value })}
                      rows={4}
                      placeholder="Compra con antelación&#10;Llega temprano&#10;Lleva agua"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">FAQ (JSON)</label>
                    <textarea
                      value={formData.faq}
                      onChange={(e) => setFormData({ ...formData, faq: e.target.value })}
                      rows={6}
                      placeholder='[{"question":"¿Cuál es el horario?","answer":"9:00 - 17:00"},{"question":"¿Hay descuentos?","answer":"Sí, para menores de 18"}]'
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium font-mono text-sm"
                    />
                    <p className="text-xs text-gray-600 mt-1">Formato JSON con question y answer</p>
                  </div>
                </div>
              </div>

              {/* INFORMACIÓN PRÁCTICA */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Información Práctica</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Horarios</label>
                    <input
                      type="text"
                      value={formData.opening_hours}
                      onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                      placeholder="Lunes a Domingo: 9:00 - 17:00"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Dirección</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Piazza del Colosseo, 1, 00184 Roma"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* WIDGET TIQETS */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Widget Tiqets (Discovery)</h3>
                <p className="text-sm text-gray-600 mb-4">Muestra productos de Tiqets relacionados con este monumento</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Tiqets Venue ID</label>
                    <input
                      type="text"
                      value={formData.tiqets_venue_id}
                      onChange={(e) => setFormData({ ...formData, tiqets_venue_id: e.target.value })}
                      placeholder="142007"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                    <p className="text-sm text-gray-600 mt-1">ID del venue en Tiqets</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Tiqets Campaign</label>
                    <input
                      type="text"
                      value={formData.tiqets_campaign}
                      onChange={(e) => setFormData({ ...formData, tiqets_campaign: e.target.value })}
                      placeholder="Pantheon"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                    <p className="text-sm text-gray-600 mt-1">Nombre de la campaña</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Productos a mostrar</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.tiqets_item_count}
                      onChange={(e) => setFormData({ ...formData, tiqets_item_count: parseInt(e.target.value) || 12 })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                    <p className="text-sm text-gray-600 mt-1">Número de tarjetas (1-20)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Productos a mostrar</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.tiqets_item_count}
                      onChange={(e) => setFormData({ ...formData, tiqets_item_count: parseInt(e.target.value) || 12 })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 font-medium"
                    />
                    <p className="text-sm text-gray-600 mt-1">Número de tarjetas (1-20)</p>
                  </div>
                </div>
              </div>

              {/* CROSS-SELLING */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Cross-Selling (Experiencias Recomendadas)</h3>
                <p className="text-sm text-gray-600 mb-4">Selecciona experiencias propias para mostrar como recomendaciones</p>
                
                {!formData.city_id && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    Selecciona primero una ciudad arriba
                  </p>
                )}

                {formData.city_id && availableExperiences.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border-2 border-gray-200 rounded-lg p-4">
                    {availableExperiences.map(exp => (
                      <label key={exp.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={formData.recommendedExperiences.includes(exp.id)}
                          onChange={() => toggleRecommendedExperience(exp.id)}
                          className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm font-medium text-gray-900">{exp.title}</span>
                      </label>
                    ))}
                  </div>
                )}

                {formData.city_id && availableExperiences.length === 0 && (
                  <p className="text-sm text-gray-600">No hay experiencias disponibles para esta ciudad</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold">
                  {editingId ? 'Actualizar' : 'Crear'} Monumento
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded-lg font-semibold"
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
                  {monument.tickets_from && (
                    <p className="text-sm font-bold text-amber-600 mb-2">Desde €{monument.tickets_from}</p>
                  )}
                  {monument.tiqets_venue_id && (
                    <p className="text-xs text-green-600 mb-2">✓ Widget Tiqets configurado</p>
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
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
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

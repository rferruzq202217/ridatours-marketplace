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
    const { data: monumentsData, error: monumentsError } = await supabase
      .from('monuments')
      .select('*, cities(name)')
      .order('name');
    
    if (monumentsError) {
      console.error('Error loading monuments:', monumentsError);
      return;
    }
    
    if (monumentsData) {
      const { data: allCatRelations } = await supabase
        .from('monument_categories')
        .select('monument_id, category_id, categories(id, name)');
      
      const catMap = new Map();
      (allCatRelations || []).forEach(rel => {
        if (!catMap.has(rel.monument_id)) {
          catMap.set(rel.monument_id, []);
        }
        catMap.get(rel.monument_id).push(rel);
      });
      
      const monumentsWithCategories = monumentsData.map(mon => ({
        ...mon,
        monument_categories: catMap.get(mon.id) || []
      }));
      
      setMonuments(monumentsWithCategories);
    }

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
      .order('title');
    
    if (experiencesData) setExperiences(experiencesData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const monumentData = {
      name: formData.name,
      slug: formData.slug,
      city_id: formData.city_id || null,
      description: formData.description || null,
      image: formData.image || null,
      hero_title: formData.hero_title || null,
      hero_subtitle: formData.hero_subtitle || null,
      why_visit: formData.why_visit ? formData.why_visit.split('\n').filter(Boolean) : null,
      what_to_see: formData.what_to_see ? formData.what_to_see.split('\n').filter(Boolean) : null,
      practical_tips: formData.practical_tips ? formData.practical_tips.split('\n').filter(Boolean) : null,
      faq: formData.faq ? JSON.parse(formData.faq) : null,
      gallery: formData.gallery ? formData.gallery.split(',').map(s => s.trim()).filter(Boolean) : null,
      opening_hours: formData.opening_hours || null,
      address: formData.address || null,
      tickets_from: formData.tickets_from || null,
      tiqets_venue_id: formData.tiqets_venue_id || null,
      tiqets_campaign: formData.tiqets_campaign || null,
      tiqets_item_count: formData.tiqets_item_count || null
    };

    if (editingId) {
      const { error } = await supabase
        .from('monuments')
        .update(monumentData)
        .eq('id', editingId);
      
      if (error) {
        alert('Error al actualizar: ' + error.message);
        return;
      }

      await supabase
        .from('monument_categories')
        .delete()
        .eq('monument_id', editingId);
      
      if (formData.selectedCategories.length > 0) {
        const catInserts = formData.selectedCategories.map(cid => ({
          monument_id: editingId,
          category_id: cid
        }));
        await supabase.from('monument_categories').insert(catInserts);
      }

      await supabase
        .from('monument_recommended_experiences')
        .delete()
        .eq('monument_id', editingId);
      
      if (formData.recommendedExperiences.length > 0) {
        const expInserts = formData.recommendedExperiences.map((eid, idx) => ({
          monument_id: editingId,
          experience_id: eid,
          order_index: idx
        }));
        await supabase.from('monument_recommended_experiences').insert(expInserts);
      }
    } else {
      const { data: newMonument, error } = await supabase
        .from('monuments')
        .insert([monumentData])
        .select()
        .single();
      
      if (error) {
        alert('Error al crear: ' + error.message);
        return;
      }
      
      if (newMonument) {
        if (formData.selectedCategories.length > 0) {
          const catInserts = formData.selectedCategories.map(cid => ({
            monument_id: newMonument.id,
            category_id: cid
          }));
          await supabase.from('monument_categories').insert(catInserts);
        }

        if (formData.recommendedExperiences.length > 0) {
          const expInserts = formData.recommendedExperiences.map((eid, idx) => ({
            monument_id: newMonument.id,
            experience_id: eid,
            order_index: idx
          }));
          await supabase.from('monument_recommended_experiences').insert(expInserts);
        }
      }
    }

    setShowForm(false);
    setEditingId(null);
    loadData();
  };

  const handleEdit = async (monument: Monument) => {
    const { data: recExps } = await supabase
      .from('monument_recommended_experiences')
      .select('experience_id')
      .eq('monument_id', monument.id)
      .order('order_index');

    setEditingId(monument.id);
    setFormData({
      name: monument.name,
      slug: monument.slug,
      city_id: monument.city_id || '',
      description: monument.description || '',
      image: monument.image || '',
      selectedCategories: monument.monument_categories?.map(mc => mc.categories.id) || [],
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
      recommendedExperiences: recExps?.map(re => re.experience_id) || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este monumento?')) return;
    
    await supabase.from('monument_categories').delete().eq('monument_id', id);
    await supabase.from('monument_recommended_experiences').delete().eq('monument_id', id);
    
    const { error } = await supabase.from('monuments').delete().eq('id', id);
    if (error) {
      alert('Error al eliminar: ' + error.message);
      return;
    }
    
    loadData();
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

  const generateSlug = (name: string) => 
    name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const availableExperiences = experiences.filter(exp => 
    !formData.city_id || exp.city_id === formData.city_id
  );

  if (showForm) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/monuments" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft size={20} />
            Volver a Monumentos
          </Link>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? 'Editar' : 'Nuevo'} Monumento
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Ciudad *</label>
                <select
                  value={formData.city_id}
                  onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar ciudad...</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Imagen Principal (URL)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Categorías</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.selectedCategories.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, selectedCategories: [...formData.selectedCategories, cat.id] });
                          } else {
                            setFormData({ ...formData, selectedCategories: formData.selectedCategories.filter(c => c !== cat.id) });
                          }
                        }}
                      />
                      <span className="text-sm text-gray-900">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Experiencias Recomendadas</label>
                {availableExperiences.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {availableExperiences.map(exp => (
                      <label key={exp.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.recommendedExperiences.includes(exp.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, recommendedExperiences: [...formData.recommendedExperiences, exp.id] });
                            } else {
                              setFormData({ ...formData, recommendedExperiences: formData.recommendedExperiences.filter(id => id !== exp.id) });
                            }
                          }}
                        />
                        <span className="text-sm text-gray-900">{exp.title}</span>
                      </label>
                    ))}
                  </div>
                ) : null}

                {formData.city_id && availableExperiences.length === 0 && (
                  <p className="text-sm text-gray-600">No hay experiencias disponibles para esta ciudad</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                  {editingId ? 'Actualizar' : 'Crear'} Monumento
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                >
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
            <h1 className="text-3xl font-bold text-gray-900">Monumentos</h1>
            <p className="text-gray-600 mt-1">Gestiona los monumentos y atracciones</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Nuevo Monumento
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monuments.map((monument) => (
            <div key={monument.id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-all">
              {monument.image && (
                <div className="relative h-48">
                  <Image src={monument.image} alt={monument.name} fill className="object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{monument.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{monument.cities?.name || 'Sin ciudad'}</p>
                {monument.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{monument.description}</p>
                )}
                <div className="flex flex-wrap gap-1 mb-3">
                  {monument.monument_categories && monument.monument_categories.map(mc => (
                    <span key={mc.categories.id} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                      {mc.categories.name}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 justify-center mt-4">
                  <button
                    onClick={() => handleEdit(monument)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Pencil size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(monument.id)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {monuments.length === 0 && !showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-12 text-center">
            <p className="text-gray-800 font-semibold mb-4">No hay monumentos creados aún</p>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
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

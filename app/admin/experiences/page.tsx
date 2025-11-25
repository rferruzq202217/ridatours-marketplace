'use client';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface Experience {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  city_id: string | null;
  monument_id: string | null;
  price: number;
  rating: number;
  reviews: number;
  duration: string | null;
  main_image: string | null;
  gallery: string[];
  widget_id: string | null;
  tiqets_venue_id: string | null;
  tiqets_campaign: string | null;
  featured: boolean;
  active: boolean;
  includes: string[] | null;
  not_includes: string[] | null;
  meeting_point: string | null;
  important_info: string | null;
  cancellation_policy: string | null;
  languages: string[] | null;
  accessibility: string | null;
  dress_code: string | null;
  restrictions: string | null;
  highlights: string[] | null;
  cities?: { name: string };
  monuments?: { name: string };
  experience_categories?: Array<{ category_id: string; categories: { id: string; name: string } }>;
}

interface City { id: string; name: string; slug: string; }
interface Category { id: string; name: string; slug: string; }
interface Monument { id: string; name: string; slug: string; city_id: string; }

const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const textareaClass = "w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const selectClass = "w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent";

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterWidget, setFilterWidget] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', long_description: '', city_id: '', monument_id: '',
    selectedCategories: [] as string[], price: 0, rating: 4.5, reviews: 0, duration: '',
    main_image: '', gallery: '', widget_id: '', tiqets_venue_id: '', tiqets_campaign: '',
    featured: false, active: false,
    includes: '', not_includes: '', meeting_point: '',
    important_info: '', cancellation_policy: '', languages: '', accessibility: '',
    dress_code: '', restrictions: '', highlights: ''
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: expData, error: expError } = await supabase
      .from('experiences')
      .select('*, cities(name)')
      .order('created_at', { ascending: false });
    
    if (expError) { console.error('Error experiences:', expError); return; }
    
    if (expData) {
      const { data: allCatRelations } = await supabase
        .from('experience_categories')
        .select('experience_id, category_id, categories(id, name)');
      
      const catMap = new Map();
      (allCatRelations || []).forEach(rel => {
        if (!catMap.has(rel.experience_id)) catMap.set(rel.experience_id, []);
        catMap.get(rel.experience_id).push(rel);
      });
      
      const expWithCategories = expData.map(exp => ({
        ...exp,
        experience_categories: catMap.get(exp.id) || []
      }));
      
      setExperiences(expWithCategories);
    }

    const { data: citiesData } = await supabase.from('cities').select('id, name, slug').order('name');
    if (citiesData) setCities(citiesData);

    const { data: categoriesData } = await supabase.from('categories').select('id, name, slug').order('name');
    if (categoriesData) setCategories(categoriesData);

    const { data: monumentsData } = await supabase.from('monuments').select('id, name, slug, city_id').order('name');
    if (monumentsData) setMonuments(monumentsData);
  };

  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => {
      const matchesSearch = searchTerm === '' || 
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.description && exp.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCity = filterCity === 'all' || exp.city_id === filterCity;
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'active' && exp.active) ||
        (filterStatus === 'inactive' && !exp.active);
      
      let matchesWidget = true;
      if (filterWidget === 'tiqets') {
        matchesWidget = !!exp.tiqets_venue_id;
      } else if (filterWidget === 'regiondo') {
        matchesWidget = !!exp.widget_id;
      } else if (filterWidget === 'none') {
        matchesWidget = !exp.tiqets_venue_id && !exp.widget_id;
      }
      
      return matchesSearch && matchesCity && matchesStatus && matchesWidget;
    });
  }, [experiences, searchTerm, filterCity, filterStatus, filterWidget]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCity('all');
    setFilterStatus('all');
    setFilterWidget('all');
  };

  const hasActiveFilters = searchTerm !== '' || filterCity !== 'all' || filterStatus !== 'all' || filterWidget !== 'all';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const expData = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: formData.description || null,
      long_description: formData.long_description || null,
      city_id: formData.city_id || null,
      monument_id: formData.monument_id || null,
      price: parseFloat(formData.price.toString()),
      rating: parseFloat(formData.rating.toString()),
      reviews: parseInt(formData.reviews.toString()),
      duration: formData.duration || null,
      main_image: formData.main_image || null,
      gallery: formData.gallery ? formData.gallery.split(',').map(s => s.trim()).filter(Boolean) : [],
      widget_id: formData.widget_id || null,
      tiqets_venue_id: formData.tiqets_venue_id || null,
      tiqets_campaign: formData.tiqets_campaign || null,
      featured: formData.featured,
      active: formData.active,
      includes: formData.includes ? formData.includes.split('\n').filter(Boolean) : null,
      not_includes: formData.not_includes ? formData.not_includes.split('\n').filter(Boolean) : null,
      meeting_point: formData.meeting_point || null,
      important_info: formData.important_info || null,
      cancellation_policy: formData.cancellation_policy || null,
      languages: formData.languages ? formData.languages.split(',').map(s => s.trim()).filter(Boolean) : null,
      accessibility: formData.accessibility || null,
      dress_code: formData.dress_code || null,
      restrictions: formData.restrictions || null,
      highlights: formData.highlights ? formData.highlights.split('\n').filter(Boolean) : null,
    };

    if (editingId) {
      const { error } = await supabase.from('experiences').update(expData).eq('id', editingId);
      if (error) { alert('Error al actualizar'); console.error(error); return; }
      
      await supabase.from('experience_categories').delete().eq('experience_id', editingId);
      if (formData.selectedCategories.length > 0) {
        const catInserts = formData.selectedCategories.map(cid => ({ experience_id: editingId, category_id: cid }));
        await supabase.from('experience_categories').insert(catInserts);
      }
    } else {
      const { data: newExp, error } = await supabase.from('experiences').insert([expData]).select().single();
      if (error) { alert('Error al crear'); console.error(error); return; }
      
      if (newExp && formData.selectedCategories.length > 0) {
        const catInserts = formData.selectedCategories.map(cid => ({ experience_id: newExp.id, category_id: cid }));
        await supabase.from('experience_categories').insert(catInserts);
      }
    }

    setShowForm(false);
    setEditingId(null);
    loadData();
  };

  const handleEdit = async (exp: Experience) => {
    setEditingId(exp.id);
    setFormData({
      title: exp.title,
      slug: exp.slug,
      description: exp.description || '',
      long_description: exp.long_description || '',
      city_id: exp.city_id || '',
      monument_id: exp.monument_id || '',
      selectedCategories: exp.experience_categories?.map(ec => ec.category_id) || [],
      price: exp.price,
      rating: exp.rating,
      reviews: exp.reviews,
      duration: exp.duration || '',
      main_image: exp.main_image || '',
      gallery: exp.gallery?.join(', ') || '',
      widget_id: exp.widget_id || '',
      tiqets_venue_id: exp.tiqets_venue_id || '',
      tiqets_campaign: exp.tiqets_campaign || '',
      featured: exp.featured,
      active: exp.active,
      includes: exp.includes?.join('\n') || '',
      not_includes: exp.not_includes?.join('\n') || '',
      meeting_point: exp.meeting_point || '',
      important_info: exp.important_info || '',
      cancellation_policy: exp.cancellation_policy || '',
      languages: exp.languages?.join(', ') || '',
      accessibility: exp.accessibility || '',
      dress_code: exp.dress_code || '',
      restrictions: exp.restrictions || '',
      highlights: exp.highlights?.join('\n') || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta experiencia?')) return;
    await supabase.from('experience_categories').delete().eq('experience_id', id);
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) { alert('Error al eliminar'); console.error(error); return; }
    loadData();
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => { setShowForm(false); setEditingId(null); }} className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            ← Volver a la lista
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">{editingId ? 'Editar Experiencia' : 'Nueva Experiencia'}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Título *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Slug</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="se-genera-automaticamente" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Ciudad *</label>
                  <select value={formData.city_id} onChange={(e) => setFormData({...formData, city_id: e.target.value})} className={selectClass} required>
                    <option value="">Seleccionar ciudad...</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Monumento (opcional)</label>
                  <select value={formData.monument_id} onChange={(e) => setFormData({...formData, monument_id: e.target.value})} className={selectClass}>
                    <option value="">Ninguno</option>
                    {monuments.filter(m => !formData.city_id || m.city_id === formData.city_id).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Descripción corta</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} className={textareaClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Descripción larga</label>
                <textarea value={formData.long_description} onChange={(e) => setFormData({...formData, long_description: e.target.value})} rows={6} className={textareaClass} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Precio (€) *</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Rating (1-5)</label>
                  <input type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Nº Opiniones</label>
                  <input type="number" value={formData.reviews} onChange={(e) => setFormData({...formData, reviews: parseInt(e.target.value) || 0})} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Duración (ej: "2 horas")</label>
                <input type="text" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Imagen principal (URL)</label>
                <input type="text" value={formData.main_image} onChange={(e) => setFormData({...formData, main_image: e.target.value})} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Galería de imágenes (URLs separadas por comas)</label>
                <textarea value={formData.gallery} onChange={(e) => setFormData({...formData, gallery: e.target.value})} rows={2} className={textareaClass} placeholder="https://..., https://..." />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold text-lg mb-3 text-gray-900">Widgets de Reserva</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Widget Regiondo ID</label>
                    <input type="text" value={formData.widget_id} onChange={(e) => setFormData({...formData, widget_id: e.target.value})} className={inputClass} placeholder="abc123..." />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Tiqets Widget</label>
                    <input type="text" value={formData.tiqets_venue_id} onChange={(e) => setFormData({...formData, tiqets_venue_id: e.target.value})} className={inputClass} placeholder="Venue ID (ej: 142007)" />
                    <input type="text" value={formData.tiqets_campaign} onChange={(e) => setFormData({...formData, tiqets_campaign: e.target.value})} className={inputClass} placeholder="Campaign (opcional)" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Categorías</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.selectedCategories.includes(cat.id)} onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, selectedCategories: [...formData.selectedCategories, cat.id]});
                        } else {
                          setFormData({...formData, selectedCategories: formData.selectedCategories.filter(c => c !== cat.id)});
                        }
                      }} />
                      <span className="text-sm text-gray-900">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Qué incluye (una por línea)</label>
                <textarea value={formData.includes} onChange={(e) => setFormData({...formData, includes: e.target.value})} rows={4} className={textareaClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Qué NO incluye (una por línea)</label>
                <textarea value={formData.not_includes} onChange={(e) => setFormData({...formData, not_includes: e.target.value})} rows={4} className={textareaClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Punto de encuentro</label>
                <textarea value={formData.meeting_point} onChange={(e) => setFormData({...formData, meeting_point: e.target.value})} rows={2} className={textareaClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Información importante</label>
                <textarea value={formData.important_info} onChange={(e) => setFormData({...formData, important_info: e.target.value})} rows={4} className={textareaClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Política de cancelación</label>
                <textarea value={formData.cancellation_policy} onChange={(e) => setFormData({...formData, cancellation_policy: e.target.value})} rows={3} className={textareaClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Idiomas (separados por comas)</label>
                  <input type="text" value={formData.languages} onChange={(e) => setFormData({...formData, languages: e.target.value})} className={inputClass} placeholder="Español, Inglés, Francés" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Accesibilidad</label>
                  <input type="text" value={formData.accessibility} onChange={(e) => setFormData({...formData, accessibility: e.target.value})} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Código de vestimenta</label>
                  <input type="text" value={formData.dress_code} onChange={(e) => setFormData({...formData, dress_code: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Restricciones</label>
                  <input type="text" value={formData.restrictions} onChange={(e) => setFormData({...formData, restrictions: e.target.value})} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Highlights (una por línea)</label>
                <textarea value={formData.highlights} onChange={(e) => setFormData({...formData, highlights: e.target.value})} rows={4} className={textareaClass} />
              </div>

              <div className="flex items-center gap-6 pt-4 border-t">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} />
                  <span className="text-sm font-medium text-gray-900">⭐ Destacada</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} />
                  <span className="text-sm font-medium text-gray-900">✅ Activa (visible en web)</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                  {editingId ? 'Actualizar' : 'Crear'} Experiencia
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Experiencias</h1>
            <p className="text-gray-600 mt-1">Gestiona las experiencias y actividades</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
            + Nueva Experiencia
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Buscar por título o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
                >
                  ×
                </button>
              )}
            </div>

            <div>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">🏙️ Todas las ciudades</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">⚡ Todos los estados</option>
                <option value="active">✅ Activas</option>
                <option value="inactive">❌ Inactivas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <select
                value={filterWidget}
                onChange={(e) => setFilterWidget(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">🎫 Todos los widgets</option>
                <option value="tiqets">Tiqets</option>
                <option value="regiondo">Regiondo</option>
                <option value="none">Sin widget</option>
              </select>
            </div>

            {hasActiveFilters && (
              <div>
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            <div className="md:col-span-2 md:col-start-3 flex items-center justify-end">
              <span className="text-sm text-gray-600">
                Mostrando <span className="font-bold text-gray-900">{filteredExperiences.length}</span> de <span className="font-bold text-gray-900">{experiences.length}</span> experiencias
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredExperiences.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">
                {hasActiveFilters ? 'No se encontraron experiencias con esos filtros' : 'No hay experiencias creadas'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredExperiences.map((exp) => (
                <div key={exp.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    {exp.main_image && exp.main_image.trim() !== '' ? (
                      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image src={exp.main_image} alt={exp.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-32 h-32 flex-shrink-0 rounded-lg bg-gray-200 flex items-center justify-center text-4xl">
                        🖼️
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{exp.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{exp.cities?.name || 'Sin ciudad'}</p>
                          {exp.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{exp.description}</p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">⭐</span>
                              <span className="font-semibold text-gray-900">{exp.rating}</span>
                              <span className="text-gray-500">({exp.reviews})</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <span className="font-semibold text-blue-600">€{exp.price}</span>
                            {exp.duration && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-600">{exp.duration}</span>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {exp.featured && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">⭐ Destacada</span>
                            )}
                            {exp.active ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">✅ Activa</span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">❌ Borrador</span>
                            )}
                            {exp.tiqets_venue_id && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">🎫 Tiqets</span>
                            )}
                            {exp.widget_id && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">🎫 Regiondo</span>
                            )}
                            {exp.experience_categories && exp.experience_categories.length > 0 && (
                              exp.experience_categories.map(ec => (
                                <span key={ec.category_id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {ec.categories.name}
                                </span>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(exp)} className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                            ✏️ Editar
                          </button>
                          <button onClick={() => handleDelete(exp.id)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

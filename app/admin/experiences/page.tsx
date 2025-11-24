'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft, Star, Image as ImageIcon, FileText, Globe } from 'lucide-react';
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

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', long_description: '', city_id: '', monument_id: '',
    selectedCategories: [] as string[], price: 0, rating: 4.5, reviews: 0, duration: '',
    main_image: '', gallery: '', widget_id: '', tiqets_venue_id: '', tiqets_campaign: '',
    featured: false, active: false, // Por defecto BORRADOR
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        title: formData.title, slug: formData.slug,
        description: formData.description || null, long_description: formData.long_description || null,
        city_id: formData.city_id || null, monument_id: formData.monument_id || null,
        price: parseFloat(formData.price.toString()), rating: parseFloat(formData.rating.toString()),
        reviews: parseInt(formData.reviews.toString()), duration: formData.duration || null,
        main_image: formData.main_image || null,
        gallery: formData.gallery ? formData.gallery.split(',').map(u => u.trim()).filter(u => u) : [],
        widget_id: formData.widget_id || null, tiqets_venue_id: formData.tiqets_venue_id || null,
        tiqets_campaign: formData.tiqets_campaign || null, featured: formData.featured, active: formData.active,
        includes: formData.includes ? formData.includes.split('\n').map(i => i.trim()).filter(i => i) : null,
        not_includes: formData.not_includes ? formData.not_includes.split('\n').map(i => i.trim()).filter(i => i) : null,
        meeting_point: formData.meeting_point || null, important_info: formData.important_info || null,
        cancellation_policy: formData.cancellation_policy || null,
        languages: formData.languages ? formData.languages.split(',').map(l => l.trim()).filter(l => l) : null,
        accessibility: formData.accessibility || null, dress_code: formData.dress_code || null,
        restrictions: formData.restrictions || null,
        highlights: formData.highlights ? formData.highlights.split('\n').map(h => h.trim()).filter(h => h) : null
      };

      let experienceId = editingId;

      if (editingId) {
        const { error } = await supabase.from('experiences').update(dataToSave).eq('id', editingId);
        if (error) { alert('Error al actualizar: ' + error.message); return; }
        await supabase.from('experience_categories').delete().eq('experience_id', editingId);
      } else {
        const { data: newExp, error } = await supabase.from('experiences').insert([dataToSave]).select().single();
        if (error) { alert('Error al crear: ' + error.message); return; }
        experienceId = newExp.id;
      }

      if (formData.selectedCategories.length > 0 && experienceId) {
        const relations = formData.selectedCategories.map(catId => ({ experience_id: experienceId, category_id: catId }));
        const { error: catError } = await supabase.from('experience_categories').insert(relations);
        if (catError) { alert('Error categorías: ' + catError.message); return; }
      }

      setShowForm(false);
      resetForm();
      loadData();
    } catch (err) { console.error(err); alert('Error inesperado'); }
  };

  const handleEdit = (exp: Experience) => {
    const categoryIds = exp.experience_categories?.map(ec => ec.categories?.id || ec.category_id).filter(Boolean) || [];
    setFormData({
      title: exp.title, slug: exp.slug, description: exp.description || '', long_description: exp.long_description || '',
      city_id: exp.city_id || '', monument_id: exp.monument_id || '', selectedCategories: categoryIds,
      price: exp.price, rating: exp.rating, reviews: exp.reviews, duration: exp.duration || '',
      main_image: exp.main_image || '', gallery: exp.gallery?.join(', ') || '',
      widget_id: exp.widget_id || '', tiqets_venue_id: exp.tiqets_venue_id || '', tiqets_campaign: exp.tiqets_campaign || '',
      featured: exp.featured, active: exp.active, includes: exp.includes?.join('\n') || '',
      not_includes: exp.not_includes?.join('\n') || '', meeting_point: exp.meeting_point || '',
      important_info: exp.important_info || '', cancellation_policy: exp.cancellation_policy || '',
      languages: exp.languages?.join(', ') || '', accessibility: exp.accessibility || '',
      dress_code: exp.dress_code || '', restrictions: exp.restrictions || '', highlights: exp.highlights?.join('\n') || ''
    });
    setEditingId(exp.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta experiencia?')) {
      await supabase.from('experience_categories').delete().eq('experience_id', id);
      const { error } = await supabase.from('experiences').delete().eq('id', id);
      if (error) { alert('Error: ' + error.message); return; }
      loadData();
    }
  };

  const togglePublishStatus = async (exp: Experience) => {
    const newStatus = !exp.active;
    const { error } = await supabase.from('experiences').update({ active: newStatus }).eq('id', exp.id);
    if (error) { alert('Error: ' + error.message); return; }
    loadData();
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '', slug: '', description: '', long_description: '', city_id: '', monument_id: '',
      selectedCategories: [], price: 0, rating: 4.5, reviews: 0, duration: '', main_image: '', gallery: '',
      widget_id: '', tiqets_venue_id: '', tiqets_campaign: '', featured: false, active: false,
      includes: '', not_includes: '', meeting_point: '', important_info: '', cancellation_policy: '',
      languages: '', accessibility: '', dress_code: '', restrictions: '', highlights: ''
    });
  };

  const generateSlug = (title: string) => title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const toggleCategory = (id: string) => setFormData(p => ({ ...p, selectedCategories: p.selectedCategories.includes(id) ? p.selectedCategories.filter(i => i !== id) : [...p.selectedCategories, id] }));
  const availableMonuments = formData.city_id ? monuments.filter(m => m.city_id === formData.city_id) : [];

  // Separar experiencias por estado
  const publishedExperiences = experiences.filter(e => e.active);
  const draftExperiences = experiences.filter(e => !e.active);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-semibold text-2xl">
                <span className="font-bold">RIDATOURS</span> / <ArrowLeft size={20} /> Volver
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Experiencias y Tours</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="inline-flex items-center gap-1 text-sm">
                  <Globe size={16} className="text-green-600" />
                  <span className="font-semibold text-green-600">{publishedExperiences.length} publicadas</span>
                </span>
                <span className="inline-flex items-center gap-1 text-sm">
                  <FileText size={16} className="text-gray-500" />
                  <span className="font-semibold text-gray-500">{draftExperiences.length} borradores</span>
                </span>
              </div>
            </div>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
              <Plus size={20} /> Nueva Experiencia
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-6 mb-6 max-h-[80vh] overflow-y-auto">
            {/* Header del formulario con botón de estado */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{editingId ? 'Editar' : 'Nueva'} Experiencia</h2>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, active: !formData.active })}
                className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-all ${
                  formData.active 
                    ? 'bg-green-100 text-green-700 border-2 border-green-500 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {formData.active ? (
                  <><Globe size={16} /> Publicada</>
                ) : (
                  <><FileText size={16} /> Borrador</>
                )}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Información Básica</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Título *</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Slug *</label>
                    <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Ciudad *</label>
                      <select value={formData.city_id} onChange={(e) => setFormData({ ...formData, city_id: e.target.value, monument_id: '' })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" required>
                        <option value="">Seleccionar</option>
                        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Monumento</label>
                      <select value={formData.monument_id} onChange={(e) => setFormData({ ...formData, monument_id: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" disabled={!formData.city_id}>
                        <option value="">Sin monumento</option>
                        {availableMonuments.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">Categorías</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map(cat => (
                        <label key={cat.id} className={`flex items-center gap-2 cursor-pointer p-3 border-2 rounded-lg transition-colors ${formData.selectedCategories.includes(cat.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                          <input type="checkbox" checked={formData.selectedCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} className="w-5 h-5 text-purple-600 rounded" />
                          <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                    {formData.selectedCategories.length > 0 && <p className="text-sm text-purple-600 mt-2 font-medium">{formData.selectedCategories.length} seleccionada(s)</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Descripción corta</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Descripción larga</label>
                    <textarea value={formData.long_description} onChange={(e) => setFormData({ ...formData, long_description: e.target.value })} rows={4} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" />
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Precio y Datos</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Precio € *</label><input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" required /></div>
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Rating</label><input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Reviews</label><input type="number" value={formData.reviews} onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Duración</label><input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="2h 30m" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Imágenes</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">URL Imagen Principal</label><input type="url" value={formData.main_image} onChange={(e) => setFormData({ ...formData, main_image: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Galería (URLs separadas por comas)</label><textarea value={formData.gallery} onChange={(e) => setFormData({ ...formData, gallery: e.target.value })} rows={2} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Highlights</h3>
                <textarea value={formData.highlights} onChange={(e) => setFormData({ ...formData, highlights: e.target.value })} rows={4} placeholder="Uno por línea" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" />
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Incluye / No Incluye</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Incluye (uno por línea)</label><textarea value={formData.includes} onChange={(e) => setFormData({ ...formData, includes: e.target.value })} rows={5} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">No Incluye (uno por línea)</label><textarea value={formData.not_includes} onChange={(e) => setFormData({ ...formData, not_includes: e.target.value })} rows={5} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Info Adicional</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Punto de encuentro</label><textarea value={formData.meeting_point} onChange={(e) => setFormData({ ...formData, meeting_point: e.target.value })} rows={2} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Info importante</label><textarea value={formData.important_info} onChange={(e) => setFormData({ ...formData, important_info: e.target.value })} rows={3} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Política cancelación</label><textarea value={formData.cancellation_policy} onChange={(e) => setFormData({ ...formData, cancellation_policy: e.target.value })} rows={3} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-gray-900 mb-2">Idiomas (comas)</label><input type="text" value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                    <div><label className="block text-sm font-bold text-gray-900 mb-2">Accesibilidad</label><input type="text" value={formData.accessibility} onChange={(e) => setFormData({ ...formData, accessibility: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-gray-900 mb-2">Vestimenta</label><textarea value={formData.dress_code} onChange={(e) => setFormData({ ...formData, dress_code: e.target.value })} rows={2} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                    <div><label className="block text-sm font-bold text-gray-900 mb-2">Restricciones</label><textarea value={formData.restrictions} onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })} rows={2} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Configuración</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Widget ID (Regiondo)</label><input type="text" value={formData.widget_id} onChange={(e) => setFormData({ ...formData, widget_id: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-gray-900 mb-2">Tiqets Venue ID</label><input type="text" value={formData.tiqets_venue_id} onChange={(e) => setFormData({ ...formData, tiqets_venue_id: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                    <div><label className="block text-sm font-bold text-gray-900 mb-2">Tiqets Campaign</label><input type="text" value={formData.tiqets_campaign} onChange={(e) => setFormData({ ...formData, tiqets_campaign: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900" /></div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-5 h-5 text-purple-600 rounded" />
                    <span className="text-sm font-bold text-gray-900">Destacado (aparece en home)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold">{editingId ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded-lg font-semibold">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* BORRADORES */}
        {draftExperiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={24} className="text-gray-500" />
              Borradores
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{draftExperiences.length}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftExperiences.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} onEdit={handleEdit} onDelete={handleDelete} onTogglePublish={togglePublishStatus} />
              ))}
            </div>
          </div>
        )}

        {/* PUBLICADAS */}
        {publishedExperiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe size={24} className="text-green-600" />
              Publicadas
              <span className="text-sm font-normal text-green-600 bg-green-100 px-3 py-1 rounded-full">{publishedExperiences.length}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedExperiences.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} onEdit={handleEdit} onDelete={handleDelete} onTogglePublish={togglePublishStatus} />
              ))}
            </div>
          </div>
        )}
        
        {experiences.length === 0 && !showForm && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-12 text-center">
            <p className="text-gray-800 font-semibold mb-4">No hay experiencias</p>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"><Plus size={20} /> Crear</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de tarjeta separado
function ExperienceCard({ exp, onEdit, onDelete, onTogglePublish }: { 
  exp: Experience; 
  onEdit: (exp: Experience) => void; 
  onDelete: (id: string) => void;
  onTogglePublish: (exp: Experience) => void;
}) {
  const categoryNames = exp.experience_categories?.map(ec => ec.categories?.name).filter(Boolean) || [];
  
  return (
    <div className={`bg-white rounded-xl border-2 overflow-hidden hover:shadow-lg transition-all ${exp.active ? 'border-green-200' : 'border-gray-300 opacity-75'}`}>
      {exp.main_image && typeof exp.main_image === 'string' && exp.main_image.startsWith('http') && (
        <div className="relative h-48">
          <Image src={exp.main_image} alt={exp.title} fill className="object-cover" />
          {exp.featured && <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">DESTACADO</div>}
          {/* Botón de estado en la imagen */}
          <button
            onClick={() => onTogglePublish(exp)}
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
              exp.active 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-700 text-white hover:bg-gray-800'
            }`}
          >
            {exp.active ? <><Globe size={12} /> Publicada</> : <><FileText size={12} /> Borrador</>}
          </button>
        </div>
      )}
      {/* Si no tiene imagen, mostrar botón de estado arriba */}
      {(!exp.main_image || typeof exp.main_image !== 'string' || !exp.main_image.startsWith('http')) && (
        <div className="p-3 border-b flex justify-end">
          <button
            onClick={() => onTogglePublish(exp)}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
              exp.active 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-700 text-white hover:bg-gray-800'
            }`}
          >
            {exp.active ? <><Globe size={12} /> Publicada</> : <><FileText size={12} /> Borrador</>}
          </button>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2 flex-wrap">
          <span className="font-semibold">{exp.cities?.name || 'Sin ciudad'}</span>
          {categoryNames.length > 0 && <><span>•</span><span className="text-purple-600">{categoryNames.join(', ')}</span></>}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{exp.title}</h3>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-current" /><span className="text-sm font-bold">{exp.rating}</span><span className="text-xs text-gray-600">({exp.reviews})</span></div>
          {exp.duration && <span className="text-sm text-gray-600">{exp.duration}</span>}
        </div>
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div><div className="text-xs text-gray-600">Desde</div><div className="text-2xl font-bold text-purple-700">€{exp.price}</div></div>
          {exp.gallery?.length > 0 && <div className="flex items-center gap-1 text-xs text-gray-600"><ImageIcon size={14} />{exp.gallery.length} fotos</div>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(exp)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1"><Pencil size={16} /> Editar</button>
          <button onClick={() => onDelete(exp.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1"><Trash2 size={16} /> Eliminar</button>
        </div>
      </div>
    </div>
  );
}

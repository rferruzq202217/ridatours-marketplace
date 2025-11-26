'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Languages, Play, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TranslationsPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    
    const { data: translations } = await supabase
      .from('translations_cache')
      .select('target_lang');

    const counts: Record<string, number> = { en: 0, fr: 0, it: 0, de: 0 };
    translations?.forEach(t => {
      if (counts[t.target_lang] !== undefined) {
        counts[t.target_lang]++;
      }
    });

    const { count: expCount } = await supabase
      .from('experiences')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);

    const { count: catCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    const { count: monCount } = await supabase
      .from('monuments')
      .select('*', { count: 'exact', head: true });

    setStats({
      translations: counts,
      total: translations?.length || 0,
      experiences: expCount || 0,
      categories: catCount || 0,
      monuments: monCount || 0
    });
    
    setIsLoading(false);
  };

  const translateAll = async () => {
    setIsTranslating(true);
    setProgress(['🚀 Iniciando traducción masiva...']);

    try {
      // Traducir categorías
      setProgress(p => [...p, '📂 Traduciendo categorías...']);
      const { data: categories } = await supabase.from('categories').select('name');
      if (categories?.length) {
        const names = categories.map(c => c.name);
        for (const lang of ['en', 'fr', 'it', 'de']) {
          await fetch('/api/translate-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts: names, targetLang: lang })
          });
        }
        setProgress(p => [...p, `  ✅ ${names.length} categorías traducidas`]);
      }

      // Traducir experiencias
      setProgress(p => [...p, '📚 Traduciendo experiencias...']);
      const { data: experiences } = await supabase
        .from('experiences')
        .select('title, description')
        .eq('active', true);

      if (experiences?.length) {
        const titles = experiences.map(e => e.title).filter(Boolean);
        const descriptions = experiences.map(e => e.description).filter(Boolean);

        for (const lang of ['en', 'fr', 'it', 'de']) {
          setProgress(p => [...p, `  🌐 Traduciendo a ${lang.toUpperCase()}...`]);
          
          await fetch('/api/translate-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts: titles, targetLang: lang })
          });

          if (descriptions.length) {
            await fetch('/api/translate-batch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ texts: descriptions, targetLang: lang })
            });
          }
        }
        setProgress(p => [...p, `  ✅ ${titles.length} experiencias traducidas`]);
      }

      // Traducir monumentos
      setProgress(p => [...p, '🏛️ Traduciendo monumentos...']);
      const { data: monuments } = await supabase
        .from('monuments')
        .select('name, description, hero_title');

      if (monuments?.length) {
        const names = monuments.map(m => m.name).filter(Boolean);
        const descriptions = monuments.map(m => m.description).filter(Boolean);

        for (const lang of ['en', 'fr', 'it', 'de']) {
          await fetch('/api/translate-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts: names, targetLang: lang })
          });

          if (descriptions.length) {
            await fetch('/api/translate-batch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ texts: descriptions, targetLang: lang })
            });
          }
        }
        setProgress(p => [...p, `  ✅ ${names.length} monumentos traducidos`]);
      }

      setProgress(p => [...p, '', '✅ ¡Traducción completada!']);
      await loadStats();
    } catch (error) {
      console.error(error);
      setProgress(p => [...p, '❌ Error durante la traducción']);
    }

    setIsTranslating(false);
  };

  const clearCache = async () => {
    if (!confirm('¿Seguro que quieres borrar toda la caché de traducciones?')) {
      return;
    }

    await supabase.from('translations_cache').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await loadStats();
  };

  const langColors: Record<string, { bg: string; text: string }> = {
    en: { bg: 'bg-blue-100', text: 'text-blue-700' },
    fr: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    it: { bg: 'bg-green-100', text: 'text-green-700' },
    de: { bg: 'bg-amber-100', text: 'text-amber-700' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft size={24} />
              </Link>
              <div className="flex items-center gap-3">
                <Languages className="text-indigo-600" size={28} />
                <h1 className="text-2xl font-bold text-gray-900">Traducciones</h1>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadStats}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Actualizar
              </button>
              <button
                onClick={clearCache}
                className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
              >
                Limpiar caché
              </button>
              <button
                onClick={translateAll}
                disabled={isTranslating}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
              >
                <Play size={18} />
                {isTranslating ? 'Traduciendo...' : 'Traducir todo'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12">Cargando estadísticas...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                <div className="text-3xl font-bold text-gray-900">{stats?.total || 0}</div>
                <div className="text-gray-600 font-medium">Traducciones totales</div>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-purple-200">
                <div className="text-3xl font-bold text-purple-600">{stats?.experiences || 0}</div>
                <div className="text-gray-700 font-medium">Experiencias</div>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-amber-200">
                <div className="text-3xl font-bold text-amber-600">{stats?.monuments || 0}</div>
                <div className="text-gray-700 font-medium">Monumentos</div>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-600">{stats?.categories || 0}</div>
                <div className="text-gray-700 font-medium">Categorías</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Traducciones por idioma</h2>
              <div className="grid grid-cols-4 gap-4">
                {['en', 'fr', 'it', 'de'].map(lang => {
                  const colors = langColors[lang];
                  return (
                    <div key={lang} className={`text-center p-4 ${colors.bg} rounded-xl`}>
                      <div className="text-3xl mb-2">
                        {lang === 'en' ? '🇬🇧' : lang === 'fr' ? '🇫🇷' : lang === 'it' ? '🇮🇹' : '🇩🇪'}
                      </div>
                      <div className={`font-bold text-2xl ${colors.text}`}>
                        {stats?.translations?.[lang] || 0}
                      </div>
                      <div className={`text-sm font-semibold ${colors.text}`}>
                        {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : lang === 'it' ? 'Italiano' : 'Deutsch'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {progress.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm">
                <h3 className="text-white font-bold mb-3">Progreso de traducción</h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {progress.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

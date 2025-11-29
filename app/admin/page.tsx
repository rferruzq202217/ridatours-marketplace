'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Tag, Landmark, Globe, Languages, LogOut, Ticket, BookOpen, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminPanel() {
  const router = useRouter();
  const [counts, setCounts] = useState({
    experiences: 0,
    cities: 0,
    categories: 0,
    monuments: 0,
    countries: 0,
    translations: 0
  });

  useEffect(() => {
    const loadCounts = async () => {
      const [exp, cities, cats, mons, countries, translations] = await Promise.all([
        supabase.from('experiences').select('*', { count: 'exact', head: true }),
        supabase.from('cities').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('monuments').select('*', { count: 'exact', head: true }),
        supabase.from('countries').select('*', { count: 'exact', head: true }),
        supabase.from('translations_cache').select('*', { count: 'exact', head: true })
      ]);
      setCounts({
        experiences: exp.count || 0,
        cities: cities.count || 0,
        categories: cats.count || 0,
        monuments: mons.count || 0,
        countries: countries.count || 0,
        translations: translations.count || 0
      });
    };
    loadCounts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    document.cookie = 'admin_session=; path=/; max-age=0';
    router.push('/admin/login');
  };

  const cards = [
    { href: '/admin/experiences', icon: Building2, title: 'Experiencias', desc: 'Tours y actividades', count: counts.experiences, color: 'purple' },
    { href: '/admin/countries', icon: Globe, title: 'Países', desc: 'Gestiona los países', count: counts.countries, color: 'emerald' },
    { href: '/admin/cities', icon: MapPin, title: 'Ciudades', desc: 'Gestiona los destinos', count: counts.cities, color: 'green' },
    { href: '/admin/categories', icon: Tag, title: 'Categorías', desc: 'Gestiona las categorías', count: counts.categories, color: 'blue' },
    { href: '/admin/monuments', icon: Landmark, title: 'Monumentos', desc: 'Lugares emblemáticos', count: counts.monuments, color: 'amber' },
    { href: '/admin/translations', icon: Languages, title: 'Traducciones', desc: 'Gestiona los idiomas', count: counts.translations, color: 'indigo' },
    { href: 'https://ridatours-cms.vercel.app/admin', icon: BookOpen, title: 'Guías de Viaje', desc: 'CMS de contenido editorial', count: null, color: 'rose', external: true },
  ];

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'hover:border-purple-500' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'hover:border-emerald-500' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'hover:border-green-500' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'hover:border-blue-500' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'hover:border-amber-500' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'hover:border-indigo-500' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'hover:border-rose-500' },
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Ticket className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RIDATOURS</h1>
                <p className="text-xs text-gray-500">Panel de Administración</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/es" className="text-sm text-gray-600 hover:text-blue-600">
                Ver sitio web
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const colors = colorClasses[card.color];
            const isExternal = (card as any).external;
            
            if (isExternal) {
              return (
                
                  key={card.href}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-6 bg-white rounded-xl border-2 border-gray-200 ${colors.border} transition-all hover:shadow-lg relative`}
                >
                  <ExternalLink className="absolute top-4 right-4 text-gray-400" size={16} />
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${colors.bg}`}>
                      <card.icon className={colors.text} size={24} />
                    </div>
                    {card.count !== null && (
                      <span className={`text-2xl font-bold ${colors.text}`}>{card.count}</span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mt-4">{card.title}</h2>
                  <p className="text-gray-600 mt-1">{card.desc}</p>
                </a>
              );
            }
            
            return (
              <Link
                key={card.href}
                href={card.href}
                className={`p-6 bg-white rounded-xl border-2 border-gray-200 ${colors.border} transition-all hover:shadow-lg`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${colors.bg}`}>
                    <card.icon className={colors.text} size={24} />
                  </div>
                  <span className={`text-2xl font-bold ${colors.text}`}>{card.count}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-4">{card.title}</h2>
                <p className="text-gray-600 mt-1">{card.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

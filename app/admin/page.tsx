'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, MapPin, Tag, Landmark, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminPanel() {
  const [counts, setCounts] = useState({
    experiences: 0,
    cities: 0,
    categories: 0,
    monuments: 0,
    countries: 0
  });

  useEffect(() => {
    const loadCounts = async () => {
      const [exp, cities, cats, mons, countries] = await Promise.all([
        supabase.from('experiences').select('*', { count: 'exact', head: true }),
        supabase.from('cities').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('monuments').select('*', { count: 'exact', head: true }),
        supabase.from('countries').select('*', { count: 'exact', head: true })
      ]);
      setCounts({
        experiences: exp.count || 0,
        cities: cities.count || 0,
        categories: cats.count || 0,
        monuments: mons.count || 0,
        countries: countries.count || 0
      });
    };
    loadCounts();
  }, []);

  const cards = [
    { href: '/admin/experiences', icon: Building2, title: 'Experiencias', desc: 'Tours y actividades', count: counts.experiences, color: 'purple' },
    { href: '/admin/countries', icon: Globe, title: 'Países', desc: 'Gestiona los países', count: counts.countries, color: 'emerald' },
    { href: '/admin/cities', icon: MapPin, title: 'Ciudades', desc: 'Gestiona los destinos', count: counts.cities, color: 'green' },
    { href: '/admin/categories', icon: Tag, title: 'Categorías', desc: 'Gestiona las categorías', count: counts.categories, color: 'blue' },
    { href: '/admin/monuments', icon: Landmark, title: 'Monumentos', desc: 'Lugares emblemáticos', count: counts.monuments, color: 'amber' },
  ];

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'hover:border-purple-500' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'hover:border-emerald-500' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'hover:border-green-500' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'hover:border-blue-500' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'hover:border-amber-500' },
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {cards.map((card) => {
          const colors = colorClasses[card.color];
          return (
            <Link
              key={card.href}
              href={card.href}
              className={`bg-white p-6 rounded-xl border-2 border-gray-300 ${colors.border} hover:shadow-lg transition-all group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${colors.bg} ${colors.text} w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <card.icon size={28} />
                </div>
                <span className={`text-3xl font-bold ${colors.text}`}>{card.count}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{card.title}</h2>
              <p className="text-gray-600 text-sm">{card.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Star, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { formatPrice } from '@/lib/formatPrice';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) notFound();

  const { data: experienceCategories } = await supabase
    .from('experience_categories')
    .select('experience_id')
    .eq('category_id', category.id);

  const experienceIds = experienceCategories?.map(ec => ec.experience_id) || [];

  const { data: experiences } = experienceIds.length > 0
    ? await supabase
        .from('experiences')
        .select('*, cities(name, slug)')
        .in('id', experienceIds)
        .eq('active', true)
        .order('rating', { ascending: false })
    : { data: [] };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang="es" />
      
      {/* Espaciado para header fijo */}
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Inicio', href: '/es' },
            { label: category.name }
          ]} />

          <div className="mt-6 mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{category.name}</h1>
            <p className="text-xl text-gray-600">
              {experiences?.length || 0} {experiences?.length === 1 ? 'experiencia' : 'experiencias'} disponibles
            </p>
          </div>

          {experiences && experiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {experiences.map((exp: any) => (
                <Link
                  key={exp.id}
                  href={`/es/${exp.cities?.slug}/${exp.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative h-48">
                    {exp.main_image ? (
                      <Image src={exp.main_image} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                    {exp.featured && (
                      <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ DESTACADO
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      {(exp.cities?.name || '').toUpperCase()}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">{exp.title}</h3>
                    {exp.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Clock size={14} />
                        <span>{exp.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-700">{exp.rating}</span>
                        <span className="text-xs text-gray-400">({exp.reviews?.toLocaleString('es-ES') || 0})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">Desde</span>
                        <p className="font-bold text-lg text-gray-900">{formatPrice(exp.price)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <p className="text-gray-600 text-lg">Próximamente añadiremos experiencias en esta categoría</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer lang="es" />
    </div>
  );
}

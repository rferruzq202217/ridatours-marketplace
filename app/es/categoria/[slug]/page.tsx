import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Star, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

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

  if (!category) {
    notFound();
  }

  // Buscar experiencias que tengan esta categoría
  const { data: experienceCategories } = await supabase
    .from('experience_categories')
    .select(`
      experiences(
        *,
        cities(name, slug)
      )
    `)
    .eq('category_id', category.id);

  const experiences = experienceCategories
    ?.map(ec => ec.experiences)
    .filter(exp => exp && exp.active) || [];

  return (
    <div className="min-h-screen bg-white">
      <Header lang="es" />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: 'Inicio', href: '/es' },
            { label: category.name }
          ]} />

          <div className="mt-6 mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              {category.name}
            </h1>
            <p className="text-xl text-gray-600">
              {experiences.length} {experiences.length === 1 ? 'experiencia' : 'experiencias'} disponibles
            </p>
          </div>

          {experiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((exp: any) => (
                <Link
                  key={exp.id}
                  href={`/es/${exp.cities?.slug}/${exp.slug}`}
                  className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all group"
                >
                  {exp.main_image && (
                    <div className="relative h-56">
                      <Image 
                        src={exp.main_image} 
                        alt={exp.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {exp.featured && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                          HASTA -30%
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    {exp.cities?.name && (
                      <div className="text-xs font-bold text-gray-600 tracking-wider mb-2">
                        {exp.cities.name}
                      </div>
                    )}
                    <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight line-clamp-2">
                      {exp.title}
                    </h3>
                    {exp.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {exp.description}
                      </p>
                    )}
                    
                    <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Star size={20} className="text-yellow-400 fill-current" />
                        <span className="font-bold text-lg text-gray-900">{exp.rating}</span>
                        <span className="text-sm text-gray-500">({exp.reviews.toLocaleString()})</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600 mb-1">Desde</div>
                        <div className="text-2xl font-bold text-blue-600">
                          €{exp.price}
                        </div>
                      </div>
                    </div>
                    {exp.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                        <Clock size={16} />
                        <span>{exp.duration}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <p className="text-gray-600 text-lg">
                Próximamente añadiremos experiencias en esta categoría
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer lang="es" />
    </div>
  );
}

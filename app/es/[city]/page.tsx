import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import MonumentCard from '@/components/MonumentCard';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{ city: string }>;
}

export default async function CityPage({ params }: PageProps) {
  const { city: citySlug } = await params;

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .single();

  if (!city) {
    notFound();
  }

  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('city_id', city.id)
    .eq('active', true)
    .order('rating', { ascending: false });

  const totalExperiences = experiences?.length || 0;
  const avgRating = experiences?.length 
    ? (experiences.reduce((sum, exp) => sum + exp.rating, 0) / experiences.length).toFixed(1)
    : '0.0';
  const totalReviews = experiences?.reduce((sum, exp) => sum + exp.reviews, 0) || 0;

  const monuments = experiences?.map(exp => ({
    name: exp.title,
    slug: exp.slug,
    image: exp.main_image || '',
    rating: exp.rating,
    reviews: exp.reviews,
    price: exp.price,
    duration: exp.duration || ''
  })) || [];

  const defaultDescription = `Descubre la ciudad con sus monumentos, arte incomparable y vibrante cultura. Explora sus lugares emblemáticos y vive experiencias únicas.`;

  return (
    <div className="min-h-screen bg-white">
      <Header lang="es" />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: 'Inicio', href: '/es' },
            { label: city.name }
          ]} />

          <div className="mt-6 mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Qué hacer en {city.name}
              </h1>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {city.description || defaultDescription}
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">{avgRating}</span>
                  <div className="text-sm text-gray-600">
                    ({totalReviews.toLocaleString()} opiniones)
                  </div>
                </div>
                <div className="h-6 w-px bg-gray-300" />
                <div className="text-lg text-gray-700">
                  <span className="font-bold text-gray-900">{totalExperiences}</span> experiencias
                </div>
              </div>
            </div>
            
            {city.image && (
              <div className="relative h-80 rounded-2xl overflow-hidden">
                <Image 
                  src={city.image} 
                  alt={city.name} 
                  fill 
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {monuments.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Todas las experiencias en {city.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {monuments.map((monument, i) => (
                  <MonumentCard 
                    key={i} 
                    monument={monument} 
                    lang="es"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <p className="text-gray-600 text-lg">
                Aún no hay experiencias disponibles en {city.name}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer lang="es" />
    </div>
  );
}

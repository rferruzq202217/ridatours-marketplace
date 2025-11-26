import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Landmark } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { formatPrice } from '@/lib/formatPrice';
import { getMessages, Locale } from '@/lib/i18n';
import { translateExperiences } from '@/lib/translateHelpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{ locale: string; city: string }>;
}

export default async function CityPage({ params }: PageProps) {
  const { locale, city: citySlug } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .single();

  if (!city) {
    notFound();
  }

  const { data: experiencesRaw } = await supabase
    .from('experiences')
    .select('*')
    .eq('city_id', city.id)
    .eq('active', true)
    .order('rating', { ascending: false });

  // Traducir experiencias
  const experiences = await translateExperiences(experiencesRaw || [], lang);

  const { data: monumentsData } = await supabase
    .from('monuments')
    .select(`
      *,
      monument_categories(categories(name))
    `)
    .eq('city_id', city.id)
    .order('name');

  const totalExperiences = experiences?.length || 0;
  const avgRating = experiences?.length 
    ? (experiences.reduce((sum, exp) => sum + exp.rating, 0) / experiences.length).toFixed(1)
    : '0.0';
  const totalReviews = experiences?.reduce((sum, exp) => sum + exp.reviews, 0) || 0;

  const defaultDescriptions: Record<string, string> = {
    es: 'Descubre la ciudad con sus monumentos, arte incomparable y vibrante cultura. Explora sus lugares emblemáticos y vive experiencias únicas.',
    en: 'Discover the city with its monuments, incomparable art and vibrant culture. Explore its iconic landmarks and live unique experiences.',
    fr: 'Découvrez la ville avec ses monuments, son art incomparable et sa culture vibrante. Explorez ses lieux emblématiques et vivez des expériences uniques.',
    it: 'Scopri la città con i suoi monumenti, l\'arte incomparabile e la cultura vibrante. Esplora i suoi luoghi iconici e vivi esperienze uniche.',
    de: 'Entdecken Sie die Stadt mit ihren Denkmälern, unvergleichlicher Kunst und lebendiger Kultur. Erkunden Sie ihre ikonischen Wahrzeichen und erleben Sie einzigartige Erlebnisse.'
  };

  const monumentTitles: Record<string, string> = {
    es: 'Monumentos emblemáticos',
    en: 'Iconic monuments',
    fr: 'Monuments emblématiques',
    it: 'Monumenti iconici',
    de: 'Ikonische Denkmäler'
  };

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` },
            { label: city.name }
          ]} />

          <div className="mt-6 mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                {t.city.thingsToDo} {city.name}
              </h1>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {city.description || defaultDescriptions[lang] || defaultDescriptions.es}
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">{avgRating}</span>
                  <div className="text-sm text-gray-600">
                    ({totalReviews.toLocaleString()} {t.common.reviews})
                  </div>
                </div>
                <div className="h-6 w-px bg-gray-300" />
                <div className="text-lg text-gray-700">
                  <span className="font-bold text-gray-900">{totalExperiences}</span> {t.common.experiences.toLowerCase()}
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

          {monumentsData && monumentsData.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Landmark className="text-amber-600" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">
                  {monumentTitles[lang] || monumentTitles.es}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {monumentsData.map((monument) => {
                  const categoryNames = monument.monument_categories?.map(
                    (mc: any) => mc.categories.name
                  ) || [];

                  return (
                    <Link
                      key={monument.id}
                      href={`/${lang}/${city.slug}/monumentos/${monument.slug}`}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
                    >
                      {monument.image && (
                        <div className="relative h-48">
                          <Image 
                            src={monument.image} 
                            alt={monument.name} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        {categoryNames.length > 0 && (
                          <div className="text-xs font-semibold text-amber-600 mb-1">
                            {categoryNames.join(' • ')}
                          </div>
                        )}
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                          {monument.name}
                        </h3>
                        {monument.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {monument.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {experiences && experiences.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t.city.allExperiences} {city.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {experiences.map((exp) => (
                  <Link
                    key={exp.id}
                    href={`/${lang}/${city.slug}/${exp.slug}`}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="relative h-48">
                      {exp.main_image ? (
                        <Image src={exp.main_image} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">{t.common.noImage}</span>
                        </div>
                      )}
                      {exp.featured && (
                        <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ {t.common.featured}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        {city.name.toUpperCase()}
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
                          <span className="text-xs text-gray-500">{t.common.from}</span>
                          <p className="font-bold text-lg text-gray-900">{formatPrice(exp.price)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t.common.noResults}</p>
            </div>
          )}
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

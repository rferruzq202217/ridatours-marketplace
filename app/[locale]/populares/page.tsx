import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Star, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { formatPrice } from '@/lib/formatPrice';
import { getMessages, Locale } from '@/lib/i18n';
import { translateExperiences } from '@/lib/translateHelpers';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PopularesPage({ params }: PageProps) {
  const { locale } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);

  const { data: allExperiences } = await supabase
    .from('experiences')
    .select('id, title, slug, price, rating, reviews, duration, main_image, featured, cities!inner(slug, name)')
    .eq('active', true)
    .order('reviews', { ascending: false })
    .limit(50);

  const experiencesRaw = (allExperiences || []).map((exp: any) => ({
    id: exp.id,
    city: exp.cities?.slug || '',
    slug: exp.slug,
    title: exp.title,
    cityName: exp.cities?.name || '',
    image: exp.main_image,
    price: exp.price,
    rating: exp.rating,
    reviews: exp.reviews,
    duration: exp.duration,
    featured: exp.featured
  }));

  // Traducir experiencias
  const experiences = await translateExperiences(experiencesRaw, lang);

  const titles: Record<string, string> = {
    es: '🔥 Experiencias más populares',
    en: '🔥 Most popular experiences',
    fr: '🔥 Expériences les plus populaires',
    it: '🔥 Esperienze più popolari',
    de: '🔥 Beliebteste Erlebnisse'
  };

  const subtitles: Record<string, string> = {
    es: 'Las favoritas de nuestros viajeros',
    en: 'Favorites of our travelers',
    fr: 'Les favorites de nos voyageurs',
    it: 'Le preferite dai nostri viaggiatori',
    de: 'Die Favoriten unserer Reisenden'
  };

  const breadcrumbLabel: Record<string, string> = {
    es: 'Más populares',
    en: 'Most popular',
    fr: 'Plus populaires',
    it: 'Più popolari',
    de: 'Am beliebtesten'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang} />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` }, 
            { label: breadcrumbLabel[lang] || breadcrumbLabel.es }
          ]} />
          
          <div className="mt-6 mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{titles[lang] || titles.es}</h1>
            <p className="text-xl text-gray-600">{subtitles[lang] || subtitles.es}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {experiences.map((exp) => (
              <Link 
                key={exp.id} 
                href={`/${lang}/${exp.city}/${exp.slug}`} 
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative h-48">
                  {exp.image ? (
                    <Image src={exp.image} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">{t.common.noImage}</span>
                    </div>
                  )}
                  {exp.featured && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {t.common.popular}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-1">{exp.cityName.toUpperCase()}</p>
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

          {experiences.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.common.noResults}</h3>
              <Link href={`/${lang}`} className="inline-flex bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700">
                {t.footer.explore}
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

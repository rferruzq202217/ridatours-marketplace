import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import RegiondoWidget from '@/components/RegiondoWidget';
import TiqetsWidget from '@/components/TiqetsWidget';
import ExperienceTabs from '@/components/ExperienceTabs';
import ImageGallery from '@/components/ImageGallery';
import ExperienceCarousel from '@/components/ExperienceCarousel';
import { formatPrice } from '@/lib/formatPrice';
import { getMessages, Locale } from '@/lib/i18n';
import { translateExperience } from '@/lib/translateExperience';
import { Star, Clock, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import SaveRecentlyViewed from '@/components/SaveRecentlyViewed';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{ locale: string; city: string; slug: string }>;
}

// Generar metadatos SEO dinámicos
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, city: citySlug, slug } = await params;
  
  const { data: city } = await supabase
    .from('cities')
    .select('name')
    .eq('slug', citySlug)
    .single();

  const { data: experience } = await supabase
    .from('experiences')
    .select('title, description, main_image, price, rating, reviews')
    .eq('slug', slug)
    .single();

  if (!experience || !city) {
    return { title: 'Experiencia no encontrada' };
  }

  const title = `${experience.title} - ${city.name}`;
  const description = experience.description || `Reserva ${experience.title} en ${city.name}. Desde ${experience.price}€. Valoración: ${experience.rating}/5 (${experience.reviews} opiniones).`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: experience.main_image ? [{ url: experience.main_image, width: 1200, height: 630 }] : [],
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : locale === 'en' ? 'en_US' : locale === 'fr' ? 'fr_FR' : locale === 'it' ? 'it_IT' : 'de_DE',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: experience.main_image ? [experience.main_image] : [],
    },
  };
}

export default async function ExperiencePage({ params }: PageProps) {
  const { locale, city: citySlug, slug } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .single();

  if (!city) notFound();

  const { data: experienceRaw } = await supabase
    .from('experiences')
    .select('*')
    .eq('slug', slug)
    .eq('city_id', city.id)
    .single();

  if (!experienceRaw) notFound();

  // Traducir la experiencia si no es español
  const experience = await translateExperience(experienceRaw, lang);

  const { data: related } = await supabase
    .from('experiences')
    .select('*')
    .eq('city_id', city.id)
    .eq('active', true)
    .neq('id', experience.id)
    .order('rating', { ascending: false })
    .limit(8);

  const relatedForCarousel = (related || []).map(rel => ({
    id: rel.id,
    slug: rel.slug,
    title: rel.title,
    image: rel.main_image,
    price: rel.price,
    rating: rel.rating,
    reviews: rel.reviews,
    duration: rel.duration,
    city_slug: city.slug,
    cityName: city.name
  }));

  const defaultHighlights = [
    t.common.instantConfirmation,
    t.common.mobileTicket,
    t.common.freeCancellation
  ];

  const highlights = (experience.highlights && experience.highlights.length > 0) 
    ? experience.highlights as string[] 
    : defaultHighlights;

  const validGallery = experience.gallery?.filter((img: string) => img?.trim()) || [];

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />
      <SaveRecentlyViewed 
        experience={{
          id: experience.id,
          slug: experience.slug,
          title: experience.title,
          main_image: experience.main_image,
          price: experience.price,
          rating: experience.rating,
          reviews: experience.reviews,
          duration: experience.duration
        }}
        citySlug={city.slug}
      />
      
      <div className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` },
            { label: city.name, href: `/${lang}/${city.slug}` },
            { label: experience.title }
          ]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Columna izquierda - Contenido principal */}
            <div className="lg:col-span-2">
              {/* Badges */}
              {experience.featured && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">{t.common.topRated}</span>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{t.common.save} 30%</span>
                </div>
              )}

              {/* Título */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {experience.title}
              </h1>
              
              {/* Subtítulo/Descripción corta */}
              {experience.description && (
                <p className="text-gray-600 mb-4">{experience.description}</p>
              )}

              {/* Rating y duración */}
              <div className="flex items-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400 fill-current" size={18} />
                  <span className="font-bold text-gray-900">{experience.rating}</span>
                  <span className="text-gray-500">({experience.reviews?.toLocaleString('es-ES')} {t.common.reviews})</span>
                </div>
                {experience.duration && (
                  <>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock size={16} />
                      <span>{experience.duration}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Galería de imágenes */}
              <ImageGallery
                mainImage={experience.main_image}
                gallery={validGallery}
                title={experience.title}
              />

              {/* Tabs de contenido */}
              <ExperienceTabs
                description={experience.description}
                longDescription={experience.long_description}
                cityName={city.name}
                highlights={highlights}
                includes={experience.includes}
                notIncludes={experience.not_includes}
                meetingPoint={experience.meeting_point}
                importantInfo={experience.important_info}
                languages={experience.languages}
                accessibility={experience.accessibility}
                dressCode={experience.dress_code}
                restrictions={experience.restrictions}
                cancellationPolicy={experience.cancellation_policy}
                rating={experience.rating}
                reviews={experience.reviews}
                lang={lang}
              />
            </div>

            {/* Columna derecha - Widget de reserva */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Precio */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">{formatPrice(experience.price)}</span>
                      {experience.featured && (
                        <span className="text-lg text-gray-400 line-through">{formatPrice(experience.price * 1.3)}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{t.common.perPerson}</div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="text-green-600 flex-shrink-0" size={16} />
                      <span>{t.common.instantConfirmation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="text-green-600 flex-shrink-0" size={16} />
                      <span>{t.common.mobileTicket}</span>
                    </div>
                  </div>
                </div>

                {/* Widget de Tiqets o Regiondo */}
                {experience.tiqets_venue_id ? (
                  <TiqetsWidget widgetCode={experience.tiqets_venue_id} lang={lang} />
                ) : experience.widget_id ? (
                  <RegiondoWidget widgetId={experience.widget_id} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-selling - Ancho completo con carrusel */}
      {relatedForCarousel.length > 0 && (
        <div className="pt-20 pb-12">
          <ExperienceCarousel
            title={`${t.experience.moreExperiencesIn} ${city.name}`}
            subtitle={t.experience.alsoInterested}
            experiences={relatedForCarousel}
            carouselId="related"
            viewAllLink={`/${lang}/${city.slug}`}
            lang={lang}
          />
        </div>
      )}

      <Footer lang={lang} />
    </div>
  );
}

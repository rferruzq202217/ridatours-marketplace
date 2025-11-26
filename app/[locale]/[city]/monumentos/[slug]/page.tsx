import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import TiqetsDiscoveryGrid from '@/components/TiqetsDiscoveryGrid';
import { Star, MapPin, Clock, Check, Calendar, Info, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { getMessages, Locale } from '@/lib/i18n';
import { translateMonument } from '@/lib/translateHelpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{ locale: string; city: string; slug: string }>;
}

export default async function MonumentPage({ params }: PageProps) {
  const { locale, city: citySlug, slug } = await params;
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

  const { data: monument } = await supabase
    .from('monuments')
    .select(`
      *,
      monument_categories(categories(name))
    `)
    .eq('slug', slug)
    .eq('city_id', city.id)
    .single();

  if (!monument) {
    notFound();
  }

  const categoryNames = monument.monument_categories?.map(
    (mc: any) => mc.categories.name
  ) || [];

  // Textos traducidos
  const texts: Record<string, Record<string, string>> = {
    whyVisit: {
      es: '¿Por qué visitar',
      en: 'Why visit',
      fr: 'Pourquoi visiter',
      it: 'Perché visitare',
      de: 'Warum besuchen'
    },
    whatToSee: {
      es: 'Qué ver en',
      en: 'What to see at',
      fr: 'Que voir à',
      it: 'Cosa vedere a',
      de: 'Was gibt es zu sehen in'
    },
    gallery: {
      es: 'Galería',
      en: 'Gallery',
      fr: 'Galerie',
      it: 'Galleria',
      de: 'Galerie'
    },
    bookVisit: {
      es: 'Reserva tu visita a',
      en: 'Book your visit to',
      fr: 'Réservez votre visite à',
      it: 'Prenota la tua visita a',
      de: 'Buchen Sie Ihren Besuch bei'
    },
    chooseExperience: {
      es: 'Elige la experiencia que mejor se adapte a ti',
      en: 'Choose the experience that best suits you',
      fr: 'Choisissez l\'expérience qui vous convient le mieux',
      it: 'Scegli l\'esperienza più adatta a te',
      de: 'Wählen Sie das Erlebnis, das am besten zu Ihnen passt'
    },
    practicalTips: {
      es: 'Consejos prácticos',
      en: 'Practical tips',
      fr: 'Conseils pratiques',
      it: 'Consigli pratici',
      de: 'Praktische Tipps'
    },
    practicalInfo: {
      es: 'Información práctica',
      en: 'Practical information',
      fr: 'Informations pratiques',
      it: 'Informazioni pratiche',
      de: 'Praktische Informationen'
    },
    openingHours: {
      es: 'Horarios',
      en: 'Opening hours',
      fr: 'Horaires',
      it: 'Orari',
      de: 'Öffnungszeiten'
    },
    location: {
      es: 'Ubicación',
      en: 'Location',
      fr: 'Emplacement',
      it: 'Posizione',
      de: 'Standort'
    },
    faq: {
      es: 'Preguntas frecuentes',
      en: 'Frequently asked questions',
      fr: 'Questions fréquentes',
      it: 'Domande frequenti',
      de: 'Häufig gestellte Fragen'
    },
    alsoInterested: {
      es: 'También te puede interesar en',
      en: 'You may also be interested in',
      fr: 'Vous pourriez aussi aimer à',
      it: 'Potrebbe interessarti anche a',
      de: 'Das könnte Sie auch interessieren in'
    },
    discoverMore: {
      es: 'Descubre otras experiencias increíbles',
      en: 'Discover other amazing experiences',
      fr: 'Découvrez d\'autres expériences incroyables',
      it: 'Scopri altre esperienze incredibili',
      de: 'Entdecken Sie andere erstaunliche Erlebnisse'
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` },
            { label: city.name, href: `/${lang}/${city.slug}` },
            { label: monument.name }
          ]} />

          {/* HERO SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6 mb-16">
            <div>
              {categoryNames.length > 0 && (
                <div className="text-sm font-bold text-amber-600 tracking-wider mb-3">
                  {categoryNames.join(' • ')}
                </div>
              )}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                {monument.hero_title || monument.name}
              </h1>
              {monument.hero_subtitle && (
                <p className="text-xl text-gray-700 mb-6">
                  {monument.hero_subtitle}
                </p>
              )}
              {monument.description && (
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {monument.description}
                </p>
              )}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={20} />
                  <span className="font-semibold">{city.name}</span>
                </div>
                {monument.tickets_from && (
                  <>
                    <div className="h-6 w-px bg-gray-300" />
                    <div>
                      <div className="text-sm text-gray-600">{t.common.from}</div>
                      <div className="text-3xl font-bold text-amber-600">€{monument.tickets_from}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {monument.image && (
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src={monument.image} 
                  alt={monument.name} 
                  fill 
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* POR QUÉ VISITAR */}
          {monument.why_visit && monument.why_visit.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {texts.whyVisit[lang]} {monument.name}?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monument.why_visit.map((reason: string, i: number) => (
                  <div key={i} className="bg-amber-50 rounded-xl p-6 border-2 border-amber-100">
                    <div className="flex items-start gap-3">
                      <Check className="text-amber-600 flex-shrink-0 mt-1" size={24} />
                      <p className="text-gray-900 font-medium">{reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUÉ VER */}
          {monument.what_to_see && monument.what_to_see.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {texts.whatToSee[lang]} {monument.name}
              </h2>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-100">
                <div className="space-y-4">
                  {monument.what_to_see.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-gray-900 font-medium pt-1">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GALERÍA */}
          {monument.gallery && monument.gallery.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{texts.gallery[lang]}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {monument.gallery.slice(0, 6).map((img: string, i: number) => (
                  <div key={i} className="relative h-64 rounded-xl overflow-hidden">
                    <Image 
                      src={img} 
                      alt={`${monument.name} ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESERVA TU VISITA - CARRUSEL TIQETS */}
          {monument.tiqets_venue_id && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {texts.bookVisit[lang]} {monument.name}
              </h2>
              <p className="text-gray-600 mb-6">{texts.chooseExperience[lang]}</p>
              <TiqetsDiscoveryGrid
                destinationType="venue"
                destinationId={monument.tiqets_venue_id}
                campaign={monument.tiqets_campaign || ''}
                itemCount={monument.tiqets_item_count || 12}
                lang={lang}
              />
            </div>
          )}

          {/* CONSEJOS PRÁCTICOS */}
          {monument.practical_tips && monument.practical_tips.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Info className="text-blue-600" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">{texts.practicalTips[lang]}</h2>
              </div>
              <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-100">
                <ul className="space-y-3">
                  {monument.practical_tips.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-900">
                      <Check className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* INFORMACIÓN PRÁCTICA */}
          {(monument.opening_hours || monument.address) && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{texts.practicalInfo[lang]}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {monument.opening_hours && (
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="text-amber-600" size={24} />
                      <h3 className="font-bold text-lg text-gray-900">{texts.openingHours[lang]}</h3>
                    </div>
                    <p className="text-gray-700">{monument.opening_hours}</p>
                  </div>
                )}
                {monument.address && (
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="text-amber-600" size={24} />
                      <h3 className="font-bold text-lg text-gray-900">{texts.location[lang]}</h3>
                    </div>
                    <p className="text-gray-700">{monument.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FAQ */}
          {monument.faq && Array.isArray(monument.faq) && monument.faq.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="text-purple-600" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">{texts.faq[lang]}</h2>
              </div>
              <div className="space-y-4">
                {monument.faq.map((item: any, i: number) => (
                  <div key={i} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CROSS-SELLING - CARRUSEL CIUDAD */}
          {monument.tiqets_venue_id && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {texts.alsoInterested[lang]} {city.name}
              </h2>
              <p className="text-gray-600 mb-6">{texts.discoverMore[lang]}</p>
              <TiqetsDiscoveryGrid
                destinationType="city"
                destinationId={city.slug}
                campaign={city.name}
                itemCount={monument.tiqets_item_count || 8}
                lang={lang}
              />
            </div>
          )}
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

export const dynamic = "force-dynamic";
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllPages, getMediaUrl } from '@/lib/payload';
import { getMessages, Locale } from '@/lib/i18n';
import { BookOpen, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const countryNames: Record<string, Record<string, string>> = {
  espana: { es: 'España', en: 'Spain', fr: 'Espagne', it: 'Spagna', de: 'Spanien' },
  italia: { es: 'Italia', en: 'Italy', fr: 'Italie', it: 'Italia', de: 'Italien' },
  francia: { es: 'Francia', en: 'France', fr: 'France', it: 'Francia', de: 'Frankreich' },
  'reino-unido': { es: 'Reino Unido', en: 'United Kingdom', fr: 'Royaume-Uni', it: 'Regno Unito', de: 'Vereinigtes Königreich' },
  alemania: { es: 'Alemania', en: 'Germany', fr: 'Allemagne', it: 'Germania', de: 'Deutschland' },
  portugal: { es: 'Portugal', en: 'Portugal', fr: 'Portugal', it: 'Portogallo', de: 'Portugal' },
  grecia: { es: 'Grecia', en: 'Greece', fr: 'Grèce', it: 'Grecia', de: 'Griechenland' },
  'paises-bajos': { es: 'Países Bajos', en: 'Netherlands', fr: 'Pays-Bas', it: 'Paesi Bassi', de: 'Niederlande' },
  austria: { es: 'Austria', en: 'Austria', fr: 'Autriche', it: 'Austria', de: 'Österreich' },
  belgica: { es: 'Bélgica', en: 'Belgium', fr: 'Belgique', it: 'Belgio', de: 'Belgien' },
  'republica-checa': { es: 'República Checa', en: 'Czech Republic', fr: 'République tchèque', it: 'Repubblica Ceca', de: 'Tschechien' },
};

const uiTexts: Record<string, { guidesIn: string; readGuide: string; guides: string; allGuides: string }> = {
  es: { guidesIn: 'Guías de viaje en', readGuide: 'Leer guía', guides: 'guías', allGuides: 'Guías' },
  en: { guidesIn: 'Travel guides in', readGuide: 'Read guide', guides: 'guides', allGuides: 'Guides' },
  fr: { guidesIn: 'Guides de voyage en', readGuide: 'Lire le guide', guides: 'guides', allGuides: 'Guides' },
  it: { guidesIn: 'Guide di viaggio in', readGuide: 'Leggi guida', guides: 'guide', allGuides: 'Guide' },
  de: { guidesIn: 'Reiseführer in', readGuide: 'Reiseführer lesen', guides: 'Reiseführer', allGuides: 'Reiseführer' },
};

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'fr' ? 'fr-FR' : locale === 'it' ? 'it-IT' : locale === 'de' ? 'de-DE' : 'en-US', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const countryName = countryNames[slug]?.[locale] || slug;
  const ui = uiTexts[locale] || uiTexts.es;
  return { title: `${ui.guidesIn} ${countryName} - Ridatours` };
}

export default async function GuiasPaisPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);
  const ui = uiTexts[lang] || uiTexts.es;
  const countryName = countryNames[slug]?.[lang] || slug;

  const allGuias = await getAllPages();
  const guias = allGuias.filter(g => g.country === slug);

  if (guias.length === 0) notFound();

  // Agrupar por ciudad
  const guiasByCity = guias.reduce((acc, guia) => {
    const citySlug = guia.citySlug || 'otros';
    const cityName = guia.city || 'Otros';
    if (!acc[citySlug]) {
      acc[citySlug] = { name: cityName, slug: citySlug, guias: [], image: null };
    }
    acc[citySlug].guias.push(guia);
    if (!acc[citySlug].image && guia.hero?.media?.url) {
      acc[citySlug].image = getMediaUrl(guia.hero.media.sizes?.medium?.url || guia.hero.media.url);
    }
    return acc;
  }, {} as Record<string, { name: string; slug: string; guias: typeof guias; image: string | null }>);

  const citiesSorted = Object.values(guiasByCity).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />

      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` },
            { label: ui.allGuides, href: `/${lang}/guias` },
            { label: countryName }
          ]} />

          <div className="mt-6 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {ui.guidesIn} {countryName}
            </h1>
            <p className="text-lg text-gray-600">
              {guias.length} {ui.guides} • {citiesSorted.length} {lang === 'es' ? 'ciudades' : 'cities'}
            </p>
          </div>

          {/* Ciudades carrusel */}
          {citiesSorted.length > 1 && (
            <section className="mb-12">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {citiesSorted.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${lang}/guias/ciudad/${city.slug}`}
                    className="flex-shrink-0 w-56 group"
                  >
                    <div className="relative h-36 rounded-2xl overflow-hidden mb-2">
                      {city.image ? (
                        <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                          <MapPin size={28} className="text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <h3 className="text-white font-bold">{city.name}</h3>
                        <p className="text-white/80 text-sm">{city.guias.length} {ui.guides}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Guías por ciudad */}
          {citiesSorted.map((city) => (
            <section key={city.slug} className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={20} className="text-green-600" />
                  {city.name}
                </h2>
                {city.guias.length > 3 && (
                  <Link href={`/${lang}/guias/ciudad/${city.slug}`} className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                    Ver todas <ArrowRight size={16} />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {city.guias.slice(0, 6).map((guia) => {
                  const imageUrl = guia.hero?.media?.url ? getMediaUrl(guia.hero.media.sizes?.medium?.url || guia.hero.media.url) : null;
                  return (
                    <Link key={guia.id} href={`/${lang}/guias/${guia.slug}`} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
                      {imageUrl ? (
                        <div className="relative h-44 overflow-hidden">
                          <img src={imageUrl} alt={guia.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      ) : (
                        <div className="relative h-44 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          <BookOpen size={40} className="text-white/50" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">{guia.title}</h3>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar size={14} />
                            <span>{formatDate(guia.updatedAt, lang)}</span>
                          </div>
                          <span className="text-green-600 font-medium text-sm flex items-center gap-1">
                            {ui.readGuide} <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

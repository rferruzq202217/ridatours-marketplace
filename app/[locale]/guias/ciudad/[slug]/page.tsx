export const dynamic = "force-dynamic";
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllPages, getMediaUrl } from '@/lib/payload';
import { getMessages, Locale } from '@/lib/i18n';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const uiTexts: Record<string, { guidesIn: string; readGuide: string; guides: string; allGuides: string }> = {
  es: { guidesIn: 'Guías de viaje en', readGuide: 'Leer guía', guides: 'guías', allGuides: 'Guías' },
  en: { guidesIn: 'Travel guides in', readGuide: 'Read guide', guides: 'guides', allGuides: 'Guides' },
  fr: { guidesIn: 'Guides de voyage à', readGuide: 'Lire le guide', guides: 'guides', allGuides: 'Guides' },
  it: { guidesIn: 'Guide di viaggio a', readGuide: 'Leggi guida', guides: 'guide', allGuides: 'Guide' },
  de: { guidesIn: 'Reiseführer für', readGuide: 'Reiseführer lesen', guides: 'Reiseführer', allGuides: 'Reiseführer' },
};

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'fr' ? 'fr-FR' : locale === 'it' ? 'it-IT' : locale === 'de' ? 'de-DE' : 'en-US', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

export default async function GuiasCiudadPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);
  const ui = uiTexts[lang] || uiTexts.es;

  const allGuias = await getAllPages();
  const guias = allGuias.filter(g => g.citySlug === slug).sort((a, b) => a.title.localeCompare(b.title));

  if (guias.length === 0) notFound();

  const cityName = guias[0]?.city || slug;
  const heroImage = guias[0]?.hero?.media?.url ? getMediaUrl(guias[0].hero.media.url) : null;

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />

      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` },
            { label: ui.allGuides, href: `/${lang}/guias` },
            { label: cityName }
          ]} />

          {/* Hero */}
          <div className="mt-6 mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {ui.guidesIn} {cityName}
              </h1>
              <p className="text-lg text-gray-600">
                {guias.length} {ui.guides}
              </p>
            </div>
            {heroImage && (
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                <img src={heroImage} alt={cityName} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Grid de guías ordenadas alfabéticamente */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guias.map((guia) => {
              const imageUrl = guia.hero?.media?.url ? getMediaUrl(guia.hero.media.sizes?.medium?.url || guia.hero.media.url) : null;
              return (
                <Link key={guia.id} href={`/${lang}/guias/${guia.slug}`} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
                  {imageUrl ? (
                    <div className="relative h-48 overflow-hidden">
                      <img src={imageUrl} alt={guia.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <BookOpen size={48} className="text-white/50" />
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {guia.title}
                    </h2>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{formatDate(guia.updatedAt, lang)}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-green-600 font-medium text-sm group-hover:gap-2 transition-all">
                        {ui.readGuide}
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

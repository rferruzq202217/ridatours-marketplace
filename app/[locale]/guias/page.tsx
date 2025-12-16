// app/[locale]/guias/page.tsx
export const dynamic = "force-dynamic";
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllPages, getMediaUrl } from '@/lib/payload';
import { getMessages, Locale } from '@/lib/i18n';
import { BookOpen, Calendar, ArrowRight, MapPin } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const uiTexts: Record<string, { 
  title: string; 
  subtitle: string; 
  readGuide: string;
  noGuidesYet: string;
  guidesCount: string;
}> = {
  es: { title: 'Guías de Viaje', subtitle: 'Todo lo que necesitas saber para visitar los mejores monumentos del Mundo. Consejos de expertos, entradas sin colas y trucos para aprovechar al máximo tu visita.', readGuide: 'Leer guía', noGuidesYet: 'Próximamente nuevas guías', guidesCount: 'guías disponibles' },
  en: { title: 'Travel Guides', subtitle: 'Everything you need to know to visit the best monuments in Europe. Expert tips, skip-the-line tickets and tricks to make the most of your visit.', readGuide: 'Read guide', noGuidesYet: 'New guides coming soon', guidesCount: 'guides available' },
  fr: { title: 'Guides de Voyage', subtitle: 'Tout ce que vous devez savoir pour visiter les meilleurs monuments d\'Europe. Conseils d\'experts et astuces pour profiter au maximum de votre visite.', readGuide: 'Lire le guide', noGuidesYet: 'Nouveaux guides à venir', guidesCount: 'guides disponibles' },
  it: { title: 'Guide di Viaggio', subtitle: 'Tutto quello che devi sapere per visitare i migliori monumenti d\'Europa. Consigli di esperti e trucchi per sfruttare al massimo la tua visita.', readGuide: 'Leggi guida', noGuidesYet: 'Nuove guide in arrivo', guidesCount: 'guide disponibili' },
  de: { title: 'Reiseführer', subtitle: 'Alles was Sie wissen müssen um die besten Denkmäler Europas zu besuchen. Expertentipps und Tricks um das Beste aus Ihrem Besuch zu machen.', readGuide: 'Reiseführer lesen', noGuidesYet: 'Neue Reiseführer in Kürze', guidesCount: 'Reiseführer verfügbar' },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const ui = uiTexts[locale] || uiTexts.es;
  return { title: ui.title + ' - Ridatours', description: ui.subtitle };
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'fr' ? 'fr-FR' : locale === 'it' ? 'it-IT' : locale === 'de' ? 'de-DE' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export default async function GuiasPage({ params }: PageProps) {
  const { locale } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);
  const ui = uiTexts[lang] || uiTexts.es;

  const guias = await getAllPages();

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />

      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` },
            { label: ui.title }
          ]} />

          {/* Hero Split */}
          <div className="mt-6 mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 text-green-600 font-semibold mb-3">
                <BookOpen size={24} />
                <span>Ridatours</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {ui.title}
              </h1>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {ui.subtitle}
              </p>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{guias.length}</span>
                  <span>{ui.guidesCount}</span>
                </div>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-green-600" />
                  <span>{lang === 'es' ? 'Europa' : 'Europe'}</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80" 
                alt={ui.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent" />
            </div>
          </div>

          {/* Grid de guías */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guias.map((guia) => {
              const imageUrl = guia.hero?.media?.url 
                ? getMediaUrl(guia.hero.media.sizes?.medium?.url || guia.hero.media.url)
                : null;

              return (
                <Link 
                  key={guia.id} 
                  href={`/${lang}/guias/${guia.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {imageUrl ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={guia.hero?.media?.alt || guia.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
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

          {guias.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">{ui.noGuidesYet}</p>
            </div>
          )}
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

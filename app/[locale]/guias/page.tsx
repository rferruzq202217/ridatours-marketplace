// app/[locale]/guias/page.tsx
export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllPages, getMediaUrl } from '@/lib/payload';
import { getMessages, Locale } from '@/lib/i18n';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'es' ? 'Guías de Viaje - Ridatours' : 'Travel Guides - Ridatours';
  const description = locale === 'es' 
    ? 'Todo lo que necesitas saber para visitar los mejores monumentos de Europa'
    : 'Everything you need to know to visit the best monuments in Europe';

  return { title, description };
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export default async function GuiasPage({ params }: PageProps) {
  const { locale } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);

  const guias = await getAllPages();

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />

      {/* Hero verde */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="mx-auto text-white/80 mb-4" size={48} />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {lang === 'es' ? 'Guías de Viaje' : 'Travel Guides'}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {lang === 'es' 
              ? 'Todo lo que necesitas saber para visitar los mejores monumentos de Europa'
              : 'Everything you need to know to visit the best monuments in Europe'}
          </p>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` },
            { label: lang === 'es' ? 'Guías de Viaje' : 'Travel Guides' }
          ]} />

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
                  {/* Imagen */}
                  {imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={guia.hero?.media?.alt || guia.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Contenido */}
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
                        {lang === 'es' ? 'Leer guía' : 'Read guide'}
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Estado vacío */}
          {guias.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">
                {lang === 'es' ? 'Próximamente nuevas guías' : 'New guides coming soon'}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

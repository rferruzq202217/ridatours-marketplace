// app/[locale]/guias/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import RenderBlocks from '@/components/guias/RenderBlocks';
import { getPage, getAllPages, getMediaUrl } from '@/lib/payload';
import { getMessages, Locale } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Generar rutas estáticas
export async function generateStaticParams() {
  const pages = await getAllPages();
  const locales = ['es', 'en', 'fr', 'it', 'de'];
  
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      locale,
      slug: page.slug,
    }))
  );
}

// Metadatos SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    return { title: 'Guía no encontrada' };
  }

  const title = page.meta?.title || page.title;
  const description = page.meta?.description || `Guía completa: ${page.title}`;
  const imageUrl = page.meta?.image?.url 
    ? getMediaUrl(page.meta.image.sizes?.og?.url || page.meta.image.url)
    : page.hero?.media?.url 
      ? getMediaUrl(page.hero.media.sizes?.og?.url || page.hero.media.url)
      : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: 'article',
      locale: locale === 'es' ? 'es_ES' : locale === 'en' ? 'en_US' : locale === 'fr' ? 'fr_FR' : locale === 'it' ? 'it_IT' : 'de_DE',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// Extraer texto del rich text del hero
function extractText(richText: any): string {
  if (!richText?.root?.children) return '';
  const extract = (nodes: any[]): string => {
    return nodes.map((node) => {
      if (node.text) return node.text;
      if (node.children) return extract(node.children);
      return '';
    }).join(' ');
  };
  return extract(richText.root.children).trim();
}

export default async function GuiaPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);

  const page = await getPage(slug);

  if (!page) notFound();

  const heroImageUrl = page.hero?.media?.url 
    ? getMediaUrl(page.hero.media.sizes?.xlarge?.url || page.hero.media.url)
    : null;
  const heroImageAlt = page.hero?.media?.alt || page.title;
  const extracto = extractText(page.hero?.richText);

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />

      {/* Hero */}
      {heroImageUrl && (
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img
            src={heroImageUrl}
            alt={heroImageAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                {page.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="pt-8 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` },
            { label: lang === 'es' ? 'Guías' : 'Guides', href: `/${lang}/guias` },
            { label: page.title }
          ]} />

          {/* Título si no hay hero */}
          {!heroImageUrl && (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-6 mb-4">
              {page.title}
            </h1>
          )}

          {/* Extracto del hero */}
          {extracto && (
            <p className="text-lg text-gray-600 mb-8 mt-6 leading-relaxed">
              {extracto}
            </p>
          )}

          {/* Contenido - Bloques */}
          <div className="prose prose-lg max-w-none">
            <RenderBlocks blocks={page.layout} />
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

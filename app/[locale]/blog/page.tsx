// app/[locale]/blog/page.tsx
export const dynamic = "force-dynamic";
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllPosts, getMediaUrl } from '@/lib/payload';
import { getMessages, Locale } from '@/lib/i18n';
import { Newspaper, Calendar, User, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const uiTexts: Record<string, { 
  title: string; 
  subtitle: string; 
  readMore: string;
  noPostsYet: string;
}> = {
  es: { title: 'Blog de Viajes', subtitle: 'Consejos, guías y novedades para tus aventuras por Europa', readMore: 'Leer artículo', noPostsYet: 'Próximamente nuevos artículos' },
  en: { title: 'Travel Blog', subtitle: 'Tips, guides and news for your European adventures', readMore: 'Read article', noPostsYet: 'New articles coming soon' },
  fr: { title: 'Blog Voyage', subtitle: 'Conseils, guides et actualités pour vos aventures en Europe', readMore: 'Lire l\'article', noPostsYet: 'Nouveaux articles à venir' },
  it: { title: 'Blog di Viaggio', subtitle: 'Consigli, guide e novità per le tue avventure in Europa', readMore: 'Leggi articolo', noPostsYet: 'Nuovi articoli in arrivo' },
  de: { title: 'Reiseblog', subtitle: 'Tipps, Reiseführer und Neuigkeiten für Ihre Europa-Abenteuer', readMore: 'Artikel lesen', noPostsYet: 'Neue Artikel in Kürze' },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const ui = uiTexts[locale] || uiTexts.es;
  return { title: ui.title + ' - Ridatours', description: ui.subtitle };
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'fr' ? 'fr-FR' : locale === 'it' ? 'it-IT' : locale === 'de' ? 'de-DE' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);
  const ui = uiTexts[lang] || uiTexts.es;

  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Newspaper className="mx-auto text-white/80 mb-4" size={48} />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {ui.title}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {ui.subtitle}
          </p>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` },
            { label: ui.title }
          ]} />

          {/* Grid de posts */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const imageUrl = post.heroImage?.url 
                ? getMediaUrl(post.heroImage.sizes?.medium?.url || post.heroImage.url)
                : null;

              return (
                <Link 
                  key={post.id} 
                  href={`/${lang}/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={post.heroImage?.alt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {post.categories.slice(0, 2).map((cat) => (
                          <span key={cat.id} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            {cat.title}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                      {post.publishedAt && (
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{formatDate(post.publishedAt, lang)}</span>
                        </div>
                      )}
                      {post.populatedAuthors?.[0] && (
                        <div className="flex items-center gap-1.5">
                          <User size={14} />
                          <span>{post.populatedAuthors[0].name}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                      {ui.readMore}
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16">
              <Newspaper className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">{ui.noPostsYet}</p>
            </div>
          )}
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

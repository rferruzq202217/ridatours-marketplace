// app/[locale]/blog/[slug]/page.tsx
export const dynamic = "force-dynamic";
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ContentBlock from '@/components/guias/ContentBlock';
import { getPost, getAllPosts, getMediaUrl } from '@/lib/payload';
import { getMessages, Locale } from '@/lib/i18n';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const uiTexts: Record<string, { blog: string; backToBlog: string; minRead: string }> = {
  es: { blog: 'Blog', backToBlog: 'Volver al blog', minRead: 'min de lectura' },
  en: { blog: 'Blog', backToBlog: 'Back to blog', minRead: 'min read' },
  fr: { blog: 'Blog', backToBlog: 'Retour au blog', minRead: 'min de lecture' },
  it: { blog: 'Blog', backToBlog: 'Torna al blog', minRead: 'min di lettura' },
  de: { blog: 'Blog', backToBlog: 'Zurück zum Blog', minRead: 'Min. Lesezeit' },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.title,
  };
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'fr' ? 'fr-FR' : locale === 'it' ? 'it-IT' : locale === 'de' ? 'de-DE' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function estimateReadTime(content: any): number {
  if (!content?.root?.children) return 3;
  const extractText = (nodes: any[]): string => {
    return nodes.map((node: any) => {
      if (node.text) return node.text;
      if (node.children) return extractText(node.children);
      return '';
    }).join(' ');
  };
  const text = extractText(content.root.children);
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function RenderContent({ content }: { content: any }) {
  if (!content?.root?.children) return null;

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (node.type === 'paragraph') {
      return (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {node.children?.map((child: any, i: number) => renderChild(child, i))}
        </p>
      );
    }
    if (node.type === 'heading') {
      const level = node.tag || 'h2';
      const className = level === 'h1' ? 'text-3xl font-bold mt-8 mb-4' :
                       level === 'h2' ? 'text-2xl font-bold mt-8 mb-4' :
                       level === 'h3' ? 'text-xl font-bold mt-6 mb-3' :
                       'text-lg font-bold mt-4 mb-2';
      const Tag = level as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag key={index} className={className}>
          {node.children?.map((child: any, i: number) => renderChild(child, i))}
        </Tag>
      );
    }
    if (node.type === 'list') {
      const ListTag = node.listType === 'number' ? 'ol' : 'ul';
      return (
        <ListTag key={index} className={`mb-4 pl-6 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
          {node.children?.map((item: any, i: number) => (
            <li key={i} className="mb-2">{item.children?.map((c: any, j: number) => renderChild(c, j))}</li>
          ))}
        </ListTag>
      );
    }
    if (node.children) {
      return node.children.map((child: any, i: number) => renderNode(child, i));
    }
    return null;
  };

  const renderChild = (child: any, index: number): React.ReactNode => {
    if (child.type === 'text') {
      let content: React.ReactNode = child.text;
      if (child.format & 1) content = <strong key={index}>{content}</strong>;
      if (child.format & 2) content = <em key={index}>{content}</em>;
      return content;
    }
    if (child.type === 'link') {
      return (
        <a key={index} href={child.fields?.url || '#'} className="text-blue-600 hover:underline">
          {child.children?.map((c: any, i: number) => renderChild(c, i))}
        </a>
      );
    }
    if (child.children) {
      return child.children.map((c: any, i: number) => renderChild(c, i));
    }
    return child.text || null;
  };

  return <>{content.root.children.map((node: any, i: number) => renderNode(node, i))}</>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);
  const ui = uiTexts[lang] || uiTexts.es;
  
  const post = await getPost(slug);
  if (!post) notFound();

  const heroImage = post.heroImage?.url ? getMediaUrl(post.heroImage.sizes?.xlarge?.url || post.heroImage.url) : null;
  const readTime = estimateReadTime(post.content);

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />
      
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t.common.home, href: '/' + lang },
            { label: ui.blog, href: '/' + lang + '/blog' },
            { label: post.title }
          ]} />

          {/* Back link */}
          <Link href={`/${lang}/blog`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-4 mb-8">
            <ArrowLeft size={18} />
            {ui.backToBlog}
          </Link>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2 mb-4">
              {post.categories.map((cat) => (
                <span key={cat.id} className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {cat.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-6 text-gray-600 mb-8 flex-wrap">
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formatDate(post.publishedAt, lang)}</span>
              </div>
            )}
            {post.populatedAuthors?.[0] && (
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{post.populatedAuthors[0].name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{readTime} {ui.minRead}</span>
            </div>
          </div>

          {/* Hero Image */}
          {heroImage && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg">
              <img 
                src={heroImage} 
                alt={post.heroImage?.alt || post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <article className="prose prose-lg max-w-none">
            <RenderContent content={post.content} />
          </article>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

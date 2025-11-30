// app/[locale]/guias/[slug]/page.tsx
export const dynamic = "force-dynamic";
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import GuiaTabs from '@/components/guias/GuiaTabs';
import AlertaConfianza from '@/components/guias/AlertaConfianza';
import TablaConversion from '@/components/guias/TablaConversion';
import BotonCTA from '@/components/guias/BotonCTA';
import { getGuia, getAllGuias, getMediaUrl } from '@/lib/payload';
import { getMessages, Locale } from '@/lib/i18n';
import { translateGuiaFull } from '@/lib/translateGuia';
import { Calendar, BookOpen, Shield } from 'lucide-react';

const uiTexts: Record<string, { guiaRidatours: string; guides: string; updated: string; guaranteedAccess: string }> = {
  es: { guiaRidatours: "Guía Ridatours", guides: "Guías", updated: "Actualizado", guaranteedAccess: "Acceso garantizado con Tiqets" },
  en: { guiaRidatours: "Ridatours Guide", guides: "Guides", updated: "Updated", guaranteedAccess: "Guaranteed access with Tiqets" },
  fr: { guiaRidatours: "Guide Ridatours", guides: "Guides", updated: "Mis à jour", guaranteedAccess: "Accès garanti avec Tiqets" },
  it: { guiaRidatours: "Guida Ridatours", guides: "Guide", updated: "Aggiornato", guaranteedAccess: "Accesso garantito con Tiqets" },
  de: { guiaRidatours: "Ridatours Reiseführer", guides: "Reiseführer", updated: "Aktualisiert", guaranteedAccess: "Garantierter Zugang mit Tiqets" },
};

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const guias = await getAllGuias();
  const locales = ['es', 'en', 'fr', 'it', 'de'];
  return guias.flatMap((guia) =>
    locales.map((locale) => ({ locale, slug: guia.slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  let guia = await getGuia(slug);
  if (guia && locale !== "es") guia = await translateGuiaFull(guia, locale);
  if (!guia) return { title: 'Guía no encontrada' };
  const title = guia.meta?.title || guia.title;
  const description = guia.meta?.description || guia.title;
  return { title, description };
}

export default async function GuiaPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);
  const ui = uiTexts[lang] || uiTexts.es;
  let guia = await getGuia(slug);
  if (guia && locale !== "es") guia = await translateGuiaFull(guia, locale);
  if (!guia) notFound();

  const heroImage = guia.hero?.media?.url ? getMediaUrl(guia.hero.media.url) : null;
  
  // Extraer intro del hero richText
  let heroIntro = '';
  if (guia.hero?.richText?.root?.children) {
    heroIntro = guia.hero.richText.root.children
      .map((node: any) => node.children?.map((child: any) => child.text).join('') || '')
      .join(' ')
      .trim();
  }

  // Separar bloques por tipo
  const alertaBlock = guia.layout?.find((b: any) => b.blockType === 'alertaConfianza');
  const tablaBlock = guia.layout?.find((b: any) => b.blockType === 'tablaConversion');
  const ctaBlock = guia.layout?.find((b: any) => b.blockType === 'botonCTA');
  const contentBlocks = guia.layout?.filter((b: any) => b.blockType === 'content') || [];
  const faqBlocks = guia.layout?.filter((b: any) => b.blockType === 'faq') || [];

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t.common.home, href: '/' + lang },
            { label: ui.guides, href: '/' + lang + '/guias' },
            { label: guia.title }
          ]} />

          {/* Hero Section */}
          <div className="mt-6 mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 text-green-600 font-semibold mb-3">
                <BookOpen size={20} />
                <span>{ui.guiaRidatours}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {guia.title}
              </h1>
              {heroIntro && (
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {heroIntro}
                </p>
              )}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span>{ui.updated}: {new Date(guia.updatedAt).toLocaleDateString(lang)}</span>
                </div>
                <div className="h-5 w-px bg-gray-300 hidden sm:block" />
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield size={18} className="text-green-600" />
                  <span>{ui.guaranteedAccess}</span>
                </div>
              </div>
            </div>
            
            {heroImage && (
              <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={heroImage} 
                  alt={guia.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* 1. Alerta de Confianza */}
          {alertaBlock && <AlertaConfianza block={alertaBlock as any} />}

          {/* 2. Tabla de Conversión (Tarjetas de Productos) */}
          {tablaBlock && <TablaConversion block={tablaBlock as any} lang={lang} />}

          {/* 3. Tabs: solo Content y FAQ */}
          <div className="mt-12">
            <GuiaTabs blocks={[...contentBlocks, ...faqBlocks]} lang={lang} />
          </div>

          {/* 4. Botón CTA */}
          {ctaBlock && <BotonCTA block={ctaBlock as any} />}
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

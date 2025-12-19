export const dynamic = "force-dynamic";
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllPages, getMediaUrl } from '@/lib/payload';
import { getMessages, Locale } from '@/lib/i18n';
import { BookOpen, Calendar, ArrowRight, MapPin, Globe, ChevronRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const uiTexts: Record<string, { 
  title: string; 
  subtitle: string; 
  readGuide: string;
  noGuidesYet: string;
  guidesCount: string;
  citiesTitle: string;
  byContinent: string;
  guides: string;
  seeAll: string;
}> = {
  es: { title: 'Guías de Viaje', subtitle: 'Todo lo que necesitas saber para visitar los mejores monumentos del Mundo. Consejos de expertos, entradas sin colas y trucos para aprovechar al máximo tu visita.', readGuide: 'Leer guía', noGuidesYet: 'Próximamente nuevas guías', guidesCount: 'guías disponibles', citiesTitle: 'Ciudades destacadas', byContinent: 'Explora por continente', guides: 'guías', seeAll: 'Ver todas' },
  en: { title: 'Travel Guides', subtitle: 'Everything you need to know to visit the best monuments in the World. Expert tips, skip-the-line tickets and tricks to make the most of your visit.', readGuide: 'Read guide', noGuidesYet: 'New guides coming soon', guidesCount: 'guides available', citiesTitle: 'Featured cities', byContinent: 'Explore by continent', guides: 'guides', seeAll: 'See all' },
  fr: { title: 'Guides de Voyage', subtitle: 'Tout ce que vous devez savoir pour visiter les meilleurs monuments du monde. Conseils d\'experts et astuces pour profiter au maximum de votre visite.', readGuide: 'Lire le guide', noGuidesYet: 'Nouveaux guides à venir', guidesCount: 'guides disponibles', citiesTitle: 'Villes en vedette', byContinent: 'Explorer par continent', guides: 'guides', seeAll: 'Voir tout' },
  it: { title: 'Guide di Viaggio', subtitle: 'Tutto quello che devi sapere per visitare i migliori monumenti del mondo. Consigli di esperti e trucchi per sfruttare al massimo la tua visita.', readGuide: 'Leggi guida', noGuidesYet: 'Nuove guide in arrivo', guidesCount: 'guide disponibili', citiesTitle: 'Città in evidenza', byContinent: 'Esplora per continente', guides: 'guide', seeAll: 'Vedi tutto' },
  de: { title: 'Reiseführer', subtitle: 'Alles was Sie wissen müssen um die besten Denkmäler der Welt zu besuchen. Expertentipps und Tricks um das Beste aus Ihrem Besuch zu machen.', readGuide: 'Reiseführer lesen', noGuidesYet: 'Neue Reiseführer in Kürze', guidesCount: 'Reiseführer verfügbar', citiesTitle: 'Ausgewählte Städte', byContinent: 'Nach Kontinent erkunden', guides: 'Reiseführer', seeAll: 'Alle anzeigen' },
};

const continentNames: Record<string, Record<string, string>> = {
  europa: { es: 'Europa', en: 'Europe', fr: 'Europe', it: 'Europa', de: 'Europa' },
  asia: { es: 'Asia', en: 'Asia', fr: 'Asie', it: 'Asia', de: 'Asien' },
  'america-norte': { es: 'América del Norte', en: 'North America', fr: 'Amérique du Nord', it: 'Nord America', de: 'Nordamerika' },
  'america-sur': { es: 'América del Sur', en: 'South America', fr: 'Amérique du Sud', it: 'Sud America', de: 'Südamerika' },
  africa: { es: 'África', en: 'Africa', fr: 'Afrique', it: 'Africa', de: 'Afrika' },
  oceania: { es: 'Oceanía', en: 'Oceania', fr: 'Océanie', it: 'Oceania', de: 'Ozeanien' },
};

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
  irlanda: { es: 'Irlanda', en: 'Ireland', fr: 'Irlande', it: 'Irlanda', de: 'Irland' },
  suiza: { es: 'Suiza', en: 'Switzerland', fr: 'Suisse', it: 'Svizzera', de: 'Schweiz' },
  croacia: { es: 'Croacia', en: 'Croatia', fr: 'Croatie', it: 'Croazia', de: 'Kroatien' },
  hungria: { es: 'Hungría', en: 'Hungary', fr: 'Hongrie', it: 'Ungheria', de: 'Ungarn' },
  polonia: { es: 'Polonia', en: 'Poland', fr: 'Pologne', it: 'Polonia', de: 'Polen' },
  turquia: { es: 'Turquía', en: 'Turkey', fr: 'Turquie', it: 'Turchia', de: 'Türkei' },
  marruecos: { es: 'Marruecos', en: 'Morocco', fr: 'Maroc', it: 'Marocco', de: 'Marokko' },
  'estados-unidos': { es: 'Estados Unidos', en: 'United States', fr: 'États-Unis', it: 'Stati Uniti', de: 'Vereinigte Staaten' },
  mexico: { es: 'México', en: 'Mexico', fr: 'Mexique', it: 'Messico', de: 'Mexiko' },
  japon: { es: 'Japón', en: 'Japan', fr: 'Japon', it: 'Giappone', de: 'Japan' },
  tailandia: { es: 'Tailandia', en: 'Thailand', fr: 'Thaïlande', it: 'Thailandia', de: 'Thailand' },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const ui = uiTexts[locale] || uiTexts.es;
  return { title: ui.title + ' - Ridatours', description: ui.subtitle };
}

export default async function GuiasPage({ params }: PageProps) {
  const { locale } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);
  const ui = uiTexts[lang] || uiTexts.es;

  const guias = await getAllPages();

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

  // Ordenar ciudades alfabéticamente
  const citiesSorted = Object.values(guiasByCity)
    .filter(c => c.slug !== 'otros')
    .sort((a, b) => a.name.localeCompare(b.name));

  // Agrupar países por continente
  const countriesByContinent = guias.reduce((acc, guia) => {
    const continent = guia.continent || 'europa';
    const country = guia.country;
    if (!country) return acc;
    
    if (!acc[continent]) acc[continent] = {};
    if (!acc[continent][country]) {
      acc[continent][country] = { count: 0, slug: country };
    }
    acc[continent][country].count++;
    return acc;
  }, {} as Record<string, Record<string, { count: number; slug: string }>>);

  const continentOrder = ['europa', 'asia', 'america-norte', 'america-sur', 'africa', 'oceania'];

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />

      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` },
            { label: ui.title }
          ]} />

          {/* Hero */}
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
                  <span>{citiesSorted.length} {lang === 'es' ? 'ciudades' : 'cities'}</span>
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

          {/* Ciudades destacadas - Carrusel horizontal */}
          {citiesSorted.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{ui.citiesTitle}</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {citiesSorted.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${lang}/guias/ciudad/${city.slug}`}
                    className="flex-shrink-0 w-64 group"
                  >
                    <div className="relative h-40 rounded-2xl overflow-hidden mb-3">
                      {city.image ? (
                        <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                          <MapPin size={32} className="text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-lg">{city.name}</h3>
                        <p className="text-white/80 text-sm">{city.guias.length} {ui.guides}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Por continente */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{ui.byContinent}</h2>
            <div className="space-y-8">
              {continentOrder.map((continentSlug) => {
                const countries = countriesByContinent[continentSlug];
                if (!countries || Object.keys(countries).length === 0) return null;
                
                const continentName = continentNames[continentSlug]?.[lang] || continentSlug;
                
                return (
                  <div key={continentSlug} className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Globe size={20} className="text-green-600" />
                      {continentName}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {Object.entries(countries)
                        .sort((a, b) => (countryNames[a[0]]?.[lang] || a[0]).localeCompare(countryNames[b[0]]?.[lang] || b[0]))
                        .map(([countrySlug, data]) => (
                          <Link
                            key={countrySlug}
                            href={`/${lang}/guias/pais/${countrySlug}`}
                            className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-green-50 hover:shadow-md transition-all group"
                          >
                            <span className="text-gray-700 group-hover:text-green-600 font-medium">
                              {countryNames[countrySlug]?.[lang] || countrySlug}
                            </span>
                            <span className="text-sm text-gray-400 group-hover:text-green-500">
                              {data.count}
                            </span>
                          </Link>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Lista alfabética de ciudades */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {lang === 'es' ? 'Todas las ciudades' : 'All cities'} ({citiesSorted.length})
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {citiesSorted.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${lang}/guias/ciudad/${city.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-green-600" />
                      <span className="text-gray-700 group-hover:text-green-600">{city.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">{city.guias.length}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

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

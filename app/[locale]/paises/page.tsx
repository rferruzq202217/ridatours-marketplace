import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Globe, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { getMessages, Locale } from '@/lib/i18n';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const continents = [
  { id: 'all', name: { es: 'Todos', en: 'All', fr: 'Tous', it: 'Tutti', de: 'Alle' }, emoji: '🌍' },
  { id: 'Europa', name: { es: 'Europa', en: 'Europe', fr: 'Europe', it: 'Europa', de: 'Europa' }, emoji: '🇪🇺' },
  { id: 'Asia', name: { es: 'Asia', en: 'Asia', fr: 'Asie', it: 'Asia', de: 'Asien' }, emoji: '🌏' },
  { id: 'América del Norte', name: { es: 'América del Norte', en: 'North America', fr: 'Amérique du Nord', it: 'Nord America', de: 'Nordamerika' }, emoji: '🌎' },
  { id: 'América del Sur', name: { es: 'América del Sur', en: 'South America', fr: 'Amérique du Sud', it: 'Sud America', de: 'Südamerika' }, emoji: '🌎' },
  { id: 'África', name: { es: 'África', en: 'Africa', fr: 'Afrique', it: 'Africa', de: 'Afrika' }, emoji: '🌍' },
  { id: 'Oceanía', name: { es: 'Oceanía', en: 'Oceania', fr: 'Océanie', it: 'Oceania', de: 'Ozeanien' }, emoji: '🌏' },
];

const texts = {
  es: { title: '🌍 Países del mundo', subtitle: 'Explora destinos únicos en cada rincón del planeta', countries: 'países', cities: 'ciudades', experiences: 'experiencias' },
  en: { title: '🌍 Countries of the world', subtitle: 'Explore unique destinations in every corner of the planet', countries: 'countries', cities: 'cities', experiences: 'experiences' },
  fr: { title: '🌍 Pays du monde', subtitle: 'Explorez des destinations uniques aux quatre coins de la planète', countries: 'pays', cities: 'villes', experiences: 'expériences' },
  it: { title: '🌍 Paesi del mondo', subtitle: 'Esplora destinazioni uniche in ogni angolo del pianeta', countries: 'paesi', cities: 'città', experiences: 'esperienze' },
  de: { title: '🌍 Länder der Welt', subtitle: 'Entdecken Sie einzigartige Reiseziele in jedem Winkel der Welt', countries: 'Länder', cities: 'Städte', experiences: 'Erlebnisse' },
};

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ region?: string }>;
}

export default async function CountriesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);
  const txt = texts[lang] || texts.es;
  const searchParamsData = await searchParams;
  const selectedRegion = searchParamsData.region || 'all';

  const { data: countriesFromDb } = await supabase.from('countries').select('*').order('name');
  const countries = countriesFromDb || [];

  const countriesWithStats = await Promise.all(
    countries.map(async (country) => {
      const { count: cityCount } = await supabase.from('cities').select('*', { count: 'exact', head: true }).eq('country_id', country.id);
      const { data: citiesData } = await supabase.from('cities').select('id').eq('country_id', country.id);
      let experienceCount = 0;
      if (citiesData && citiesData.length > 0) {
        const cityIds = citiesData.map(c => c.id);
        const { count } = await supabase.from('experiences').select('*', { count: 'exact', head: true }).in('city_id', cityIds).eq('active', true);
        experienceCount = count || 0;
      }
      return { ...country, cityCount: cityCount || 0, experienceCount };
    })
  );

  const filteredCountries = selectedRegion === 'all' ? countriesWithStats : countriesWithStats.filter(c => c.continent === selectedRegion);
  const countriesByContinent = filteredCountries.reduce((acc, country) => {
    if (!acc[country.continent]) acc[country.continent] = [];
    acc[country.continent].push(country);
    return acc;
  }, {} as Record<string, typeof filteredCountries>);

  const sortedContinents = Object.keys(countriesByContinent).sort();
  const availableContinents = [...new Set(countriesWithStats.map(c => c.continent))];
  const filteredContinentTabs = continents.filter(c => c.id === 'all' || availableContinents.includes(c.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang} />
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: t.common.home, href: '/' + lang }, { label: txt.countries }]} />
          <div className="mt-6 mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{txt.title}</h1>
            <p className="text-xl text-gray-600">{txt.subtitle}</p>
          </div>
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {filteredContinentTabs.map((continent) => (
              <Link key={continent.id} href={continent.id === 'all' ? '/' + lang + '/paises' : '/' + lang + '/paises?region=' + encodeURIComponent(continent.id)} className={'flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ' + (selectedRegion === continent.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200')}>
                <span>{continent.emoji}</span>
                <span>{continent.name[lang] || continent.name.es}</span>
              </Link>
            ))}
          </div>
          <div className="mb-6 text-sm text-gray-600"><span className="font-semibold text-gray-900">{filteredCountries.length}</span> {txt.countries}</div>
          {sortedContinents.map((continent) => (
            <div key={continent} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span>{continents.find(c => c.id === continent)?.emoji || '🌍'}</span>
                <span>{continent}</span>
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{countriesByContinent[continent].length}</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {countriesByContinent[continent].map((country) => (
                  <Link key={country.slug} href={'/' + lang + '/paises/' + country.slug} className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-200 shadow-md hover:shadow-xl transition-shadow">
                    {country.image ? (
                      <Image src={country.image} alt={country.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="20vw" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"><Globe size={48} className="text-white/50" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 text-white"><Globe size={16} /><span className="font-bold text-lg">{country.name}</span></div>
                      <div className="flex gap-3 mt-1 ml-6">
                        {country.cityCount > 0 && <p className="text-xs text-white/80">{country.cityCount} {txt.cities}</p>}
                        {country.experienceCount > 0 && <p className="text-xs text-white/80">{country.experienceCount} {txt.experiences}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {filteredCountries.length === 0 && (
            <div className="text-center py-16"><Globe size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-gray-500 text-lg">{t.common.noResults}</p></div>
          )}
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}

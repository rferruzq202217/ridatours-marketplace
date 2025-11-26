import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { getMessages, Locale } from '@/lib/i18n';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const continents = [
  { id: 'all', name: { es: 'Todas', en: 'All', fr: 'Toutes', it: 'Tutte', de: 'Alle' }, emoji: '🌍' },
  { id: 'Europa', name: { es: 'Europa', en: 'Europe', fr: 'Europe', it: 'Europa', de: 'Europa' }, emoji: '🇪🇺' },
  { id: 'Asia', name: { es: 'Asia', en: 'Asia', fr: 'Asie', it: 'Asia', de: 'Asien' }, emoji: '🌏' },
  { id: 'América del Norte', name: { es: 'América del Norte', en: 'North America', fr: 'Amérique du Nord', it: 'Nord America', de: 'Nordamerika' }, emoji: '🌎' },
  { id: 'América del Sur', name: { es: 'América del Sur', en: 'South America', fr: 'Amérique du Sud', it: 'Sud America', de: 'Südamerika' }, emoji: '🌎' },
  { id: 'África', name: { es: 'África', en: 'Africa', fr: 'Afrique', it: 'Africa', de: 'Afrika' }, emoji: '🌍' },
  { id: 'Oceanía', name: { es: 'Oceanía', en: 'Oceania', fr: 'Océanie', it: 'Oceania', de: 'Ozeanien' }, emoji: '🌏' },
];

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ region?: string }>;
}

export default async function CitiesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);
  
  const searchParamsData = await searchParams;
  const selectedRegion = searchParamsData.region || 'all';

  const { data: citiesFromDb } = await supabase
    .from('cities')
    .select('id, name, slug, image, country_id, countries(id, name, continent)')
    .order('name');

  const cities = (citiesFromDb || []).map((city: any) => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
    image: city.image,
    country: city.countries?.name || 'Sin país',
    continent: city.countries?.continent || 'Europa'
  }));

  const citiesWithCount = await Promise.all(
    cities.map(async (city) => {
      const { count } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true })
        .eq('city_id', city.id)
        .eq('active', true);
      return { ...city, experienceCount: count || 0 };
    })
  );

  const filteredCities = selectedRegion === 'all' 
    ? citiesWithCount 
    : citiesWithCount.filter(city => city.continent === selectedRegion);

  const citiesByContinent = filteredCities.reduce((acc, city) => {
    if (!acc[city.continent]) acc[city.continent] = {};
    if (!acc[city.continent][city.country]) acc[city.continent][city.country] = [];
    acc[city.continent][city.country].push(city);
    return acc;
  }, {} as Record<string, Record<string, typeof filteredCities>>);

  const sortedContinents = Object.keys(citiesByContinent).sort();
  const availableContinents = [...new Set(citiesWithCount.map(c => c.continent))];
  const filteredContinentTabs = continents.filter(c => c.id === 'all' || availableContinents.includes(c.id));

  const titles: Record<string, string> = {
    es: '🏙️ Ciudades del mundo',
    en: '🏙️ Cities of the world',
    fr: '🏙️ Villes du monde',
    it: '🏙️ Città del mondo',
    de: '🏙️ Städte der Welt'
  };

  const subtitles: Record<string, string> = {
    es: 'Desde lugares emblemáticos hasta experiencias inolvidables',
    en: 'From iconic landmarks to unforgettable experiences',
    fr: 'Des lieux emblématiques aux expériences inoubliables',
    it: 'Dai luoghi iconici alle esperienze indimenticabili',
    de: 'Von ikonischen Wahrzeichen bis hin zu unvergesslichen Erlebnissen'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang} />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` },
            { label: t.common.cities }
          ]} />

          <div className="mt-6 mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{titles[lang] || titles.es}</h1>
            <p className="text-xl text-gray-600">{subtitles[lang] || subtitles.es}</p>
          </div>

          {/* Filtros por continente */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {filteredContinentTabs.map((continent) => (
              <Link 
                key={continent.id} 
                href={continent.id === 'all' ? `/${lang}/ciudades` : `/${lang}/ciudades?region=${encodeURIComponent(continent.id)}`}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                  selectedRegion === continent.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{continent.emoji}</span>
                <span>{continent.name[lang] || continent.name.es}</span>
              </Link>
            ))}
          </div>

          <div className="mb-6 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filteredCities.length}</span> {t.common.cities.toLowerCase()}
          </div>

          {sortedContinents.map((continent) => (
            <div key={continent} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span>{continents.find(c => c.id === continent)?.emoji || '🌍'}</span>
                <span>{continent}</span>
              </h2>
              
              {Object.keys(citiesByContinent[continent]).sort().map((country) => (
                <div key={country} className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <span>{country}</span>
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {citiesByContinent[continent][country].length}
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {citiesByContinent[continent][country].map((city) => (
                      <Link 
                        key={city.slug} 
                        href={`/${lang}/${city.slug}`} 
                        className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-200"
                      >
                        {city.image && (
                          <Image 
                            src={city.image} 
                            alt={city.name} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-500" 
                            sizes="20vw" 
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center gap-2 text-white">
                            <MapPin size={16} />
                            <span className="font-bold text-lg">{city.name}</span>
                          </div>
                          {city.experienceCount > 0 && (
                            <p className="text-xs text-white/80 mt-1 ml-6">
                              {city.experienceCount} {t.common.experiences.toLowerCase()}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {filteredCities.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{t.common.noResults}</p>
            </div>
          )}
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

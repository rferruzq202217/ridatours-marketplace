import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const continents = [
  { id: 'all', name: 'Todas', emoji: '🌍' },
  { id: 'Europa', name: 'Europa', emoji: '🇪🇺' },
  { id: 'Asia', name: 'Asia', emoji: '🌏' },
  { id: 'América del Norte', name: 'América del Norte', emoji: '🌎' },
  { id: 'América del Sur', name: 'América del Sur', emoji: '🌎' },
  { id: 'África', name: 'África', emoji: '🌍' },
  { id: 'Oceanía', name: 'Oceanía', emoji: '🌏' },
];

const breadcrumbItems = [
  { label: 'Inicio', href: '/es' },
  { label: 'Ciudades' }
];

interface PageProps {
  searchParams: Promise<{ region?: string }>;
}

export default async function CitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedRegion = params.region || 'all';

  // Obtener ciudades con su país y continente
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

  // Contar experiencias por ciudad
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

  // Filtrar por continente
  const filteredCities = selectedRegion === 'all' 
    ? citiesWithCount 
    : citiesWithCount.filter(city => city.continent === selectedRegion);

  // Agrupar por continente y luego por país
  const citiesByContinent = filteredCities.reduce((acc, city) => {
    if (!acc[city.continent]) acc[city.continent] = {};
    if (!acc[city.continent][city.country]) acc[city.continent][city.country] = [];
    acc[city.continent][city.country].push(city);
    return acc;
  }, {} as Record<string, Record<string, typeof filteredCities>>);

  const sortedContinents = Object.keys(citiesByContinent).sort();

  // Obtener continentes únicos que tienen ciudades
  const availableContinents = [...new Set(citiesWithCount.map(c => c.continent))];
  const filteredContinentTabs = continents.filter(c => c.id === 'all' || availableContinents.includes(c.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang="es" transparent={false} showSearch={true} />
      
      <div className="h-24"></div>
      
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Las mejores ciudades del mundo para visitar</h1>
          <p className="text-xl text-blue-100 max-w-2xl">Desde lugares emblemáticos hasta experiencias inolvidables.</p>
        </div>
      </div>

      <div className="bg-white border-b sticky top-24 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {filteredContinentTabs.map((continent) => (
              <Link 
                key={continent.id} 
                href={continent.id === 'all' ? '/es/ciudades' : `/es/ciudades?region=${encodeURIComponent(continent.id)}`}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${selectedRegion === continent.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span>{continent.emoji}</span><span>{continent.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center gap-4 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{filteredCities.length} ciudades</span>
        </div>

        {sortedContinents.map((continent) => (
          <div key={continent} className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span>{continents.find(c => c.id === continent)?.emoji || '🌍'}</span>
              <span>{continent}</span>
            </h2>
            
            {Object.keys(citiesByContinent[continent]).sort().map((country) => (
              <div key={country} className="mb-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span>{country}</span>
                  <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {citiesByContinent[continent][country].length} ciudades
                  </span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {citiesByContinent[continent][country].map((city) => (
                    <Link 
                      key={city.slug} 
                      href={`/es/${city.slug}`} 
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
                          <p className="text-xs text-white/80 mt-1 ml-6">{city.experienceCount} experiencias</p>
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
            <p className="text-gray-500 text-lg">No hay ciudades en esta región</p>
          </div>
        )}
      </div>

      <Footer lang="es" />
    </div>
  );
}

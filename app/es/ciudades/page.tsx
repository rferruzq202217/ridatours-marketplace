import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const cityData: Record<string, { country: string; continent: string }> = {
  'roma': { country: 'Italia', continent: 'Europa' },
  'paris': { country: 'Francia', continent: 'Europa' },
  'barcelona': { country: 'España', continent: 'Europa' },
  'madrid': { country: 'España', continent: 'Europa' },
  'londres': { country: 'Reino Unido', continent: 'Europa' },
  'amsterdam': { country: 'Países Bajos', continent: 'Europa' },
  'berlin': { country: 'Alemania', continent: 'Europa' },
  'viena': { country: 'Austria', continent: 'Europa' },
  'praga': { country: 'República Checa', continent: 'Europa' },
  'lisboa': { country: 'Portugal', continent: 'Europa' },
  'florencia': { country: 'Italia', continent: 'Europa' },
  'venecia': { country: 'Italia', continent: 'Europa' },
  'milan': { country: 'Italia', continent: 'Europa' },
  'napoles': { country: 'Italia', continent: 'Europa' },
  'atenas': { country: 'Grecia', continent: 'Europa' },
  'estambul': { country: 'Turquía', continent: 'Europa' },
  'dublin': { country: 'Irlanda', continent: 'Europa' },
  'edimburgo': { country: 'Reino Unido', continent: 'Europa' },
  'bruselas': { country: 'Bélgica', continent: 'Europa' },
  'copenhague': { country: 'Dinamarca', continent: 'Europa' },
  'estocolmo': { country: 'Suecia', continent: 'Europa' },
  'oslo': { country: 'Noruega', continent: 'Europa' },
  'helsinki': { country: 'Finlandia', continent: 'Europa' },
  'budapest': { country: 'Hungría', continent: 'Europa' },
  'varsovia': { country: 'Polonia', continent: 'Europa' },
  'cracovia': { country: 'Polonia', continent: 'Europa' },
  'nueva-york': { country: 'Estados Unidos', continent: 'América del Norte' },
  'los-angeles': { country: 'Estados Unidos', continent: 'América del Norte' },
  'miami': { country: 'Estados Unidos', continent: 'América del Norte' },
  'las-vegas': { country: 'Estados Unidos', continent: 'América del Norte' },
  'san-francisco': { country: 'Estados Unidos', continent: 'América del Norte' },
  'chicago': { country: 'Estados Unidos', continent: 'América del Norte' },
  'toronto': { country: 'Canadá', continent: 'América del Norte' },
  'cancun': { country: 'México', continent: 'América del Norte' },
  'ciudad-de-mexico': { country: 'México', continent: 'América del Norte' },
  'buenos-aires': { country: 'Argentina', continent: 'América del Sur' },
  'rio-de-janeiro': { country: 'Brasil', continent: 'América del Sur' },
  'lima': { country: 'Perú', continent: 'América del Sur' },
  'bogota': { country: 'Colombia', continent: 'América del Sur' },
  'santiago': { country: 'Chile', continent: 'América del Sur' },
  'tokio': { country: 'Japón', continent: 'Asia' },
  'bangkok': { country: 'Tailandia', continent: 'Asia' },
  'singapur': { country: 'Singapur', continent: 'Asia' },
  'hong-kong': { country: 'China', continent: 'Asia' },
  'dubai': { country: 'Emiratos Árabes', continent: 'Asia' },
  'bali': { country: 'Indonesia', continent: 'Asia' },
  'sydney': { country: 'Australia', continent: 'Oceanía' },
  'melbourne': { country: 'Australia', continent: 'Oceanía' },
  'el-cairo': { country: 'Egipto', continent: 'África' },
  'marrakech': { country: 'Marruecos', continent: 'África' },
  'ciudad-del-cabo': { country: 'Sudáfrica', continent: 'África' },
};

const continents = [
  { id: 'all', name: 'Todas', emoji: '🌍' },
  { id: 'Europa', name: 'Europa', emoji: '🇪🇺' },
  { id: 'América del Norte', name: 'América del Norte', emoji: '🌎' },
  { id: 'América del Sur', name: 'América del Sur', emoji: '🌎' },
  { id: 'Asia', name: 'Asia', emoji: '🌏' },
  { id: 'Oceanía', name: 'Oceanía', emoji: '🌏' },
  { id: 'África', name: 'África', emoji: '🌍' },
];

interface PageProps {
  searchParams: Promise<{ region?: string }>;
}

export default async function CitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedRegion = params.region || 'all';

  const { data: citiesFromDb } = await supabase
    .from('cities')
    .select('name, slug, image')
    .order('name');

  const cities = (citiesFromDb || []).map(city => {
    const data = cityData[city.slug] || { country: 'Europa', continent: 'Europa' };
    return {
      ...city,
      country: data.country,
      continent: data.continent
    };
  });

  const citiesWithCount = await Promise.all(
    cities.map(async (city) => {
      const { data: cityRecord } = await supabase
        .from('cities')
        .select('id')
        .eq('slug', city.slug)
        .single();
      
      if (cityRecord) {
        const { count } = await supabase
          .from('experiences')
          .select('*', { count: 'exact', head: true })
          .eq('city_id', cityRecord.id)
          .eq('active', true);
        
        return { ...city, experienceCount: count || 0 };
      }
      return { ...city, experienceCount: 0 };
    })
  );

  const filteredCities = selectedRegion === 'all' 
    ? citiesWithCount 
    : citiesWithCount.filter(city => city.continent === selectedRegion);

  const citiesByCountry = filteredCities.reduce((acc, city) => {
    if (!acc[city.country]) {
      acc[city.country] = [];
    }
    acc[city.country].push(city);
    return acc;
  }, {} as Record<string, typeof filteredCities>);

  const sortedCountries = Object.keys(citiesByCountry).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang="es" transparent={false} showSearch={true} />
      
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Las mejores ciudades del mundo para visitar
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Echa un vistazo a nuestra lista de ciudades: desde lugares emblemáticos hasta experiencias inolvidables.
          </p>
        </div>
      </div>

      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {continents.map((continent) => (
              <Link
                key={continent.id}
                href={continent.id === 'all' ? '/es/ciudades' : `/es/ciudades?region=${encodeURIComponent(continent.id)}`}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                  selectedRegion === continent.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{continent.emoji}</span>
                <span>{continent.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center gap-4 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{filteredCities.length} ciudades</span>
          <span>•</span>
          <span>{sortedCountries.length} países</span>
        </div>

        {sortedCountries.map((country) => (
          <div key={country} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span>{country}</span>
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {citiesByCountry[country].length} {citiesByCountry[country].length === 1 ? 'ciudad' : 'ciudades'}
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {citiesByCountry[country].map((city) => (
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
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 text-white">
                      <MapPin size={16} className="text-blue-400" />
                      <span className="font-bold text-lg drop-shadow-lg">{city.name}</span>
                    </div>
                    {city.experienceCount > 0 && (
                      <p className="text-xs text-blue-300 mt-1 ml-6">
                        {city.experienceCount} {city.experienceCount === 1 ? 'experiencia' : 'experiencias'}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filteredCities.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay ciudades en esta región todavía</h3>
            <p className="text-gray-600 mb-6">Estamos trabajando para añadir más destinos pronto</p>
            <Link href="/es/ciudades" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
              Ver todas las ciudades
            </Link>
          </div>
        )}
      </div>

      <Footer lang="es" />
    </div>
  );
}

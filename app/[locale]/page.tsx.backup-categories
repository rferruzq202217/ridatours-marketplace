import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import ExperienceCarousel from '@/components/ExperienceCarousel';
import RecentlyViewedCarousel from '@/components/RecentlyViewedCarousel';
import { Landmark, Building2, Church, Palette, Music, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function HomePage() {
  // Cargar ciudades desde Supabase
  const { data: cities } = await supabase
    .from('cities')
    .select('name, slug, image')
    .order('name');

  // Cargar categorías desde Supabase
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('name, slug, count')
    .order('name');

  // Cargar TODAS las experiencias activas
  const { data: allExperiences } = await supabase
    .from('experiences')
    .select(`
      id,
      title,
      slug,
      description,
      price,
      rating,
      reviews,
      duration,
      main_image,
      featured,
      city_id,
      cities!inner(slug, name)
    `)
    .eq('active', true)
    .order('created_at', { ascending: false });

  // Mapear a formato del componente
  const experiences = allExperiences?.map((exp: any) => ({
    city: exp.cities?.slug || '',
    slug: exp.slug,
    title: exp.title,
    cityName: exp.cities?.name || '',
    image: exp.main_image || '',
    price: exp.price,
    rating: exp.rating,
    reviews: exp.reviews,
    duration: exp.duration || '',
    featured: exp.featured
  })) || [];

  // LÓGICA INTELIGENTE DE CARRUSELES:

  // 1. Actividades más populares: Featured o más reviews
  const popularActivities = experiences
    .filter(e => e.featured || e.reviews > 5000)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 6);

  // 2. Las mejores del mundo: Rating alto
  const worldBest = experiences
    .filter(e => e.rating >= 4.7)
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, 6);

  // 3. Recomendaciones de Ridatours: Más recientes
  const ridatoursRecommended = experiences
    .slice(0, 6);

  // Mapear categorías con iconos
  const iconMap: any = {
    'Monumentos': Landmark,
    'Museos': Palette,
    'Tours': Building2,
    'Iglesias': Church,
    'Catedrales': Church,
    'Gastronomía': UtensilsCrossed,
    'Shows': Music,
  };

  const categories = categoriesData?.map(cat => ({
    name: cat.name,
    icon: iconMap[cat.name] || Landmark,
    count: cat.count || 0
  })) || [];

  return (
    <div className="min-h-screen bg-white">
      <Header lang="es" transparent={true} showSearch={true} />
      
      {/* Hero */}
      <div className="relative h-[65vh] overflow-hidden">
        <iframe 
          className="absolute inset-0" 
          style={{ width: '100vw', height: '100vh', transform: 'scale(1.5)' }} 
          src="https://www.youtube.com/embed/eZjmjT5SLYs?autoplay=1&mute=1&controls=0&loop=1&playlist=eZjmjT5SLYs&playsinline=1" 
          frameBorder="0" 
          allowFullScreen 
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-4 drop-shadow-2xl">Descubre el mundo</h1>
          <p className="text-lg md:text-xl text-white text-center mb-8 drop-shadow-lg">Las mejores experiencias en las ciudades más increíbles</p>
          <SearchBar />
        </div>
      </div>

      {/* Categorías */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Explora por categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, i) => {
            const Icon = category.icon;
            return (
              <button key={i} className="bg-white hover:bg-white border-2 border-gray-200 hover:border-blue-600 rounded-2xl p-6 transition-all hover:shadow-lg">
                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Icon size={32} />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 mb-1">{category.name}</div>
                  <div className="text-sm text-gray-500">{category.count} opciones</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continúa explorando - Solo si tiene historial */}
      <RecentlyViewedCarousel lang="es" />

      {/* Destinos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Ciudades populares</h2>
          <p className="text-gray-600">Explora las ciudades más fascinantes de Europa</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cities?.map((city, i) => (
            <Link key={i} href={`/es/${city.slug}`} className="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all aspect-[4/3]">
              {city.image && <Image src={city.image} alt={city.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center gap-2 text-white">
                  <MapPin size={20} />
                  <span className="text-xl font-bold drop-shadow-lg">{city.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CARRUSELES DINÁMICOS */}
      {popularActivities.length > 0 && (
        <ExperienceCarousel 
          title="Las actividades más populares" 
          subtitle="Las experiencias más reservadas por nuestros viajeros" 
          experiences={popularActivities} 
          carouselId="popular" 
          viewAllLink="/es/populares" 
          lang="es" 
        />
      )}

      {worldBest.length > 0 && (
        <ExperienceCarousel 
          title="Las mejores cosas que hacer alrededor del mundo" 
          subtitle="Descubre las maravillas de Europa" 
          experiences={worldBest} 
          carouselId="world" 
          viewAllLink="/es/mundo" 
          lang="es" 
        />
      )}

      {ridatoursRecommended.length > 0 && (
        <ExperienceCarousel 
          title="Principales recomendaciones de Ridatours" 
          subtitle="Las experiencias que no puedes perderte" 
          experiences={ridatoursRecommended} 
          carouselId="recommended" 
          viewAllLink="/es/recomendaciones" 
          lang="es" 
        />
      )}

      <Footer lang="es" />
    </div>
  );
}

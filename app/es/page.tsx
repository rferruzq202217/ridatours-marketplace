import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import ExperienceCarousel from '@/components/ExperienceCarousel';
import RecentlyViewedCarousel from '@/components/RecentlyViewedCarousel';
import CategoryCarousel from '@/components/CategoryCarousel';
import CityCarousel from '@/components/CityCarousel';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const cityCountries: Record<string, string> = {
  'roma': 'Italia',
  'paris': 'Francia',
  'barcelona': 'España',
  'madrid': 'España',
  'londres': 'Reino Unido',
  'amsterdam': 'Países Bajos',
  'berlin': 'Alemania',
  'viena': 'Austria',
  'praga': 'República Checa',
  'lisboa': 'Portugal',
  'florencia': 'Italia',
  'venecia': 'Italia',
  'atenas': 'Grecia',
  'dublin': 'Irlanda',
  'bruselas': 'Bélgica',
};

export default async function HomePage() {
  const { data: citiesFromDb } = await supabase
    .from('cities')
    .select('id, name, slug, image')
    .order('name');

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name, slug, icon_name')
    .order('name');

  const categoriesWithCount = await Promise.all(
    (categoriesData || []).map(async (cat) => {
      const { count } = await supabase
        .from('experience_categories')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id);
      
      return { ...cat, count: count || 0 };
    })
  );

  const citiesWithCount = await Promise.all(
    (citiesFromDb || []).map(async (city) => {
      const { count } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true })
        .eq('city_id', city.id)
        .eq('active', true);
      
      return {
        name: city.name,
        slug: city.slug,
        image: city.image || '',
        country: cityCountries[city.slug] || '',
        experienceCount: count || 0
      };
    })
  );

  const { data: allExperiences } = await supabase
    .from('experiences')
    .select(`
      id, title, slug, description, price, rating, reviews, duration, main_image, featured, city_id,
      cities!inner(slug, name),
      experience_categories(categories(name))
    `)
    .eq('active', true)
    .order('created_at', { ascending: false });

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

  const popularActivities = experiences.filter(e => e.featured || e.reviews > 5000).sort((a, b) => b.reviews - a.reviews).slice(0, 6);
  const worldBest = experiences.filter(e => e.rating >= 4.7).sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 6);
  const ridatoursRecommended = experiences.slice(0, 6);

  const categories = categoriesWithCount.map(cat => ({
    name: cat.name,
    slug: cat.slug,
    icon_name: cat.icon_name || 'Landmark',
    count: cat.count
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header lang="es" transparent={true} showSearch={true} />
      
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

      <CategoryCarousel categories={categories} />
      <RecentlyViewedCarousel lang="es" />

      <CityCarousel
        title="Ciudades populares"
        subtitle="Explora las ciudades más fascinantes de Europa"
        cities={citiesWithCount}
        viewAllLink="/es/ciudades"
        lang="es"
      />

      {popularActivities.length > 0 && (
        <ExperienceCarousel title="Las actividades más populares" subtitle="Las experiencias más reservadas por nuestros viajeros" experiences={popularActivities} carouselId="popular" viewAllLink="/es/populares" lang="es" />
      )}

      {worldBest.length > 0 && (
        <ExperienceCarousel title="Las mejores cosas que hacer alrededor del mundo" subtitle="Descubre las maravillas de Europa" experiences={worldBest} carouselId="world" viewAllLink="/es/mundo" lang="es" />
      )}

      {ridatoursRecommended.length > 0 && (
        <ExperienceCarousel title="Principales recomendaciones de Ridatours" subtitle="Las experiencias que no puedes perderte" experiences={ridatoursRecommended} carouselId="recommended" viewAllLink="/es/recomendaciones" lang="es" />
      )}

      <Footer lang="es" />
    </div>
  );
}

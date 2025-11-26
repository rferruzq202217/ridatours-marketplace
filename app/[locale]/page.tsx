import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import ExperienceCarousel from '@/components/ExperienceCarousel';
import RecentlyViewedCarousel from '@/components/RecentlyViewedCarousel';
import CategoryCarousel from '@/components/CategoryCarousel';
import CityCarousel from '@/components/CityCarousel';
import TrustBadges from '@/components/TrustBadges';
import LinkFarm from '@/components/LinkFarm';
import ContactBlock from '@/components/ContactBlock';
import { createClient } from '@supabase/supabase-js';
import { getMessages, Locale } from '@/lib/i18n';
import { translateExperiences } from '@/lib/translateHelpers';

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

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);

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

  const experiencesRaw = allExperiences?.map((exp: any) => ({
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

  // Traducir todas las experiencias
  const experiences = await translateExperiences(experiencesRaw, lang);

  const popularActivities = experiences.filter(e => e.featured || e.reviews > 5000).sort((a, b) => b.reviews - a.reviews).slice(0, 6);
  const worldBest = experiences.filter(e => e.rating >= 4.7).sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 6);
  const ridatoursRecommended = experiences.slice(0, 6);

  const categories = categoriesWithCount.map(cat => ({
    name: cat.name,
    slug: cat.slug,
    icon_name: cat.icon_name || 'Landmark',
    count: cat.count
  }));

  const linkFarmExperiences = experiences.map(e => ({
    title: e.title,
    slug: e.slug,
    city: e.city
  }));

  const linkFarmCities = citiesWithCount.map(c => ({
    name: c.name,
    slug: c.slug
  }));

  const linkFarmCategories = categories.map(c => ({
    name: c.name,
    slug: c.slug
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} transparent={true} showSearch={true} />
      
      <div className="relative h-[65vh] overflow-hidden">
        <iframe 
          className="absolute inset-0" 
          style={{ width: '100vw', height: '100vh', transform: 'scale(1.5)' }} 
          src="https://www.youtube.com/embed/eZjmjT5SLYs?autoplay=1&mute=1&controls=0&loop=1&playlist=eZjmjT5SLYs&playsinline=1" 
          frameBorder="0" 
          allowFullScreen 
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-4 drop-shadow-2xl">
            {t.home.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-white text-center mb-8 drop-shadow-lg">
            {t.home.heroSubtitle}
          </p>
          <SearchBar />
        </div>
      </div>

      <TrustBadges lang={lang} />
      <CategoryCarousel categories={categories} lang={lang} />
      <RecentlyViewedCarousel lang={lang} />

      <CityCarousel
        title={t.home.popularCities}
        subtitle={lang === 'es' ? 'Explora las ciudades más fascinantes de Europa' : 'Explore the most fascinating cities in Europe'}
        cities={citiesWithCount}
        viewAllLink={`/${lang}/ciudades`}
        lang={lang}
      />

      {popularActivities.length > 0 && (
        <ExperienceCarousel 
          title={lang === 'es' ? 'Las actividades más populares' : 'Most popular activities'}
          subtitle={lang === 'es' ? 'Las experiencias más reservadas por nuestros viajeros' : 'Most booked experiences by our travelers'}
          experiences={popularActivities} 
          carouselId="popular" 
          viewAllLink={`/${lang}/populares`} 
          lang={lang} 
        />
      )}

      {worldBest.length > 0 && (
        <ExperienceCarousel 
          title={t.home.worldExperiences}
          subtitle={lang === 'es' ? 'Descubre las maravillas de Europa' : 'Discover the wonders of Europe'}
          experiences={worldBest} 
          carouselId="world" 
          viewAllLink={`/${lang}/mundo`} 
          lang={lang} 
        />
      )}

      {ridatoursRecommended.length > 0 && (
        <ExperienceCarousel 
          title={lang === 'es' ? 'Principales recomendaciones de Ridatours' : 'Top Ridatours recommendations'}
          subtitle={lang === 'es' ? 'Las experiencias que no puedes perderte' : "Experiences you can't miss"}
          experiences={ridatoursRecommended} 
          carouselId="recommended" 
          viewAllLink={`/${lang}/recomendaciones`} 
          lang={lang} 
        />
      )}

      <LinkFarm 
        experiences={linkFarmExperiences}
        cities={linkFarmCities}
        categories={linkFarmCategories}
        lang={lang}
      />

      <ContactBlock lang={lang} />

      <Footer lang={lang} />
    </div>
  );
}

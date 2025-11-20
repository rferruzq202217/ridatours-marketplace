'use client';

import { useEffect, useState } from 'react';
import { useRecentlyViewed } from '@/lib/useRecentlyViewed';
import ExperienceCarousel from './ExperienceCarousel';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RecentlyViewedCarousel({ lang }: { lang: string }) {
  const { viewed } = useRecentlyViewed();
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRelatedProducts() {
      if (viewed.length === 0) return;

      // Obtener ciudades visitadas
      const viewedCities = [...new Set(viewed.map(v => v.city))];
      const viewedIds = viewed.map(v => v.id);

      // Buscar más experiencias de las mismas ciudades
      const { data: cityExperiences } = await supabase
        .from('experiences')
        .select(`
          id,
          slug,
          title,
          main_image,
          price,
          rating,
          reviews,
          duration,
          cities!inner(slug, name)
        `)
        .in('cities.slug', viewedCities)
        .not('id', 'in', `(${viewedIds.join(',')})`)
        .eq('active', true)
        .order('rating', { ascending: false })
        .limit(6);

      if (cityExperiences) {
        const formatted = cityExperiences.map((exp: any) => ({
          city: exp.cities.slug,
          slug: exp.slug,
          title: exp.title,
          cityName: exp.cities.name,
          image: exp.main_image || '',
          price: exp.price,
          rating: exp.rating,
          reviews: exp.reviews,
          duration: exp.duration || '',
        }));
        
        setRelatedProducts(formatted);
      }
    }

    fetchRelatedProducts();
  }, [viewed]);

  // No mostrar si no hay productos visitados o relacionados
  if (viewed.length === 0 || relatedProducts.length === 0) {
    return null;
  }

  const viewedCities = [...new Set(viewed.map(v => v.city))];

  return (
    <ExperienceCarousel 
      title="Continúa explorando tus destinos favoritos" 
      subtitle="Más experiencias en los lugares que has visitado" 
      experiences={relatedProducts} 
      carouselId="recently-viewed" 
      viewAllLink={`/${lang}/${viewedCities[0]}`} 
      lang={lang} 
    />
  );
}

'use client';
import { useEffect } from 'react';

interface SaveRecentlyViewedProps {
  experience: {
    id: string;
    slug: string;
    title: string;
    main_image: string | null;
    price: number;
    rating: number;
    reviews: number;
    duration?: string | null;
  };
  citySlug: string;
}

export default function SaveRecentlyViewed({ experience, citySlug }: SaveRecentlyViewedProps) {
  // Esto se ejecuta SIEMPRE que el componente se monta
  console.log('🔴 COMPONENTE MONTADO - SaveRecentlyViewed');
  console.log('Experience:', experience.title);
  
  useEffect(() => {
    console.log('🍪 useEffect EJECUTÁNDOSE');
    
    try {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const cookieValue = getCookie('recentlyViewed');
      let recentlyViewed = cookieValue ? JSON.parse(decodeURIComponent(cookieValue)) : [];

      const expData = {
        id: experience.id,
        city: citySlug,
        slug: experience.slug,
        title: experience.title,
        image: experience.main_image || '',
        price: experience.price,
        rating: experience.rating,
        reviews: experience.reviews,
        duration: experience.duration || ''
      };

      recentlyViewed = recentlyViewed.filter((item: any) => item.id !== experience.id);
      recentlyViewed.unshift(expData);

      if (recentlyViewed.length > 6) {
        recentlyViewed = recentlyViewed.slice(0, 6);
      }

      document.cookie = `recentlyViewed=${encodeURIComponent(JSON.stringify(recentlyViewed))}; path=/; max-age=${30 * 24 * 60 * 60}`;
      
      console.log('✅ Cookie guardada:', recentlyViewed);
      
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }, [experience.id, citySlug]);

  return null;
}

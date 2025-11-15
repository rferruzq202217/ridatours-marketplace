'use client';

import { useRecentlyViewed } from '@/lib/useRecentlyViewed';
import ExperienceCarousel from './ExperienceCarousel';

// Datos de productos (mismos que en la home, podrían venir de API)
const allProducts = [
  { city: 'roma', slug: 'coliseo', title: 'Coliseo Romano con acceso prioritario', cityName: 'Roma', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', price: 45, rating: 4.8, reviews: 12543, duration: '3h' },
  { city: 'roma', slug: 'vaticano', title: 'Museos Vaticanos y Capilla Sixtina', cityName: 'Roma', image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800', price: 35, rating: 4.9, reviews: 8920, duration: '2h' },
  { city: 'roma', slug: 'foro-romano', title: 'Foro Romano y Monte Palatino guiado', cityName: 'Roma', image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=800', price: 28, rating: 4.7, reviews: 6543, duration: '1.5h' },
  { city: 'barcelona', slug: 'sagrada-familia', title: 'Sagrada Familia con audioguía', cityName: 'Barcelona', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', price: 28, rating: 4.8, reviews: 11543, duration: '1.5h' },
  { city: 'paris', slug: 'torre-eiffel', title: 'Torre Eiffel con acceso prioritario', cityName: 'París', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', price: 35, rating: 4.9, reviews: 15234, duration: '2h' },
  { city: 'madrid', slug: 'museo-prado', title: 'Museo del Prado entrada prioritaria', cityName: 'Madrid', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800', price: 22, rating: 4.7, reviews: 8765, duration: '2h' },
];

export default function RecentlyViewedCarousel({ lang }: { lang: string }) {
  const { viewed } = useRecentlyViewed();

  // No mostrar si no hay productos visitados
  if (viewed.length === 0) {
    return null;
  }

  // Obtener ciudades visitadas
  const viewedCities = [...new Set(viewed.map(v => v.city))];
  
  // Productos relacionados: de las mismas ciudades pero que no han visto
  const relatedProducts = allProducts.filter(
    p => viewedCities.includes(p.city) && !viewed.find(v => v.slug === p.slug)
  ).slice(0, 6);

  // Si no hay productos relacionados, no mostrar
  if (relatedProducts.length === 0) {
    return null;
  }

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

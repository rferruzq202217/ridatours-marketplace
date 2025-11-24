'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Experience {
  city: string;
  slug: string;
  title: string;
  cityName: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
}

interface RecentlyViewedCarouselProps {
  lang: string;
}

export default function RecentlyViewedCarousel({ lang }: RecentlyViewedCarouselProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const loadRecentlyViewed = async () => {
      const cookies = document.cookie.split(';');
      const recentCookie = cookies.find(c => c.trim().startsWith('recentlyViewed='));
      
      if (!recentCookie) return;

      try {
        const recentData = JSON.parse(decodeURIComponent(recentCookie.split('=')[1]));
        const slugs = recentData.map((item: any) => item.slug);
        
        if (slugs.length === 0) return;

        const { data } = await supabase
          .from('experiences')
          .select(`
            id, title, slug, price, rating, reviews, main_image,
            cities!inner(slug, name)
          `)
          .in('slug', slugs)
          .eq('active', true);

        if (data) {
          const mapped = data.map((exp: any) => ({
            city: exp.cities?.slug || '',
            slug: exp.slug,
            title: exp.title,
            cityName: exp.cities?.name || '',
            image: exp.main_image || '',
            price: exp.price,
            rating: exp.rating,
            reviews: exp.reviews
          }));
          
          const ordered = slugs
            .map((slug: string) => mapped.find(e => e.slug === slug))
            .filter(Boolean) as Experience[];
          
          setExperiences(ordered);
        }
      } catch (e) {
        console.error('Error loading recent:', e);
      }
    };

    loadRecentlyViewed();
  }, []);

  if (experiences.length === 0) return null;

  const maxIndex = Math.max(0, experiences.length - itemsPerPage);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Continúa explorando tus destinos favoritos</h2>
            <p className="text-gray-600">Retoma donde lo dejaste</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/recientes`} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Ver todas →
            </Link>
            <div className="flex gap-2">
              <button 
                onClick={() => setStartIndex(prev => Math.max(0, prev - itemsPerPage))}
                disabled={startIndex === 0}
                className="p-2 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => setStartIndex(prev => Math.min(maxIndex, prev + itemsPerPage))}
                disabled={startIndex >= maxIndex}
                className="p-2 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.slice(startIndex, startIndex + itemsPerPage).map((exp) => (
            <Link 
              key={exp.slug} 
              href={`/${lang}/${exp.city}/${exp.slug}`}
              className="group bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56">
                <Image src={exp.image} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 25vw" />
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-gray-600 tracking-wider mb-2">{exp.cityName.toUpperCase()}</div>
                <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight line-clamp-2 min-h-[3rem]">{exp.title}</h3>
                <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Star size={18} className="text-yellow-400 fill-current" />
                    <span className="font-bold text-base text-gray-900">{exp.rating}</span>
                    <span className="text-xs text-gray-500">({exp.reviews.toLocaleString('es-ES')})</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600 mb-1">Desde</div>
                    <div className="text-xl font-bold text-gray-900">€{exp.price}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

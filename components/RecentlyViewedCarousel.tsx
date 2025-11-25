'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface Experience {
  id: string;
  city: string;
  slug: string;
  title: string;
  image: string | null;
  price: number;
  rating: number;
  reviews: number;
  duration?: string | null;
}

export default function RecentlyViewedCarousel() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const cookieValue = getCookie('recentlyViewed');
    if (cookieValue) {
      try {
        const data = JSON.parse(decodeURIComponent(cookieValue));
        setExperiences(data);
      } catch (error) {
        console.error('Error leyendo cookie:', error);
      }
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('recently-viewed-container');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (experiences.length === 0) return null;

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Visto recientemente
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          id="recently-viewed-container"
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {experiences.map((exp) => (
            <Link
              key={exp.id}
              href={`/es/${exp.city}/${exp.slug}`}
              className="flex-shrink-0 w-72 bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              {exp.image && exp.image.trim() !== '' ? (
                <div className="relative h-48">
                  <Image 
                    src={exp.image} 
                    alt={exp.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                    sizes="(max-width: 768px) 100vw, 25vw" 
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Sin imagen</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {exp.title}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-bold">{exp.rating}</span>
                    <span className="text-xs text-gray-600">({exp.reviews})</span>
                  </div>
                  {exp.duration && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock size={14} />
                      <span className="text-xs">{exp.duration}</span>
                    </div>
                  )}
                </div>
                <div className="text-xl font-bold text-blue-600">
                  €{exp.price}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

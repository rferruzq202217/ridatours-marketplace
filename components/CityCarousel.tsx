'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface City {
  id?: string;
  name: string;
  slug: string;
  country: string;
  image: string | null;
  description?: string;
  experienceCount?: number;
}

interface CityCarouselProps {
  title: string;
  subtitle?: string;
  cities: City[];
  viewAllLink?: string;
  lang?: string;
}

export default function CityCarousel({ title, subtitle, cities, viewAllLink }: CityCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`city-carousel-${title}`);
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (!cities || cities.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {viewAllLink && (
            <Link 
              href={viewAllLink}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 group"
            >
              Ver todo
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all -ml-4"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            id={`city-carousel-${title}`}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cities.map((city, index) => (
              <Link
                key={city.id || city.slug || index}
                href={`/es/${city.slug}`}
                className="flex-shrink-0 w-72 bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-48">
                  {city.image && city.image.trim() !== '' ? (
                    <Image
                      src={city.image}
                      alt={city.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-1 group-hover:text-blue-200 transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-white/90 text-sm">{city.country}</p>
                    {city.experienceCount && (
                      <p className="text-white/80 text-xs mt-1">
                        {city.experienceCount} experiencias
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all -mr-4"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}

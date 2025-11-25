'use client';
import { useState, useRef, useEffect } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const container = containerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [cities]);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = 316;
      const newPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
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
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-900 rounded-full p-2 shadow-lg hover:shadow-xl border border-gray-200 transition-all -ml-4"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div
            ref={containerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 -my-2 px-1 -mx-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cities.map((city, index) => (
              <Link
                key={city.id || city.slug || index}
                href={`/es/${city.slug}`}
                className="flex-shrink-0 w-[300px] group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
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
                    <h3 className="text-white text-xl font-bold mb-1">
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

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-900 rounded-full p-2 shadow-lg hover:shadow-xl border border-gray-200 transition-all -mr-4"
              aria-label="Siguiente"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

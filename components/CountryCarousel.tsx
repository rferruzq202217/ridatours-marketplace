'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { getMessages, Locale } from '@/lib/i18n';

interface Country {
  id?: string;
  name: string;
  slug: string;
  image: string | null;
  cityCount?: number;
  experienceCount?: number;
}

interface CountryCarouselProps {
  title: string;
  subtitle?: string;
  countries: Country[];
  viewAllLink?: string;
  lang?: string;
}

export default function CountryCarousel({ title, subtitle, countries, viewAllLink, lang = 'es' }: CountryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const t = getMessages(lang as Locale);

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
  }, [countries]);

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

  if (countries.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {viewAllLink && (
            <Link 
              href={viewAllLink}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              {t.common.seeAll}
              <span>→</span>
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
            {countries.map((country) => (
              <Link
                key={country.slug}
                href={`/${lang}/paises/${country.slug}`}
                className="flex-shrink-0 w-[300px] group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative h-48">
                  {country.image && country.image.trim() !== '' ? (
                    <Image
                      src={country.image}
                      alt={country.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <Globe size={48} className="text-white/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-1">
                      {country.name}
                    </h3>
                    <div className="flex gap-3 text-white/80 text-sm">
                      {country.cityCount !== undefined && country.cityCount > 0 && (
                        <span>{country.cityCount} {lang === 'es' ? 'ciudades' : 'cities'}</span>
                      )}
                      {country.experienceCount !== undefined && country.experienceCount > 0 && (
                        <span>{country.experienceCount} {t.common.experiences}</span>
                      )}
                    </div>
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

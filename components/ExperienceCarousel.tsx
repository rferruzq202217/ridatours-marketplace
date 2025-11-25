'use client';
import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';
import Image from 'next/image';
import { Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface Experience {
  id?: string;
  city?: string;
  city_slug?: string;
  cityName?: string;
  slug: string;
  title: string;
  image: string | null;
  price: number;
  rating: number;
  reviews: number;
  duration?: string;
  featured?: boolean;
}

interface ExperienceCarouselProps {
  title: string;
  subtitle?: string;
  experiences: Experience[];
  carouselId?: string;
  viewAllLink?: string;
  lang?: string;
}

export default function ExperienceCarousel({ 
  title, 
  subtitle, 
  experiences, 
  carouselId = 'default',
  viewAllLink 
}: ExperienceCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`exp-carousel-${carouselId}`);
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (!experiences || experiences.length === 0) return null;

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
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 text-white rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-gray-900 transition-all -ml-4"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            id={`exp-carousel-${carouselId}`}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {experiences.map((exp, index) => {
              const citySlug = exp.city_slug || exp.city || '';
              const href = `/${citySlug}/${exp.slug}`;

              return (
                <Link
                  key={exp.id || index}
                  href={href}
                  className="flex-shrink-0 w-[300px] group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative h-48">
                    {exp.image && exp.image.trim() !== '' ? (
                      <Image
                        src={exp.image}
                        alt={exp.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                    {exp.featured && (
                      <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ DESTACADO
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      {(exp.cityName || exp.city || '').toUpperCase()}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                      {exp.title}
                    </h3>
                    {exp.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Clock size={14} />
                        <span>{exp.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="font-semibold">{exp.rating}</span>
                        <span className="text-xs text-gray-500">({exp.reviews.toLocaleString('es-ES')})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">Desde</span>
                        <p className="font-bold text-lg">{formatPrice(exp.price)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 text-white rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-gray-900 transition-all -mr-4"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}

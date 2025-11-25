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
                  className="flex-shrink-0 w-72 bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all group"
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
                      <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ Destacado
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {exp.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="font-semibold">{exp.rating}</span>
                        <span className="text-gray-500">({exp.reviews})</span>
                      </div>
                      {exp.duration && (
                        <>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock size={16} />
                            <span>{exp.duration}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Desde</div>
                        <div className="text-xl font-bold text-gray-900">
                          {formatPrice(exp.price)}
                        </div>
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

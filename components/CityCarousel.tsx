'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface City {
  name: string;
  slug: string;
  image: string;
  country?: string;
  experienceCount?: number;
}

interface CityCarouselProps {
  title: string;
  subtitle: string;
  cities: City[];
  viewAllLink: string;
  lang: string;
}

export default function CityCarousel({ title, subtitle, cities, viewAllLink, lang }: CityCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, cities.length - itemsPerPage);

  const handlePrev = () => {
    setStartIndex(prev => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(maxIndex, prev + itemsPerPage));
  };

  const visibleCities = cities.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href={viewAllLink} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Ver todas →
            </Link>
            <div className="flex gap-2">
              <button 
                onClick={handlePrev}
                disabled={startIndex === 0}
                className="p-2 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                disabled={startIndex >= maxIndex}
                className="p-2 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCities.map((city) => (
            <Link 
              key={city.slug} 
              href={`/${lang}/${city.slug}`} 
              className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 aspect-[4/3]"
            >
              {city.image && (
                <Image 
                  src={city.image} 
                  alt={city.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 text-white mb-1">
                  <MapPin size={18} className="text-white" />
                  <span className="text-xl font-bold drop-shadow-lg">{city.name}</span>
                </div>
                {city.country && (
                  <p className="text-sm text-gray-200 ml-6">{city.country}</p>
                )}
                {city.experienceCount !== undefined && city.experienceCount > 0 && (
                  <p className="text-xs text-white/80 mt-2 ml-6 font-medium">
                    {city.experienceCount} experiencias
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

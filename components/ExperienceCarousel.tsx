'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface Experience {
  city: string;
  slug: string;
  title: string;
  cityName: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  featured?: boolean;
}

interface ExperienceCarouselProps {
  title: string;
  subtitle: string;
  experiences: Experience[];
  carouselId: string;
  viewAllLink: string;
  lang: string;
}

export default function ExperienceCarousel({ title, subtitle, experiences, viewAllLink, lang }: ExperienceCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, experiences.length - itemsPerPage);

  const handlePrev = () => {
    setStartIndex(prev => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(maxIndex, prev + itemsPerPage));
  };

  const visibleExperiences = experiences.slice(startIndex, startIndex + itemsPerPage);

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
          {visibleExperiences.map((exp) => (
            <Link 
              key={exp.slug} 
              href={`/${lang}/${exp.city}/${exp.slug}`} 
              className="group bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56">
                <Image 
                  src={exp.image} 
                  alt={exp.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {exp.featured && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    HASTA -30 %
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-gray-600 tracking-wider mb-2">
                  {exp.cityName.toUpperCase()}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight line-clamp-2 min-h-[3rem]">
                  {exp.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Explora esta increíble experiencia
                </p>
                
                <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Star size={18} className="text-yellow-400 fill-current" />
                    <span className="font-bold text-base text-gray-900">{exp.rating}</span>
                    <span className="text-xs text-gray-500">({exp.reviews.toLocaleString('es-ES')})</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600 mb-1">Desde</div>
                    <div className="text-xl font-bold text-gray-900">
                      €{exp.price}
                    </div>
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

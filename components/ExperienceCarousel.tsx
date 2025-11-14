'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';

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
}

interface ExperienceCarouselProps {
  title: string;
  subtitle: string;
  experiences: Experience[];
  carouselId: string;
  viewAllLink: string;
  lang: string;
}

export default function ExperienceCarousel({ title, subtitle, experiences, carouselId, viewAllLink, lang }: ExperienceCarouselProps) {
  const scrollCarousel = (direction: 'left' | 'right') => {
    const container = document.getElementById(`carousel-${carouselId}`);
    if (container) {
      const scrollAmount = 1032;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href={viewAllLink} className="text-blue-600 hover:text-blue-700 font-semibold">Ver todas →</Link>
            <div className="flex gap-2">
              <button onClick={() => scrollCarousel('left')} className="p-2 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50">
                <ChevronLeft size={24} />
              </button>
              <button onClick={() => scrollCarousel('right')} className="p-2 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <div id={`carousel-${carouselId}`} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth">
            {experiences.map((exp) => (
              <Link key={exp.slug} href={`/${lang}/${exp.city}/${exp.slug}`} className="flex-none w-80 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all group">
                <div className="relative h-48">
                  <Image src={exp.image} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                    <MapPin size={14} />
                    <span>{exp.cityName}</span>
                  </div>
                  <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">{exp.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="font-semibold text-sm">{exp.rating}</span>
                    <span className="text-xs text-gray-500">({exp.reviews.toLocaleString()})</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500">Desde</span>
                      <div className="text-xl font-bold">€{exp.price}</div>
                    </div>
                    <span className="text-xs text-gray-500">{exp.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

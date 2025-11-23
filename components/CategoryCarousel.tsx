'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface Category {
  name: string;
  slug: string;
  icon: LucideIcon;
  count: number;
}

interface CategoryCarouselProps {
  categories: Category[];
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 6;
  const maxIndex = Math.max(0, categories.length - itemsPerPage);

  const handlePrev = () => {
    setStartIndex(prev => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(maxIndex, prev + itemsPerPage));
  };

  const visibleCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Explora por categoría</h2>
        {categories.length > itemsPerPage && (
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
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {visibleCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link 
              key={category.slug} 
              href={`/es/categoria/${category.slug}`}
              className="bg-white hover:bg-white border-2 border-gray-200 hover:border-blue-600 rounded-2xl p-6 transition-all hover:shadow-lg group"
            >
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Icon size={32} />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">{category.name}</div>
                <div className="text-sm text-gray-500">{category.count} {category.count === 1 ? 'opción' : 'opciones'}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

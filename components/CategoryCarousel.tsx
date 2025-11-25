'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AVAILABLE_ICONS } from '@/lib/icons';

interface Category {
  name: string;
  slug: string;
  icon_name: string;
  count: number;
}

interface CategoryCarouselProps {
  categories: Category[];
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('category-carousel');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Explora por categoría</h2>
            <p className="text-gray-600 mt-1">Encuentra experiencias por tipo de actividad</p>
          </div>
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
            id="category-carousel"
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => {
              const iconData = AVAILABLE_ICONS.find(i => i.name === category.icon_name);
              const Icon = iconData?.icon || AVAILABLE_ICONS[0].icon;
              
              return (
                <div
                  key={category.slug}
                  className="flex-shrink-0 w-72 bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow p-6 cursor-default"
                >
                  <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={32} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {category.count} {category.count === 1 ? 'opción' : 'opciones'}
                    </p>
                  </div>
                </div>
              );
            })}
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

'use client';
import { useRef, useState, useEffect } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Explora por categoría</h2>
          <p className="text-gray-600 mt-1">Encuentra experiencias por tipo de actividad</p>
        </div>

        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-900 rounded-full p-2 shadow-lg hover:shadow-xl border border-gray-200 transition-all -ml-4"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div
            ref={containerRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => {
              const iconData = AVAILABLE_ICONS.find(i => i.name === category.icon_name);
              const Icon = iconData?.icon || AVAILABLE_ICONS[0].icon;
              const isSelected = selectedCategory === category.slug;
              
              return (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(isSelected ? null : category.slug)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 whitespace-nowrap transition-all ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-900 rounded-full p-2 shadow-lg hover:shadow-xl border border-gray-200 transition-all -mr-4"
              aria-label="Siguiente"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

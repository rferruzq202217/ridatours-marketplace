'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Filter } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Experience {
  id: string;
  title: string;
  slug: string;
  main_image: string;
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  featured: boolean;
  experience_categories?: { category_id: string; categories: Category }[];
}

interface Props {
  experiences: Experience[];
  categories: Category[];
  citySlug: string;
  cityName: string;
  lang: string;
  texts: {
    allExperiences: string;
    noImage: string;
    featured: string;
    from: string;
    all: string;
  };
}

export default function CityExperienceGrid({ experiences, categories, citySlug, cityName, lang, texts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredExperiences = selectedCategory
    ? experiences.filter(exp => 
        exp.experience_categories?.some(ec => ec.categories?.id === selectedCategory)
      )
    : experiences;

  return (
    <div>
      {/* Filtros */}
      {categories.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrar por categoría:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {texts.all}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid de experiencias */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {texts.allExperiences} {cityName}
        {selectedCategory && ` (${filteredExperiences.length})`}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredExperiences.map((exp) => (
          <Link
            key={exp.id}
            href={`/${lang}/${citySlug}/${exp.slug}`}
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="relative h-48">
              {exp.main_image ? (
                <Image src={exp.main_image} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">{texts.noImage}</span>
                </div>
              )}
              {exp.featured && (
                <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ {texts.featured}
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                {cityName.toUpperCase()}
              </p>
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">{exp.title}</h3>
              {exp.duration && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Clock size={14} />
                  <span>{exp.duration}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-700">{exp.rating}</span>
                  <span className="text-xs text-gray-400">({exp.reviews?.toLocaleString('es-ES') || 0})</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">{texts.from}</span>
                  <span className="text-lg font-bold text-amber-600 ml-1">€{exp.price}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

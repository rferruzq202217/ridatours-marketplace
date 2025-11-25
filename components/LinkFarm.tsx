'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Experience {
  title: string;
  slug: string;
  city: string;
}

interface City {
  name: string;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
}

interface LinkFarmProps {
  experiences: Experience[];
  cities: City[];
  categories: Category[];
}

export default function LinkFarm({ experiences, cities, categories }: LinkFarmProps) {
  const [activeTab, setActiveTab] = useState<'activities' | 'destinations' | 'categories'>('activities');

  const tabs = [
    { id: 'activities', label: 'Las mejores actividades' },
    { id: 'destinations', label: 'Destinos favoritos' },
    { id: 'categories', label: 'Las mejores categorías' },
  ] as const;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Descubre los lugares más populares de Ridatours
        </h2>

        <div className="relative mb-4">
          <div className="flex gap-0 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-base transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          {activeTab === 'activities' && (
            <div className="flex flex-wrap gap-2">
              {experiences.slice(0, 30).map((exp, index) => (
                <Link
                  key={index}
                  href={`/es/${exp.city}/${exp.slug}`}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors"
                >
                  {exp.title}
                </Link>
              ))}
            </div>
          )}

          {activeTab === 'destinations' && (
            <>
              <h3 className="text-base font-medium text-gray-900 mb-3">Las mejores ciudades para visitar</h3>
              <div className="flex flex-wrap gap-2">
                {cities.map((city, index) => (
                  <Link
                    key={index}
                    href={`/es/${city.slug}`}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </>
          )}

          {activeTab === 'categories' && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, index) => (
                <Link
                  key={index}
                  href={`/es/categoria/${cat.slug}`}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

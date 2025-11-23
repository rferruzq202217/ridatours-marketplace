'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SearchBarProps {
  inHeader?: boolean;
}

interface SearchResult {
  type: 'city' | 'monument' | 'experience';
  name: string;
  slug: string;
  citySlug?: string;
  cityName?: string;
  category?: string;
}

export default function SearchBar({ inHeader = false }: SearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchAll = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      const searchLower = searchTerm.toLowerCase();

      try {
        // Buscar ciudades
        const { data: cities } = await supabase
          .from('cities')
          .select('name, slug')
          .ilike('name', `%${searchTerm}%`)
          .limit(3);

        // Buscar monumentos
        const { data: monuments } = await supabase
          .from('monuments')
          .select('name, slug, cities!inner(slug, name)')
          .ilike('name', `%${searchTerm}%`)
          .limit(5);

        // Buscar experiencias
        const { data: experiences } = await supabase
          .from('experiences')
          .select('title, slug, cities!inner(slug, name)')
          .ilike('title', `%${searchTerm}%`)
          .eq('active', true)
          .limit(5);

        const allResults: SearchResult[] = [
          ...(cities || []).map(c => ({
            type: 'city' as const,
            name: c.name,
            slug: c.slug
          })),
          ...(monuments || []).map((m: any) => ({
            type: 'monument' as const,
            name: m.name,
            slug: m.slug,
            citySlug: m.cities.slug,
            cityName: m.cities.name,
            category: 'Monumento'
          })),
          ...(experiences || []).map((e: any) => ({
            type: 'experience' as const,
            name: e.title,
            slug: e.slug,
            citySlug: e.cities.slug,
            cityName: e.cities.name,
            category: 'Experiencia'
          }))
        ];

        setResults(allResults);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchAll, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSelect = (result: SearchResult) => {
    setSearchTerm('');
    setIsOpen(false);
    setResults([]);

    if (result.type === 'city') {
      router.push(`/es/${result.slug}`);
    } else if (result.type === 'monument') {
      router.push(`/es/${result.citySlug}/monumentos/${result.slug}`);
    } else if (result.type === 'experience') {
      router.push(`/es/${result.citySlug}/${result.slug}`);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${inHeader ? 'w-full max-w-2xl' : 'w-full max-w-4xl'}`}>
      <form onSubmit={(e) => { e.preventDefault(); if (results.length > 0) handleSelect(results[0]); }}>
        <div className={`bg-white rounded-2xl ${inHeader ? 'border border-gray-200' : 'shadow-2xl border-2 border-white'}`}>
          <div className="relative flex items-center gap-3 px-6 py-4">
            <MapPin className="text-blue-600 flex-shrink-0" size={24} />
            <input
              type="text"
              placeholder="Buscar destinos y experiencias"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="flex-1 text-base font-medium text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent"
            />
            {searchTerm && (
              <button 
                type="button" 
                onClick={() => { 
                  setSearchTerm(''); 
                  setResults([]);
                  setIsOpen(false); 
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors flex-shrink-0"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </form>

      {/* Dropdown de resultados */}
      {isOpen && searchTerm.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="px-6 py-4 text-gray-500 text-center">
              Buscando...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.slug}-${index}`}
                  onClick={() => handleSelect(result)}
                  className="w-full px-6 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 text-left"
                >
                  <MapPin size={18} className="text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {result.name}
                    </div>
                    {result.cityName && (
                      <div className="text-sm text-gray-500">
                        {result.category} en {result.cityName}
                      </div>
                    )}
                  </div>
                  {result.type === 'city' && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Ciudad
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 mb-2">No se encontraron resultados</p>
              <p className="text-sm text-gray-400">
                Intenta con otro destino o experiencia
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

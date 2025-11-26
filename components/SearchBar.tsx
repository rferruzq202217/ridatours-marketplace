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

      try {
        // Usar la función RPC que normaliza acentos
        const { data, error } = await supabase.rpc('search_all', {
          search_term: searchTerm
        });

        if (error) {
          console.error('Search error:', error);
          setResults([]);
          return;
        }

        const allResults: SearchResult[] = (data || []).map((item: any) => ({
          type: item.type as 'city' | 'monument' | 'experience',
          name: item.name,
          slug: item.slug,
          citySlug: item.city_slug,
          cityName: item.city_name,
          category: item.type === 'monument' ? 'Monumento' : item.type === 'experience' ? 'Experiencia' : undefined
        }));

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
    <div ref={wrapperRef} className={`relative ${inHeader ? 'w-full max-w-xl' : 'w-full max-w-2xl'}`}>
      <form onSubmit={(e) => { e.preventDefault(); if (results.length > 0) handleSelect(results[0]); }}>
        <div className={`bg-white rounded-full border transition-shadow ${
          inHeader 
            ? 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md' 
            : 'border-gray-200 shadow-2xl hover:shadow-xl'
        }`}>
          <div className="relative flex items-center gap-2 pl-5 pr-5 py-2">
            <Search className="text-gray-400 flex-shrink-0" size={20} />
            <input
              type="text"
              placeholder="Buscar ciudades, monumentos, experiencias..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent py-1"
            />
            {searchTerm && (
              <button 
                type="button" 
                onClick={() => { 
                  setSearchTerm(''); 
                  setResults([]);
                  setIsOpen(false); 
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Dropdown de resultados */}
      {isOpen && searchTerm.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="px-5 py-4 text-gray-500 text-center text-sm">
              Buscando...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.slug}-${index}`}
                  onClick={() => handleSelect(result)}
                  className="w-full px-5 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    result.type === 'city' ? 'bg-blue-100' : 
                    result.type === 'monument' ? 'bg-amber-100' : 'bg-purple-100'
                  }`}>
                    <MapPin size={16} className={
                      result.type === 'city' ? 'text-blue-600' : 
                      result.type === 'monument' ? 'text-amber-600' : 'text-purple-600'
                    } />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {result.name}
                    </div>
                    {result.cityName && (
                      <div className="text-xs text-gray-500">
                        {result.category} • {result.cityName}
                      </div>
                    )}
                    {result.type === 'city' && (
                      <div className="text-xs text-gray-500">Ciudad</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-5 py-6 text-center">
              <p className="text-gray-500 text-sm">No se encontraron resultados</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

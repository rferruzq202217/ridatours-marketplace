'use client';
import { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  inHeader?: boolean;
}

export default function SearchBar({ inHeader = false }: SearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchData = [
    { type: 'city', name: 'Roma', slug: 'roma' },
    { type: 'city', name: 'París', slug: 'paris' },
    { type: 'tour', name: 'Coliseo Romano', slug: 'coliseo', city: 'roma', cityName: 'Roma' },
  ];

  const suggestions = searchTerm.length > 0
    ? searchData.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleSelectSuggestion = (item: any) => {
    setSearchTerm('');
    setShowSuggestions(false);
    if (item.type === 'city') {
      router.push(`/es/${item.slug}`);
    } else {
      router.push(`/es/${item.city}/${item.slug}`);
    }
  };

  return (
    <div className={`${inHeader ? 'w-full max-w-2xl' : 'w-full max-w-4xl'}`}>
      <form onSubmit={(e) => { e.preventDefault(); if (suggestions.length > 0) handleSelectSuggestion(suggestions[0]); }}>
        <div className={`bg-white rounded-2xl p-2 ${inHeader ? 'border border-gray-200' : 'shadow-2xl'}`}>
          <div className="relative flex items-center gap-3 px-4 py-3">
            <MapPin className="text-blue-600" size={24} />
            <input
              type="text"
              placeholder="Buscar por destinos y experiencias"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
              className="flex-1 text-base font-medium text-gray-900 placeholder-gray-600 focus:outline-none"
            />
            {searchTerm && <button type="button" onClick={() => { setSearchTerm(''); setShowSuggestions(false); }}><X size={20} /></button>}
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"><Search size={20} /></button>
          </div>
        </div>
      </form>
    </div>
  );
}

'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Globe, ChevronDown } from 'lucide-react';
import { Language } from '@/lib/types';
import SearchBar from './SearchBar';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  lang: Language;
  transparent?: boolean;
  showSearch?: boolean;
}

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export default function Header({ lang, transparent = false, showSearch = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLang: string) => {
    // Reemplazar el idioma actual en la URL
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    setLangMenuOpen(false);
    router.push(newPath);
  };

  const shouldShowSearch = isHome ? scrolled : true;
  const showBackground = !isHome || scrolled;
  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {showBackground && <div className="absolute inset-0 bg-white shadow-md" />}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${shouldShowSearch ? 'h-24' : 'h-20'}`}>
          <Link href={`/${lang || 'es'}`}>
            <span className={`text-2xl font-bold ${showBackground ? 'text-blue-600' : 'text-white'}`}>RIDATOURS</span>
          </Link>
          {shouldShowSearch && <div className="flex-1 mx-8 hidden lg:block"><SearchBar inHeader /></div>}
          
          {/* Selector de idioma */}
          <div className="relative" ref={langMenuRef}>
            <button 
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                showBackground 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Globe size={20} />
              <span className="font-medium">{currentLang.code.toUpperCase()}</span>
              <ChevronDown size={16} className={`transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[180px] z-50">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      language.code === lang ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{language.flag}</span>
                    <span className="font-medium">{language.name}</span>
                    {language.code === lang && (
                      <span className="ml-auto text-blue-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { Language } from '@/lib/types';
import SearchBar from './SearchBar';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  lang: Language;
  transparent?: boolean;
  showSearch?: boolean;
}

export default function Header({ lang, transparent = false, showSearch = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldShowSearch = isHome ? scrolled : true;
  const showBackground = !isHome || scrolled;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {showBackground && <div className="absolute inset-0 bg-white shadow-md" />}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${shouldShowSearch ? 'h-24' : 'h-20'}`}>
          <Link href={`/${lang || 'es'}`}>
            <span className={`text-2xl font-bold ${showBackground ? 'text-blue-600' : 'text-white'}`}>RIDATOURS</span>
          </Link>
          {shouldShowSearch && <div className="flex-1 mx-8 hidden lg:block"><SearchBar inHeader /></div>}
          <button className={`flex items-center gap-2 ${showBackground ? 'text-gray-700' : 'text-white'}`}>
            <Globe size={20} />
            <span>{(lang || 'es').toUpperCase()}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

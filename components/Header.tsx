'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Globe, ChevronDown, Search, Menu, X, BookOpen, Newspaper } from 'lucide-react';
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

const navTexts: Record<string, { guides: string; blog: string }> = {
  es: { guides: 'Guías', blog: 'Blog' },
  en: { guides: 'Guides', blog: 'Blog' },
  fr: { guides: 'Guides', blog: 'Blog' },
  it: { guides: 'Guide', blog: 'Blog' },
  de: { guides: 'Reiseführer', blog: 'Blog' },
};

export default function Header({ lang, transparent = false, showSearch = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;
  const nav = navTexts[lang] || navTexts.es;

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

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  const handleLanguageChange = (newLang: string) => {
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    setLangMenuOpen(false);
    router.push(newPath);
  };

  const shouldShowSearch = isHome ? scrolled : true;
  const showBackground = !isHome || scrolled;
  const currentLang = languages.find(l => l.code === lang) || languages[0];

  const navItems = [
    { href: `/${lang}/guias`, label: nav.guides, icon: BookOpen },
    { href: `/${lang}/blog`, label: nav.blog, icon: Newspaper },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {showBackground && <div className="absolute inset-0 bg-white shadow-md" />}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${shouldShowSearch ? 'h-24' : 'h-20'}`}>
            {/* Logo */}
            <Link href={`/${lang || 'es'}`}>
              <span className={`text-2xl font-bold ${showBackground ? 'text-blue-600' : 'text-white'}`}>RIDATOURS</span>
            </Link>

            {/* Desktop: Search */}
            {shouldShowSearch && (
              <div className="flex-1 mx-8 hidden lg:block">
                <SearchBar inHeader />
              </div>
            )}

            {/* Desktop: Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${
                    showBackground 
                      ? 'text-gray-700 hover:text-blue-600' 
                      : 'text-white/90 hover:text-white'
                  } ${pathname.startsWith(item.href) ? (showBackground ? 'text-blue-600' : 'text-white') : ''}`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Desktop: Language Selector */}
            <div className="hidden md:block relative ml-4" ref={langMenuRef}>
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

            {/* Mobile: Actions */}
            <div className="flex md:hidden items-center gap-2">
              {/* Search Button */}
              {shouldShowSearch && (
                <button
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  className={`p-2 rounded-full transition-colors ${
                    showBackground ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Search size={22} />
                </button>
              )}

              {/* Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-full transition-colors ${
                  showBackground ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {mobileSearchOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 border-t">
            <SearchBar inHeader />
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-bold text-lg text-blue-600">RIDATOURS</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500">
                <X size={24} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    pathname.startsWith(item.href) 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Language Selector */}
            <div className="p-4 border-t">
              <p className="text-sm text-gray-500 mb-2 px-4">Idioma</p>
              <div className="space-y-1">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      handleLanguageChange(language.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 rounded-xl transition-colors ${
                      language.code === lang ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}

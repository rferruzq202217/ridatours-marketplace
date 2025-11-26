'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import Script from 'next/script';
import { getMessages, Locale } from '@/lib/i18n';

interface FooterProps {
  lang?: string;
}

export default function Footer({ lang = 'es' }: FooterProps) {
  const t = getMessages(lang as Locale);
  
  const cities = [
    { name: 'Barcelona', slug: 'barcelona' },
    { name: 'Londres', slug: 'londres' },
    { name: 'Nueva York', slug: 'nueva-york' },
    { name: 'París', slug: 'paris' },
    { name: 'Roma', slug: 'roma' },
  ];

  const trustpilotLocale: Record<string, string> = {
    es: 'es-ES',
    en: 'en-GB',
    fr: 'fr-FR',
    it: 'it-IT',
    de: 'de-DE'
  };

  // Reinicializar Trustpilot cuando el componente se monta
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(
        document.querySelector('.trustpilot-widget'),
        true
      );
    }
  }, [lang]);

  return (
    <footer className="bg-[#1D2D52] text-white">
      <Script 
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" 
        strategy="lazyOnload"
        onLoad={() => {
          if ((window as any).Trustpilot) {
            (window as any).Trustpilot.loadFromElement(
              document.querySelector('.trustpilot-widget'),
              true
            );
          }
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold mb-4">{t.footer.explore}</h3>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link href={`/${lang}/${city.slug}`} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {city.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/${lang}/ciudades`} className="text-sm text-gray-300 hover:text-white transition-colors">
                  {t.nav.allDestinations}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">{t.nav.support}</h3>
            <ul className="space-y-2">
              <li>
                <a href={`https://support.tiqets.com/lang/${lang}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {t.nav.helpCenter}
                </a>
              </li>
              <li>
                <Link href={`/${lang}/terminos`} className="text-sm text-gray-300 hover:text-white transition-colors">
                  {t.nav.terms}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/privacidad`} className="text-sm text-gray-300 hover:text-white transition-colors">
                  {t.nav.privacy}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">App Tiqets</h3>
            <div className="flex flex-col gap-3">
              <a href="https://apps.apple.com/app/tiqets-tickets-tours/id943611357" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.tiqets.com/static/assets/img/apps/app-store-badge@2x.png" alt="Download on the App Store" className="h-10" loading="lazy" />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.tiqets.tiqets" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.tiqets.com/static/assets/img/apps/google-play-badge-320.png" alt="Get it on Google Play" className="h-10" loading="lazy" />
              </a>
            </div>
            <p className="text-sm text-gray-300 mt-3">
              {t.footer.downloadedBy} <strong className="text-white">5.000.000 {t.footer.travelers}</strong>
            </p>
            
            {/* Trustpilot Widget */}
            <div className="mt-5">
              <div 
                className="trustpilot-widget" 
                data-locale={trustpilotLocale[lang] || 'es-ES'}
                data-template-id="53aa8807dec7e10d38f59f32" 
                data-businessunit-id="5405737f00006400057a1376" 
                data-style-height="100px" 
                data-style-width="180px" 
                data-theme="dark"
                style={{ width: '180px', height: '100px' }}
              >
                <a href="https://es.trustpilot.com/review/tiqets.com" target="_blank" rel="noopener noreferrer">
                  Trustpilot
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <Link href={`/${lang}`} className="text-2xl font-bold mb-4">RIDATOURS</Link>
            <p className="text-sm text-gray-400 text-center md:text-right">{t.footer.tagline}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#151F38]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href={`/${lang}`} className="text-xl font-bold">RIDATOURS</Link>
            <div className="text-sm text-gray-400">{t.footer.copyright}</div>
            <div className="flex items-center gap-2">
              <a href="https://www.instagram.com/ridatoursllc/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full hover:bg-[#1D2D52] transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

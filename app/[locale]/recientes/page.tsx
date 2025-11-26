'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Star, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';
import { getMessages, Locale } from '@/lib/i18n';
import { Language } from '@/lib/types';
import { useParams } from 'next/navigation';

interface Experience {
  id: string;
  city: string;
  slug: string;
  title: string;
  image: string | null;
  price: number;
  rating: number;
  reviews: number;
  duration?: string | null;
}

export default function RecientesPage() {
  const params = useParams();
  const lang = (params.locale as string) || 'es';
  const t = getMessages(lang as Locale);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const titles: Record<string, string> = {
    es: '👀 Visto recientemente',
    en: '👀 Recently viewed',
    fr: '👀 Vus récemment',
    it: '👀 Visti di recente',
    de: '👀 Kürzlich angesehen'
  };

  const subtitles: Record<string, string> = {
    es: 'Tus últimas experiencias visitadas',
    en: 'Your recently visited experiences',
    fr: 'Vos dernières expériences visitées',
    it: 'Le tue ultime esperienze visitate',
    de: 'Ihre zuletzt besuchten Erlebnisse'
  };

  const emptyTitles: Record<string, string> = {
    es: 'No has visitado ninguna experiencia',
    en: "You haven't visited any experience yet",
    fr: "Vous n'avez visité aucune expérience",
    it: 'Non hai visitato nessuna esperienza',
    de: 'Sie haben noch kein Erlebnis besucht'
  };

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const cookieValue = getCookie('recentlyViewed');
    if (cookieValue) {
      try {
        const data = JSON.parse(decodeURIComponent(cookieValue));
        setExperiences(data);
      } catch (error) {
        console.error('Error reading cookie:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang as Language} />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: t.common.home, href: `/${lang}` }, 
            { label: t.home.recentlyViewed }
          ]} />
          
          <div className="mt-6 mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{titles[lang] || titles.es}</h1>
            <p className="text-xl text-gray-600">{subtitles[lang] || subtitles.es}</p>
          </div>

          {experiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {experiences.map((exp) => (
                <Link 
                  key={exp.id} 
                  href={`/${lang}/${exp.city}/${exp.slug}`} 
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative h-48">
                    {exp.image ? (
                      <Image src={exp.image} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">{t.common.noImage}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-1">{exp.city.toUpperCase()}</p>
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
                        <span className="text-xs text-gray-500">{t.common.from}</span>
                        <p className="font-bold text-lg text-gray-900">{formatPrice(exp.price)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{emptyTitles[lang] || emptyTitles.es}</h3>
              <Link href={`/${lang}`} className="inline-flex bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700">
                {t.footer.explore}
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer lang={lang as Language} />
    </div>
  );
}

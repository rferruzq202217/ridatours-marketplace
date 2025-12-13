import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Globe, MapPin, Ticket, Star, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { getMessages, Locale } from '@/lib/i18n';
import { formatPrice } from '@/lib/formatPrice';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const texts = {
  es: { thingsToDo: 'Cosas que hacer en', topCities: 'Los mejores lugares para visitar en', topExperiences: 'Top experiencias en', cities: 'ciudades', experiences: 'experiencias', citiesIn: 'Ciudades en', countries: 'Países', noImage: 'Sin imagen', featured: 'Destacado' },
  en: { thingsToDo: 'Things to do in', topCities: 'Top places to visit in', topExperiences: 'Top experiences in', cities: 'cities', experiences: 'experiences', citiesIn: 'Cities in', countries: 'Countries', noImage: 'No image', featured: 'Featured' },
  fr: { thingsToDo: 'Choses à faire à', topCities: 'Les meilleurs endroits à visiter en', topExperiences: 'Top expériences en', cities: 'villes', experiences: 'expériences', citiesIn: 'Villes en', countries: 'Pays', noImage: 'Pas d\'image', featured: 'En vedette' },
  it: { thingsToDo: 'Cose da fare in', topCities: 'I migliori posti da visitare in', topExperiences: 'Top esperienze in', cities: 'città', experiences: 'esperienze', citiesIn: 'Città in', countries: 'Paesi', noImage: 'Nessuna immagine', featured: 'In evidenza' },
  de: { thingsToDo: 'Aktivitäten in', topCities: 'Die besten Orte in', topExperiences: 'Top Erlebnisse in', cities: 'Städte', experiences: 'Erlebnisse', citiesIn: 'Städte in', countries: 'Länder', noImage: 'Kein Bild', featured: 'Empfohlen' },
};

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function CountryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const lang = locale as Locale;
  const t = getMessages(lang);
  const txt = texts[lang] || texts.es;

  const { data: country } = await supabase.from('countries').select('*').eq('slug', slug).single();
  if (!country) notFound();

  const { data: citiesData } = await supabase.from('cities').select('*').eq('country_id', country.id).order('name');
  const cities = citiesData || [];

  const citiesWithCount = await Promise.all(
    cities.map(async (city: any) => {
      const { count } = await supabase.from('experiences').select('*', { count: 'exact', head: true }).eq('city_id', city.id).eq('active', true);
      return { ...city, experienceCount: count || 0 };
    })
  );

  const citiesAlphabetical = [...citiesWithCount].sort((a, b) => a.name.localeCompare(b.name));

  const cityIds = cities.map((c: any) => c.id);
  let experiences: any[] = [];
  
  if (cityIds.length > 0) {
    const { data: experiencesData } = await supabase.from('experiences').select('*, cities(name, slug)').in('city_id', cityIds).eq('active', true).order('rating', { ascending: false }).limit(12);
    experiences = experiencesData || [];
  }

  const totalExperiences = experiences.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang} />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: t.common.home, href: '/' + lang }, { label: txt.countries, href: '/' + lang + '/paises' }, { label: country.name }]} />

          {/* Hero Section */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-12 mt-6">
            {country.image ? (
              <Image src={country.image} alt={country.name} fill className="object-cover" priority />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white">{txt.thingsToDo} {country.name}</h1>
              <div className="flex items-center gap-4 mt-3 text-white/80">
                <span className="flex items-center gap-1"><MapPin size={16} />{citiesAlphabetical.length} {txt.cities}</span>
                <span className="flex items-center gap-1"><Ticket size={16} />{totalExperiences} {txt.experiences}</span>
              </div>
            </div>
          </div>

          {/* 1. Ciudades en España (lista alfabética) */}
          {citiesAlphabetical.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{txt.citiesIn} {country.name}</h2>
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {citiesAlphabetical.map((city: any) => (
                    <Link key={city.slug} href={'/' + lang + '/' + city.slug} className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <MapPin size={16} className="text-emerald-600" />
                      <span className="text-gray-700 hover:text-emerald-600">{city.name}</span>
                      {city.experienceCount > 0 && <span className="text-xs text-gray-400 ml-auto">{city.experienceCount}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 2. Top experiencias */}
          {experiences.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{txt.topExperiences} {country.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {experiences.map((exp: any) => (
                  <Link key={exp.id} href={'/' + lang + '/' + exp.cities?.slug + '/' + exp.slug} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
                    <div className="relative h-48">
                      {exp.main_image ? (
                        <Image src={exp.main_image} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="25vw" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">{txt.noImage}</span>
                        </div>
                      )}
                      {exp.featured && (
                        <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ {txt.featured}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-1">{exp.cities?.name?.toUpperCase()}</p>
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
            </section>
          )}

          {/* 3. Los mejores lugares para visitar (grid con imágenes, ordenado alfabéticamente) */}
          {citiesAlphabetical.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{txt.topCities} {country.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {citiesAlphabetical.map((city: any) => (
                  <Link key={city.slug} href={'/' + lang + '/' + city.slug} className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-200 shadow-md hover:shadow-xl transition-all">
                    {city.image ? (
                      <Image src={city.image} alt={city.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="25vw" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center"><MapPin size={32} className="text-white/50" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-lg text-white">{city.name}</h3>
                      {city.experienceCount > 0 && <p className="text-sm text-white/80 mt-1">{city.experienceCount} {txt.experiences}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {citiesAlphabetical.length === 0 && experiences.length === 0 && (
            <div className="text-center py-16"><Globe size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-gray-500 text-lg">No hay experiencias disponibles</p></div>
          )}
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}

import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import RegiondoWidget from '@/components/RegiondoWidget';
import { Star, MapPin, Clock, Check, Calendar, Info, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{ city: string; slug: string }>;
}

export default async function MonumentPage({ params }: PageProps) {
  const { city: citySlug, slug } = await params;

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .single();

  if (!city) {
    notFound();
  }

  const { data: monument } = await supabase
    .from('monuments')
    .select(`
      *,
      monument_categories(categories(name))
    `)
    .eq('slug', slug)
    .eq('city_id', city.id)
    .single();

  if (!monument) {
    notFound();
  }

  const { data: monumentExperiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('monument_id', monument.id)
    .eq('active', true)
    .order('rating', { ascending: false });

  const { data: recommendedData } = await supabase
    .from('monument_recommended_experiences')
    .select(`
      experiences(*)
    `)
    .eq('monument_id', monument.id)
    .order('display_order');

  const recommendedExperiences = recommendedData?.map(r => r.experiences).filter(Boolean) || [];

  const categoryNames = monument.monument_categories?.map(
    (mc: any) => mc.categories.name
  ) || [];

  return (
    <div className="min-h-screen bg-white">
      <Header lang="es" />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: 'Inicio', href: '/es' },
            { label: city.name, href: `/es/${city.slug}` },
            { label: monument.name }
          ]} />

          {/* HERO SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6 mb-16">
            <div>
              {categoryNames.length > 0 && (
                <div className="text-sm font-bold text-amber-600 tracking-wider mb-3">
                  {categoryNames.join(' • ')}
                </div>
              )}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                {monument.hero_title || monument.name}
              </h1>
              {monument.hero_subtitle && (
                <p className="text-xl text-gray-700 mb-6">
                  {monument.hero_subtitle}
                </p>
              )}
              {monument.description && (
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {monument.description}
                </p>
              )}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={20} />
                  <span className="font-semibold">{city.name}</span>
                </div>
                {monument.tickets_from && (
                  <>
                    <div className="h-6 w-px bg-gray-300" />
                    <div>
                      <div className="text-sm text-gray-600">Desde</div>
                      <div className="text-3xl font-bold text-amber-600">€{monument.tickets_from}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {monument.image && (
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src={monument.image} 
                  alt={monument.name} 
                  fill 
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* POR QUÉ VISITAR */}
          {monument.why_visit && monument.why_visit.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                ¿Por qué visitar {monument.name}?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monument.why_visit.map((reason: string, i: number) => (
                  <div key={i} className="bg-amber-50 rounded-xl p-6 border-2 border-amber-100">
                    <div className="flex items-start gap-3">
                      <Check className="text-amber-600 flex-shrink-0 mt-1" size={24} />
                      <p className="text-gray-900 font-medium">{reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUÉ VER */}
          {monument.what_to_see && monument.what_to_see.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Qué ver en {monument.name}
              </h2>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-100">
                <div className="space-y-4">
                  {monument.what_to_see.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-gray-900 font-medium pt-1">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GALERÍA */}
          {monument.gallery && monument.gallery.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {monument.gallery.slice(0, 6).map((img: string, i: number) => (
                  <div key={i} className="relative h-64 rounded-xl overflow-hidden">
                    <Image 
                      src={img} 
                      alt={`${monument.name} ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCIAS DEL MONUMENTO */}
          {monumentExperiences && monumentExperiences.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Reserva tu visita a {monument.name}
              </h2>
              <p className="text-gray-600 mb-6">Elige la experiencia que mejor se adapte a ti</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {monumentExperiences.map((exp: any) => (
                  <div key={exp.id} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all">
                    {exp.main_image && (
                      <div className="relative h-56">
                        <Image 
                          src={exp.main_image} 
                          alt={exp.title} 
                          fill 
                          className="object-cover"
                        />
                        {exp.featured && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                            HASTA -30%
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight">
                        {exp.title}
                      </h3>
                      {exp.description && (
                        <p className="text-gray-600 text-sm mb-4">
                          {exp.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <Star size={20} className="text-yellow-400 fill-current" />
                          <span className="font-bold text-lg text-gray-900">{exp.rating}</span>
                          <span className="text-sm text-gray-500">({exp.reviews.toLocaleString()})</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600 mb-1">Desde</div>
                          <div className="text-2xl font-bold text-blue-600">€{exp.price}</div>
                        </div>
                      </div>

                      {exp.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <Clock size={16} />
                          <span>{exp.duration}</span>
                        </div>
                      )}

                      {exp.widget_id && (
                        <RegiondoWidget widgetId={exp.widget_id} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONSEJOS PRÁCTICOS */}
          {monument.practical_tips && monument.practical_tips.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Info className="text-blue-600" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">Consejos prácticos</h2>
              </div>
              <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-100">
                <ul className="space-y-3">
                  {monument.practical_tips.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-900">
                      <Check className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* INFORMACIÓN PRÁCTICA */}
          {(monument.opening_hours || monument.address) && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Información práctica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {monument.opening_hours && (
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="text-amber-600" size={24} />
                      <h3 className="font-bold text-lg text-gray-900">Horarios</h3>
                    </div>
                    <p className="text-gray-700">{monument.opening_hours}</p>
                  </div>
                )}
                {monument.address && (
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="text-amber-600" size={24} />
                      <h3 className="font-bold text-lg text-gray-900">Ubicación</h3>
                    </div>
                    <p className="text-gray-700">{monument.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FAQ */}
          {monument.faq && Array.isArray(monument.faq) && monument.faq.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="text-purple-600" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">Preguntas frecuentes</h2>
              </div>
              <div className="space-y-4">
                {monument.faq.map((item: any, i: number) => (
                  <div key={i} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CROSS-SELLING - EXPERIENCIAS RECOMENDADAS */}
          {recommendedExperiences.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">También te puede interesar</h2>
              <p className="text-gray-600 mb-6">Descubre otras experiencias increíbles en {city.name}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedExperiences.map((exp: any) => (
                  <Link
                    key={exp.id}
                    href={`/es/${city.slug}/${exp.slug}`}
                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all"
                  >
                    {exp.main_image && (
                      <div className="relative h-48">
                        <Image 
                          src={exp.main_image} 
                          alt={exp.title} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {exp.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-400 fill-current" />
                          <span className="text-sm font-bold">{exp.rating}</span>
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          €{exp.price}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer lang="es" />
    </div>
  );
}

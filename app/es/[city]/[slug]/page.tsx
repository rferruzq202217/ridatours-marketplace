import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Star, Clock, Users, Check, Sparkles, Calendar } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{ city: string; slug: string }>;
}

export default async function ExperiencePage({ params }: PageProps) {
  const { city: citySlug, slug } = await params;

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .single();

  if (!city) {
    notFound();
  }

  const { data: experience } = await supabase
    .from('experiences')
    .select(`
      *,
      categories(name)
    `)
    .eq('slug', slug)
    .eq('city_id', city.id)
    .single();

  if (!experience) {
    notFound();
  }

  const { data: related } = await supabase
    .from('experiences')
    .select('*')
    .eq('city_id', city.id)
    .eq('active', true)
    .neq('id', experience.id)
    .order('rating', { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-white">
      <Header lang="es" />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: 'Inicio', href: '/es' },
            { label: city.name, href: `/es/${city.slug}` },
            { label: experience.title }
          ]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            <div className="lg:col-span-2">
              <div className="mb-6">
                {experience.featured && (
                  <div className="flex items-center gap-2 text-red-600 font-bold mb-3">
                    <Sparkles size={20} className="fill-current" />
                    <span>Oferta especial - Ahorra hasta 30%</span>
                  </div>
                )}
                {experience.categories && (
                  <div className="text-sm text-gray-700 font-semibold mb-2">
                    {experience.categories.name}
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {experience.title}
                </h1>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-current" size={20} />
                    <span className="font-bold text-lg text-gray-900">{experience.rating}</span>
                  </div>
                  <span className="text-gray-600">({experience.reviews.toLocaleString()} opiniones)</span>
                  {experience.duration && (
                    <>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1 text-gray-700">
                        <Clock size={18} />
                        <span>{experience.duration}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-8">
                {experience.main_image && (
                  <div className="relative h-96 rounded-2xl overflow-hidden mb-4">
                    <Image 
                      src={experience.main_image} 
                      alt={experience.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                )}
                
                {experience.gallery && experience.gallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {experience.gallery.slice(0, 3).map((img: string, i: number) => (
                      <div key={i} className="relative h-32 rounded-xl overflow-hidden">
                        <Image 
                          src={img} 
                          alt={`Vista ${i + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Acerca de esta actividad
                </h2>
                <div className="text-gray-700 space-y-3 leading-relaxed">
                  {experience.long_description ? (
                    <p className="whitespace-pre-line">{experience.long_description}</p>
                  ) : experience.description ? (
                    <p>{experience.description}</p>
                  ) : (
                    <p>Disfruta de esta increíble experiencia en {city.name}.</p>
                  )}
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">
                  Lo más destacado
                </h2>
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Check className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-semibold text-gray-900">Acceso rápido</div>
                        <div className="text-sm text-gray-700">Evita las colas con entrada prioritaria</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-semibold text-gray-900">Cancelación flexible</div>
                        <div className="text-sm text-gray-700">Cancela hasta 24h antes sin cargos</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-semibold text-gray-900">Confirmación inmediata</div>
                        <div className="text-sm text-gray-700">Recibe tu entrada al instante</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-semibold text-gray-900">Entrada móvil</div>
                        <div className="text-sm text-gray-700">Muestra tu ticket en el móvil</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {related && related.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-5">
                    También te puede interesar
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {related.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/es/${city.slug}/${rel.slug}`}
                        className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all"
                      >
                        {rel.main_image && (
                          <div className="relative h-40">
                            <Image 
                              src={rel.main_image} 
                              alt={rel.title} 
                              fill 
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">
                            {rel.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-400 fill-current" />
                              <span className="text-sm font-bold">{rel.rating}</span>
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                              €{rel.price}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-24">
                <div className="mb-4">
                  <div className="text-sm text-gray-700 font-semibold mb-1">Desde</div>
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    €{experience.price}
                  </div>
                  <div className="text-xs text-gray-600">por persona</div>
                </div>

                <div className="mb-6 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Check className="text-green-600 flex-shrink-0" size={16} />
                    <span>Confirmación inmediata</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Check className="text-green-600 flex-shrink-0" size={16} />
                    <span>Entrada móvil</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Check className="text-green-600 flex-shrink-0" size={16} />
                    <span>Cancelación gratis 24h</span>
                  </div>
                </div>

                {experience.widget_id ? (
                  <div className="mb-6">
                    <div 
                      dangerouslySetInnerHTML={{
                        __html: `<booking-widget widget-id="${experience.widget_id}"></booking-widget>`
                      }}
                    />
                  </div>
                ) : (
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg mb-4 transition-colors">
                    Reservar ahora
                  </button>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                    <Calendar size={16} />
                    <span className="font-semibold">Disponibilidad flexible</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users size={16} />
                    <span className="font-semibold">Para todos los públicos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer lang="es" />
    </div>
  );
}

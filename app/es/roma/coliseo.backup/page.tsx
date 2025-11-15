'use client';
import { useEffect } from 'react';
import { useRecentlyViewed } from '@/lib/useRecentlyViewed';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Star, Clock, Users, Check, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function ColiseoPage() {
  const { addProduct } = useRecentlyViewed();

  // Guardar en cookies cuando visitan esta página
  useEffect(() => {
    addProduct({
      slug: 'coliseo',
      city: 'roma',
      title: 'Coliseo Romano con acceso prioritario'
    });
  }, [addProduct]);

  // Cargar el script del widget de Regiondo
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widgets.regiondo.net/booking/v1/booking-widget.min.js';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header lang="es" />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: 'Inicio', href: '/es' },
            { label: 'Roma', href: '/es/roma' },
            { label: 'Coliseo' }
          ]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Columna principal - Contenido */}
            <div className="lg:col-span-2">
              {/* Badge y título */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-amber-600 font-semibold mb-3">
                  <Sparkles size={20} className="fill-current" />
                  <span>7 Maravillas del Mundo</span>
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                  Coliseo de Roma
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  El anfiteatro más grande jamás construido. Un ícono intemporal de la antigua Roma.
                </p>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-current" size={18} />
                    <span className="font-bold">4.9</span>
                  </div>
                  <span className="text-gray-600 text-sm">(5,702)</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-600 text-sm">+12M visitantes/año</span>
                </div>
              </div>

              {/* Imagen principal (en móvil irá aquí, en desktop a la derecha) */}
              <div className="relative h-80 rounded-2xl overflow-hidden mb-8 lg:hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800" 
                  alt="Coliseo de Roma" 
                  fill 
                  className="object-cover"
                />
              </div>

              {/* ¿Por qué visitar el Coliseo? */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ¿Por qué visitar el Coliseo?
                </h2>
                <div className="text-gray-700 space-y-3 leading-relaxed">
                  <p>
                    El Coliseo es el anfiteatro más grande jamás construido y uno de los monumentos más 
                    emblemáticos del mundo. Construido hace casi 2,000 años, este coso de la Roma imperial sigue 
                    siendo un testimonio impresionante de la ingeniería y arquitectura romanas.
                  </p>
                  <p>
                    Con capacidad para más de 50,000 espectadores, el Coliseo fue escenario de combates de 
                    gladiadores, batallas navales simuladas y espectáculos públicos que cautivaban a las masas.
                  </p>
                </div>
              </div>

              {/* Galería */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Galería</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative h-48 rounded-xl overflow-hidden">
                      <Image 
                        src={`https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=${80 + i}`}
                        alt={`Vista ${i} del Coliseo`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Lo más destacado */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">
                  Lo más destacado
                </h2>
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex items-start gap-3">
                      <Check className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-semibold text-gray-900">Mayor anfiteatro del mundo</div>
                        <div className="text-sm text-gray-600">50,000 espectadores de capacidad</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-semibold text-gray-900">Arquitectura impresionante</div>
                        <div className="text-sm text-gray-600">Diseño revolucionario</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-semibold text-gray-900">Historia fascinante</div>
                        <div className="text-sm text-gray-600">Gladiadores y espectáculos épicos</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-semibold text-gray-900">Patrimonio UNESCO</div>
                        <div className="text-sm text-gray-600">7 Maravillas del Mundo</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos curiosos */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">
                  Datos curiosos
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>• El Coliseo tardó solo 8 años en construirse, de 72 d.C. a 80 d.C.</p>
                  <p>• Se estima que más de 400,000 personas y 1 millón de animales murieron en el Coliseo.</p>
                  <p>• El nombre original era "Anfiteatro Flavio", el nombre "Coliseo" viene de una estatua gigante cercana.</p>
                  <p>• Tenía un sistema de toldos retráctiles para proteger a los espectadores del sol.</p>
                </div>
              </div>
            </div>

            {/* Columna derecha - Imagen grande y Widget */}
            <div className="lg:col-span-1">
              {/* Imagen principal solo en desktop */}
              <div className="hidden lg:block relative h-64 rounded-2xl overflow-hidden mb-6">
                <Image 
                  src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800" 
                  alt="Coliseo de Roma" 
                  fill 
                  className="object-cover"
                />
              </div>

              {/* Widget de Regiondo */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-24">
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-3">
                    Coliseo, Foro Romano y Monte Palatino - Tickets 24h
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-sm font-semibold">4.8</span>
                    <span className="text-sm text-gray-500">(2857)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Clock size={16} />
                    <span className="text-sm">24 horas</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Users size={16} />
                    <span className="text-sm">Acceso para todos</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Desde</div>
                  <div className="text-4xl font-bold text-purple-700 mb-1">€50.00</div>
                  <div className="text-xs text-gray-500">por persona</div>
                </div>

                {/* Widget de Regiondo */}
                <div className="mb-6">
                  <booking-widget widget-id="07df3e12-8853-4549-8b62-13cb958e9562"></booking-widget>
                </div>

                {/* Beneficios */}
                <div className="space-y-2 text-sm mb-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Check className="text-green-600 flex-shrink-0" size={16} />
                    <span>Confirmación inmediata</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-green-600 flex-shrink-0" size={16} />
                    <span>Entrada móvil</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-green-600 flex-shrink-0" size={16} />
                    <span>Cancelación gratis 24h</span>
                  </div>
                </div>

                {/* Otras opciones */}
                <div className="border-t pt-4">
                  <h4 className="font-bold text-sm mb-3">Otras opciones</h4>
                  <div className="space-y-2">
                    <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                      <div className="text-sm font-semibold mb-1">Coliseo Tour Guiado</div>
                      <div className="text-purple-700 font-bold text-sm">€70.00</div>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                      <div className="text-sm font-semibold mb-1">Full Experience Coliseo y Arena</div>
                      <div className="text-purple-700 font-bold text-sm">€90.00</div>
                    </div>
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

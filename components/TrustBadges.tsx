'use client';
import { ShieldCheck, Smartphone, MapPin } from 'lucide-react';

const badges = [
  {
    icon: ShieldCheck,
    title: 'Flexibilidad en todo momento',
    description: 'Opciones flexibles de cancelación en todos los establecimientos'
  },
  {
    icon: Smartphone,
    title: 'Reserva con confianza',
    description: 'Reserva desde tu móvil con facilidad y sáltate la cola'
  },
  {
    icon: MapPin,
    title: 'Descubre la cultura a tu manera',
    description: 'Las mejores experiencias en museos y atracciones de todo el mundo'
  }
];

export default function TrustBadges() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {badges.map((badge, index) => (
            <div 
              key={index}
              className="flex-1 min-w-[280px] max-w-[400px] p-4 bg-gray-100 rounded-xl flex items-start gap-3"
            >
              <div className="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                <badge.icon size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-base text-gray-900 mb-1">{badge.title}</h3>
                <p className="text-sm text-gray-600 m-0">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

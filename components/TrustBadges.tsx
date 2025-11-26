'use client';
import { ShieldCheck, Smartphone, MapPin } from 'lucide-react';

interface TrustBadgesProps {
  lang?: string;
}

const badgeTexts: Record<string, { title: string; description: string }[]> = {
  es: [
    { title: 'Flexibilidad en todo momento', description: 'Opciones flexibles de cancelación en todos los establecimientos' },
    { title: 'Reserva con confianza', description: 'Reserva desde tu móvil con facilidad y sáltate la cola' },
    { title: 'Descubre la cultura a tu manera', description: 'Las mejores experiencias en museos y atracciones de todo el mundo' }
  ],
  en: [
    { title: 'Flexibility at all times', description: 'Flexible cancellation options at all venues' },
    { title: 'Book with confidence', description: 'Book from your mobile with ease and skip the line' },
    { title: 'Discover culture your way', description: 'The best experiences in museums and attractions worldwide' }
  ],
  fr: [
    { title: 'Flexibilité à tout moment', description: 'Options d\'annulation flexibles dans tous les établissements' },
    { title: 'Réservez en toute confiance', description: 'Réservez facilement depuis votre mobile et évitez la file d\'attente' },
    { title: 'Découvrez la culture à votre façon', description: 'Les meilleures expériences dans les musées et attractions du monde entier' }
  ],
  it: [
    { title: 'Flessibilità in ogni momento', description: 'Opzioni di cancellazione flessibili in tutte le strutture' },
    { title: 'Prenota con fiducia', description: 'Prenota facilmente dal tuo cellulare e salta la coda' },
    { title: 'Scopri la cultura a modo tuo', description: 'Le migliori esperienze nei musei e nelle attrazioni di tutto il mondo' }
  ],
  de: [
    { title: 'Flexibilität jederzeit', description: 'Flexible Stornierungsoptionen bei allen Einrichtungen' },
    { title: 'Mit Vertrauen buchen', description: 'Buchen Sie einfach von Ihrem Handy aus und überspringen Sie die Warteschlange' },
    { title: 'Entdecken Sie Kultur auf Ihre Weise', description: 'Die besten Erlebnisse in Museen und Attraktionen weltweit' }
  ]
};

const icons = [ShieldCheck, Smartphone, MapPin];

export default function TrustBadges({ lang = 'es' }: TrustBadgesProps) {
  const badges = badgeTexts[lang] || badgeTexts.es;

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {badges.map((badge, index) => {
            const Icon = icons[index];
            return (
              <div 
                key={index}
                className="flex-1 min-w-[280px] max-w-[400px] p-4 bg-gray-100 rounded-xl flex items-start gap-3"
              >
                <div className="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-base text-gray-900 mb-1">{badge.title}</h3>
                  <p className="text-sm text-gray-600 m-0">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

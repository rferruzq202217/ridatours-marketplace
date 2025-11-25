'use client';
import { useEffect, useRef } from 'react';

interface TiqetsWidgetProps {
  venueId: string;
  campaign?: string;
}

export default function TiqetsWidget({ venueId, campaign = '' }: TiqetsWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Función para inicializar el widget
    const initWidget = () => {
      if (typeof window !== 'undefined' && (window as any).tiqets) {
        console.log('🎫 Inicializando widget de Tiqets...');
        (window as any).tiqets.init();
      } else {
        // Si el script no está listo, reintentar
        setTimeout(initWidget, 100);
      }
    };

    // Dar tiempo para que el DOM esté listo
    const timer = setTimeout(initWidget, 500);

    return () => clearTimeout(timer);
  }, [venueId, campaign]);

  return (
    <div 
      ref={widgetRef}
      data-tiqets-widget="availability" 
      data-layout="full" 
      data-orientation="vertical" 
      data-venue-id={venueId}
      data-partner="rida_tours_llc-181548"
      data-tq-campaign={campaign}
      className="tiqets-widget-container"
    />
  );
}

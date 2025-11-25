'use client';
import { useEffect, useRef, useState } from 'react';

interface TiqetsWidgetProps {
  venueId: string;
  campaign?: string;
}

export default function TiqetsWidget({ venueId, campaign = '' }: TiqetsWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20; // 2 segundos máximo (20 * 100ms)

    const initWidget = () => {
      if (typeof window !== 'undefined' && (window as any).tiqets?.init) {
        console.log('🎫 Inicializando widget de Tiqets para venue:', venueId);
        try {
          (window as any).tiqets.init();
          setIsLoaded(true);
        } catch (error) {
          console.error('Error inicializando widget:', error);
        }
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(initWidget, 100);
        } else {
          console.warn('⚠️ No se pudo cargar el widget de Tiqets después de', maxAttempts * 100, 'ms');
        }
      }
    };

    // Esperar un poco para asegurar que el DOM esté listo
    const timer = setTimeout(initWidget, 300);

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
      className="tiqets-widget-container min-h-[400px]"
      style={{ opacity: isLoaded ? 1 : 0.5 }}
    />
  );
}

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
    const maxAttempts = 20;

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
      className="tiqets-widget-wrapper"
      style={{ 
        minHeight: '400px',
        width: '100%'
      }}
    >
      <style jsx>{`
        .tiqets-widget-wrapper {
          width: 100%;
        }
        
        .tiqets-widget-wrapper iframe {
          width: 100% !important;
          border: none !important;
          display: block !important;
        }
        
        /* Asegurar que no haya transformaciones que causen blur */
        .tiqets-widget-wrapper * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}

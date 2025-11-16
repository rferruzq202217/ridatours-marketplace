'use client';
import { useEffect, useRef } from 'react';

interface RegiondoWidgetProps {
  widgetId: string;
}

export default function RegiondoWidget({ widgetId }: RegiondoWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar el script de Regiondo solo una vez
    if (!document.querySelector('script[src*="regiondo"]')) {
      const script = document.createElement('script');
      script.src = 'https://widgets.regiondo.net/booking/v1/booking-widget.min.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Crear el elemento del widget manualmente
    if (containerRef.current && !containerRef.current.querySelector('booking-widget')) {
      const widget = document.createElement('booking-widget');
      widget.setAttribute('widget-id', widgetId);
      containerRef.current.appendChild(widget);
    }
  }, [widgetId]);

  return <div ref={containerRef}></div>;
}

'use client';

import { useMemo } from 'react';

interface TiqetsWidgetProps {
  widgetCode?: string | null;
}

export default function TiqetsWidget({ widgetCode }: TiqetsWidgetProps) {
  const iframeSrc = useMemo(() => {
    if (!widgetCode) return null;

    // Extraer product-id o venue-id del código HTML
    const productMatch = widgetCode.match(/data-product-id="(\d+)"/);
    const venueMatch = widgetCode.match(/data-venue-id="(\d+)"/);
    
    const productId = productMatch ? productMatch[1] : null;
    const venueId = venueMatch ? venueMatch[1] : null;
    
    if (!productId && !venueId) return null;

    // Extraer campaign si existe
    const campaignMatch = widgetCode.match(/data-tq-campaign="([^"]+)"/);
    const campaign = campaignMatch ? campaignMatch[1] : '';

    // Construir URL del iframe de Tiqets
    const params = new URLSearchParams({
      partner: 'rida_tours_llc-181548',
      layout: 'full',
      orientation: 'vertical',
      language: 'es',
      currency: 'EUR',
    });
    
    // Usar productId o venueId según lo que exista
    if (productId) {
      params.append('productId', productId);
    } else if (venueId) {
      params.append('venueId', venueId);
    }
    
    if (campaign) {
      params.append('campaign', campaign);
    }

    return `https://www.tiqets.com/widgets/availability/?${params.toString()}`;
  }, [widgetCode]);

  if (!iframeSrc) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Reservar</h2>
      <iframe
        src={iframeSrc}
        width="100%"
        height="800"
        frameBorder="0"
        style={{ border: 'none', minHeight: '800px' }}
        allow="payment"
      />
    </div>
  );
}

'use client';

import { useMemo } from 'react';

interface TiqetsWidgetProps {
  widgetCode?: string | null;
  lang?: string;
}

export default function TiqetsWidget({ widgetCode, lang = 'es' }: TiqetsWidgetProps) {
  const iframeSrc = useMemo(() => {
    if (!widgetCode) return null;

    const productMatch = widgetCode.match(/data-product-id="(\d+)"/);
    const venueMatch = widgetCode.match(/data-venue-id="(\d+)"/);
    
    const productId = productMatch ? productMatch[1] : null;
    const venueId = venueMatch ? venueMatch[1] : null;
    
    if (!productId && !venueId) return null;

    const campaignMatch = widgetCode.match(/data-tq-campaign="([^"]+)"/);
    const campaign = campaignMatch ? campaignMatch[1] : '';

    // Mapeo de idiomas
    const langMap: Record<string, string> = {
      es: 'es',
      en: 'en',
      fr: 'fr',
      it: 'it',
      de: 'de'
    };

    const params = new URLSearchParams({
      partner: 'rida_tours_llc-181548',
      layout: 'full',
      orientation: 'vertical',
      language: langMap[lang] || 'es',
      currency: 'EUR',
    });
    
    if (productId) {
      params.append('productId', productId);
    } else if (venueId) {
      params.append('venueId', venueId);
    }
    
    if (campaign) {
      params.append('campaign', campaign);
    }

    return `https://www.tiqets.com/widgets/availability/?${params.toString()}`;
  }, [widgetCode, lang]);

  if (!iframeSrc) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {lang === 'es' ? 'Reservar' : lang === 'fr' ? 'Réserver' : lang === 'it' ? 'Prenota' : lang === 'de' ? 'Buchen' : 'Book'}
      </h2>
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

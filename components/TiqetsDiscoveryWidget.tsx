'use client';
import { useEffect } from 'react';

interface TiqetsDiscoveryWidgetProps {
  destinationType: 'venue' | 'city';
  destinationId: string;
  campaign?: string;
  itemCount?: number;
  layout?: 'responsive' | 'grid' | 'carousel';
  contentType?: 'product' | 'collection';
}

export default function TiqetsDiscoveryWidget({
  destinationType,
  destinationId,
  campaign = '',
  itemCount = 12,
  layout = 'responsive',
  contentType = 'product'
}: TiqetsDiscoveryWidgetProps) {
  
  useEffect(() => {
    // Forzar reinicialización del widget cuando cambia
    if ((window as any).tiqets) {
      setTimeout(() => {
        (window as any).tiqets.init();
      }, 100);
    }
  }, [destinationId, campaign]);

  return (
    <div 
      data-tiqets-widget="discovery"
      data-cards-layout={layout}
      data-content-type={contentType}
      data-item_count={itemCount}
      data-destination-type={destinationType}
      data-destination-id={destinationId}
      data-slug-ids=""
      data-partner="rida_tours_llc-181548"
      data-tq-campaign={campaign}
      className="w-full"
    />
  );
}

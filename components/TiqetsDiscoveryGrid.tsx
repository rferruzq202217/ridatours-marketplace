'use client';
import { useEffect } from 'react';

interface TiqetsDiscoveryGridProps {
  destinationType: 'venue' | 'city';
  destinationId: string;
  campaign?: string;
  itemCount?: number;
  lang?: string;
}

export default function TiqetsDiscoveryGrid({
  destinationType,
  destinationId,
  campaign = '',
  itemCount = 12,
  lang = 'es'
}: TiqetsDiscoveryGridProps) {
  
  useEffect(() => {
    console.log('🎯 TiqetsDiscoveryGrid props:', { destinationType, destinationId, campaign, itemCount, lang });
    
    if ((window as any).tiqets) {
      setTimeout(() => {
        (window as any).tiqets.init();
      }, 100);
    }
  }, [destinationId, campaign, itemCount, destinationType, lang]);

  return (
    <div 
      data-tiqets-widget="discovery"
      data-cards-layout="responsive"
      data-content-type="product"
      data-item_count={itemCount}
      data-hide-destination-link="true"
      data-destination-type={destinationType}
      data-destination-id={destinationId}
      data-slug-ids=""
      data-partner="rida_tours_llc-181548"
      data-tq-campaign={campaign}
      data-language={lang}
    />
  );
}

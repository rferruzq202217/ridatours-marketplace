'use client';
import { useEffect } from 'react';

interface TiqetsDiscoveryGridProps {
  destinationType: 'venue' | 'city';
  destinationId: string;
  campaign?: string;
  itemCount?: number;
}

export default function TiqetsDiscoveryGrid({
  destinationType,
  destinationId,
  campaign = '',
  itemCount = 12
}: TiqetsDiscoveryGridProps) {
  
  useEffect(() => {
    if ((window as any).tiqets) {
      setTimeout(() => {
        (window as any).tiqets.init();
      }, 100);
    }
  }, [destinationId, campaign]);

  return (
    <div className="tiqets-grid-wrapper">
      <div 
        data-tiqets-widget="discovery"
        data-cards-layout="grid"
        data-content-type="product"
        data-item_count={itemCount}
        data-destination-type={destinationType}
        data-destination-id={destinationId}
        data-slug-ids=""
        data-partner="rida_tours_llc-181548"
        data-tq-campaign={campaign}
      />
      <style jsx global>{`
        .tiqets-grid-wrapper iframe {
          min-height: 800px !important;
        }
        /* Intentar forzar grid dentro del iframe */
        .tiqets-grid-wrapper [class*="cards"],
        .tiqets-grid-wrapper [class*="grid"],
        .tiqets-grid-wrapper [class*="products"] {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 1.5rem !important;
        }
      `}</style>
    </div>
  );
}

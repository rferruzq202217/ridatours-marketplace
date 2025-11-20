'use client';

interface TiqetsDiscoveryWidgetProps {
  destinationType: 'venue' | 'city';
  destinationId: string;
  campaign?: string;
  itemCount?: number;
  cardsLayout?: 'responsive' | 'grid';
  contentType?: 'product' | 'collection';
}

export default function TiqetsDiscoveryWidget({
  destinationType,
  destinationId,
  campaign = '',
  itemCount = 12,
  cardsLayout = 'responsive',
  contentType = 'product'
}: TiqetsDiscoveryWidgetProps) {
  return (
    <div 
      data-tiqets-widget="discovery"
      data-cards-layout={cardsLayout}
      data-content-type={contentType}
      data-item_count={itemCount}
      data-destination-type={destinationType}
      data-destination-id={destinationId}
      data-slug-ids=""
      data-partner="rida_tours_llc-181548"
      data-tq-campaign={campaign}
    />
  );
}

'use client';

interface TiqetsWidgetProps {
  venueId: string;
  campaign?: string;
}

export default function TiqetsWidget({ venueId, campaign = '' }: TiqetsWidgetProps) {
  return (
    <div 
      data-tiqets-widget="availability" 
      data-layout="full" 
      data-orientation="vertical" 
      data-venue-id={venueId}
      data-partner="rida_tours_llc-181548"
      data-tq-campaign={campaign}
    />
  );
}

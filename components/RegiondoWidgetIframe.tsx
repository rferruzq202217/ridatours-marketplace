'use client';

interface RegiondoWidgetIframeProps {
  widgetId: string;
}

export default function RegiondoWidgetIframe({ widgetId }: RegiondoWidgetIframeProps) {
  return (
    <iframe 
      src={`https://widgets.regiondo.net/widget/${widgetId}`}
      style={{ width: '100%', minHeight: '500px', border: 'none' }}
      title="Booking Widget"
    />
  );
}

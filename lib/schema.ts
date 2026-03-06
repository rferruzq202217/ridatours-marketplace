export function generateWebSiteSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ridatours',
    url: 'https://www.ridatours.com',
    description: 'Tours, entradas a monumentos y actividades turísticas en todo el mundo. Reserva online con cancelación gratis.',
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `https://www.ridatours.com/${locale}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateCitySchema(params: {
  cityName: string; citySlug: string; description: string; image?: string;
  locale: string; avgRating: string; totalReviews: number; totalExperiences: number;
}) {
  const { cityName, citySlug, description, image, locale, avgRating, totalReviews, totalExperiences } = params;
  const cityUrl = `https://www.ridatours.com/${locale}/${citySlug}`;
  return [
    {
      '@context': 'https://schema.org', '@type': 'TouristDestination',
      name: cityName, description, url: cityUrl, ...(image && { image }),
      touristType: ['Cultural tourist', 'City break'],
      ...(totalReviews > 0 && { aggregateRating: { '@type': 'AggregateRating', ratingValue: avgRating, reviewCount: totalReviews, bestRating: '5', worstRating: '1' } }),
      hasOfferCatalog: { '@type': 'OfferCatalog', name: `Tours y experiencias en ${cityName}`, numberOfItems: totalExperiences },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `https://www.ridatours.com/${locale}` },
        { '@type': 'ListItem', position: 2, name: cityName, item: cityUrl },
      ],
    },
  ];
}

export function generateExperienceSchema(params: {
  title: string; description: string; image?: string; price: number; rating: number;
  reviews: number; duration?: string; cityName: string; citySlug: string;
  slug: string; locale: string; featured?: boolean;
}) {
  const { title, description, image, price, rating, reviews, duration, cityName, citySlug, slug, locale, featured } = params;
  const experienceUrl = `https://www.ridatours.com/${locale}/${citySlug}/${slug}`;
  const priceValidUntil = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
  return [
    {
      '@context': 'https://schema.org', '@type': 'Product',
      name: title, description, ...(image && { image }), url: experienceUrl,
      brand: { '@type': 'Brand', name: 'Ridatours' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.toString(), reviewCount: reviews, bestRating: '5', worstRating: '1' },
      offers: {
        '@type': 'Offer', url: experienceUrl, priceCurrency: 'EUR',
        price: price.toFixed(2), priceValidUntil,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        ...(featured && { highPrice: (price * 1.3).toFixed(2) }),
        seller: { '@type': 'Organization', name: 'Ridatours', url: 'https://www.ridatours.com' },
      },
      ...(duration && { additionalProperty: { '@type': 'PropertyValue', name: 'Duration', value: duration } }),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `https://www.ridatours.com/${locale}` },
        { '@type': 'ListItem', position: 2, name: cityName, item: `https://www.ridatours.com/${locale}/${citySlug}` },
        { '@type': 'ListItem', position: 3, name: title, item: experienceUrl },
      ],
    },
  ];
}

// ─────────────────────────────────────────────
// 4. Hreflang alternates para generateMetadata
// ─────────────────────────────────────────────
export function generateAlternates(path: string) {
  const locales = ['es', 'en', 'fr', 'it', 'de'];
  const base = 'https://www.ridatours.com';
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${base}/${locale}${path}`;
  }
  languages['x-default'] = `${base}/es${path}`;
  return { languages };
}

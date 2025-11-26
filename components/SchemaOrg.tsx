interface ExperienceSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  city: string;
  url: string;
}

export function ExperienceSchema({ name, description, image, price, rating, reviewCount, city, url }: ExperienceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": name,
    "description": description,
    "image": image,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount,
      "bestRating": 5,
      "worstRating": 1
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Ridatours",
    "url": "https://www.ridatours.com",
    "logo": "https://www.ridatours.com/logo.png",
    "description": "Tours y experiencias turísticas en Europa",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ES"
    },
    "sameAs": [
      "https://www.instagram.com/ridatoursllc/"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/formatPrice';
import { getMessages, Locale } from '@/lib/i18n';
import { Star, MapPin } from 'lucide-react';

interface Monument {
  id?: string;
  slug: string;
  name: string;
  image: string | null;
  description?: string | null;
  rating?: number;
  reviews?: number;
  tickets_from?: number;
  price?: number;
  city?: string;
}

interface MonumentCardProps {
  monument: Monument;
  lang?: string;
  citySlug?: string;
}

export default function MonumentCard({ monument, lang = 'es', citySlug }: MonumentCardProps) {
  const slug = citySlug || monument.city || '';
  const href = `/${lang}/${slug}/monumentos/${monument.slug}`;
  const t = getMessages(lang as Locale);

  return (
    <Link
      href={href}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow group block"
    >
      <div className="relative h-48">
        {monument.image && monument.image.trim() !== '' ? (
          <Image
            src={monument.image}
            alt={monument.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">{t.common.noImage}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {monument.name}
        </h3>

        {monument.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {monument.description}
          </p>
        )}

        {monument.rating && monument.reviews && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="font-medium text-gray-700">{monument.rating}</span>
              <span className="text-gray-500">({monument.reviews})</span>
            </div>
          </div>
        )}

        {(monument.tickets_from || monument.price) && (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">{t.common.from}</div>
              <div className="text-xl font-bold text-gray-900">
                {formatPrice(monument.tickets_from || monument.price)}
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

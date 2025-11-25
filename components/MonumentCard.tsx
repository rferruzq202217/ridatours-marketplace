import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface Monument {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  city_slug?: string;
  city_name?: string;
  tickets_from?: number;
}

export default function MonumentCard({ monument }: { monument: Monument }) {
  return (
    <Link
      href={`/es/${monument.city_slug}/monumentos/${monument.slug}`}
      className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group"
    >
      {monument.image && monument.image.trim() !== '' ? (
        <div className="relative h-56">
          <Image 
            src={monument.image} 
            alt={monument.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-56 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Sin imagen</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
          {monument.name}
        </h3>
        {monument.city_name && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <MapPin size={14} />
            <span>{monument.city_name}</span>
          </div>
        )}
        {monument.tickets_from && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Desde</span>
            <div className="text-xl font-bold text-blue-600">
              €{monument.tickets_from}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

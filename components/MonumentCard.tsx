import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface Monument {
  name: string;
  slug: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  duration: string;
}

interface MonumentCardProps {
  monument: Monument;
  lang: string;
}

export default function MonumentCard({ monument, lang }: MonumentCardProps) {
  return (
    <Link 
      href={`/${lang}/roma/${monument.slug}`}
      className="group bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-56">
        <Image 
          src={monument.image} 
          alt={monument.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">
          {monument.name}
        </h3>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-400 fill-current" />
            <span className="font-bold text-gray-900">{monument.rating}</span>
            <span className="text-sm text-gray-500">({monument.reviews.toLocaleString()})</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">Desde</div>
            <div className="text-xl font-bold text-blue-600">
              €{monument.price}
            </div>
          </div>
        </div>
        {monument.duration && (
          <div className="text-sm text-gray-600 mt-2">
            {monument.duration}
          </div>
        )}
      </div>
    </Link>
  );
}

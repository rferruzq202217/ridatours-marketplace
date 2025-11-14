import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, MapPin } from 'lucide-react';
import { Monument } from '@/lib/types';
import { Language } from '@/lib/types';

interface MonumentCardProps {
  monument: Monument;
  lang: Language;
}

export default function MonumentCard({ monument, lang }: MonumentCardProps) {
  return (
    <Link 
      href={`/${lang}/roma/${monument.slug}`} 
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-300"
    >
      <div className="relative h-64">
        <Image 
          src={monument.image} 
          alt={monument.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
          <MapPin size={14} />
          <span>Roma</span>
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 leading-snug min-h-[3.5rem]">
          {monument.name}
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="font-semibold text-sm">{monument.rating}</span>
            <span className="text-xs text-gray-500">({monument.reviews.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Clock size={16} />
            <span>{monument.duration}</span>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">Desde</span>
              <div className="text-2xl font-bold text-gray-900">€{monument.price}</div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors group-hover:scale-105">
              Ver más
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

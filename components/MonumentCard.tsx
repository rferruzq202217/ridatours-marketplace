import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
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
      className="group bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-56">
        <Image 
          src={monument.image} 
          alt={monument.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        {monument.featured && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
            HASTA -30 %
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="text-xs font-bold text-gray-600 tracking-wider mb-2">
          ROMA
        </div>
        <h3 className="font-bold text-2xl text-gray-900 mb-2 leading-tight">
          {monument.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          Explora este increíble monumento histórico
        </p>
        
        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Star size={20} className="text-yellow-400 fill-current" />
            <span className="font-bold text-lg text-gray-900">{monument.rating}</span>
            <span className="text-sm text-gray-500">({monument.reviews.toLocaleString()})</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600 mb-1">Desde</div>
            <div className="text-2xl font-bold text-gray-900">
              €{monument.price}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { PayloadCategory } from '@/lib/payload';

interface BlogFiltersProps {
  categories: PayloadCategory[];
  activeSlug?: string;
  lang: string;
  allLabel: string;
}

export default function BlogFilters({ categories, activeSlug, lang, allLabel }: BlogFiltersProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <Link
        href={`/${lang}/blog`}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !activeSlug
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {allLabel}
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/${lang}/blog?category=${category.slug}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeSlug === category.slug
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.title}
        </Link>
      ))}
    </div>
  );
}

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-base mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="text-gray-600 hover:text-blue-600">{item.label}</Link>
          ) : (
            <span className="text-gray-900 font-semibold">{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRight size={18} className="text-gray-400" />}
        </div>
      ))}
    </nav>
  );
}

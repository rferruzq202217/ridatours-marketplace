import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  light?: boolean;
}

export default function Breadcrumb({ items, light = false }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-base mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link 
              href={item.href} 
              className={light ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-blue-600"}
            >
              {item.label}
            </Link>
          ) : (
            <span className={light ? "text-white font-semibold" : "text-gray-900 font-semibold"}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <ChevronRight size={18} className={light ? "text-white/60" : "text-gray-400"} />
          )}
        </div>
      ))}
    </nav>
  );
}

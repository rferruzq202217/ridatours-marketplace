import { Language } from '@/lib/types';

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">RIDATOURS</h3>
          <p className="text-gray-400">© 2024 Ridatours. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

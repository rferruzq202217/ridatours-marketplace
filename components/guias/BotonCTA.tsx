// components/guias/BotonCTA.tsx
import { clsx } from 'clsx';
import type { BotonCTABlock } from '@/lib/payload';

const estiloClasses: Record<string, string> = {
    primary: 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30',
    secondary: 'bg-gray-800 text-white hover:bg-gray-700',
    urgent: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 animate-pulse',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30',
    outline: 'border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white',
};

const tamanoClasses: Record<string, string> = {
    large: 'py-5 px-10 text-xl',
    medium: 'py-4 px-8 text-lg',
    small: 'py-3 px-6 text-base',
};

// Dominios de staging/preview que no deben aparecer en producción
const STAGING_DOMAINS = [
    'ridatours-marketplace.vercel.app',
    'ridatours-marketplace-git-',
    'localhost:3000',
    'localhost:3001',
  ];

/**
 * Sanitiza URLs del CMS: reemplaza dominios de staging por el dominio de producción.
 * Protege contra URLs incorrectas guardadas en el CMS durante el desarrollo.
 */
function sanitizarUrl(url: string | undefined): string {
    if (!url) return '#';

  // Si es una URL relativa, devolverla tal cual
  if (url.startsWith('/')) return url;

  try {
        const parsed = new URL(url);
        const esStaging = STAGING_DOMAINS.some(domain => parsed.hostname.includes(domain) || url.includes(domain));

      if (esStaging) {
              // Mantener el path+query, cambiar el dominio a producción
          return `https://www.ridatours.com${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
  } catch {
        // URL malformada: devolverla sin tocar
      return url;
  }

  return url;
}

interface Props {
    block: BotonCTABlock;
}

export default function BotonCTA({ block }: Props) {
    const {
          texto,
          subtexto,
          url,
          estilo,
          tamano,
          anchoCompleto,
          abrirEnNuevaVentana,
    } = block;

  const estiloClass = estiloClasses[estilo ?? 'primary'] ?? estiloClasses.primary;
    const tamanoClass = tamanoClasses[tamano ?? 'large'] ?? tamanoClasses.large;
    const urlFinal = sanitizarUrl(url);

  return (
        <div className="my-10 text-center">
              <a
                        href={urlFinal}
                        target={abrirEnNuevaVentana ? '_blank' : '_self'}
                        rel={abrirEnNuevaVentana ? 'noopener noreferrer' : undefined}
                        className={clsx(
                                    'inline-block font-bold rounded-2xl transition-all transform hover:scale-105',
                                    estiloClass,
                                    tamanoClass,
                                    anchoCompleto && 'w-full max-w-2xl',
                                  )}
                      >
                {texto}
              </a>a>
          {subtexto && (
                  <p className="mt-3 text-sm text-gray-500">
                    {subtexto}
                  </p>p>
              )}
        </div>div>
      );
}</div>

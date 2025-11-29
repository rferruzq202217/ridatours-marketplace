// components/guias/AlertaConfianza.tsx
import { clsx } from 'clsx';
import type { AlertaConfianzaBlock } from '@/lib/payload';

const iconMap: Record<string, string> = {
  shield: '🛡️',
  check: '✅',
  lock: '🔒',
  star: '⭐',
  hundred: '💯',
  ticket: '🎫',
  bolt: '⚡',
};

const styleMap: Record<string, { bg: string; border: string; text: string }> = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
  },
  highlight: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
  },
};

interface Props {
  block: AlertaConfianzaBlock;
}

export default function AlertaConfianza({ block }: Props) {
  const { icono, titulo, mensaje, estilo } = block;

  const icon = iconMap[icono ?? 'shield'] ?? '🛡️';
  const styles = styleMap[estilo ?? 'info'] ?? styleMap.info;

  return (
    <div
      className={clsx(
        'rounded-2xl border-2 p-6 my-8',
        styles.bg,
        styles.border,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl flex-shrink-0" role="img" aria-hidden="true">
          {icon}
        </span>
        <div className="flex-1">
          <h3 className={clsx('text-lg font-bold mb-2', styles.text)}>
            {titulo}
          </h3>
          <p className={clsx('text-base leading-relaxed', styles.text)}>
            {mensaje}
          </p>
        </div>
      </div>
    </div>
  );
}

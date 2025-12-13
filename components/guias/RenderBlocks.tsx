// components/guias/RenderBlocks.tsx
import type { PayloadBlock } from '@/lib/payload';
import AlertaConfianza from './AlertaConfianza';
import TablaConversion from './TablaConversion';
import BotonCTA from './BotonCTA';
import FAQ from './FAQ';
import ContentBlock from './ContentBlock';
import ContentAcordeon from './ContentAcordeon';

interface Props {
  blocks: PayloadBlock[];
}

export default function RenderBlocks({ blocks }: Props) {
  if (!blocks || blocks.length === 0) {
    return <div className="text-red-500 p-4 bg-red-50">DEBUG: No blocks received</div>;
  }

  return (
    <>
      <div className="text-blue-500 p-2 bg-blue-50 mb-4">
        DEBUG: {blocks.length} blocks - Types: {blocks.map((b: any) => b.blockType).join(', ')}
      </div>
      {blocks.map((block, index) => {
        const blockType = (block as any).blockType;
        switch (blockType) {
          case 'alertaConfianza':
            return <AlertaConfianza key={index} block={block as any} />;
          case 'tablaConversion':
            return <TablaConversion key={index} block={block as any} />;
          case 'botonCTA':
            return <BotonCTA key={index} block={block as any} />;
          case 'faq':
            return <FAQ key={index} block={block as any} />;
          case 'content':
            return <ContentBlock key={index} block={block as any} />;
          case 'contentAcordeon':
            return <ContentAcordeon key={index} block={block as any} />;
          default:
            return <div key={index} className="text-orange-500 p-2 bg-orange-50">Bloque no reconocido: {blockType}</div>;
        }
      })}
    </>
  );
}

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
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
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
            return null;
        }
      })}
    </>
  );
}

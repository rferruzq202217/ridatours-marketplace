// components/guias/FAQ.tsx
'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import type { FAQBlock } from '@/lib/payload';

type Pregunta = FAQBlock['preguntas'][number];

// Extraer texto plano del rich text de Payload
function extractText(richText: any): string {
  if (!richText?.root?.children) return '';
  
  const extract = (nodes: any[]): string => {
    return nodes
      .map((node) => {
        if (node.text) return node.text;
        if (node.children) return extract(node.children);
        return '';
      })
      .join(' ');
  };
  
  return extract(richText.root.children);
}

// Renderizar rich text simple
function RenderRichText({ data }: { data: any }) {
  if (!data?.root?.children) return null;

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (node.text) {
      let element: React.ReactNode = node.text;
      if (node.bold) element = <strong key={index}>{element}</strong>;
      if (node.italic) element = <em key={index}>{element}</em>;
      return element;
    }

    if (node.type === 'paragraph') {
      return (
        <p key={index} className="mb-2 last:mb-0">
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </p>
      );
    }

    if (node.type === 'list') {
      const Tag = node.listType === 'number' ? 'ol' : 'ul';
      return (
        <Tag key={index} className={clsx('mb-2 pl-5', node.listType === 'number' ? 'list-decimal' : 'list-disc')}>
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </Tag>
      );
    }

    if (node.type === 'listitem') {
      return (
        <li key={index}>
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </li>
      );
    }

    if (node.type === 'link') {
      return (
        <a 
          key={index} 
          href={node.fields?.url || '#'} 
          className="text-green-600 hover:underline"
          target={node.fields?.newTab ? '_blank' : undefined}
          rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
        >
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </a>
      );
    }

    if (node.children) {
      return node.children.map((child: any, i: number) => renderNode(child, i));
    }

    return null;
  };

  return <>{data.root.children.map((node: any, i: number) => renderNode(node, i))}</>;
}

function FAQItem({ 
  pregunta, 
  isOpen, 
  onToggle 
}: { 
  pregunta: Pregunta; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-4 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 pr-4">{pregunta.pregunta}</span>
        <ChevronDown 
          className={clsx(
            'flex-shrink-0 w-5 h-5 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <div
        className={clsx(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-4 pb-5 text-gray-600">
          <RenderRichText data={pregunta.respuesta} />
        </div>
      </div>
    </div>
  );
}

interface Props {
  block: FAQBlock;
}

export default function FAQ({ block }: Props) {
  const { titulo, preguntas, generarSchema } = block;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!preguntas || preguntas.length === 0) return null;

  // Schema JSON-LD para SEO
  const faqSchema = generarSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: preguntas.map((p) => ({
          '@type': 'Question',
          name: p.pregunta,
          acceptedAnswer: {
            '@type': 'Answer',
            text: extractText(p.respuesta),
          },
        })),
      }
    : null;

  return (
    <div className="my-12">
      {/* Schema JSON-LD */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Título */}
      {titulo && (
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
          {titulo}
        </h2>
      )}

      {/* Acordeón */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {preguntas.map((pregunta, index) => (
          <FAQItem
            key={index}
            pregunta={pregunta}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}

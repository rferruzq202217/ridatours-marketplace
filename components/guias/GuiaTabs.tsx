// components/guias/GuiaTabs.tsx
'use client';

import { useState } from 'react';
import { BookOpen, HelpCircle } from 'lucide-react';
import RenderBlocks from './RenderBlocks';
import FAQ from './FAQ';

interface GuiaTabsProps {
  blocks: any[];
  lang?: string;
}

export default function GuiaTabs({ blocks, lang = 'es' }: GuiaTabsProps) {
  const [activeTab, setActiveTab] = useState('contenido');

  // DEBUG
  console.log('GuiaTabs received blocks:', blocks?.length);
  console.log('GuiaTabs block types:', blocks?.map((b: any) => b.blockType));

  // Separar bloques FAQ del resto
  const faqBlocks = blocks?.filter((block: any) => block.blockType === 'faq') || [];
  const contentBlocks = blocks?.filter((block: any) => block.blockType !== 'faq') || [];

  console.log('Content blocks:', contentBlocks?.length);
  console.log('FAQ blocks:', faqBlocks?.length);

  const texts: Record<string, { content: string; faq: string }> = {
    es: { content: 'Guía completa', faq: 'Preguntas frecuentes' },
    en: { content: 'Complete guide', faq: 'FAQ' },
    fr: { content: 'Guide complet', faq: 'Questions fréquentes' },
    it: { content: 'Guida completa', faq: 'Domande frequenti' },
    de: { content: 'Vollständiger Reiseführer', faq: 'Häufige Fragen' },
  };

  const txt = texts[lang] || texts.es;

  const tabs = [
    { id: 'contenido', label: txt.content, icon: BookOpen, count: contentBlocks.length },
    { id: 'faq', label: txt.faq, icon: HelpCircle, count: faqBlocks.length > 0 ? faqBlocks[0]?.preguntas?.length : 0 },
  ];

  return (
    <div>
      {/* DEBUG INFO */}
      <div className="bg-yellow-100 p-4 mb-4 text-sm">
        <p>DEBUG GuiaTabs:</p>
        <p>Total blocks: {blocks?.length || 0}</p>
        <p>Content blocks: {contentBlocks?.length || 0}</p>
        <p>FAQ blocks: {faqBlocks?.length || 0}</p>
        <p>Block types: {blocks?.map((b: any) => b.blockType).join(', ') || 'none'}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-base font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Contenido Tab */}
        {activeTab === 'contenido' && (
          <div className="prose prose-lg max-w-none">
            <RenderBlocks blocks={contentBlocks} />
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div>
            {faqBlocks.length > 0 ? (
              faqBlocks.map((block: any, index: number) => (
                <FAQ key={index} block={block} />
              ))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">
                  {lang === 'es' ? 'No hay preguntas frecuentes disponibles.' : 'No FAQ available.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

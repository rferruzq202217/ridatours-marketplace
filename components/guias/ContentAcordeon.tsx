'use client'

import { useState } from 'react'
import { ChevronDown, Clock, MapPin, DollarSign, List, Info, Star, Ticket, Camera, User } from 'lucide-react'
import { clsx } from 'clsx'

const iconMap: Record<string, React.ElementType> = {
  clock: Clock,
  location: MapPin,
  money: DollarSign,
  list: List,
  info: Info,
  star: Star,
  ticket: Ticket,
  camera: Camera,
  person: User,
}

// Renderizar rich text de Payload
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
          className="text-emerald-600 hover:underline"
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

interface AcordeonItem {
  id?: string
  titulo?: string
  icono?: string
  contenido?: any
  abiertoPorDefecto?: boolean
}

interface ContentAcordeonBlock {
  blockType: 'contentAcordeon'
  titulo?: string
  subtitulo?: string
  items?: AcordeonItem[]
  permitirMultiplesAbiertos?: boolean
  estilo?: 'cards' | 'minimal' | 'bordered' | 'shadowed'
}

interface Props {
  block: ContentAcordeonBlock
}

export default function ContentAcordeon({ block }: Props) {
  const { titulo, subtitulo, items = [], permitirMultiplesAbiertos = true, estilo = 'cards' } = block

  const [openItems, setOpenItems] = useState<Set<number>>(() => {
    const initial = new Set<number>()
    items.forEach((item, index) => {
      if (item.abiertoPorDefecto) initial.add(index)
    })
    return initial
  })

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        if (!permitirMultiplesAbiertos) {
          newSet.clear()
        }
        newSet.add(index)
      }
      return newSet
    })
  }

  const estiloClasses: Record<string, { container: string; item: string; header: string }> = {
    cards: {
      container: 'space-y-3',
      item: 'bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden',
      header: 'hover:bg-gray-50',
    },
    minimal: {
      container: 'space-y-0 divide-y divide-gray-200',
      item: '',
      header: 'hover:bg-gray-50',
    },
    bordered: {
      container: 'space-y-3',
      item: 'border-2 border-gray-200 rounded-lg overflow-hidden',
      header: 'hover:bg-gray-50',
    },
    shadowed: {
      container: 'space-y-4',
      item: 'bg-white rounded-xl shadow-md overflow-hidden',
      header: 'hover:bg-gray-50',
    },
  }

  const classes = estiloClasses[estilo] || estiloClasses.cards

  if (!items || items.length === 0) return null

  return (
    <section className="py-8">
      {(titulo || subtitulo) && (
        <div className="mb-6">
          {titulo && <h2 className="text-2xl font-bold text-gray-900 mb-2">{titulo}</h2>}
          {subtitulo && <p className="text-gray-600">{subtitulo}</p>}
        </div>
      )}

      <div className={classes.container}>
        {items.map((item, index) => {
          const isOpen = openItems.has(index)
          const IconComponent = item.icono && item.icono !== 'none' ? iconMap[item.icono] : null

          return (
            <div key={item.id || index} className={classes.item}>
              <button
                onClick={() => toggleItem(index)}
                className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors ${classes.header}`}
              >
                <div className="flex items-center gap-3">
                  {IconComponent && (
                    <IconComponent className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  )}
                  <span className="font-semibold text-gray-900">{item.titulo}</span>
                </div>
                <ChevronDown
                  className={clsx(
                    'w-5 h-5 text-gray-500 transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>

              <div
                className={clsx(
                  'overflow-hidden transition-all duration-300',
                  isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="px-5 pb-4 text-gray-700">
                  {item.contenido && <RenderRichText data={item.contenido} />}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

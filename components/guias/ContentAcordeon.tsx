'use client'

import { useState } from 'react'
import { ChevronDown, Clock, MapPin, DollarSign, List, Info, Star, Ticket, Camera, User } from 'lucide-react'
import RichText from './RichText'

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
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-4 text-gray-700">
                  {item.contenido && <RichText content={item.contenido} />}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

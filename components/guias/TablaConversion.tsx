// components/guias/TablaConversion.tsx
import { clsx } from 'clsx';
import { Check, Star } from 'lucide-react';
import type { TablaConversionBlock } from '@/lib/payload';

type Producto = TablaConversionBlock['productos'][number];

function ProductCard({ producto }: { producto: Producto }) {
  const {
    nombre,
    descripcionCorta,
    precio,
    precioOriginal,
    urlAfiliado,
    textoCTA,
    destacado,
    etiquetaDestacado,
    caracteristicas,
  } = producto;

  return (
    <div
      className={clsx(
        'relative rounded-2xl border-2 p-6 transition-all hover:shadow-xl',
        destacado
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 bg-white hover:border-green-300',
      )}
    >
      {/* Etiqueta destacado */}
      {destacado && etiquetaDestacado && (
        <div className="absolute -top-3 left-4 bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full flex items-center gap-1">
          <Star size={14} className="fill-current" />
          {etiquetaDestacado}
        </div>
      )}

      {/* Nombre y descripción */}
      <div className="mb-4 mt-2">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{nombre}</h3>
        {descripcionCorta && (
          <p className="text-gray-600 text-sm">{descripcionCorta}</p>
        )}
      </div>

      {/* Características */}
      {caracteristicas && caracteristicas.length > 0 && (
        <ul className="mb-4 space-y-2">
          {caracteristicas.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
              <Check className="text-green-500 flex-shrink-0" size={16} />
              {item.texto}
            </li>
          ))}
        </ul>
      )}

      {/* Precio */}
      <div className="mb-5">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{precio}</span>
          {precioOriginal && (
            <span className="text-lg text-gray-400 line-through">
              {precioOriginal}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">por persona</p>
      </div>

      {/* CTA Button */}
      <a
        href={urlAfiliado}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'block w-full text-center py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02]',
          destacado
            ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30'
            : 'bg-gray-900 text-white hover:bg-gray-800',
        )}
      >
        {textoCTA || 'Reservar ahora'}
      </a>
    </div>
  );
}

function ProductRow({ producto }: { producto: Producto }) {
  const {
    nombre,
    descripcionCorta,
    precio,
    precioOriginal,
    urlAfiliado,
    textoCTA,
    destacado,
    etiquetaDestacado,
  } = producto;

  return (
    <tr
      className={clsx(
        'border-b border-gray-100',
        destacado && 'bg-green-50',
      )}
    >
      <td className="py-5 px-4">
        <div className="flex items-center gap-3">
          {destacado && etiquetaDestacado && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
              {etiquetaDestacado}
            </span>
          )}
          <div>
            <div className="font-semibold text-gray-900">{nombre}</div>
            {descripcionCorta && (
              <div className="text-sm text-gray-500">{descripcionCorta}</div>
            )}
          </div>
        </div>
      </td>
      <td className="py-5 px-4 text-right">
        <div className="font-bold text-gray-900 text-lg">{precio}</div>
        {precioOriginal && (
          <div className="text-sm text-gray-400 line-through">{precioOriginal}</div>
        )}
      </td>
      <td className="py-5 px-4 text-right">
        <a
          href={urlAfiliado}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-green-600 transition-all text-sm"
        >
          {textoCTA || 'Reservar'}
        </a>
      </td>
    </tr>
  );
}

interface Props {
  block: TablaConversionBlock;
}

export default function TablaConversion({ block }: Props) {
  const { tituloTabla, subtitulo, productos, estiloTabla } = block;

  const estilo = estiloTabla ?? 'cards';

  if (!productos || productos.length === 0) return null;

  return (
    <div className="my-12">
      {/* Header */}
      {(tituloTabla || subtitulo) && (
        <div className="text-center mb-8">
          {tituloTabla && (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {tituloTabla}
            </h2>
          )}
          {subtitulo && (
            <p className="text-gray-600">{subtitulo}</p>
          )}
        </div>
      )}

      {/* Cards Layout */}
      {estilo === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto, index) => (
            <ProductCard key={index} producto={producto} />
          ))}
        </div>
      )}

      {/* Table Layout */}
      {estilo === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Entrada</th>
                <th className="text-right py-4 px-4 font-semibold text-gray-900">Precio</th>
                <th className="text-right py-4 px-4 font-semibold text-gray-900">Reservar</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <ProductRow key={index} producto={producto} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* List Layout */}
      {estilo === 'list' && (
        <div className="space-y-4">
          {productos.map((producto, index) => (
            <div
              key={index}
              className={clsx(
                'flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2',
                producto.destacado
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white',
              )}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {producto.destacado && producto.etiquetaDestacado && (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {producto.etiquetaDestacado}
                    </span>
                  )}
                  <span className="font-bold text-gray-900">{producto.nombre}</span>
                </div>
                {producto.descripcionCorta && (
                  <p className="text-sm text-gray-600 mt-1">{producto.descripcionCorta}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-lg">{producto.precio}</div>
                  {producto.precioOriginal && (
                    <div className="text-sm text-gray-400 line-through">
                      {producto.precioOriginal}
                    </div>
                  )}
                </div>
                <a
                  href={producto.urlAfiliado}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-green-600 transition-all text-sm whitespace-nowrap"
                >
                  {producto.textoCTA || 'Reservar'}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

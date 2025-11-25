import Image from 'next/image';
import Link from 'next/link';

export default function ContactBlock() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-xl bg-indigo-100 pt-8 px-0 sm:px-8">
          <div className="flex flex-col-reverse sm:flex-row sm:items-center">
            <div className="relative w-[294px] h-[183px] flex-none max-w-[90%] mx-1 overflow-hidden">
              <img 
                src="https://cdn.tiqets.com/static/assets/webpack/cs-girl.svg" 
                alt="Soporte al cliente"
                className="absolute left-1/2 top-1/2 h-[200%] w-[200%] max-w-none -translate-x-1/2 -translate-y-1/2"
                loading="lazy"
              />
            </div>
            <div className="px-8">
              <h2 className="mb-4 mt-0 text-xl sm:text-2xl xl:text-3xl font-bold text-gray-900">
                ¿Necesitas ayuda?
              </h2>
              <p className="mt-0 mb-4 text-gray-700">
                Visita nuestro Centro de Ayuda para obtener respuestas rápidas o chatea con nuestro equipo de soporte. Estamos aquí las 24 horas del día
              </p>
              <Link 
                href="https://support.tiqets.com/lang/es"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-8 inline-flex items-center justify-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
              >
                Pide ayuda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

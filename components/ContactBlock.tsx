export default function ContactBlock() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-xl text-gray-900 bg-indigo-100 pt-8 px-0 sm:px-8 overflow-hidden">
          <div className="flex flex-col-reverse sm:flex-row sm:items-end">
            <div className="relative flex-none w-[294px] h-[220px] -mb-1">
              <img 
                className="absolute bottom-0 left-0 w-full h-auto"
                src="https://cdn.tiqets.com/static/assets/webpack/cs-girl.svg" 
                alt=""
                loading="lazy"
              />
            </div>
            <div className="px-8 pb-8">
              <h2 className="mb-4 mt-0 text-2xl xl:text-[2rem] font-bold text-indigo-900">¿Necesitas ayuda?</h2>
              <p className="mt-0 mb-4 text-gray-700">Visita nuestro Centro de Ayuda para obtener respuestas rápidas o chatea con nuestro equipo de soporte. Estamos aquí las 24 horas del día</p>
              <a 
                className="inline-flex justify-center items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                href="https://support.tiqets.com/lang/es"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pide ayuda
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactBlock() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-xl text-gray-900 bg-indigo-100 pt-8 px-0 sm:px-8">
          <div className="flex flex-col-reverse sm:flex-row sm:items-center">
            <div style={{ width: '294px', height: '183px' }} className="relative overflow-hidden flex-none max-w-[90%] mx-1">
              <img 
                className="absolute left-1/2 top-1/2 h-[200%] w-[200%] max-w-none -translate-x-1/2 -translate-y-1/2"
                src="https://cdn.tiqets.com/static/assets/webpack/cs-girl.svg" 
                alt=""
                loading="lazy"
              />
            </div>
            <div className="px-8">
              <h2 className="mb-4 mt-0 sm:text-2xl xl:text-[2rem] font-bold">¿Necesitas ayuda?</h2>
              <p className="mt-0 mb-4">Visita nuestro Centro de Ayuda para obtener respuestas rápidas o chatea con nuestro equipo de soporte. Estamos aquí las 24 horas del día</p>
              <a 
                className="mb-8 mr-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white active:translate-y-px rounded-lg border border-transparent text-center focus:ring-2 focus:ring-offset-2 relative font-medium inline-flex justify-center items-center no-underline duration-100 transition ease-in-out text-base py-2 px-3"
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

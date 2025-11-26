'use client';
import { getMessages, Locale } from '@/lib/i18n';

interface ContactBlockProps {
  lang?: string;
}

export default function ContactBlock({ lang = 'es' }: ContactBlockProps) {
  const texts: Record<string, Record<string, string>> = {
    title: {
      es: '¿Necesitas ayuda?',
      en: 'Need help?',
      fr: 'Besoin d\'aide?',
      it: 'Hai bisogno di aiuto?',
      de: 'Brauchen Sie Hilfe?'
    },
    description: {
      es: 'Visita nuestro Centro de Ayuda para obtener respuestas rápidas o chatea con nuestro equipo de soporte. Estamos aquí las 24 horas del día',
      en: 'Visit our Help Center for quick answers or chat with our support team. We\'re here 24/7',
      fr: 'Visitez notre Centre d\'aide pour des réponses rapides ou discutez avec notre équipe de support. Nous sommes là 24h/24',
      it: 'Visita il nostro Centro assistenza per risposte rapide o chatta con il nostro team di supporto. Siamo qui 24 ore su 24',
      de: 'Besuchen Sie unser Hilfezentrum für schnelle Antworten oder chatten Sie mit unserem Support-Team. Wir sind rund um die Uhr für Sie da'
    },
    button: {
      es: 'Pide ayuda',
      en: 'Get help',
      fr: 'Obtenir de l\'aide',
      it: 'Chiedi aiuto',
      de: 'Hilfe anfordern'
    }
  };

  const supportUrls: Record<string, string> = {
    es: 'https://support.tiqets.com/lang/es',
    en: 'https://support.tiqets.com/lang/en',
    fr: 'https://support.tiqets.com/lang/fr',
    it: 'https://support.tiqets.com/lang/it',
    de: 'https://support.tiqets.com/lang/de'
  };

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
              <h2 className="mb-4 mt-0 text-2xl xl:text-[2rem] font-bold text-indigo-900">
                {texts.title[lang] || texts.title.es}
              </h2>
              <p className="mt-0 mb-4 text-gray-700">
                {texts.description[lang] || texts.description.es}
              </p>
              <a 
                className="inline-flex justify-center items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                href={supportUrls[lang] || supportUrls.es}
                target="_blank"
                rel="noopener noreferrer"
              >
                {texts.button[lang] || texts.button.es}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

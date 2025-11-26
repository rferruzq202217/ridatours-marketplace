export const locales = ['es', 'en', 'fr', 'it', 'de'] as const;
export const defaultLocale = 'es' as const;
export type Locale = (typeof locales)[number];

import es from '@/messages/es.json';
import en from '@/messages/en.json';
import fr from '@/messages/fr.json';
import it from '@/messages/it.json';
import de from '@/messages/de.json';

const messages: Record<Locale, typeof es> = { es, en, fr, it, de };

export function getMessages(locale: Locale) {
  return messages[locale] || messages.es;
}

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = messages[locale] || messages.es;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

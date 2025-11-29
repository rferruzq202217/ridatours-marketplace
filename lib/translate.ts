import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api.deepl.com/v2/translate';

// Mapeo de códigos de idioma para DeepL
const langMap: Record<string, string> = {
  es: 'ES',
  en: 'EN',
  fr: 'FR',
  it: 'IT',
  de: 'DE'
};

/**
 * Traduce un texto usando caché + DeepL
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'es'
): Promise<string> {
  console.log('🌐 translateText called:', { text: text?.substring(0, 50), targetLang, sourceLang });
  console.log('🔑 DEEPL_API_KEY exists:', !!DEEPL_API_KEY);

  // Si es el mismo idioma, devolver original
  if (targetLang === sourceLang || !text || text.trim() === '') {
    return text;
  }

  // Buscar en caché
  const { data: cached, error: cacheError } = await supabase
    .from('translations_cache')
    .select('translated_text')
    .eq('source_text', text)
    .eq('target_lang', targetLang)
    .single();

  if (cached) {
    console.log('✅ Found in cache');
    return cached.translated_text;
  }

  if (!DEEPL_API_KEY) {
    console.error('❌ No DEEPL_API_KEY configured');
    return text;
  }

  // Traducir con DeepL
  try {
    console.log('🚀 Calling DeepL API...');
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        source_lang: langMap[sourceLang] || 'ES',
        target_lang: langMap[targetLang] || 'EN',
      }),
    });

    console.log('📡 DeepL response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DeepL error:', response.status, errorText);
      return text;
    }

    const data = await response.json();
    console.log('✅ DeepL response:', data);
    const translatedText = data.translations?.[0]?.text || text;

    // Guardar en caché
    const { error: insertError } = await supabase
      .from('translations_cache')
      .insert({
        source_text: text,
        source_lang: sourceLang,
        target_lang: targetLang,
        translated_text: translatedText,
      });

    if (insertError) {
      console.log('⚠️ Cache insert error:', insertError.message);
    } else {
      console.log('💾 Saved to cache');
    }

    return translatedText;
  } catch (error) {
    console.error('❌ Translation error:', error);
    return text;
  }
}

/**
 * Traduce múltiples textos en batch (más eficiente)
 */
export async function translateBatch(
  texts: string[],
  targetLang: string,
  sourceLang: string = 'es'
): Promise<string[]> {
  console.log('🌐 translateBatch called:', { count: texts.length, targetLang });

  if (targetLang === sourceLang) {
    console.log('⏭️ Same language, skipping');
    return texts;
  }

  // Filtrar textos vacíos y crear mapa de índices
  const validTexts = texts.map((t, i) => ({ text: t?.trim() || '', index: i }))
    .filter(t => t.text !== '');

  if (validTexts.length === 0) {
    return texts;
  }

  // Buscar todos en caché
  const { data: cached } = await supabase
    .from('translations_cache')
    .select('source_text, translated_text')
    .eq('target_lang', targetLang)
    .in('source_text', validTexts.map(t => t.text));

  const cacheMap = new Map(cached?.map(c => [c.source_text, c.translated_text]) || []);
  console.log('💾 Found in cache:', cacheMap.size, 'of', validTexts.length);
  
  // Separar los que hay que traducir
  const toTranslate = validTexts.filter(t => !cacheMap.has(t.text));
  console.log('🔄 Need to translate:', toTranslate.length);

  // Traducir los que faltan con DeepL
  if (toTranslate.length > 0 && DEEPL_API_KEY) {
    try {
      const response = await fetch(DEEPL_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams([
          ...toTranslate.map(t => ['text', t.text]),
          ['source_lang', langMap[sourceLang] || 'ES'],
          ['target_lang', langMap[targetLang] || 'EN'],
        ]),
      });

      console.log('📡 DeepL batch response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        const translations = data.translations || [];

        // Guardar en caché y actualizar mapa
        const inserts = toTranslate.map((t, i) => ({
          source_text: t.text,
          source_lang: sourceLang,
          target_lang: targetLang,
          translated_text: translations[i]?.text || t.text,
        }));

        // Guardar en caché
        await supabase
          .from('translations_cache')
          .upsert(inserts, { onConflict: 'source_text,target_lang' });

        // Actualizar mapa
        inserts.forEach(ins => cacheMap.set(ins.source_text, ins.translated_text));
        console.log('✅ Translated and cached:', inserts.length);
      } else {
        const errorText = await response.text();
        console.error('❌ DeepL batch error:', errorText);
      }
    } catch (error) {
      console.error('❌ Batch translation error:', error);
    }
  }

  // Reconstruir array con traducciones
  return texts.map(t => {
    const trimmed = t?.trim() || '';
    return trimmed ? (cacheMap.get(trimmed) || t) : t;
  });
}

/**
 * Traduce un objeto con campos específicos
 */
export async function translateObject<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[],
  targetLang: string,
  sourceLang: string = 'es'
): Promise<T> {
  if (targetLang === sourceLang) {
    return obj;
  }

  const textsToTranslate = fields.map(f => String(obj[f] || ''));
  const translated = await translateBatch(textsToTranslate, targetLang, sourceLang);

  const result = { ...obj };
  fields.forEach((field, i) => {
    (result as any)[field] = translated[i];
  });

  return result;
}

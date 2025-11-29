import { translateBatch } from './translate';

/**
 * Traduce un array de experiencias (solo campos visibles)
 */
export async function translateExperiences(
  experiences: any[],
  targetLang: string
): Promise<any[]> {
  if (targetLang === 'es' || experiences.length === 0) {
    return experiences;
  }

  // Extraer títulos para traducir en batch
  const titles = experiences.map(e => e.title || '');
  const translatedTitles = await translateBatch(titles, targetLang);

  return experiences.map((exp, i) => ({
    ...exp,
    title: translatedTitles[i] || exp.title
  }));
}

/**
 * Traduce un array de ciudades (descripción si existe)
 */
export async function translateCities(
  cities: any[],
  targetLang: string
): Promise<any[]> {
  if (targetLang === 'es' || cities.length === 0) {
    return cities;
  }

  const descriptions = cities.map(c => c.description || '');
  const translated = await translateBatch(descriptions, targetLang);

  return cities.map((city, i) => ({
    ...city,
    description: translated[i] || city.description
  }));
}

/**
 * Traduce campos de un monumento
 */
export async function translateMonument(
  monument: any,
  targetLang: string
): Promise<any> {
  if (targetLang === 'es' || !monument) {
    return monument;
  }

  const fields = [
    monument.name || '',
    monument.hero_title || '',
    monument.hero_subtitle || '',
    monument.description || '',
  ];

  const translated = await translateBatch(fields, targetLang);

  // Traducir arrays
  const whyVisit = monument.why_visit?.length 
    ? await translateBatch(monument.why_visit, targetLang)
    : monument.why_visit;

  const whatToSee = monument.what_to_see?.length
    ? await translateBatch(monument.what_to_see, targetLang)
    : monument.what_to_see;

  const practicalTips = monument.practical_tips?.length
    ? await translateBatch(monument.practical_tips, targetLang)
    : monument.practical_tips;

  // Traducir FAQ
  let faq = monument.faq;
  if (faq?.length) {
    const questions = faq.map((f: any) => f.question || '');
    const answers = faq.map((f: any) => f.answer || '');
    const [transQ, transA] = await Promise.all([
      translateBatch(questions, targetLang),
      translateBatch(answers, targetLang)
    ]);
    faq = faq.map((f: any, i: number) => ({
      question: transQ[i],
      answer: transA[i]
    }));
  }

  return {
    ...monument,
    name: translated[0] || monument.name,
    hero_title: translated[1] || monument.hero_title,
    hero_subtitle: translated[2] || monument.hero_subtitle,
    description: translated[3] || monument.description,
    why_visit: whyVisit,
    what_to_see: whatToSee,
    practical_tips: practicalTips,
    faq
  };
}

/**
 * Traduce un array de categorías
 */
export async function translateCategories(
  categories: any[],
  targetLang: string
): Promise<any[]> {
  if (targetLang === 'es' || categories.length === 0) {
    return categories;
  }

  const names = categories.map(c => c.name || '');
  const translatedNames = await translateBatch(names, targetLang);

  return categories.map((cat, i) => ({
    ...cat,
    name: translatedNames[i] || cat.name
  }));
}

// Traducir guía del CMS
export async function translateGuia(
  guia: any,
  targetLang: string
): Promise<any> {
  if (targetLang === 'es' || !guia) return guia;

  const textsToTranslate = [
    guia.title || '',
  ];

  // Extraer heroIntro si existe
  let heroIntro = '';
  if (guia.hero?.richText?.root?.children) {
    heroIntro = guia.hero.richText.root.children
      .map((node: any) => node.children?.map((child: any) => child.text).join('') || '')
      .join(' ')
      .trim();
  }
  textsToTranslate.push(heroIntro);

  const translated = await translateBatch(textsToTranslate, targetLang);

  return {
    ...guia,
    title: translated[0] || guia.title,
    _translatedHeroIntro: translated[1] || heroIntro,
  };
}

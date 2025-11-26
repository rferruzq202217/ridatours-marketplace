import { translateBatch } from './translate';

interface Experience {
  title: string;
  description: string | null;
  long_description: string | null;
  highlights: string[] | null;
  includes: string[] | null;
  not_includes: string[] | null;
  meeting_point: string | null;
  important_info: string | null;
  cancellation_policy: string | null;
  [key: string]: any;
}

export async function translateExperience(
  experience: Experience,
  targetLang: string
): Promise<Experience> {
  if (targetLang === 'es') {
    return experience;
  }

  // Campos de texto simple
  const simpleFields = [
    experience.title,
    experience.description || '',
    experience.long_description || '',
    experience.meeting_point || '',
    experience.important_info || '',
    experience.cancellation_policy || '',
  ];

  // Traducir campos simples
  const translatedSimple = await translateBatch(simpleFields, targetLang);

  // Traducir arrays
  const highlights = experience.highlights?.length 
    ? await translateBatch(experience.highlights, targetLang)
    : experience.highlights;

  const includes = experience.includes?.length
    ? await translateBatch(experience.includes, targetLang)
    : experience.includes;

  const notIncludes = experience.not_includes?.length
    ? await translateBatch(experience.not_includes, targetLang)
    : experience.not_includes;

  return {
    ...experience,
    title: translatedSimple[0],
    description: translatedSimple[1] || null,
    long_description: translatedSimple[2] || null,
    meeting_point: translatedSimple[3] || null,
    important_info: translatedSimple[4] || null,
    cancellation_policy: translatedSimple[5] || null,
    highlights,
    includes,
    not_includes: notIncludes,
  };
}

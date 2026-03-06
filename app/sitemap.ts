import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LANGUAGES = ['es', 'en', 'fr', 'it', 'de'];
const BASE_URL = 'https://www.ridatours.com';

export default async function sitemap() {
  const urls: { url: string; lastModified: Date; changeFrequency: string; priority: number }[] = [];

  // Páginas estáticas por idioma
  for (const lang of LANGUAGES) {
    urls.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
    
    urls.push({
      url: `${BASE_URL}/${lang}/populares`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });
    
    urls.push({
      url: `${BASE_URL}/${lang}/mundo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });
    
    urls.push({
      url: `${BASE_URL}/${lang}/recomendaciones`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  // Ciudades
  const { data: cities } = await supabase.from('cities').select('slug, updated_at');
  for (const city of cities || []) {
    for (const lang of LANGUAGES) {
      urls.push({
        url: `${BASE_URL}/${lang}/${city.slug}`,
        lastModified: new Date(city.updated_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  // Categorías
  const { data: categories } = await supabase.from('categories').select('slug');
  for (const cat of categories || []) {
    for (const lang of LANGUAGES) {
      urls.push({
        url: `${BASE_URL}/${lang}/categoria/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Experiencias
  const { data: experiences } = await supabase
    .from('experiences')
    .select('slug, updated_at, cities(slug)')
    .eq('active', true);
    
  for (const exp of experiences || []) {
    const citySlug = (exp.cities as any)?.slug;
    if (citySlug) {
      for (const lang of LANGUAGES) {
        urls.push({
          url: `${BASE_URL}/${lang}/${citySlug}/${exp.slug}`,
          lastModified: new Date(exp.updated_at || new Date()),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  }

  // Monumentos
  const { data: monuments } = await supabase
    .from('monuments')
    .select('slug, updated_at, cities(slug)');
    
  for (const mon of monuments || []) {
    const citySlug = (mon.cities as any)?.slug;
    if (citySlug) {
      for (const lang of LANGUAGES) {
        urls.push({
          url: `${BASE_URL}/${lang}/${citySlug}/monumentos/${mon.slug}`,
          lastModified: new Date(mon.updated_at || new Date()),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }
  }

  // Blog posts (Payload CMS)
  try {
    const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || process.env.PAYLOAD_URL || 'https://ridatours-cms.vercel.app';
    const postsRes = await fetch(`${PAYLOAD_URL}/api/posts?limit=100&where[_status][equals]=published`);
    if (postsRes.ok) {
      const postsData = await postsRes.json();
      for (const lang of LANGUAGES) {
        urls.push({ url: `${BASE_URL}/${lang}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 });
      }
      for (const post of postsData.docs || []) {
        for (const lang of LANGUAGES) {
          urls.push({ url: `${BASE_URL}/${lang}/blog/${post.slug}`, lastModified: new Date(post.updatedAt || new Date()), changeFrequency: 'monthly', priority: 0.7 });
        }
      }
    }
  } catch (e) { console.error('Sitemap blog error', e); }

  // Guías de viaje (Payload CMS)
  try {
    const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || process.env.PAYLOAD_URL || 'https://ridatours-cms.vercel.app';
    const pagesRes = await fetch(`${PAYLOAD_URL}/api/pages?limit=100&depth=1`);
    if (pagesRes.ok) {
      const pagesData = await pagesRes.json();
      for (const lang of LANGUAGES) {
        urls.push({ url: `${BASE_URL}/${lang}/guias`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 });
      }
      for (const page of pagesData.docs || []) {
        for (const lang of LANGUAGES) {
          urls.push({ url: `${BASE_URL}/${lang}/guias/${page.slug}`, lastModified: new Date(page.updatedAt || new Date()), changeFrequency: 'monthly', priority: 0.7 });
        }
      }
    }
  } catch (e) { console.error('Sitemap guias error', e); }

  return urls;
}

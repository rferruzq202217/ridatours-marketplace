import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  // Query EXACTA de la home
  const { data: allExperiences, error: expError } = await supabase
    .from('experiences')
    .select(`
      id, title, slug, description, price, rating, reviews, duration, main_image, featured, city_id,
      cities(slug, name)
    `)
    .eq('active', true)
    .order('created_at', { ascending: false });

  const experiencesRaw = allExperiences?.map((exp: any) => ({
    city: exp.cities?.slug || '',
    slug: exp.slug,
    title: exp.title,
    cityName: exp.cities?.name || '',
    image: exp.main_image || '',
    price: exp.price,
    rating: exp.rating,
    reviews: exp.reviews,
    duration: exp.duration || '',
    featured: exp.featured
  })) || [];

  const popularActivities = experiencesRaw.filter(e => e.featured || e.reviews > 5000).slice(0, 6);
  const worldBest = experiencesRaw.filter(e => e.rating >= 4.7).slice(0, 6);
  const ridatoursRecommended = experiencesRaw.slice(0, 6);

  return NextResponse.json({
    queryError: expError,
    totalExperiences: allExperiences?.length || 0,
    experiencesRawCount: experiencesRaw.length,
    sampleRaw: experiencesRaw.slice(0, 3),
    sections: {
      popularActivities: { count: popularActivities.length, items: popularActivities },
      worldBest: { count: worldBest.length, items: worldBest },
      ridatoursRecommended: { count: ridatoursRecommended.length, items: ridatoursRecommended }
    }
  });
}

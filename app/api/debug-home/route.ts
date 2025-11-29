import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: experiences, error: expError } = await supabase
    .from('experiences')
    .select('id, title, rating, reviews, featured, active')
    .eq('active', true)
    .limit(10);

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .limit(10);

  const { data: cities, error: citiesError } = await supabase
    .from('cities')
    .select('id, name, slug')
    .limit(5);

  const popularCount = experiences?.filter(e => e.featured || e.reviews > 5000).length || 0;
  const worldBestCount = experiences?.filter(e => e.rating >= 4.7).length || 0;

  return NextResponse.json({
    experiences: { count: experiences?.length, sample: experiences?.slice(0,3), error: expError },
    categories: { count: categories?.length, sample: categories?.slice(0,3), error: catError },
    cities: { count: cities?.length, sample: cities, error: citiesError },
    filters: { popularCount, worldBestCount },
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
  });
}

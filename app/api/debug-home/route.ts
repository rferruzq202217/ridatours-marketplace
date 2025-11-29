import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: cities, error: citiesError } = await supabase
    .from('cities')
    .select('id, name, slug')
    .limit(3);

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name, slug')
    .limit(3);

  const { data: experiences, error: experiencesError } = await supabase
    .from('experiences')
    .select('id, title, slug')
    .eq('active', true)
    .limit(3);

  return NextResponse.json({
    cities: { data: cities, error: citiesError },
    categories: { data: categories, error: categoriesError },
    experiences: { data: experiences, error: experiencesError }
  });
}

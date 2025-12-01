import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: city } = await supabase
    .from('cities')
    .select('id, name')
    .eq('slug', 'roma')
    .single();

  const { data: experiences, error } = await supabase
    .from('experiences')
    .select(`
      id, title, active,
      experience_categories(category_id, categories(id, name, slug))
    `)
    .eq('city_id', city?.id)
    .eq('active', true)
    .limit(5);

  return NextResponse.json({
    city,
    experiencesCount: experiences?.length,
    experiences,
    error: error?.message
  });
}

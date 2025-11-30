import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const monumentId = '5245634d-7ab6-4583-b261-d1052a127ba0'; // Coliseo

  const { data: categories, error: catError } = await supabase
    .from('monument_categories')
    .select('*')
    .eq('monument_id', monumentId);

  const { data: experiences, error: expError } = await supabase
    .from('monument_recommended_experiences')
    .select('*')
    .eq('monument_id', monumentId);

  const { data: crossSelling, error: crossError } = await supabase
    .from('monument_cross_selling')
    .select('*')
    .eq('monument_id', monumentId);

  return NextResponse.json({
    monumentId,
    categories: { data: categories, error: catError?.message },
    experiences: { data: experiences, error: expError?.message },
    crossSelling: { data: crossSelling, error: crossError?.message }
  });
}

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: monuments, error } = await supabase
    .from('monuments')
    .select('id, name, slug, city_id')
    .limit(50);

  const { data: cities } = await supabase
    .from('cities')
    .select('id, name, slug')
    .limit(20);

  return NextResponse.json({ 
    monuments: monuments || [], 
    cities: cities || [],
    error: error?.message 
  });
}

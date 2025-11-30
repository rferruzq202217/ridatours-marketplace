import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: monument } = await supabase
    .from('monuments')
    .select('*')
    .eq('slug', 'coliseo-romano')
    .single();

  const { data: monumentExperiences, error: expError } = await supabase
    .from('monument_experiences')
    .select('*')
    .limit(10);

  return NextResponse.json({ 
    monument,
    monumentExperiences,
    expError: expError?.message
  });
}

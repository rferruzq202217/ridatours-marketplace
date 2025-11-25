const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data } = await supabase
    .from('experiences')
    .select('title, tiqets_venue_id, tiqets_campaign, slug')
    .ilike('title', '%Palacio Real%')
    .single();

  console.log('📊 Datos del Palacio Real:');
  console.log(JSON.stringify(data, null, 2));
}

check();

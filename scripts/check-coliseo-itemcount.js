const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase
    .from('monuments')
    .select('name, tiqets_venue_id, tiqets_campaign, tiqets_item_count')
    .ilike('name', '%Coliseo%')
    .single();
  
  if (error) {
    console.log('❌ Error:', error.message);
    console.log('Probablemente no ejecutaste el SQL en Supabase');
    return;
  }
  
  console.log('📊 Datos del Coliseo:');
  console.log(JSON.stringify(data, null, 2));
}

check();

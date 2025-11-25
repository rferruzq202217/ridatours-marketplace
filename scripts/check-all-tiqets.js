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
    .not('tiqets_venue_id', 'is', null);

  console.log('📊 Experiencias con widgets de Tiqets:\n');
  data?.forEach(exp => {
    console.log(`${exp.title}`);
    console.log(`  Venue ID: ${exp.tiqets_venue_id}`);
    console.log(`  Campaign: ${exp.tiqets_campaign}`);
    console.log(`  Slug: ${exp.slug}\n`);
  });
}

check();

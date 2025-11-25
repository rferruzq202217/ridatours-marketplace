const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fix() {
  const wrongVenues = ['974045', '974046'];
  
  for (const venueId of wrongVenues) {
    const { data, error } = await supabase
      .from('experiences')
      .update({ 
        tiqets_venue_id: null,
        tiqets_campaign: null
      })
      .eq('tiqets_venue_id', venueId)
      .select('title');

    if (error) {
      console.error(`❌ Error con venue ${venueId}:`, error);
    } else if (data && data.length > 0) {
      console.log(`✅ Widget quitado de: ${data[0].title} (venue: ${venueId})`);
    }
  }
  
  console.log('\n✅ Limpieza completada');
}

fix();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  // Buscar Sevilla
  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .or('slug.eq.sevilla,slug.eq.seville,name.ilike.%sevilla%,name.ilike.%seville%');
  
  console.log('🏙️  Ciudades encontradas:', cities);
  
  // Buscar tour de Sevilla
  const { data: tour } = await supabase
    .from('experiences')
    .select('*, cities(name, slug)')
    .eq('slug', 'seville-cathedral-and-giralda')
    .single();
  
  console.log('\n📍 Tour:', tour);
  
  if (tour && tour.cities) {
    console.log(`\n✅ URL correcta:`);
    console.log(`   http://localhost:3000/es/${tour.cities.slug}/seville-cathedral-and-giralda`);
  } else {
    console.log('\n⚠️  El tour no tiene ciudad asignada');
  }
}

check();

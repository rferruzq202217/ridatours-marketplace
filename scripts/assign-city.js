const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function assignCity() {
  console.log('🏙️  Asignando ciudad a Sevilla tour...\n');
  
  // Ver qué ciudades existen
  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .order('name');
  
  // Buscar Sevilla
  const sevilla = cities.find(c => 
    c.name.toLowerCase().includes('sevilla') || 
    c.slug.includes('sevilla') ||
    c.name.toLowerCase().includes('seville')
  );
  
  if (!sevilla) {
    console.log('⚠️  No existe Sevilla. Creándola...');
    const { data: newCity } = await supabase
      .from('cities')
      .insert([{ name: 'Sevilla', slug: 'sevilla', country: 'España' }])
      .select()
      .single();
    
    console.log(`✅ Ciudad creada: ${newCity.name}\n`);
    
    await supabase
      .from('experiences')
      .update({ city_id: newCity.id })
      .eq('slug', 'seville-cathedral-and-giralda');
    
    console.log('✅ Tour asignado a Sevilla');
  } else {
    console.log(`✅ Sevilla existe: ${sevilla.name}\n`);
    
    await supabase
      .from('experiences')
      .update({ city_id: sevilla.id })
      .eq('slug', 'seville-cathedral-and-giralda');
    
    console.log('✅ Tour asignado a Sevilla');
  }
}

assignCity();

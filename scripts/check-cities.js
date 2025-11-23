const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase
    .from('cities')
    .select('id, name, slug, image, description')
    .order('name');
  
  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }
  
  console.log('📊 Ciudades en la base de datos:\n');
  data.forEach(city => {
    console.log('- ' + city.name + ' (/' + city.slug + ')');
    console.log('  Image: ' + (city.image ? '✓' : '✗'));
    console.log('  Description: ' + (city.description ? '✓' : '✗'));
    console.log('');
  });
  
  console.log('Total: ' + data.length + ' ciudades');
}

check();

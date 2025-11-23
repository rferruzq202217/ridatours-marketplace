const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  // Ver una categoría existente
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .limit(1)
    .single();
  
  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }
  
  console.log('📊 Columnas en categories:');
  console.log(Object.keys(data));
  console.log('\n¿Tiene icon_name?', 'icon_name' in data ? '✓' : '✗');
  
  if (!('icon_name' in data)) {
    console.log('\n⚠️ NECESITAS ejecutar este SQL en Supabase:');
    console.log('ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_name TEXT DEFAULT \'Landmark\';');
  }
}

check();

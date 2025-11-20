const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  console.log('🔍 Verificando experiencias en Supabase...\n');
  
  const { data, error, count } = await supabase
    .from('experiences')
    .select('id, title, slug, city_id, active', { count: 'exact' });
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log(`✅ Total: ${count} experiencias\n`);
  
  if (data && data.length > 0) {
    console.log('📋 Experiencias encontradas:');
    data.forEach(exp => {
      console.log(`  - ${exp.title}`);
      console.log(`    ID: ${exp.id}`);
      console.log(`    Slug: ${exp.slug}`);
      console.log(`    City ID: ${exp.city_id || 'NULL'}`);
      console.log(`    Active: ${exp.active}`);
      console.log('');
    });
  } else {
    console.log('⚠️  No hay experiencias en la BD');
  }
}

check();

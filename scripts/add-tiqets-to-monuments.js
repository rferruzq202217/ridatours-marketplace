const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function addColumns() {
  console.log('📝 Añadiendo columnas Tiqets a monuments...\n');
  
  try {
    const { data, error } = await supabase
      .from('monuments')
      .select('tiqets_venue_id, tiqets_campaign')
      .limit(1);
    
    if (!error) {
      console.log('✅ Las columnas ya existen!');
      return;
    }
    
    console.log('❌ No se pueden añadir columnas desde el cliente.');
    console.log('\n📋 Ve a Supabase Dashboard → SQL Editor y ejecuta:\n');
    console.log('ALTER TABLE monuments');
    console.log('ADD COLUMN IF NOT EXISTS tiqets_venue_id TEXT,');
    console.log('ADD COLUMN IF NOT EXISTS tiqets_campaign TEXT;');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

addColumns();

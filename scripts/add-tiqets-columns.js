const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function addColumns() {
  console.log('📝 Añadiendo columnas para Tiqets...\n');
  
  try {
    // Verificar si ya existen las columnas probando una query
    const { data, error } = await supabase
      .from('experiences')
      .select('tiqets_venue_id, tiqets_campaign')
      .limit(1);
    
    if (!error) {
      console.log('✅ Las columnas ya existen!');
      return;
    }
    
    console.log('❌ No se pueden añadir columnas desde el cliente.');
    console.log('\n📋 Ve a Supabase Dashboard:');
    console.log('   1. https://supabase.com/dashboard');
    console.log('   2. Selecciona tu proyecto');
    console.log('   3. Menú lateral → SQL Editor');
    console.log('   4. Click "+ New query"');
    console.log('   5. Pega este código:\n');
    console.log('ALTER TABLE experiences');
    console.log('ADD COLUMN IF NOT EXISTS tiqets_venue_id TEXT,');
    console.log('ADD COLUMN IF NOT EXISTS tiqets_campaign TEXT;');
    console.log('\n   6. Click "Run" (o Ctrl+Enter)');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

addColumns();

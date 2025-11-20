const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data } = await supabase
    .from('experiences')
    .select('*')
    .eq('slug', 'entrada-al-museo-vaticano-y-a-la-capilla-sixtina-con-audioguia')
    .single();
  
  console.log('📍 Vaticano - Campos con datos:\n');
  
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== '' && 
        (Array.isArray(data[key]) ? data[key].length > 0 : true)) {
      console.log(`✅ ${key}:`, 
        Array.isArray(data[key]) ? `[${data[key].length} items]` : 
        typeof data[key] === 'string' && data[key].length > 50 ? 
        data[key].substring(0, 50) + '...' : data[key]
      );
    }
  });
  
  console.log('\n❌ Campos vacíos:\n');
  Object.keys(data).forEach(key => {
    if (data[key] === null || data[key] === '' || 
        (Array.isArray(data[key]) && data[key].length === 0)) {
      console.log(`   - ${key}`);
    }
  });
}

check();

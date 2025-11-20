const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data } = await supabase
    .from('experiences')
    .select('id, title, main_image')
    .or('main_image.is.null,main_image.eq.');
  
  console.log('📸 Experiencias sin imagen:\n');
  data?.forEach(exp => {
    console.log(`- ${exp.title}`);
  });
  
  console.log(`\n⚠️  Total: ${data?.length || 0} experiencias sin imagen`);
  console.log('\nVe a /admin/experiences y añade imágenes a estas experiencias');
}

check();

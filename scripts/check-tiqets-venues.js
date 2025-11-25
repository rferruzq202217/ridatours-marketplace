const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://bfrswlydljsqalfvxfow.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcnN3bHlkbGpzcWFsZnZ4Zm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2NzI2ODAsImV4cCI6MjA0NzI0ODY4MH0.v94t7BesMvmdvlWKaAGCQPqkrRA8bPPOhGVNTLNQcmY'
);

async function checkTiqets() {
  const { data, error } = await supabase
    .from('experiences')
    .select('id, title, tiqets_venue_id, tiqets_campaign')
    .not('tiqets_venue_id', 'is', null);
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Experiencias con Tiqets configurado:', data.length);
  console.log('\n');
  data.forEach(exp => {
    console.log('---');
    console.log('Título:', exp.title);
    console.log('tiqets_venue_id:', exp.tiqets_venue_id);
    console.log('tiqets_campaign:', exp.tiqets_campaign);
  });
}

checkTiqets();

const fetch = require('node-fetch');

const WP_URL = 'https://www.candletours.es/wp-json/wp/v2';

async function testEndpoints() {
  const endpoints = [
    'tour',
    'tours',
    'travel_tour',
    'activity',
    'activities',
    'product',
    'products'
  ];
  
  console.log('🔍 Probando endpoints de tours...\n');
  
  for (const endpoint of endpoints) {
    try {
      const url = `${WP_URL}/${endpoint}?per_page=1`;
      console.log(`Probando: ${url}`);
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ¡ENCONTRADO! ${endpoint} tiene ${data.length} items\n`);
        console.log('📄 Campos disponibles:');
        if (data[0]) {
          console.log(Object.keys(data[0]));
          console.log('\n📝 Primer tour:');
          console.log(JSON.stringify(data[0], null, 2).substring(0, 2000));
        }
        return;
      } else {
        console.log(`❌ No existe: ${endpoint} (${response.status})\n`);
      }
    } catch (error) {
      console.log(`❌ Error: ${endpoint} - ${error.message}\n`);
    }
  }
  
  console.log('⚠️  No se encontró ningún endpoint de tours');
}

testEndpoints();

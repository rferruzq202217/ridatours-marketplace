const fetch = require('node-fetch');

const WP_URL = 'https://www.candletours.es/wp-json';

async function exploreAPI() {
  console.log('🔍 Explorando API de WordPress...\n');
  
  try {
    // Ver todos los endpoints disponibles
    const response = await fetch(WP_URL);
    const data = await response.json();
    
    console.log('📋 Endpoints disponibles:');
    console.log(JSON.stringify(data.routes, null, 2));
    
    // Buscar específicamente post types
    console.log('\n📦 Custom Post Types detectados:');
    const routes = Object.keys(data.routes);
    const postTypes = routes
      .filter(r => r.includes('/wp/v2/') && !r.includes('{'))
      .filter(r => !['posts', 'pages', 'media', 'comments', 'users'].includes(r.split('/').pop()));
    
    postTypes.forEach(pt => console.log(`  - ${pt}`));
    
    // Probar obtener tours
    console.log('\n🎯 Probando endpoint de tours...');
    const tourResponse = await fetch(`${WP_URL}/wp/v2/tour?per_page=2`);
    if (tourResponse.ok) {
      const tours = await tourResponse.json();
      console.log(`✅ Encontrados ${tours.length} tours`);
      console.log('\n📄 Muestra del primer tour:');
      console.log(JSON.stringify(tours[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

exploreAPI();

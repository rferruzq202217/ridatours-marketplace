const fetch = require('node-fetch');

async function getFullTour() {
  const tourId = 8739;
  const baseUrl = 'https://www.candletours.es/wp-json/wp/v2/tour/' + tourId;
  
  console.log('🎯 Obteniendo tour completo con metadatos...\n');
  
  try {
    const response = await fetch(baseUrl);
    const tour = await response.json();
    
    console.log('📋 TOUR BÁSICO:');
    console.log('ID:', tour.id);
    console.log('Título:', tour.title.rendered);
    console.log('Slug:', tour.slug);
    console.log('Excerpt:', tour.excerpt.rendered.substring(0, 200));
    
    console.log('\n📦 METADATOS (meta):');
    console.log(JSON.stringify(tour.meta, null, 2));
    
    // Intentar obtener ACF (Advanced Custom Fields)
    console.log('\n🔍 Buscando campos ACF...');
    const acfResponse = await fetch(baseUrl + '?_fields=acf');
    const acfData = await acfResponse.json();
    
    if (acfData.acf) {
      console.log('✅ ACF encontrado:');
      console.log(JSON.stringify(acfData.acf, null, 2));
    } else {
      console.log('❌ No hay campos ACF');
    }
    
    // Obtener todos los campos
    console.log('\n📄 TOUR COMPLETO (primeros 3000 caracteres):');
    console.log(JSON.stringify(tour, null, 2).substring(0, 3000));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getFullTour();

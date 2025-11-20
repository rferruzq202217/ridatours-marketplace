const fetch = require('node-fetch');

async function getTourMetas() {
  const tourId = 8739;
  
  console.log('🔍 Buscando metadatos del tema Travel Tour...\n');
  
  // 1. Obtener imagen destacada
  try {
    const tour = await fetch(`https://www.candletours.es/wp-json/wp/v2/tour/${tourId}`).then(r => r.json());
    
    if (tour.featured_media) {
      const media = await fetch(`https://www.candletours.es/wp-json/wp/v2/media/${tour.featured_media}`).then(r => r.json());
      console.log('🖼️  Imagen destacada:', media.source_url);
    }
  } catch (e) {
    console.log('❌ Error obteniendo imagen');
  }
  
  // 2. Ver si hay endpoint de taxonomías con info
  try {
    console.log('\n📂 Categorías del tour:');
    const cats = await fetch(`https://www.candletours.es/wp-json/wp/v2/tour_category?include=151`).then(r => r.json());
    console.log(cats);
  } catch (e) {}
  
  // 3. Intentar obtener con diferentes parámetros
  console.log('\n🔑 Intentando obtener postmeta...');
  
  const attempts = [
    `https://www.candletours.es/wp-json/wp/v2/tour/${tourId}?context=edit`,
    `https://www.candletours.es/wp-json/wp/v2/tour/${tourId}?_fields=id,title,meta,acf,tour_meta`,
    `https://www.candletours.es/wp-json/travel-tour/v1/tour/${tourId}`,
  ];
  
  for (const url of attempts) {
    try {
      console.log(`\nProbando: ${url}`);
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Respuesta:', JSON.stringify(data, null, 2).substring(0, 1500));
      } else {
        console.log(`❌ ${response.status}`);
      }
    } catch (e) {
      console.log(`❌ Error: ${e.message}`);
    }
  }
  
  console.log('\n💡 SUGERENCIA: Los datos pueden estar en el HTML del tour.');
  console.log('   Accede directamente a: https://www.candletours.es/tour/seville-cathedral-and-giralda/');
  console.log('   Y busca precio, duración en el código fuente.');
}

getTourMetas();

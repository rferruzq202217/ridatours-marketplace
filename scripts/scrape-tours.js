const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function scrapeTour(tourSlug) {
  const url = `https://www.candletours.es/tour/${tourSlug}/`;
  console.log(`🔍 Scrapeando: ${url}\n`);
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extraer datos del tema Travel Tour
    const tour = {
      title: $('h1.entry-title, .tour-title').first().text().trim(),
      price: $('.tour-price, .price, [class*="price"]').first().text().trim(),
      duration: $('.tour-duration, .duration, [class*="duration"]').first().text().trim(),
      description: $('.tour-description, .entry-content').first().text().trim().substring(0, 500),
      image: $('meta[property="og:image"]').attr('content') || $('.tour-image img, .featured-image img').first().attr('src'),
      rating: $('.rating, .tour-rating').first().text().trim(),
      reviews: $('.reviews-count, .review-count').first().text().trim(),
    };
    
    console.log('📋 Datos extraídos:');
    console.log(JSON.stringify(tour, null, 2));
    
    // Buscar en el HTML cualquier referencia a precio o duración
    console.log('\n🔍 Buscando patrones de precio...');
    const priceMatches = html.match(/(\$|€|USD|EUR)\s*\d+/gi);
    if (priceMatches) {
      console.log('Precios encontrados:', priceMatches.slice(0, 5));
    }
    
    console.log('\n🔍 Buscando patrones de duración...');
    const durationMatches = html.match(/\d+\s*(hour|hours|h|día|días|day|days)/gi);
    if (durationMatches) {
      console.log('Duraciones encontradas:', durationMatches.slice(0, 5));
    }
    
    // Buscar JSON-LD schema
    console.log('\n🔍 Buscando Schema.org data...');
    const scripts = $('script[type="application/ld+json"]');
    scripts.each((i, elem) => {
      try {
        const json = JSON.parse($(elem).html());
        if (json['@type'] === 'Product' || json['@type'] === 'TouristAttraction') {
          console.log('✅ Schema encontrado:', JSON.stringify(json, null, 2).substring(0, 1000));
        }
      } catch (e) {}
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

scrapeTour('seville-cathedral-and-giralda');

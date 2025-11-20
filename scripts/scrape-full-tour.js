const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function scrapeFull(slug) {
  const url = `https://www.candletours.es/tour/${slug}/`;
  console.log(`🔍 Scrapeando datos completos: ${url}\n`);
  
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  
  // Buscar Schema.org
  const scripts = $('script[type="application/ld+json"]');
  let schema = null;
  
  scripts.each((i, elem) => {
    try {
      const json = JSON.parse($(elem).html());
      if (json['@type'] === 'Product') {
        schema = json;
      }
    } catch (e) {}
  });
  
  console.log('📋 Schema.org Product:');
  console.log(JSON.stringify(schema, null, 2));
  
  // Buscar en el HTML
  console.log('\n🔍 Buscando más datos en el HTML...\n');
  
  // Highlights
  const highlights = [];
  $('.tour-highlights li, .highlights li, [class*="highlight"] li').each((i, el) => {
    highlights.push($(el).text().trim());
  });
  if (highlights.length > 0) {
    console.log('✅ Highlights encontrados:', highlights);
  }
  
  // Includes
  const includes = [];
  $('.included li, .includes li, [class*="include"] li').each((i, el) => {
    includes.push($(el).text().trim());
  });
  if (includes.length > 0) {
    console.log('✅ Includes encontrados:', includes);
  }
  
  // Languages
  const languages = [];
  $('.languages li, .language li').each((i, el) => {
    languages.push($(el).text().trim());
  });
  if (languages.length > 0) {
    console.log('✅ Languages encontrados:', languages);
  }
  
  console.log('\n💡 Nota: Si no aparecen datos, el tema de WordPress puede tener');
  console.log('   estructura diferente. Necesitamos ver el HTML real del tour.');
}

scrapeFull('seville-cathedral-and-giralda');

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function scrapeSchema(slug) {
  const url = `https://www.candletours.es/tour/${slug}/`;
  console.log(`🔍 Scrapeando: ${url}\n`);
  
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const scripts = $('script[type="application/ld+json"]');
  
  for (let i = 0; i < scripts.length; i++) {
    try {
      const json = JSON.parse($(scripts[i]).html());
      if (json['@type'] === 'Product') {
        return json;
      }
    } catch (e) {}
  }
  
  return null;
}

async function importOne() {
  const tourSlug = 'seville-cathedral-and-giralda';
  
  try {
    // 1. Obtener datos básicos de WordPress
    console.log('📦 Obteniendo datos de WordPress...');
    const wpResponse = await fetch(`https://www.candletours.es/wp-json/wp/v2/tour?slug=${tourSlug}`);
    const tours = await wpResponse.json();
    const tour = tours[0];
    
    console.log(`✅ Tour: ${tour.title.rendered}\n`);
    
    // 2. Scrapear Schema.org
    console.log('🔍 Extrayendo Schema.org...');
    const schema = await scrapeSchema(tourSlug);
    
    if (!schema) {
      throw new Error('No se encontró schema');
    }
    
    console.log(`✅ Precio: €${schema.offers.price}`);
    console.log(`✅ Imagen: ${schema.image}\n`);
    
    // 3. Verificar si ya existe
    const { data: existing } = await supabase
      .from('experiences')
      .select('id')
      .eq('slug', tourSlug)
      .single();
    
    if (existing) {
      console.log('⚠️  Este tour ya existe en Supabase');
      console.log('   Borrando para reimportar...\n');
      await supabase.from('experiences').delete().eq('id', existing.id);
    }
    
    // 4. Preparar datos
    const experience = {
      title: tour.title.rendered.replace(/&amp;/g, '&'),
      slug: tour.slug,
      description: schema.description || tour.excerpt.rendered.replace(/<[^>]*>/g, ''),
      main_image: schema.image,
      price: parseFloat(schema.offers.price),
      rating: 4.5,
      reviews: 127,
      duration: '1h 30min',
      active: true,
      city_id: null, // Lo asignaremos después
    };
    
    console.log('📝 Datos a importar:');
    console.log(JSON.stringify(experience, null, 2));
    console.log('');
    
    // 5. Insertar en Supabase
    console.log('💾 Insertando en Supabase...');
    const { data, error } = await supabase
      .from('experiences')
      .insert([experience])
      .select();
    
    if (error) throw error;
    
    console.log('\n✅ ¡IMPORTADO EXITOSAMENTE!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   URL: http://localhost:3000/es/[CITY]/${data[0].slug}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

importOne();

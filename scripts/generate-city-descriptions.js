const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateCityDescription(city) {
  const prompt = `Genera un texto de aproximadamente 400 palabras en español sobre ${city.name}, ${city.country || ''}.

El texto debe incluir:
1. Una introducción atractiva a la ciudad
2. Los monumentos y atracciones principales
3. Consejos prácticos para visitantes
4. Por qué es importante reservar entradas con antelación para las atracciones populares

Escribe en tono informativo pero amigable, como si fueras un experto en turismo. No uses títulos ni secciones, solo un texto fluido.

Descripción corta actual de la ciudad: ${city.description || 'No disponible'}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return message.content[0].text;
  } catch (error) {
    console.error(`Error generando descripción para ${city.name}:`, error.message);
    return null;
  }
}

async function updateCityDescription(cityId, description) {
  const { error } = await supabase
    .from('cities')
    .update({ description_long: description })
    .eq('id', cityId);

  if (error) {
    console.error(`Error actualizando ciudad ${cityId}:`, error.message);
    return false;
  }
  return true;
}

async function main() {
  console.log('🏙️  Generando descripciones de ciudades...\n');

  // Obtener todas las ciudades
  const { data: cities, error } = await supabase
    .from('cities')
    .select('id, name, slug, country, description, description_long')
    .order('name');

  if (error) {
    console.error('❌ Error obteniendo ciudades:', error.message);
    return;
  }

  console.log(`📊 Total de ciudades: ${cities.length}\n`);

  // Filtrar ciudades sin description_long
  const citiesToProcess = cities.filter(city => !city.description_long || city.description_long.trim() === '');

  console.log(`✏️  Ciudades a procesar: ${citiesToProcess.length}\n`);

  if (citiesToProcess.length === 0) {
    console.log('✅ Todas las ciudades ya tienen descripción larga');
    return;
  }

  const totalCities = cities.length;
  let processed = 0;
  let successful = 0;
  let failed = 0;

  // Procesar en batches de 5
  for (let i = 0; i < citiesToProcess.length; i += 5) {
    const batch = citiesToProcess.slice(i, i + 5);

    for (const city of batch) {
      processed++;
      const currentIndex = cities.findIndex(c => c.id === city.id) + 1;

      process.stdout.write(`Ciudad ${currentIndex}/${totalCities}: ${city.name}... `);

      const description = await generateCityDescription(city);

      if (description) {
        const updated = await updateCityDescription(city.id, description);
        if (updated) {
          console.log('✅');
          successful++;
        } else {
          console.log('❌ (error guardando)');
          failed++;
        }
      } else {
        console.log('❌ (error generando)');
        failed++;
      }

      // Pequeña pausa entre llamadas individuales
      await sleep(500);
    }

    // Pausa entre batches
    if (i + 5 < citiesToProcess.length) {
      console.log(`\n⏸️  Pausa de 2 segundos... (${processed}/${citiesToProcess.length})\n`);
      await sleep(2000);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📈 Resumen:');
  console.log(`   ✅ Exitosas: ${successful}`);
  console.log(`   ❌ Fallidas: ${failed}`);
  console.log(`   📊 Total procesadas: ${processed}`);
  console.log('='.repeat(50));
}

main();

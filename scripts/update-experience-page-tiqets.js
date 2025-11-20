const fs = require('fs');

const filePath = 'app/es/[city]/[slug]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

console.log('📝 Actualizando página de experiencia para Tiqets...\n');

// 1. Añadir import de TiqetsWidget
content = content.replace(
  "import RegiondoWidget from '@/components/RegiondoWidget';",
  `import RegiondoWidget from '@/components/RegiondoWidget';
import TiqetsWidget from '@/components/TiqetsWidget';`
);

// 2. Reemplazar el bloque del widget
const oldWidget = `                {experience.widget_id && (
                  <div className="mb-6">
                    <RegiondoWidget widgetId={experience.widget_id} />
                  </div>
                )}`;

const newWidget = `                {experience.tiqets_venue_id ? (
                  <div className="mb-6">
                    <TiqetsWidget 
                      venueId={experience.tiqets_venue_id}
                      campaign={experience.tiqets_campaign || ''}
                    />
                  </div>
                ) : experience.widget_id ? (
                  <div className="mb-6">
                    <RegiondoWidget widgetId={experience.widget_id} />
                  </div>
                ) : null}`;

content = content.replace(oldWidget, newWidget);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Página actualizada');
console.log('✅ Ahora usa TiqetsWidget si tiene tiqets_venue_id');
console.log('✅ Mantiene RegiondoWidget si tiene widget_id');
console.log('\nRecarga la página de la experiencia');

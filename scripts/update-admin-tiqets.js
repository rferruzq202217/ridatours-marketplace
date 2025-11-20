const fs = require('fs');

const filePath = 'app/admin/experiences/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

console.log('📝 Actualizando formulario para Tiqets...\n');

// 1. Añadir al interface (después de widget_id)
content = content.replace(
  'widget_id: string | null;',
  `widget_id: string | null;
  tiqets_venue_id: string | null;
  tiqets_campaign: string | null;`
);

// 2. Añadir al formData inicial
content = content.replace(
  "widget_id: '',",
  `widget_id: '',
    tiqets_venue_id: '',
    tiqets_campaign: '',`
);

// 3. Añadir al dataToSave
content = content.replace(
  'widget_id: formData.widget_id || null,',
  `widget_id: formData.widget_id || null,
        tiqets_venue_id: formData.tiqets_venue_id || null,
        tiqets_campaign: formData.tiqets_campaign || null,`
);

// 4. Añadir al handleEdit
content = content.replace(
  "widget_id: exp.widget_id || '',",
  `widget_id: exp.widget_id || '',
      tiqets_venue_id: exp.tiqets_venue_id || '',
      tiqets_campaign: exp.tiqets_campaign || '',`
);

// 5. Añadir al resetForm (segundo widget_id)
const resetFormMatch = content.match(/(widget_id: '',[\s\S]*?featured: false)/);
if (resetFormMatch) {
  content = content.replace(
    resetFormMatch[0],
    resetFormMatch[0].replace(
      "widget_id: '',",
      `widget_id: '',
      tiqets_venue_id: '',
      tiqets_campaign: '',`
    )
  );
}

// 6. Añadir campos visuales después de Widget ID
const widgetSection = `                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Widget ID (Regiondo)</label>
                    <input
                      type="text"
                      value={formData.widget_id}
                      onChange={(e) => setFormData({ ...formData, widget_id: e.target.value })}
                      placeholder="748f3583-4051-439f-a6e4-a688c9b28354"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                    />
                    <p className="text-sm text-gray-600 mt-1">ID del widget de Regiondo para reservas</p>
                  </div>`;

const tiqetsFields = `                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Widget ID (Regiondo)</label>
                    <input
                      type="text"
                      value={formData.widget_id}
                      onChange={(e) => setFormData({ ...formData, widget_id: e.target.value })}
                      placeholder="748f3583-4051-439f-a6e4-a688c9b28354"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                    />
                    <p className="text-sm text-gray-600 mt-1">ID del widget de Regiondo para reservas</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-md font-bold text-gray-900 mb-3">O usa Tiqets</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Tiqets Venue ID</label>
                        <input
                          type="text"
                          value={formData.tiqets_venue_id}
                          onChange={(e) => setFormData({ ...formData, tiqets_venue_id: e.target.value })}
                          placeholder="142007"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                        />
                        <p className="text-sm text-gray-600 mt-1">ID del venue en Tiqets</p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Tiqets Campaign</label>
                        <input
                          type="text"
                          value={formData.tiqets_campaign}
                          onChange={(e) => setFormData({ ...formData, tiqets_campaign: e.target.value })}
                          placeholder="Pantheon"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
                        />
                        <p className="text-sm text-gray-600 mt-1">Nombre de la campaña</p>
                      </div>
                    </div>
                  </div>`;

content = content.replace(widgetSection, tiqetsFields);

// Guardar
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Formulario actualizado con campos de Tiqets');
console.log('✅ Añadidos: tiqets_venue_id, tiqets_campaign');
console.log('\nRecarga /admin/experiences para ver los cambios');

const fs = require('fs');

const filePath = 'app/admin/monuments/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

console.log('📝 Actualizando admin de monumentos para Tiqets...\n');

// 1. Añadir al interface Monument (después de active)
content = content.replace(
  /active: boolean;(\s+)/,
  `active: boolean;
  tiqets_venue_id: string | null;
  tiqets_campaign: string | null;$1`
);

// 2. Añadir al formData inicial (después de active: true)
content = content.replace(
  /active: true,(\s+)/,
  `active: true,
    tiqets_venue_id: '',
    tiqets_campaign: '',$1`
);

// 3. Añadir al dataToSave (después de active)
content = content.replace(
  /active: formData\.active(\s+)/,
  `active: formData.active,
        tiqets_venue_id: formData.tiqets_venue_id || null,
        tiqets_campaign: formData.tiqets_campaign || null$1`
);

// 4. Añadir al handleEdit (después de active)
content = content.replace(
  /active: monument\.active,(\s+)/,
  `active: monument.active,
      tiqets_venue_id: monument.tiqets_venue_id || '',
      tiqets_campaign: monument.tiqets_campaign || '',$1`
);

// 5. Añadir al resetForm (después de active: true en resetForm)
const resetFormRegex = /(\s+active: true,)(\s+};\s+};)/;
content = content.replace(
  resetFormRegex,
  `$1
      tiqets_venue_id: '',
      tiqets_campaign: ''$2`
);

// 6. Añadir campos visuales (buscar la sección de "Activo" checkbox)
const checkboxSection = `                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div>
                        <span className="text-sm font-bold text-gray-900">Activo</span>
                        <p className="text-xs text-gray-600">Visible en el sitio web</p>
                      </div>
                    </label>`;

const withTiqets = `                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div>
                        <span className="text-sm font-bold text-gray-900">Activo</span>
                        <p className="text-xs text-gray-600">Visible en el sitio web</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* TIQETS WIDGET */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Widget Tiqets (Discovery)</h3>
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
                      <p className="text-sm text-gray-600 mt-1">ID del venue en Tiqets para mostrar productos</p>
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
                    </div`;

content = content.replace(checkboxSection, withTiqets);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Admin de monumentos actualizado con campos Tiqets');
console.log('✅ Añadidos: tiqets_venue_id, tiqets_campaign');
console.log('\nRecarga /admin/monuments para ver los cambios');

'use client';

import { useState } from 'react';
import { Check, X, MapPin, Info, Globe, Users, Sparkles, Shield, Star } from 'lucide-react';

interface ExperienceTabsProps {
  description: string | null;
  longDescription: string | null;
  cityName: string;
  highlights: string[];
  includes: string[] | null;
  notIncludes: string[] | null;
  meetingPoint: string | null;
  importantInfo: string | null;
  languages: string[] | null;
  accessibility: string | null;
  dressCode: string | null;
  restrictions: string | null;
  cancellationPolicy: string | null;
  rating: number;
  reviews: number;
}

export default function ExperienceTabs({
  description,
  longDescription,
  cityName,
  highlights,
  includes,
  notIncludes,
  meetingPoint,
  importantInfo,
  languages,
  accessibility,
  dressCode,
  restrictions,
  cancellationPolicy,
  rating,
  reviews
}: ExperienceTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Descripción' },
    { id: 'included', label: 'Incluido' },
    { id: 'info', label: 'Info' },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Highlights */}
            {highlights.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Lo más destacado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {highlights.map((highlight, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700 text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Acerca de esta experiencia</h3>
              <div className="text-gray-700 text-sm leading-relaxed">
                {longDescription ? (
                  <p className="whitespace-pre-line">{longDescription}</p>
                ) : description ? (
                  <p>{description}</p>
                ) : (
                  <p>Disfruta de esta increíble experiencia en {cityName}.</p>
                )}
              </div>
            </div>

            {/* Meeting Point */}
            {meetingPoint && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                  <MapPin className="text-blue-600" size={18} />
                  Punto de encuentro
                </h3>
                <p className="text-gray-700 text-sm">{meetingPoint}</p>
              </div>
            )}
          </div>
        )}

        {/* Included Tab */}
        {activeTab === 'included' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {includes && includes.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Check className="text-green-600" size={18} />
                    Qué incluye
                  </h3>
                  <ul className="space-y-2">
                    {includes.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <Check className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {notIncludes && notIncludes.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <X className="text-red-600" size={18} />
                    Qué NO incluye
                  </h3>
                  <ul className="space-y-2">
                    {notIncludes.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <X className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {!includes?.length && !notIncludes?.length && (
              <p className="text-gray-500 text-sm">No hay información disponible sobre lo que incluye esta experiencia.</p>
            )}
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Important Info */}
            {importantInfo && (
              <div className="bg-yellow-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                  <Info className="text-yellow-600" size={18} />
                  Información importante
                </h3>
                <p className="text-gray-700 text-sm whitespace-pre-line">{importantInfo}</p>
              </div>
            )}

            {/* Additional Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languages && languages.length > 0 && (
                <div className="flex items-start gap-3">
                  <Globe className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm mb-1">Idiomas</div>
                    <div className="text-sm text-gray-700">{languages.join(', ')}</div>
                  </div>
                </div>
              )}
              
              {accessibility && (
                <div className="flex items-start gap-3">
                  <Users className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm mb-1">Accesibilidad</div>
                    <div className="text-sm text-gray-700">{accessibility}</div>
                  </div>
                </div>
              )}
              
              {dressCode && (
                <div className="flex items-start gap-3">
                  <Sparkles className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm mb-1">Código de vestimenta</div>
                    <div className="text-sm text-gray-700">{dressCode}</div>
                  </div>
                </div>
              )}
              
              {restrictions && (
                <div className="flex items-start gap-3">
                  <Shield className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm mb-1">Restricciones</div>
                    <div className="text-sm text-gray-700">{restrictions}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Cancellation Policy */}
            {cancellationPolicy && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                  <Shield className="text-gray-600" size={18} />
                  Política de cancelación
                </h3>
                <p className="text-gray-700 text-sm">{cancellationPolicy}</p>
              </div>
            )}

            {!importantInfo && !languages?.length && !accessibility && !dressCode && !restrictions && !cancellationPolicy && (
              <p className="text-gray-500 text-sm">No hay información adicional disponible.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

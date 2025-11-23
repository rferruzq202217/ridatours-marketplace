'use client';
import { useState } from 'react';
import { 
  Landmark, Building2, Church, Palette, Music, UtensilsCrossed,
  Plane, Camera, Mountain, Waves, Trees, Sun, Moon, Star,
  Coffee, Wine, Pizza, IceCream, Utensils, ShoppingBag,
  Theater, Briefcase, GraduationCap, Heart, Sparkles
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'Landmark', icon: Landmark, label: 'Monumento' },
  { name: 'Building2', icon: Building2, label: 'Edificio' },
  { name: 'Church', icon: Church, label: 'Iglesia' },
  { name: 'Palette', icon: Palette, label: 'Arte' },
  { name: 'Music', icon: Music, label: 'Música' },
  { name: 'UtensilsCrossed', icon: UtensilsCrossed, label: 'Gastronomía' },
  { name: 'Plane', icon: Plane, label: 'Viaje' },
  { name: 'Camera', icon: Camera, label: 'Fotografía' },
  { name: 'Mountain', icon: Mountain, label: 'Montaña' },
  { name: 'Waves', icon: Waves, label: 'Playa' },
  { name: 'Trees', icon: Trees, label: 'Naturaleza' },
  { name: 'Sun', icon: Sun, label: 'Sol' },
  { name: 'Moon', icon: Moon, label: 'Noche' },
  { name: 'Star', icon: Star, label: 'Destacado' },
  { name: 'Coffee', icon: Coffee, label: 'Café' },
  { name: 'Wine', icon: Wine, label: 'Vino' },
  { name: 'Pizza', icon: Pizza, label: 'Comida' },
  { name: 'IceCream', icon: IceCream, label: 'Helado' },
  { name: 'Utensils', icon: Utensils, label: 'Restaurante' },
  { name: 'ShoppingBag', icon: ShoppingBag, label: 'Compras' },
  { name: 'Theater', icon: Theater, label: 'Teatro' },
  { name: 'Briefcase', icon: Briefcase, label: 'Negocios' },
  { name: 'GraduationCap', icon: GraduationCap, label: 'Educación' },
  { name: 'Heart', icon: Heart, label: 'Favorito' },
  { name: 'Sparkles', icon: Sparkles, label: 'Especial' },
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedIcon = AVAILABLE_ICONS.find(i => i.name === value) || AVAILABLE_ICONS[0];
  const SelectedIconComponent = selectedIcon.icon;

  return (
    <div className="relative">
      <label className="block text-sm font-bold text-gray-900 mb-2">Icono</label>
      
      {/* Botón selector */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500 focus:outline-none text-left flex items-center gap-3"
      >
        <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
          <SelectedIconComponent size={24} />
        </div>
        <div>
          <div className="font-semibold text-gray-900">{selectedIcon.label}</div>
          <div className="text-xs text-gray-500">{selectedIcon.name}</div>
        </div>
      </button>

      {/* Panel de iconos */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-2xl p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map((iconData) => {
                const IconComponent = iconData.icon;
                return (
                  <button
                    key={iconData.name}
                    type="button"
                    onClick={() => {
                      onChange(iconData.name);
                      setIsOpen(false);
                    }}
                    className={`p-3 rounded-lg border-2 hover:border-blue-500 transition-all flex flex-col items-center gap-2 ${
                      value === iconData.name 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <IconComponent size={28} className="text-gray-700" />
                    <span className="text-xs text-gray-600 text-center leading-tight">
                      {iconData.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { AVAILABLE_ICONS };

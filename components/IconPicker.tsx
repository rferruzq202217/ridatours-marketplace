'use client';
import { useState } from 'react';
import { 
  Landmark, Building2, Church, Palette, Music, UtensilsCrossed,
  Plane, Camera, Mountain, Waves, Trees, Sun, Moon, Star,
  Coffee, Wine, Pizza, IceCream, Utensils, ShoppingBag,
  Theater, Briefcase, GraduationCap, Heart, Sparkles,
  Bike, Ticket, Train, Bus, Ship, Ferry, Map, Compass,
  Luggage, Hotel, Key, Phone, Info, Backpack, Castle,
  Tent, Anchor, Flag, Fish, PartyPopper, Gift, Trophy,
  Crown, Zap, Flame, Droplet, Wind, Leaf, Globe,
  Users, User, Baby, Dog, Cat, Bird
} from 'lucide-react';

const AVAILABLE_ICONS = [
  // Monumentos y lugares
  { name: 'Landmark', icon: Landmark, label: 'Monumento' },
  { name: 'Building2', icon: Building2, label: 'Edificio' },
  { name: 'Church', icon: Church, label: 'Iglesia' },
  { name: 'Castle', icon: Castle, label: 'Castillo' },
  { name: 'Mountain', icon: Mountain, label: 'Montaña' },
  { name: 'Waves', icon: Waves, label: 'Playa/Agua' },
  { name: 'Trees', icon: Trees, label: 'Naturaleza' },
  { name: 'Tent', icon: Tent, label: 'Camping' },
  
  // Transporte
  { name: 'Plane', icon: Plane, label: 'Avión' },
  { name: 'Train', icon: Train, label: 'Tren' },
  { name: 'Bus', icon: Bus, label: 'Autobús' },
  { name: 'Ship', icon: Ship, label: 'Barco' },
  { name: 'Ferry', icon: Ferry, label: 'Ferry' },
  { name: 'Bike', icon: Bike, label: 'Bicicleta' },
  
  // Turismo y viajes
  { name: 'Ticket', icon: Ticket, label: 'Entradas' },
  { name: 'Map', icon: Map, label: 'Mapa' },
  { name: 'Compass', icon: Compass, label: 'Brújula' },
  { name: 'Luggage', icon: Luggage, label: 'Maleta' },
  { name: 'Backpack', icon: Backpack, label: 'Mochila' },
  { name: 'Camera', icon: Camera, label: 'Fotografía' },
  { name: 'Globe', icon: Globe, label: 'Mundo' },
  
  // Alojamiento
  { name: 'Hotel', icon: Hotel, label: 'Hotel' },
  { name: 'Key', icon: Key, label: 'Llave/Acceso' },
  
  // Cultura y entretenimiento
  { name: 'Palette', icon: Palette, label: 'Arte' },
  { name: 'Music', icon: Music, label: 'Música' },
  { name: 'Theater', icon: Theater, label: 'Teatro' },
  { name: 'PartyPopper', icon: PartyPopper, label: 'Fiesta' },
  
  // Gastronomía
  { name: 'UtensilsCrossed', icon: UtensilsCrossed, label: 'Gastronomía' },
  { name: 'Utensils', icon: Utensils, label: 'Restaurante' },
  { name: 'Coffee', icon: Coffee, label: 'Café' },
  { name: 'Wine', icon: Wine, label: 'Vino' },
  { name: 'Pizza', icon: Pizza, label: 'Comida' },
  { name: 'IceCream', icon: IceCream, label: 'Helado' },
  
  // Actividades
  { name: 'Anchor', icon: Anchor, label: 'Actividades acuáticas' },
  { name: 'Flag', icon: Flag, label: 'Golf/Deporte' },
  { name: 'Trophy', icon: Trophy, label: 'Competición' },
  { name: 'Fish', icon: Fish, label: 'Pesca/Acuario' },
  
  // Compras y servicios
  { name: 'ShoppingBag', icon: ShoppingBag, label: 'Compras' },
  { name: 'Gift', icon: Gift, label: 'Regalos' },
  { name: 'Briefcase', icon: Briefcase, label: 'Negocios' },
  { name: 'GraduationCap', icon: GraduationCap, label: 'Educación' },
  
  // Personas y grupos
  { name: 'Users', icon: Users, label: 'Grupos' },
  { name: 'User', icon: User, label: 'Individual' },
  { name: 'Baby', icon: Baby, label: 'Niños/Familia' },
  
  // Animales
  { name: 'Dog', icon: Dog, label: 'Perros/Zoo' },
  { name: 'Cat', icon: Cat, label: 'Gatos' },
  { name: 'Bird', icon: Bird, label: 'Aves' },
  
  // Elementos naturales
  { name: 'Sun', icon: Sun, label: 'Sol/Día' },
  { name: 'Moon', icon: Moon, label: 'Noche' },
  { name: 'Star', icon: Star, label: 'Destacado' },
  { name: 'Leaf', icon: Leaf, label: 'Ecológico' },
  { name: 'Droplet', icon: Droplet, label: 'Agua' },
  { name: 'Wind', icon: Wind, label: 'Viento' },
  { name: 'Flame', icon: Flame, label: 'Fuego' },
  { name: 'Zap', icon: Zap, label: 'Rápido/Energía' },
  
  // Otros
  { name: 'Heart', icon: Heart, label: 'Favorito' },
  { name: 'Sparkles', icon: Sparkles, label: 'Especial' },
  { name: 'Crown', icon: Crown, label: 'Premium' },
  { name: 'Info', icon: Info, label: 'Información' },
  { name: 'Phone', icon: Phone, label: 'Contacto' },
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const selectedIcon = AVAILABLE_ICONS.find(i => i.name === value) || AVAILABLE_ICONS[0];
  const SelectedIconComponent = selectedIcon.icon;

  const filteredIcons = search
    ? AVAILABLE_ICONS.filter(i => 
        i.label.toLowerCase().includes(search.toLowerCase()) ||
        i.name.toLowerCase().includes(search.toLowerCase())
      )
    : AVAILABLE_ICONS;

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
          <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-2xl p-4 max-h-[500px] overflow-y-auto">
            {/* Buscador */}
            <input
              type="text"
              placeholder="Buscar icono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-4 focus:border-blue-500 focus:outline-none"
            />
            
            <div className="text-xs text-gray-500 mb-2">
              {filteredIcons.length} iconos disponibles
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {filteredIcons.map((iconData) => {
                const IconComponent = iconData.icon;
                return (
                  <button
                    key={iconData.name}
                    type="button"
                    onClick={() => {
                      onChange(iconData.name);
                      setIsOpen(false);
                      setSearch('');
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

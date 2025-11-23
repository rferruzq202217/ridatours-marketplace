import { 
  Landmark, Building2, Church, Palette, Music, UtensilsCrossed,
  Plane, Camera, Mountain, Waves, Trees, Sun, Moon, Star,
  Coffee, Wine, Pizza, Utensils, ShoppingBag,
  Theater, Briefcase, GraduationCap, Heart, Sparkles,
  Bike, Ticket, Train, Bus, Ship, Map, Compass,
  Luggage, Hotel, Key, Info, Backpack,
  Tent, Anchor, Flag, Trophy,
  Crown, Zap, Flame, Droplet, Wind, Leaf, Globe,
  Users, User, Baby, Dog,
  type LucideIcon
} from 'lucide-react';

export interface IconData {
  name: string;
  icon: LucideIcon;
  label: string;
}

export const AVAILABLE_ICONS: IconData[] = [
  // Monumentos y lugares
  { name: 'Landmark', icon: Landmark, label: 'Monumento' },
  { name: 'Building2', icon: Building2, label: 'Edificio' },
  { name: 'Church', icon: Church, label: 'Iglesia' },
  { name: 'Mountain', icon: Mountain, label: 'Montaña' },
  { name: 'Waves', icon: Waves, label: 'Playa/Agua' },
  { name: 'Trees', icon: Trees, label: 'Naturaleza' },
  { name: 'Tent', icon: Tent, label: 'Camping' },
  
  // Transporte
  { name: 'Plane', icon: Plane, label: 'Avión' },
  { name: 'Train', icon: Train, label: 'Tren' },
  { name: 'Bus', icon: Bus, label: 'Autobús' },
  { name: 'Ship', icon: Ship, label: 'Barco' },
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
  
  // Gastronomía
  { name: 'UtensilsCrossed', icon: UtensilsCrossed, label: 'Gastronomía' },
  { name: 'Utensils', icon: Utensils, label: 'Restaurante' },
  { name: 'Coffee', icon: Coffee, label: 'Café' },
  { name: 'Wine', icon: Wine, label: 'Vino' },
  { name: 'Pizza', icon: Pizza, label: 'Comida' },
  
  // Actividades
  { name: 'Anchor', icon: Anchor, label: 'Náutica' },
  { name: 'Flag', icon: Flag, label: 'Tours' },
  { name: 'Trophy', icon: Trophy, label: 'Deportes' },
  
  // Compras y servicios
  { name: 'ShoppingBag', icon: ShoppingBag, label: 'Compras' },
  { name: 'Briefcase', icon: Briefcase, label: 'Negocios' },
  { name: 'GraduationCap', icon: GraduationCap, label: 'Educación' },
  
  // Personas y grupos
  { name: 'Users', icon: Users, label: 'Grupos' },
  { name: 'User', icon: User, label: 'Individual' },
  { name: 'Baby', icon: Baby, label: 'Niños/Familia' },
  { name: 'Dog', icon: Dog, label: 'Mascotas' },
  
  // Elementos naturales
  { name: 'Sun', icon: Sun, label: 'Sol/Día' },
  { name: 'Moon', icon: Moon, label: 'Noche' },
  { name: 'Star', icon: Star, label: 'Destacado' },
  { name: 'Leaf', icon: Leaf, label: 'Ecológico' },
  { name: 'Droplet', icon: Droplet, label: 'Agua' },
  { name: 'Wind', icon: Wind, label: 'Viento' },
  { name: 'Flame', icon: Flame, label: 'Popular' },
  { name: 'Zap', icon: Zap, label: 'Rápido' },
  
  // Otros
  { name: 'Heart', icon: Heart, label: 'Favorito' },
  { name: 'Sparkles', icon: Sparkles, label: 'Especial' },
  { name: 'Crown', icon: Crown, label: 'Premium' },
  { name: 'Info', icon: Info, label: 'Información' },
];

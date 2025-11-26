export type Language = 'es' | 'en' | 'fr' | 'it' | 'de';

export interface Monument {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  category: string;
}

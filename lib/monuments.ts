import { Monument } from './types';

export const romaMonuments: Monument[] = [
  {
    id: '1',
    name: 'Coliseo Romano',
    slug: 'coliseo',
    description: 'El anfiteatro más grande del mundo romano',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    price: 45,
    rating: 4.8,
    reviews: 12543,
    duration: '3 horas',
    category: 'Monumento'
  },
  {
    id: '2',
    name: 'Museos Vaticanos',
    slug: 'vaticano',
    description: 'Capilla Sixtina y obras maestras del arte',
    image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800',
    price: 35,
    rating: 4.9,
    reviews: 8920,
    duration: '2 horas',
    category: 'Museo'
  }
];

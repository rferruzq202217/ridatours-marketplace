// lib/payload.ts
const PAYLOAD_URL = process.env.PAYLOAD_CMS_URL || 'http://localhost:3001';

export interface PayloadPage {
  id: number;
  title: string;
  slug: string;
  hero?: {
    type?: string;
    richText?: any;
    media?: PayloadMedia;
    links?: any[];
  };
  layout: PayloadBlock[];
  meta?: {
    title?: string;
    description?: string;
    image?: PayloadMedia;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadMedia {
  id: number;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  sizes?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
    xlarge?: { url: string };
    og?: { url: string };
  };
}

export type PayloadBlock =
  | AlertaConfianzaBlock
  | TablaConversionBlock
  | BotonCTABlock
  | FAQBlock
  | ContentBlock;

export interface AlertaConfianzaBlock {
  blockType: 'alertaConfianza';
  id?: string;
  icono?: string;
  titulo: string;
  mensaje: string;
  estilo?: 'info' | 'success' | 'warning' | 'danger' | 'highlight';
}

export interface TablaConversionBlock {
  blockType: 'tablaConversion';
  id?: string;
  tituloTabla?: string;
  subtitulo?: string;
  productos: {
    id?: string;
    nombre: string;
    descripcionCorta?: string;
    precio: string;
    precioOriginal?: string;
    urlAfiliado: string;
    textoCTA: string;
    destacado?: boolean;
    etiquetaDestacado?: string;
    caracteristicas?: { texto: string }[];
  }[];
  estiloTabla?: 'cards' | 'table' | 'list';
}

export interface BotonCTABlock {
  blockType: 'botonCTA';
  id?: string;
  texto: string;
  subtexto?: string;
  url: string;
  estilo?: 'primary' | 'secondary' | 'urgent' | 'success' | 'outline';
  tamano?: 'large' | 'medium' | 'small';
  anchoCompleto?: boolean;
  abrirEnNuevaVentana?: boolean;
}

export interface FAQBlock {
  blockType: 'faq';
  id?: string;
  titulo?: string;
  preguntas: {
    id?: string;
    pregunta: string;
    respuesta: any;
  }[];
  generarSchema?: boolean;
  estiloAcordeon?: 'classic' | 'modern' | 'minimal';
}

export interface ContentBlock {
  blockType: 'content';
  id?: string;
  columns?: {
    id?: string;
    size?: 'oneThird' | 'half' | 'twoThirds' | 'full';
    richText?: any;
    enableLink?: boolean;
    link?: any;
  }[];
}

export function getMediaUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${PAYLOAD_URL}${url}`;
}

export async function getPage(slug: string): Promise<PayloadPage | null> {
  try {
    const res = await fetch(
      `${PAYLOAD_URL}/api/pages?where[slug][equals]=${slug}&depth=2`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

export async function getAllPages(): Promise<PayloadPage[]> {
  try {
    const res = await fetch(
      `${PAYLOAD_URL}/api/pages?limit=100&depth=1`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

export const getGuia = getPage;
export const getAllGuias = getAllPages;
export type PayloadGuia = PayloadPage;

// === POSTS/BLOG ===

export interface PayloadPost {
  id: number;
  title: string;
  slug: string;
  heroImage?: PayloadMedia;
  content?: any; // Lexical rich text
  categories?: { id: number; title: string; slug: string }[];
  authors?: { id: number; name: string }[];
  populatedAuthors?: { id: number; name: string }[];
  meta?: {
    title?: string;
    description?: string;
    image?: PayloadMedia;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  _status?: string;
}

export async function getPost(slug: string): Promise<PayloadPost | null> {
  try {
    const res = await fetch(
      `${PAYLOAD_URL}/api/posts?where[slug][equals]=${slug}&depth=2`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getAllPosts(): Promise<PayloadPost[]> {
  try {
    const res = await fetch(
      `${PAYLOAD_URL}/api/posts?limit=100&depth=1&where[_status][equals]=published`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

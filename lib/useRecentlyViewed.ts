'use client';

import { useState, useEffect } from 'react';

interface ViewedProduct {
  slug: string;
  city: string;
  title: string;
  timestamp: number;
}

export function useRecentlyViewed() {
  const [viewed, setViewed] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    // Leer cookies al cargar
    const cookies = document.cookie;
    const match = cookies.match(/recentlyViewed=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setViewed(data);
      } catch (e) {
        console.error('Error parsing cookies:', e);
      }
    }
  }, []);

  const addProduct = (product: { slug: string; city: string; title: string }) => {
    const newViewed = [
      { ...product, timestamp: Date.now() },
      ...viewed.filter(v => v.slug !== product.slug) // Evitar duplicados
    ].slice(0, 10); // Máximo 10 productos

    setViewed(newViewed);
    
    // Guardar en cookie (expira en 30 días)
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `recentlyViewed=${encodeURIComponent(JSON.stringify(newViewed))}; expires=${expires.toUTCString()}; path=/`;
  };

  return { viewed, addProduct };
}

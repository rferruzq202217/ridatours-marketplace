'use client';

import { useState, useEffect } from 'react';

interface ViewedProduct {
  id: string;
  city: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  duration: string;
}

export function useRecentlyViewed() {
  const [viewed, setViewed] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    // Leer cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const cookieValue = getCookie('recentlyViewed');
    if (cookieValue) {
      try {
        const data = JSON.parse(decodeURIComponent(cookieValue));
        setViewed(data);
      } catch (e) {
        console.error('Error parsing recentlyViewed cookie:', e);
      }
    }
  }, []);

  return { viewed };
}

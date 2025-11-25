'use client';
import { useEffect } from 'react';

export default function TiqetsScriptLoader() {
  useEffect(() => {
    // Verificar si ya existe el script
    const existingScript = document.querySelector('script[src*="widgets.tiqets.com"]');
    if (existingScript) {
      console.log('✅ Script de Tiqets ya existe');
      return;
    }

    console.log('📦 Cargando script de Tiqets...');
    
    const script = document.createElement('script');
    script.src = 'https://widgets.tiqets.com/loader.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Tiqets loader.js cargado exitosamente');
      // Dar tiempo para que se inicialice
      setTimeout(() => {
        if ((window as any).tiqets) {
          console.log('✅ window.tiqets está disponible');
        }
      }, 100);
    };
    
    script.onerror = () => {
      console.error('❌ Error cargando Tiqets loader.js');
    };
    
    document.head.appendChild(script);
  }, []);

  return null;
}

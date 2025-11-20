'use client';
import { useEffect } from 'react';

export default function TiqetsScriptLoader() {
  useEffect(() => {
    // Verificar si ya existe el script
    if (document.querySelector('script[src*="widgets.tiqets.com"]')) {
      console.log('✅ Script de Tiqets ya cargado');
      return;
    }

    // Crear y añadir el script
    const script = document.createElement('script');
    script.src = 'https://widgets.tiqets.com/loader.js';
    script.defer = true;
    script.onload = () => {
      console.log('✅ Tiqets loader.js cargado exitosamente');
    };
    script.onerror = () => {
      console.error('❌ Error cargando Tiqets loader.js');
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Cleanup si el componente se desmonta
      const existingScript = document.querySelector('script[src*="widgets.tiqets.com"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  mainImage: string | null;
  gallery: string[];
  title: string;
}

export default function ImageGallery({ mainImage, gallery, title }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combinar imagen principal + galería
  const allImages = [
    ...(mainImage?.trim() ? [mainImage] : []),
    ...gallery.filter(img => img?.trim())
  ];

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Cerrar con ESC y navegar con flechas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Bloquear scroll cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (allImages.length === 0) return null;

  const galleryImages = allImages.slice(1, 4); // Las 3 primeras de la galería

  return (
    <>
      {/* Layout de imágenes */}
      <div className="mb-8">
        {/* Imagen principal */}
        {allImages[0] && (
          <div 
            className="relative h-80 md:h-96 rounded-2xl overflow-hidden mb-3 cursor-pointer group"
            onClick={() => openLightbox(0)}
          >
            <Image 
              src={allImages[0]} 
              alt={title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            {allImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                1 / {allImages.length}
              </div>
            )}
          </div>
        )}
        
        {/* Galería pequeña */}
        {galleryImages.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {galleryImages.map((img, i) => (
              <div 
                key={i} 
                className="relative h-24 md:h-32 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(i + 1)}
              >
                <Image 
                  src={img} 
                  alt={`${title} - ${i + 2}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Botón cerrar */}
          <button 
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
            onClick={closeLightbox}
          >
            <X size={28} />
          </button>

          {/* Contador */}
          <div className="absolute top-4 left-4 text-white/80 text-sm font-medium">
            {currentIndex + 1} / {allImages.length}
          </div>

          {/* Navegación izquierda */}
          {allImages.length > 1 && (
            <button 
              className="absolute left-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft size={36} />
            </button>
          )}

          {/* Imagen actual */}
          <div 
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[currentIndex]}
              alt={`${title} - ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Navegación derecha */}
          {allImages.length > 1 && (
            <button 
              className="absolute right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight size={36} />
            </button>
          )}

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentIndex ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

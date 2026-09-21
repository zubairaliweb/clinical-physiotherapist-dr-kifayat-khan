import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { GalleryRecord } from '../../types';

interface GallerySectionProps {
  gallery: GalleryRecord[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextImage = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % gallery.length);
    }
  };

  const prevImage = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + gallery.length) % gallery.length);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Clinical Environment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Clinic & Practice Gallery
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            A glimpse into Dr. Kifayat Khan's modern clinical practice, treatment equipment, and patient care setting in Islamabad.
          </p>
        </div>

        {/* Gallery Grid */}
        {(!gallery || gallery.length === 0) ? (
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Gallery Images Available</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Currently no photos are published. New clinic photographs can be uploaded from the Staff Dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gallery.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => openLightbox(idx)}
                className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer shadow-2xs hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm truncate">{item.title}</span>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 ml-2">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activeLightboxIndex !== null && gallery[activeLightboxIndex] && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Previous */}
            {gallery.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Navigation Next */}
            {gallery.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Lightbox Content Container */}
            <div
              className="max-w-4xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black">
                <img
                  src={gallery[activeLightboxIndex].imageUrl}
                  alt={gallery[activeLightboxIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto object-contain rounded-xl"
                />
              </div>

              {/* Caption */}
              <div className="mt-4 text-center max-w-2xl text-white">
                <h3 className="text-lg font-bold">
                  {gallery[activeLightboxIndex].title}
                </h3>
                {gallery[activeLightboxIndex].description && (
                  <p className="mt-1 text-xs sm:text-sm text-slate-300">
                    {gallery[activeLightboxIndex].description}
                  </p>
                )}
                <span className="mt-2 inline-block text-[11px] font-semibold text-teal-400">
                  {activeLightboxIndex + 1} / {gallery.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

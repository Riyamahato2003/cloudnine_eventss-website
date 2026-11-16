import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCatalog } from '../context/CatalogContext';
import { ResilientImage } from './ResilientImage';

export function LightboxModal() {
  const { lightboxItem, setLightboxItem, portfolioItems, startCustomisingFromStyle } = useCatalog();

  const currentIndex = lightboxItem
    ? portfolioItems.findIndex((p) => p.id === lightboxItem.id)
    : -1;

  useEffect(() => {
    if (!lightboxItem) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxItem(null);
      } else if (e.key === 'ArrowRight' && currentIndex >= 0) {
        const next = portfolioItems[(currentIndex + 1) % portfolioItems.length];
        setLightboxItem(next);
      } else if (e.key === 'ArrowLeft' && currentIndex >= 0) {
        const prev =
          portfolioItems[(currentIndex - 1 + portfolioItems.length) % portfolioItems.length];
        setLightboxItem(prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxItem, currentIndex, portfolioItems, setLightboxItem]);

  return (
    <AnimatePresence>
      {lightboxItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-[#1C1917]/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          onClick={() => setLightboxItem(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-[#FAF8F6] rounded-xl overflow-hidden border border-[#DED6CE] grid grid-cols-1 lg:grid-cols-12 max-h-[90vh]"
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              aria-label="Close gallery preview"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#1C1917]/80 text-white hover:bg-[#1C1917] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="lg:col-span-7 bg-[#F2EEEB] flex items-center justify-center max-h-[55vh] lg:max-h-[85vh] overflow-hidden relative">
              <ResilientImage
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="w-full h-full object-contain max-h-[55vh] lg:max-h-[85vh]"
              />
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-[#6B625C]">
                  <span>{lightboxItem.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lightboxItem.eventType}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lightboxItem.location}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917] leading-snug">
                  {lightboxItem.title}
                </h2>

                <p className="text-sm text-[#6B625C] leading-relaxed">
                  {lightboxItem.description}
                </p>

                <div className="pt-4 border-t border-[#DED6CE]">
                  <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2.5">
                    Included Craft Elements
                  </h3>
                  <ul className="space-y-1.5 text-sm text-[#6B625C]">
                    {lightboxItem.stylingElements.map((el) => (
                      <li key={el} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#7C4D59]" aria-hidden="true" />
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#DED6CE] space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    const styleId = lightboxItem.linkedStyleId;
                    const addonIds = lightboxItem.linkedAddonIds;
                    setLightboxItem(null);
                    startCustomisingFromStyle(styleId, addonIds);
                  }}
                  className="w-full py-3 px-5 min-h-[44px] text-sm font-medium text-white bg-[#7C4D59] hover:bg-[#643B46] rounded-md transition-colors cursor-pointer"
                >
                  Customise Similar Styling
                </button>

                <div className="flex items-center justify-between text-xs text-[#6B625C]">
                  <button
                    type="button"
                    onClick={() => {
                      const prev =
                        portfolioItems[
                          (currentIndex - 1 + portfolioItems.length) % portfolioItems.length
                        ];
                      setLightboxItem(prev);
                    }}
                    className="inline-flex items-center gap-1.5 py-2 hover:text-[#1C1917] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <span className="tabular-nums">
                    {currentIndex + 1} / {portfolioItems.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = portfolioItems[(currentIndex + 1) % portfolioItems.length];
                      setLightboxItem(next);
                    }}
                    className="inline-flex items-center gap-1.5 py-2 hover:text-[#1C1917] transition-colors cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

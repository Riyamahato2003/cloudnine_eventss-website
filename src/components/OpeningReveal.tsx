import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export function OpeningReveal() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return false;
    const seen = sessionStorage.getItem('cloudnine_intro_seen');
    return !seen;
  });

  useEffect(() => {
    if (!visible) return;
    sessionStorage.setItem('cloudnine_intro_seen', '1');
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 1150);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F6] px-6 cursor-pointer select-none"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-md"
          >
            <p className="text-xs tracking-[0.24em] uppercase text-[#6B625C] mb-3">
              Sydney · Bespoke Event Styling
            </p>
            <div className="font-serif text-4xl sm:text-5xl text-[#1C1917] tracking-tight">
              Cloudnine Events
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-24 bg-[#7C4D59] mx-auto my-4 origin-center"
            />
            <p className="font-serif italic text-lg text-[#6B625C]">
              Transforming moments into lasting memories.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

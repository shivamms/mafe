'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'mafe_disclaimer_accepted';

export default function DisclaimerBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl shadow-2xl px-6 pt-5 pb-8 max-w-lg mx-auto"
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-warm-200 rounded-full mx-auto mb-5" />

            {/* Icon + title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2v14M2 9h14" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="font-semibold text-warm-900 text-base">Before you start</h2>
            </div>

            <p className="text-sm text-warm-600 leading-relaxed mb-5">
              MAFE provides <strong className="text-warm-800">general health information only</strong> —
              it does not diagnose conditions, prescribe medication, or replace a qualified healthcare professional.
              In an emergency, always call your local emergency services.
            </p>

            <button
              onClick={accept}
              className="w-full py-3.5 bg-brand text-white font-semibold rounded-xl
                         hover:bg-brand-dark transition-colors text-sm"
            >
              Got it, let's go
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

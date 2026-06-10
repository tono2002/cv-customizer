"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  pdfUrl: string | null;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function GenerationPreviewModal({ pdfUrl, companyName, isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-card rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white truncate">{companyName}</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="btn-glass text-white/60 hover:text-white border border-white/10 bg-white/5 rounded-lg p-1.5"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex flex-col bg-black/40">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  title={`${companyName} PDF preview`}
                  className="w-full flex-1"
                  style={{ minHeight: "70vh" }}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center p-10 text-sm text-white/55">
                  PDF preview is not available.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

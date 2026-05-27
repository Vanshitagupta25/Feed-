'use client';

import { X, Heart, MessageCircle, Share2, Eye, Repeat2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    reposts: number;
    views?: number;
  };
}

export default function ImageLightbox({ isOpen, imageUrl, onClose, metrics }: ImageLightboxProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col"
          onClick={onClose}
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={24} />
          </motion.button>

          {/* Image container */}
          <div className="flex-1 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={imageUrl}
              alt="Full screen view"
              className="max-w-full max-h-[calc(100vh-120px)] object-contain rounded-lg"
              crossOrigin="anonymous"
            />
          </div>

          {/* Metrics strip at bottom */}
          {metrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.15 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center gap-8 py-6 px-4">
                <div className="flex items-center gap-2 text-white/90">
                  <Heart size={20} className="text-pink-400" />
                  <span className="text-sm font-medium">{metrics.likes.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-white/90">
                  <MessageCircle size={20} className="text-blue-400" />
                  <span className="text-sm font-medium">{metrics.comments.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-white/90">
                  <Repeat2 size={20} className="text-green-400" />
                  <span className="text-sm font-medium">{metrics.reposts.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-white/90">
                  <Share2 size={20} className="text-purple-400" />
                  <span className="text-sm font-medium">{metrics.shares.toLocaleString()}</span>
                </div>

                {metrics.views !== undefined && (
                  <div className="flex items-center gap-2 text-white/90">
                    <Eye size={20} className="text-yellow-400" />
                    <span className="text-sm font-medium">{metrics.views.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

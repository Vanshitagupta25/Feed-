'use client';

import { X, Heart, MessageCircle, Share2, Repeat2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  postId?: string;
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    reposts: number;
  };
  onMetricsUpdate?: (metrics: { likes: number; shares: number; reposts: number }) => void;
}

export default function ImageLightbox({ isOpen, imageUrl, onClose, postId, metrics, onMetricsUpdate }: ImageLightboxProps) {
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [localMetrics, setLocalMetrics] = useState(metrics);

  // Sync metrics when props change
  useEffect(() => {
    setLocalMetrics(metrics);
    setLiked(false);
    setShared(false);
    setReposted(false);
  }, [metrics, isOpen]);

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

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    if (localMetrics) {
      const newLikes = localMetrics.likes + (newLiked ? 1 : -1);
      setLocalMetrics({ ...localMetrics, likes: newLikes });
      onMetricsUpdate?.({ likes: newLikes, shares: localMetrics.shares, reposts: localMetrics.reposts });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newShared = !shared;
    setShared(newShared);
    if (localMetrics) {
      const newShares = localMetrics.shares + (newShared ? 1 : -1);
      setLocalMetrics({ ...localMetrics, shares: newShares });
      onMetricsUpdate?.({ likes: localMetrics.likes, shares: newShares, reposts: localMetrics.reposts });
    }
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newReposted = !reposted;
    setReposted(newReposted);
    if (localMetrics) {
      const newReposts = localMetrics.reposts + (newReposted ? 1 : -1);
      setLocalMetrics({ ...localMetrics, reposts: newReposts });
      onMetricsUpdate?.({ likes: localMetrics.likes, shares: localMetrics.shares, reposts: newReposts });
    }
  };

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

          {/* Interactive Metrics strip at bottom */}
          {localMetrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.15 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center gap-8 md:gap-12 py-6 px-4">
                {/* Likes - Interactive */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-colors ${
                    liked ? 'text-pink-400' : 'text-white/80 hover:text-pink-400'
                  }`}
                >
                  <Heart size={22} fill={liked ? 'currentColor' : 'none'} />
                  <span className="text-sm font-medium">{localMetrics.likes.toLocaleString()}</span>
                </motion.button>
                
                {/* Comments - Static (display only) */}
                <div className="flex items-center gap-2 text-white/80">
                  <MessageCircle size={22} className="text-blue-400" />
                  <span className="text-sm font-medium">{localMetrics.comments.toLocaleString()}</span>
                </div>
                
                {/* Reposts - Interactive */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRepost}
                  className={`flex items-center gap-2 transition-colors ${
                    reposted ? 'text-green-400' : 'text-white/80 hover:text-green-400'
                  }`}
                >
                  <Repeat2 size={22} />
                  <span className="text-sm font-medium">{localMetrics.reposts.toLocaleString()}</span>
                </motion.button>
                
                {/* Shares - Interactive */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className={`flex items-center gap-2 transition-colors ${
                    shared ? 'text-purple-400' : 'text-white/80 hover:text-purple-400'
                  }`}
                >
                  <Share2 size={22} />
                  <span className="text-sm font-medium">{localMetrics.shares.toLocaleString()}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

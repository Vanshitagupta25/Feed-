'use client';

import { PlusCircle } from 'lucide-react';

interface FloatingPostFABProps {
  onClick: () => void;
  isVisible?: boolean;
}

export default function FloatingPostFAB({ onClick, isVisible = true }: FloatingPostFABProps) {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-[#00A870] to-[#006239] hover:from-[#00A870]/90 hover:to-[#006239]/90 text-white font-semibold shadow-lg hover:shadow-[#006239]/50 transition-all transform hover:scale-105"
    >
      <PlusCircle size={20} />
      <span>Create Post</span>
    </button>
  );
}

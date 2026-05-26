'use client';

import { PlusCircle } from 'lucide-react';

interface FloatingPostFABProps {
  onClick: () => void;
}

export default function FloatingPostFAB({ onClick }: FloatingPostFABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg hover:shadow-primary/50 transition-all transform hover:scale-105"
    >
      <PlusCircle size={20} />
      <span>Create Post</span>
    </button>
  );
}

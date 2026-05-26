'use client';

import { X, Image as ImageIcon, Send, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import type { User } from '@/app/page';

interface PostCreationScreenProps {
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (content: string, image?: string) => void;
}

export default function PostCreationScreen({ isOpen, currentUser, onClose, onSubmit }: PostCreationScreenProps) {
  const [content, setContent] = useState('');
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !currentUser) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous blob URL to prevent memory leaks
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
      }
      // Generate blob URL from the selected file
      const blobUrl = URL.createObjectURL(file);
      setImageBlobUrl(blobUrl);
      setSelectedFileName(file.name);
    }
  };

  const removeImage = () => {
    if (imageBlobUrl) {
      URL.revokeObjectURL(imageBlobUrl);
    }
    setImageBlobUrl(null);
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (content.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        onSubmit(content, imageBlobUrl || undefined);
        setContent('');
        setImageBlobUrl(null);
        setSelectedFileName(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setIsLoading(false);
        onClose();
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 dark flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-card border border-border rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-secondary/20 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Create a Post</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <X size={20} className="text-foreground/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
              {currentUser.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{currentUser.username}</p>
              <p className="text-xs text-foreground/60">{currentUser.email}</p>
            </div>
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Share Your Thoughts
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind? Share your feedback, ideas, or thoughts..."
              className="w-full min-h-32 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none"
              autoFocus
            />
            <p className="text-xs text-foreground/50">{content.length} characters</p>
          </div>

          {/* Image Upload - Real Browser File Input */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
              <ImageIcon size={14} />
              Attach Image (Optional)
            </label>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            {/* Custom upload button */}
            <button
              type="button"
              onClick={triggerFileInput}
              className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-background border-2 border-dashed border-border rounded-xl text-foreground/70 hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <Upload size={20} />
              <span className="text-sm font-medium">
                {selectedFileName ? selectedFileName : 'Click to select an image from your device'}
              </span>
            </button>
          </div>

          {/* Image Preview - Full Width with Object Cover */}
          {imageBlobUrl && (
            <div className="relative w-full h-52 rounded-xl overflow-hidden border border-border group">
              <img
                src={imageBlobUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-destructive/80 hover:bg-destructive rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                {selectedFileName}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-secondary/10 border-t border-border flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border hover:bg-secondary/20 text-foreground font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !content.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:from-muted disabled:to-muted disabled:cursor-not-allowed text-primary-foreground font-semibold transition-all"
          >
            <Send size={16} />
            <span>{isLoading ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

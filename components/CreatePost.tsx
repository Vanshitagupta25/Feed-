"use client";

import { useState, useRef } from "react";
import { ImagePlus, Send, X } from "lucide-react";

interface CreatePostProps {
  onSubmit: (content: string, imageUrl?: string) => void;
  username: string;
}

export function CreatePost({ onSubmit, username }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() || imagePreview) {
      onSubmit(content.trim(), imagePreview || undefined);
      setContent("");
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="py-4 border-b border-[#3a3a3a]">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-[#006239] flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-white">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full resize-none py-2 px-3 rounded-lg text-[#f5f5f5] placeholder-[#a0a0a0] focus:ring-1 focus:ring-[#006239]"
          />

          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-[200px] w-auto rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-black"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-[#a0a0a0] hover:text-[#006239] transition-colors"
            >
              <ImagePlus className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            <button
              type="submit"
              disabled={!content.trim() && !imagePreview}
              className="px-4 py-2 bg-[#006239] text-white rounded-lg font-medium hover:bg-[#00472a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Post
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

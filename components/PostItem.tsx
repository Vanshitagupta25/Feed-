"use client";

import { Heart, MessageCircle } from "lucide-react";
import type { Post } from "@/lib/types";

interface PostItemProps {
  post: Post;
  currentUserId: string;
  onLike: (postId: string) => void;
  onOpenThread: (post: Post) => void;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export function PostItem({
  post,
  currentUserId,
  onLike,
  onOpenThread,
}: PostItemProps) {
  const isLiked = post.likedBy.includes(currentUserId);

  return (
    <article className="py-4 border-b border-[#3a3a3a]/50">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-[#006239] flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-white">
            {post.username.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-[#f5f5f5]">{post.username}</span>
            <span className="text-[#a0a0a0]">·</span>
            <span className="text-[#a0a0a0]">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>

          {post.content && (
            <p className="mt-2 text-[#f5f5f5] whitespace-pre-wrap break-words">
              {post.content}
            </p>
          )}

          {post.imageUrl && (
            <div className="mt-3">
              <img
                src={post.imageUrl}
                alt="Post image"
                className="max-h-[350px] max-w-full w-auto rounded-lg object-contain"
              />
            </div>
          )}

          <div className="flex items-center gap-6 mt-3">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isLiked
                  ? "text-red-500"
                  : "text-[#a0a0a0] hover:text-red-500"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
              />
              <span>{post.likes > 0 ? post.likes : ""}</span>
            </button>

            <button
              onClick={() => onOpenThread(post)}
              className="flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-[#006239] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.commentCount > 0 ? post.commentCount : ""}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

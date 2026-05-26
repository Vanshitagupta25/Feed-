"use client";

import { useState } from "react";
import type { Post } from "@/lib/types";
import { PostItem } from "./PostItem";
import { CreatePost } from "./CreatePost";
import { ThreadDrawer } from "./ThreadDrawer";
import type { Comment } from "@/lib/types";

interface FeedProps {
  posts: Post[];
  currentUserId: string;
  username: string;
  onAddPost: (content: string, imageUrl?: string) => void;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, content: string, parentId?: string) => void;
  getCommentsForPost: (postId: string) => Comment[];
}

export function Feed({
  posts,
  currentUserId,
  username,
  onAddPost,
  onLike,
  onAddComment,
  getCommentsForPost,
}: FeedProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-[#242424]/95 backdrop-blur-sm border-b border-[#3a3a3a]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#006239] flex items-center justify-center">
                <span className="text-sm font-bold text-white">F</span>
              </div>
              <h1 className="text-xl font-semibold text-[#f5f5f5]">Feed</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#a0a0a0]">{username}</span>
              <div className="w-8 h-8 rounded-full bg-[#006239] flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4">
        <CreatePost onSubmit={onAddPost} username={username} />

        <div>
          {posts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[#a0a0a0]">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onLike={onLike}
                onOpenThread={setSelectedPost}
              />
            ))
          )}
        </div>
      </main>

      {selectedPost && (
        <ThreadDrawer
          post={selectedPost}
          comments={getCommentsForPost(selectedPost.id)}
          currentUserId={currentUserId}
          onClose={() => setSelectedPost(null)}
          onAddComment={onAddComment}
        />
      )}
    </div>
  );
}

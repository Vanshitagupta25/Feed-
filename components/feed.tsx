'use client';

import { MessageCircle, Share2, Trash2, ChevronUp, ChevronDown, ThumbsUp, Repeat2 } from 'lucide-react';
import { useState } from 'react';
import type { Post, Comment, Channel } from '@/app/page';

interface FeedProps {
  posts: Post[];
  comments: Comment[];
  channel?: Channel;
  isAdmin: boolean;
  onSelectThread: (postId: string) => void;
  onCreatePost: (title: string, content: string) => void;
  onDeletePost: (postId: string) => void;
}

export default function Feed({
  posts,
  comments,
  channel,
  isAdmin,
  onSelectThread,
  onDeletePost,
}: FeedProps) {
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [postVotes, setPostVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [postMetrics, setPostMetrics] = useState<Record<string, { likes: number; reposts: number; shares: number; comments: number }>>({});

  const toggleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    setPostMetrics((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        likes: (prev[postId]?.likes || 0) + (likes[postId] ? -1 : 1),
      },
    }));
  };

  const toggleVote = (e: React.MouseEvent, postId: string, direction: 'up' | 'down') => {
    e.stopPropagation();
    setPostVotes((prev) => ({
      ...prev,
      [postId]: prev[postId] === direction ? null : direction,
    }));
  };

  const getCommentCount = (postId: string) => {
    return comments.filter(c => c.postId === postId && c.parentId === null).length;
  };

  const handleDeletePost = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    onDeletePost(postId);
  };

  return (
    <div className="flex-1 flex flex-col bg-background border-r border-border overflow-hidden">
      {/* Feed Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-lg font-bold text-foreground">#{channel?.name || 'general'}</h2>
        <p className="text-xs text-foreground/60 mt-1">{channel?.description || 'Discussions'}</p>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto">
        {/* Posts */}
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectThread(post.id)}
              className="p-6 hover:bg-card/30 transition-all duration-200 cursor-pointer group"
            >
              {/* Post Container - Reddit/Twitter Style */}
              <div className="flex gap-4">
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={(e) => toggleVote(e, post.id, 'up')}
                    className={`p-1.5 rounded-lg transition-all ${
                      postVotes[post.id] === 'up'
                        ? 'bg-primary/30 text-primary'
                        : 'text-foreground/50 hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    <ChevronUp size={18} />
                  </button>
                  <span className={`text-sm font-bold ${postVotes[post.id] === 'up' ? 'text-primary' : postVotes[post.id] === 'down' ? 'text-destructive' : 'text-foreground/70'}`}>
                    {post.upvotes + (postVotes[post.id] === 'up' ? 1 : postVotes[post.id] === 'down' ? -1 : 0)}
                  </span>
                  <button
                    onClick={(e) => toggleVote(e, post.id, 'down')}
                    className={`p-1.5 rounded-lg transition-all ${
                      postVotes[post.id] === 'down'
                        ? 'bg-destructive/30 text-destructive'
                        : 'text-foreground/50 hover:bg-destructive/10 hover:text-destructive'
                    }`}
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Author & Avatar Row */}
                  <div className="flex items-center gap-3 mb-3 justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${post.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {post.author.charAt(0)}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono font-semibold text-foreground text-sm">{post.author}</span>
                        <span className="text-xs text-foreground/50">· {post.timestamp}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeletePost(e, post.id)}
                        className="p-1.5 rounded-lg text-destructive hover:bg-destructive/20 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Text Content Area */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-foreground mb-2 leading-snug">{post.title}</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">{post.content}</p>
                  </div>

                  {/* Embedded Media Image Box */}
                  {post.image && (
                    <div className="mb-4 w-full h-52 rounded-xl overflow-hidden bg-secondary/30">
                      <img
                        src={post.image}
                        alt="Post media"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Metrics Bar */}
                  <div className="flex items-center gap-6 pt-3 border-t border-border/30 text-xs font-medium">
                    {/* Votes */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleVote(e, post.id, 'up')}
                        className={`transition-colors ${
                          postVotes[post.id] === 'up'
                            ? 'text-primary'
                            : 'text-foreground/60 hover:text-primary'
                        }`}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <span className={postVotes[post.id] === 'up' ? 'text-primary font-semibold' : postVotes[post.id] === 'down' ? 'text-destructive font-semibold' : 'text-foreground/60'}>
                        {post.upvotes - post.downvotes + (postVotes[post.id] === 'up' ? 1 : postVotes[post.id] === 'down' ? -1 : 0)}
                      </span>
                      <button
                        onClick={(e) => toggleVote(e, post.id, 'down')}
                        className={`transition-colors ${
                          postVotes[post.id] === 'down'
                            ? 'text-destructive'
                            : 'text-foreground/60 hover:text-destructive'
                        }`}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {/* Likes */}
                    <button
                      onClick={(e) => toggleLike(e, post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        likes[post.id]
                          ? 'text-accent font-semibold'
                          : 'text-foreground/60 hover:text-accent'
                      }`}
                    >
                      <ThumbsUp size={14} fill={likes[post.id] ? 'currentColor' : 'none'} />
                      <span>{(postMetrics[post.id]?.likes || post.likes) + (likes[post.id] ? 1 : 0)}</span>
                    </button>

                    {/* Comments */}
                    <div className="flex items-center gap-1.5 text-foreground/60">
                      <MessageCircle size={14} />
                      <span>{getCommentCount(post.id)}</span>
                    </div>

                    {/* Reposts */}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-foreground/60 hover:text-primary transition-colors"
                    >
                      <Repeat2 size={14} />
                      <span>{postMetrics[post.id]?.reposts || post.reposts}</span>
                    </button>

                    {/* Shares */}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-foreground/60 hover:text-primary transition-colors"
                    >
                      <Share2 size={14} />
                      <span>{postMetrics[post.id]?.shares || post.shares}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

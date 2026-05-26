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
  const [reposts, setReposts] = useState<Record<string, boolean>>({});
  const [shares, setShares] = useState<Record<string, boolean>>({});
  const [postVotes, setPostVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [postMetrics, setPostMetrics] = useState<Record<string, { upvotes: number; downvotes: number; likes: number; reposts: number; shares: number }>>({});

  const initMetrics = (postId: string, post: Post) => {
    if (!postMetrics[postId]) {
      setPostMetrics((prev) => ({
        ...prev,
        [postId]: {
          upvotes: post.upvotes,
          downvotes: post.downvotes,
          likes: post.likes,
          reposts: post.reposts,
          shares: post.shares,
        },
      }));
    }
  };

  const toggleLike = (e: React.MouseEvent, postId: string, post: Post) => {
    e.stopPropagation();
    initMetrics(postId, post);
    const isLiked = likes[postId];
    setLikes((prev) => ({
      ...prev,
      [postId]: !isLiked,
    }));
    setPostMetrics((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        upvotes: prev[postId]?.upvotes ?? post.upvotes,
        downvotes: prev[postId]?.downvotes ?? post.downvotes,
        likes: (prev[postId]?.likes ?? post.likes) + (isLiked ? -1 : 1),
        reposts: prev[postId]?.reposts ?? post.reposts,
        shares: prev[postId]?.shares ?? post.shares,
      },
    }));
  };

  const toggleRepost = (e: React.MouseEvent, postId: string, post: Post) => {
    e.stopPropagation();
    initMetrics(postId, post);
    const isReposted = reposts[postId];
    setReposts((prev) => ({
      ...prev,
      [postId]: !isReposted,
    }));
    setPostMetrics((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        upvotes: prev[postId]?.upvotes ?? post.upvotes,
        downvotes: prev[postId]?.downvotes ?? post.downvotes,
        likes: prev[postId]?.likes ?? post.likes,
        reposts: (prev[postId]?.reposts ?? post.reposts) + (isReposted ? -1 : 1),
        shares: prev[postId]?.shares ?? post.shares,
      },
    }));
  };

  const toggleShare = (e: React.MouseEvent, postId: string, post: Post) => {
    e.stopPropagation();
    initMetrics(postId, post);
    const isShared = shares[postId];
    setShares((prev) => ({
      ...prev,
      [postId]: !isShared,
    }));
    setPostMetrics((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        upvotes: prev[postId]?.upvotes ?? post.upvotes,
        downvotes: prev[postId]?.downvotes ?? post.downvotes,
        likes: prev[postId]?.likes ?? post.likes,
        reposts: prev[postId]?.reposts ?? post.reposts,
        shares: (prev[postId]?.shares ?? post.shares) + (isShared ? -1 : 1),
      },
    }));
  };

  const toggleVote = (e: React.MouseEvent, postId: string, direction: 'up' | 'down', post: Post) => {
    e.stopPropagation();
    initMetrics(postId, post);
    const currentVote = postVotes[postId];
    let upvoteDelta = 0;
    let downvoteDelta = 0;

    if (currentVote === direction) {
      // Undo vote
      if (direction === 'up') upvoteDelta = -1;
      else downvoteDelta = -1;
      setPostVotes((prev) => ({ ...prev, [postId]: null }));
    } else if (currentVote === null || currentVote === undefined) {
      // New vote
      if (direction === 'up') upvoteDelta = 1;
      else downvoteDelta = 1;
      setPostVotes((prev) => ({ ...prev, [postId]: direction }));
    } else {
      // Switching vote
      if (direction === 'up') {
        upvoteDelta = 1;
        downvoteDelta = -1;
      } else {
        upvoteDelta = -1;
        downvoteDelta = 1;
      }
      setPostVotes((prev) => ({ ...prev, [postId]: direction }));
    }

    setPostMetrics((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        upvotes: (prev[postId]?.upvotes ?? post.upvotes) + upvoteDelta,
        downvotes: (prev[postId]?.downvotes ?? post.downvotes) + downvoteDelta,
        likes: prev[postId]?.likes ?? post.likes,
        reposts: prev[postId]?.reposts ?? post.reposts,
        shares: prev[postId]?.shares ?? post.shares,
      },
    }));
  };

  const getCommentCount = (postId: string) => {
    return comments.filter(c => c.postId === postId && c.parentId === null).length;
  };

  const handleDeletePost = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    onDeletePost(postId);
  };

  const getUpvotes = (post: Post) => postMetrics[post.id]?.upvotes ?? post.upvotes;
  const getDownvotes = (post: Post) => postMetrics[post.id]?.downvotes ?? post.downvotes;
  const getLikes = (post: Post) => postMetrics[post.id]?.likes ?? post.likes;
  const getReposts = (post: Post) => postMetrics[post.id]?.reposts ?? post.reposts;
  const getShares = (post: Post) => postMetrics[post.id]?.shares ?? post.shares;

  return (
    <div className="flex-1 flex flex-col bg-[#DDE8E3] border-r border-border overflow-hidden">
      {/* Feed Header */}
      <div className="px-6 py-4 border-b border-border bg-[#006239] backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-lg font-bold text-white">#{channel?.name || 'general'}</h2>
        <p className="text-xs text-white/70 mt-1">{channel?.description || 'Discussions'}</p>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Posts */}
        <div className="space-y-4 px-3">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectThread(post.id)}
              className="max-w-[92%] mx-auto p-6 bg-[#006239] hover:bg-[#005230] transition-all duration-200 cursor-pointer group rounded-xl shadow-lg"
            >
              {/* Post Container - Reddit/Twitter Style */}
              <div className="flex gap-4">
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={(e) => toggleVote(e, post.id, 'up', post)}
                    className={`p-1.5 rounded-lg transition-all ${
                      postVotes[post.id] === 'up'
                        ? 'bg-white/30 text-white'
                        : 'text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <ChevronUp size={18} />
                  </button>
                  <span className={`text-sm font-bold ${postVotes[post.id] === 'up' ? 'text-white' : postVotes[post.id] === 'down' ? 'text-red-300' : 'text-white/70'}`}>
                    {getUpvotes(post) - getDownvotes(post)}
                  </span>
                  <button
                    onClick={(e) => toggleVote(e, post.id, 'down', post)}
                    className={`p-1.5 rounded-lg transition-all ${
                      postVotes[post.id] === 'down'
                        ? 'bg-red-500/30 text-red-300'
                        : 'text-white/50 hover:bg-red-500/10 hover:text-red-300'
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
                        <span className="font-mono font-semibold text-white text-sm">{post.author}</span>
                        <span className="text-xs text-white/50">· {post.timestamp}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeletePost(e, post.id)}
                        className="p-1.5 rounded-lg text-red-300 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Text Content Area */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-white mb-2 leading-snug">{post.title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{post.content}</p>
                  </div>

                  {/* Embedded Media Image Box */}
                  {post.image && (
                    <div className="mb-4 w-full h-52 rounded-xl overflow-hidden bg-white/10">
                      <img
                        src={post.image}
                        alt="Post media"
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}

                  {/* Metrics Bar */}
                  <div className="flex items-center gap-6 pt-3 border-t border-white/20 text-xs font-medium">
                    {/* Votes */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleVote(e, post.id, 'up', post)}
                        className={`transition-colors ${
                          postVotes[post.id] === 'up'
                            ? 'text-white'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <span className={postVotes[post.id] === 'up' ? 'text-white font-semibold' : postVotes[post.id] === 'down' ? 'text-red-300 font-semibold' : 'text-white/60'}>
                        {getUpvotes(post) - getDownvotes(post)}
                      </span>
                      <button
                        onClick={(e) => toggleVote(e, post.id, 'down', post)}
                        className={`transition-colors ${
                          postVotes[post.id] === 'down'
                            ? 'text-red-300'
                            : 'text-white/60 hover:text-red-300'
                        }`}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {/* Likes */}
                    <button
                      onClick={(e) => toggleLike(e, post.id, post)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        likes[post.id]
                          ? 'text-pink-300 font-semibold'
                          : 'text-white/60 hover:text-pink-300'
                      }`}
                    >
                      <ThumbsUp size={14} fill={likes[post.id] ? 'currentColor' : 'none'} />
                      <span>{getLikes(post)}</span>
                    </button>

                    {/* Comments */}
                    <div className="flex items-center gap-1.5 text-white/60">
                      <MessageCircle size={14} />
                      <span>{getCommentCount(post.id)}</span>
                    </div>

                    {/* Reposts */}
                    <button
                      onClick={(e) => toggleRepost(e, post.id, post)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        reposts[post.id]
                          ? 'text-green-300 font-semibold'
                          : 'text-white/60 hover:text-green-300'
                      }`}
                    >
                      <Repeat2 size={14} />
                      <span>{getReposts(post)}</span>
                    </button>

                    {/* Shares */}
                    <button
                      onClick={(e) => toggleShare(e, post.id, post)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        shares[post.id]
                          ? 'text-blue-300 font-semibold'
                          : 'text-white/60 hover:text-blue-300'
                      }`}
                    >
                      <Share2 size={14} />
                      <span>{getShares(post)}</span>
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

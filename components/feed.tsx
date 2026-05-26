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
      if (direction === 'up') upvoteDelta = -1;
      else downvoteDelta = -1;
      setPostVotes((prev) => ({ ...prev, [postId]: null }));
    } else if (currentVote === null || currentVote === undefined) {
      if (direction === 'up') upvoteDelta = 1;
      else downvoteDelta = 1;
      setPostVotes((prev) => ({ ...prev, [postId]: direction }));
    } else {
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
    <div className="flex-1 flex flex-col bg-[#242424] border-r border-[#3a3a3a] overflow-hidden">
      {/* Feed Header */}
      <div className="px-6 py-4 border-b border-[#3a3a3a] bg-[#006239] sticky top-0 z-10">
        <h2 className="text-lg font-bold text-white">#{channel?.name || 'general'}</h2>
        <p className="text-xs text-white/70 mt-1">{channel?.description || 'Discussions'}</p>
      </div>

      {/* Scrollable Feed - Reddit/Discord Style */}
      <div className="flex-1 overflow-y-auto">
        {/* Posts - Continuous Thread Stream */}
        <div className="divide-y divide-[#3a3a3a]">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectThread(post.id)}
              className="px-4 py-4 hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
            >
              {/* Post Container - Clean Minimal Layout */}
              <div className="flex gap-3">
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-0.5 pt-1">
                  <button
                    onClick={(e) => toggleVote(e, post.id, 'up', post)}
                    className={`p-1 rounded transition-all ${
                      postVotes[post.id] === 'up'
                        ? 'text-[#006239]'
                        : 'text-[#666] hover:text-[#006239]'
                    }`}
                  >
                    <ChevronUp size={18} />
                  </button>
                  <span className={`text-xs font-bold ${postVotes[post.id] === 'up' ? 'text-[#006239]' : postVotes[post.id] === 'down' ? 'text-red-400' : 'text-[#888]'}`}>
                    {getUpvotes(post) - getDownvotes(post)}
                  </span>
                  <button
                    onClick={(e) => toggleVote(e, post.id, 'down', post)}
                    className={`p-1 rounded transition-all ${
                      postVotes[post.id] === 'down'
                        ? 'text-red-400'
                        : 'text-[#666] hover:text-red-400'
                    }`}
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Author Row */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full ${post.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                      {post.author.charAt(0)}
                    </div>
                    <span className="font-medium text-[#DDE8E3] text-sm">{post.author}</span>
                    <span className="text-xs text-[#666]">{post.timestamp}</span>
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeletePost(e, post.id)}
                        className="ml-auto p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-[15px] font-semibold text-[#DDE8E3] mb-1 leading-snug">{post.title}</h3>

                  {/* Content */}
                  <p className="text-sm text-[#aaa] leading-relaxed mb-3">{post.content}</p>

                  {/* Embedded Media - Controlled Size */}
                  {post.image && (
                    <div className="mb-3 inline-block">
                      <img
                        src={post.image}
                        alt="Post media"
                        className="max-h-[350px] max-w-full w-auto rounded-lg object-contain bg-[#1a1a1a]"
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}

                  {/* Metrics Bar */}
                  <div className="flex items-center gap-4 text-xs text-[#666]">
                    {/* Likes */}
                    <button
                      onClick={(e) => toggleLike(e, post.id, post)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        likes[post.id]
                          ? 'text-pink-400'
                          : 'hover:text-pink-400'
                      }`}
                    >
                      <ThumbsUp size={14} fill={likes[post.id] ? 'currentColor' : 'none'} />
                      <span>{getLikes(post)}</span>
                    </button>

                    {/* Comments */}
                    <div className="flex items-center gap-1.5">
                      <MessageCircle size={14} />
                      <span>{getCommentCount(post.id)} comments</span>
                    </div>

                    {/* Reposts */}
                    <button
                      onClick={(e) => toggleRepost(e, post.id, post)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        reposts[post.id]
                          ? 'text-[#006239]'
                          : 'hover:text-[#006239]'
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
                          ? 'text-blue-400'
                          : 'hover:text-blue-400'
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

'use client';

import { MessageCircle, Share2, Trash2, ChevronUp, ChevronDown, ThumbsUp, Repeat2, Search, X, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Post, Comment, Channel, User } from '@/app/page';
import ProfileToggle from './profile-toggle';
import AuthScreen from '@/components/auth-screen';

interface FeedProps {
  posts: Post[];
  comments: Comment[];
  channels: Channel[];
  users: User[];
  channel?: Channel;
  isAdmin: boolean;
  currentUser: User | null;
  isAuthenticated: boolean;
  onAuthenticate: (user: User) => void;
  onSelectThread?: (postId: string) => void;
  onCreatePost: (title: string, content: string) => void;
  onDeletePost: (postId: string) => void;
  onAddComment: (postId: string, content: string, parentId: string | null) => void;
  onDeleteComment: (commentId: string) => void;
  onLogout: () => void;
  onUpdateUsername: (newUsername: string) => void;
  onUpdateAvatar: (avatarImage: string) => void;
  onToggleSidebar: () => void;
  isMobile: boolean;
}

// Lightbox component for full-screen image view
function ImageLightbox({ 
  post, 
  onClose 
}: { 
  post: Post; 
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X size={24} className="text-white" />
      </button>

      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.img
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          src={post.image}
          alt="Full screen view"
          className="max-w-full max-h-full object-contain rounded-lg"
          crossOrigin="anonymous"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Metrics Strip */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-8 text-white/80">
          <div className="flex items-center gap-2">
            <ThumbsUp size={18} />
            <span className="text-sm font-medium">{post.likes} Likes</span>
          </div>
          <div className="flex items-center gap-2">
            <Repeat2 size={18} />
            <span className="text-sm font-medium">{post.reposts} Reposts</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 size={18} />
            <span className="text-sm font-medium">{post.shares} Shares</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Search Modal Component
function SearchModal({
  isOpen,
  onClose,
  channels,
  users,
}: {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  users: User[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="w-full max-w-lg bg-[#111827] border border-[#374151] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-[#374151]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search channels and users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1f2937] border border-[#374151] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006239] transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {searchQuery && (
            <>
              {/* Channels */}
              {filteredChannels.length > 0 && (
                <div className="p-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">Channels</p>
                  {filteredChannels.map((channel) => (
                    <button
                      key={channel.id}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#1f2937] transition-colors"
                      onClick={onClose}
                    >
                      <span className="text-white font-medium">#{channel.name}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{channel.description}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Users */}
              {filteredUsers.length > 0 && (
                <div className="p-2 border-t border-[#374151]">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">Users</p>
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#1f2937] transition-colors flex items-center gap-3"
                      onClick={onClose}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#006239] flex items-center justify-center text-white text-xs font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{user.username}</span>
                    </button>
                  ))}
                </div>
              )}

              {filteredChannels.length === 0 && filteredUsers.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              )}
            </>
          )}

          {!searchQuery && (
            <div className="p-8 text-center text-gray-500">
              Start typing to search...
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Read More / Less component for text truncation
function TruncatedText({ content, maxLength = 280 }: { content: string; maxLength?: number }) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = content.length > maxLength;

  if (!shouldTruncate) {
    return <p className="text-sm text-gray-300 leading-relaxed">{content}</p>;
  }

  return (
    <div>
      <p className="text-sm text-gray-300 leading-relaxed">
        {expanded ? content : `${content.substring(0, maxLength)}...`}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className="mt-2 text-sm font-medium text-[#00A870] hover:text-[#00A870]/80 transition-colors"
      >
        {expanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
}

export default function Feed({
  posts,
  comments,
  channels,
  users,
  channel,
  isAdmin,
  currentUser,
  isAuthenticated,
  onAuthenticate,
  onDeletePost,
  onAddComment,
  onDeleteComment,
  onLogout,
  onUpdateUsername,
  onUpdateAvatar,
  onToggleSidebar,
  isMobile,
}: FeedProps) {
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [reposts, setReposts] = useState<Record<string, boolean>>({});
  const [shares, setShares] = useState<Record<string, boolean>>({});
  const [postVotes, setPostVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [postMetrics, setPostMetrics] = useState<Record<string, { upvotes: number; downvotes: number; likes: number; reposts: number; shares: number }>>({});
  const [lightboxPost, setLightboxPost] = useState<Post | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onAuthenticate={onAuthenticate} />;
  }

  const toggleLike = (e: React.MouseEvent, postId: string, post: Post) => {
    e.stopPropagation();
    initMetrics(postId, post);
    const isLiked = likes[postId];
    setLikes((prev) => ({ ...prev, [postId]: !isLiked }));
    setPostMetrics((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        likes: (prev[postId]?.likes ?? post.likes) + (isLiked ? -1 : 1),
      },
    }));
  };

  const toggleRepost = (e: React.MouseEvent, postId: string, post: Post) => {
    e.stopPropagation();
    initMetrics(postId, post);
    const isReposted = reposts[postId];
    setReposts((prev) => ({ ...prev, [postId]: !isReposted }));
    setPostMetrics((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        reposts: (prev[postId]?.reposts ?? post.reposts) + (isReposted ? -1 : 1),
      },
    }));
  };

  const toggleShare = (e: React.MouseEvent, postId: string, post: Post) => {
    e.stopPropagation();
    initMetrics(postId, post);
    const isShared = shares[postId];
    setShares((prev) => ({ ...prev, [postId]: !isShared }));
    setPostMetrics((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
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

  const openLightbox = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    if (post.image) {
      setLightboxPost(post);
    }
  };

  const getUpvotes = (post: Post) => postMetrics[post.id]?.upvotes ?? post.upvotes;
  const getDownvotes = (post: Post) => postMetrics[post.id]?.downvotes ?? post.downvotes;
  const getLikes = (post: Post) => postMetrics[post.id]?.likes ?? post.likes;
  const getReposts = (post: Post) => postMetrics[post.id]?.reposts ?? post.reposts;
  const getShares = (post: Post) => postMetrics[post.id]?.shares ?? post.shares;

  return (
    <>
      <div className="flex-1 flex flex-col bg-[#111827] border-r border-[#374151] overflow-hidden">
        {/* Feed Header */}
        <div className="px-4 md:px-6 py-4 border-b border-[#374151] bg-[#006239] backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={onToggleSidebar}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Menu size={20} className="text-white" />
                </button>
              )}
              <div>
                <h2 className="text-lg font-bold text-white">
                  #{channel?.name || 'general'}
                </h2>
                <p className="text-xs text-white/70 mt-0.5">
                  {channel?.description || 'Discussions'}
                </p>
              </div>
            </div>

            {/* Right - Search Icon + Profile */}
            <div className="flex items-center gap-2">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
              >
                <Search size={18} className="text-white" />
              </button>

              {currentUser && (
                <ProfileToggle
                  currentUser={currentUser}
                  onUpdateUsername={onUpdateUsername}
                  onUpdateAvatar={onUpdateAvatar}
                  onLogout={onLogout}
                />
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4 px-3">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="max-w-[95%] md:max-w-[92%] mx-auto p-4 md:p-6 bg-[#1f2937] hover:bg-[#263445] transition-all duration-200 cursor-pointer group rounded-xl shadow-lg border border-[#374151]"
                >
                  {/* Post Container */}
                  <div className="flex gap-3 md:gap-4">
                    {/* Vote Column */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={(e) => toggleVote(e, post.id, 'up', post)}
                        className={`p-1.5 rounded-lg transition-all ${
                          postVotes[post.id] === 'up'
                            ? 'bg-[#006239] text-white'
                            : 'text-gray-500 hover:bg-[#374151] hover:text-white'
                        }`}
                      >
                        <ChevronUp size={18} />
                      </button>
                      <span className={`text-sm font-bold ${
                        postVotes[post.id] === 'up'
                          ? 'text-[#00A870]'
                          : postVotes[post.id] === 'down'
                            ? 'text-red-400'
                            : 'text-gray-400'
                      }`}>
                        {getUpvotes(post) - getDownvotes(post)}
                      </span>
                      <button
                        onClick={(e) => toggleVote(e, post.id, 'down', post)}
                        className={`p-1.5 rounded-lg transition-all ${
                          postVotes[post.id] === 'down'
                            ? 'bg-red-500/30 text-red-400'
                            : 'text-gray-500 hover:bg-red-500/10 hover:text-red-400'
                        }`}
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Author Row */}
                      <div className="flex items-center gap-3 mb-3 justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${post.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {post.author.charAt(0)}
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-mono font-semibold text-white text-sm">
                              {post.author}
                            </span>
                            <span className="text-xs text-gray-500">
                              · {post.timestamp}
                            </span>
                          </div>
                        </div>

                        {isAdmin && (
                          <button
                            onClick={(e) => handleDeletePost(e, post.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      {/* Text Content - No title/description, just content with Read More */}
                      <div className="mb-4">
                        <TruncatedText content={post.content} maxLength={280} />
                      </div>

                      {/* Image - Standardized dimensions with click for lightbox */}
                      {post.image && (
                        <div 
                          className="mb-4 w-full h-[200px] md:h-[280px] rounded-xl overflow-hidden bg-[#374151] cursor-pointer"
                          onClick={(e) => openLightbox(e, post)}
                        >
                          <img
                            src={post.image}
                            alt="Post media"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            crossOrigin="anonymous"
                          />
                        </div>
                      )}

                      {/* Metrics */}
                      <div className="flex items-center gap-4 md:gap-6 pt-3 border-t border-[#374151] text-xs font-medium">
                        {/* Likes */}
                        <button
                          onClick={(e) => toggleLike(e, post.id, post)}
                          className={`flex items-center gap-1.5 transition-colors ${
                            likes[post.id]
                              ? 'text-pink-400 font-semibold'
                              : 'text-gray-500 hover:text-pink-400'
                          }`}
                        >
                          <ThumbsUp size={14} fill={likes[post.id] ? 'currentColor' : 'none'} />
                          <span>{getLikes(post)}</span>
                        </button>

                        {/* Comments */}
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <MessageCircle size={14} />
                          <span>{getCommentCount(post.id)}</span>
                        </div>

                        {/* Reposts */}
                        <button
                          onClick={(e) => toggleRepost(e, post.id, post)}
                          className={`flex items-center gap-1.5 transition-colors ${
                            reposts[post.id]
                              ? 'text-[#00A870] font-semibold'
                              : 'text-gray-500 hover:text-[#00A870]'
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
                              ? 'text-blue-400 font-semibold'
                              : 'text-gray-500 hover:text-blue-400'
                          }`}
                        >
                          <Share2 size={14} />
                          <span>{getShares(post)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxPost && (
          <ImageLightbox post={lightboxPost} onClose={() => setLightboxPost(null)} />
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <SearchModal
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
            channels={channels}
            users={users}
          />
        )}
      </AnimatePresence>
    </>
  );
}

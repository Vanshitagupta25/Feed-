'use client';

import { MessageCircle, Share2, Trash2, ChevronUp, ChevronDown, ThumbsUp, Repeat2, Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Post, Comment, Channel, User } from '@/app/page';
import ProfileToggle from './profile-toggle';
import AuthScreen from '@/components/auth-screen';
import ImageLightbox from '@/components/image-lightbox';

interface FeedProps {
  posts: Post[];
  comments: Comment[];
  channel?: Channel;
  isAdmin: boolean;
  onCreatePost: (title: string, content: string) => void;
  onDeletePost: (postId: string) => void;
  onAddComment: (postId: string, content: string, parentId: string | null) => void;
  onDeleteComment: (commentId: string) => void;
  currentUser: User | null;
  isAuthenticated: boolean;
  onAuthenticate: (user: User) => void;
  onLogout: () => void;
  onUpdateUsername: (newUsername: string) => void;
  onUpdateAvatar: (avatarImage: string) => void;
  onOpenSearch: () => void;
}

// Character limit for truncation
const TEXT_TRUNCATE_LIMIT = 280;

export default function Feed({
  posts,
  comments,
  channel,
  isAdmin,
  onDeletePost,
  currentUser,
  isAuthenticated,
  onAuthenticate,
  onLogout,
  onUpdateUsername,
  onUpdateAvatar,
  onOpenSearch,
}: FeedProps) {
  const router = useRouter();
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [reposts, setReposts] = useState<Record<string, boolean>>({});
  const [shares, setShares] = useState<Record<string, boolean>>({});
  const [postVotes, setPostVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [postMetrics, setPostMetrics] = useState<Record<string, { upvotes: number; downvotes: number; likes: number; reposts: number; shares: number }>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [lightboxImage, setLightboxImage] = useState<{ url: string; postId: string; metrics: { likes: number; comments: number; shares: number; reposts: number } } | null>(null);

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

  const toggleExpand = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const openLightbox = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    if (post.image) {
      setLightboxImage({
        url: post.image,
        postId: post.id,
        metrics: {
          likes: getLikes(post),
          comments: getCommentCount(post.id),
          shares: getShares(post),
          reposts: getReposts(post),
        },
      });
    }
  };

  const navigateToThread = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    // Save posts and comments to localStorage for the thread page
    localStorage.setItem('verge_posts', JSON.stringify(posts));
    localStorage.setItem('verge_comments', JSON.stringify(comments));
    router.push(`/thread/${postId}`);
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

  const shouldTruncate = (content: string) => content.length > TEXT_TRUNCATE_LIMIT;
  const getTruncatedContent = (content: string) => content.slice(0, TEXT_TRUNCATE_LIMIT) + '...';

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="flex-1 flex flex-col bg-[#111827] overflow-hidden">
      {/* Feed Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 md:px-6 py-4 border-b border-[#374151] bg-[#006239] sticky top-0 z-10"
      >
        <div className="flex items-center justify-between">
          {/* Left */}
          <div>
            <h2 className="text-lg font-bold text-white">
              #{channel?.name || 'general'}
            </h2>
            <p className="text-xs text-white/70 mt-1">
              {channel?.description || 'Discussions'}
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Icon - Raw transparent button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSearch}
              className="p-2 transition-colors"
              title="Search"
            >
              <Search size={18} className="text-white/80 hover:text-white" />
            </motion.button>

            {/* Theme Toggle - Locked to dark mode (static visual) */}
            <div className="relative w-14 h-8 rounded-full bg-[#1f2937] border border-[#374151] flex items-center cursor-not-allowed" title="Dark mode locked">
              <div className="absolute left-1 w-6 h-6 rounded-full bg-[#374151]" />
            </div>

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
      </motion.div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-4 px-3 md:px-4 max-w-2xl mx-auto">
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.01 }}
                className="p-4 md:p-6 bg-[#1f2937] hover:bg-[#243447] transition-all duration-200 cursor-pointer group rounded-xl border border-[#374151]"
              >
                {/* Post Container */}
                <div className="flex gap-3 md:gap-4">
                  {/* Vote Column */}
                  <div className="flex flex-col items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => toggleVote(e, post.id, 'up', post)}
                      className={`p-1.5 rounded-lg transition-all ${
                        postVotes[post.id] === 'up'
                          ? 'bg-[#00A870]/30 text-[#00A870]'
                          : 'text-gray-400 hover:bg-[#374151] hover:text-white'
                      }`}
                    >
                      <ChevronUp size={18} />
                    </motion.button>

                    <span
                      className={`text-sm font-bold ${
                        postVotes[post.id] === 'up'
                          ? 'text-[#00A870]'
                          : postVotes[post.id] === 'down'
                          ? 'text-red-400'
                          : 'text-gray-300'
                      }`}
                    >
                      {getUpvotes(post) - getDownvotes(post)}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => toggleVote(e, post.id, 'down', post)}
                      className={`p-1.5 rounded-lg transition-all ${
                        postVotes[post.id] === 'down'
                          ? 'bg-red-500/30 text-red-400'
                          : 'text-gray-400 hover:bg-red-500/10 hover:text-red-400'
                      }`}
                    >
                      <ChevronDown size={18} />
                    </motion.button>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    {/* Author Row */}
                    <div className="flex items-center gap-3 mb-3 justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${post.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                        >
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
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDeletePost(e, post.id)}
                          className="p-1.5 text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      )}
                    </div>

                    {/* Text Content with Read More/Less */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {shouldTruncate(post.content) && !expandedPosts[post.id]
                          ? getTruncatedContent(post.content)
                          : post.content}
                      </p>
                      {shouldTruncate(post.content) && (
                        <button
                          onClick={(e) => toggleExpand(e, post.id)}
                          className="mt-2 text-sm font-medium text-[#00A870] hover:text-[#00A870]/80 transition-colors"
                        >
                          {expandedPosts[post.id] ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </div>

                    {/* Image - Standardized dimensions with lightbox */}
                    {post.image && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={(e) => openLightbox(e, post)}
                        className="mb-4 w-full h-[240px] md:h-[320px] rounded-xl overflow-hidden bg-[#374151] cursor-pointer"
                      >
                        <img
                          src={post.image}
                          alt="Post media"
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </motion.div>
                    )}

                    {/* Metrics */}
                    <div className="flex items-center gap-4 md:gap-6 pt-3 border-t border-[#374151] text-xs font-medium">
                      {/* Likes */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => toggleLike(e, post.id, post)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          likes[post.id]
                            ? 'text-pink-400 font-semibold'
                            : 'text-gray-400 hover:text-pink-400'
                        }`}
                      >
                        <ThumbsUp size={14} fill={likes[post.id] ? 'currentColor' : 'none'} />
                        <span>{getLikes(post)}</span>
                      </motion.button>

                      {/* Comments - Navigates to thread */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => navigateToThread(e, post.id)}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-[#00A870] transition-colors"
                      >
                        <MessageCircle size={14} />
                        <span>{getCommentCount(post.id)}</span>
                      </motion.button>

                      {/* Reposts */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => toggleRepost(e, post.id, post)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          reposts[post.id]
                            ? 'text-green-400 font-semibold'
                            : 'text-gray-400 hover:text-green-400'
                        }`}
                      >
                        <Repeat2 size={14} />
                        <span>{getReposts(post)}</span>
                      </motion.button>

                      {/* Shares */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => toggleShare(e, post.id, post)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          shares[post.id]
                            ? 'text-blue-400 font-semibold'
                            : 'text-gray-400 hover:text-blue-400'
                        }`}
                      >
                        <Share2 size={14} />
                        <span>{getShares(post)}</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={!!lightboxImage}
        imageUrl={lightboxImage?.url || ''}
        postId={lightboxImage?.postId}
        onClose={() => setLightboxImage(null)}
        metrics={lightboxImage?.metrics}
        onMetricsUpdate={(updatedMetrics) => {
          if (lightboxImage?.postId) {
            const post = posts.find(p => p.id === lightboxImage.postId);
            if (post) {
              setPostMetrics((prev) => ({
                ...prev,
                [lightboxImage.postId]: {
                  ...(prev[lightboxImage.postId] || { upvotes: post.upvotes, downvotes: post.downvotes }),
                  likes: updatedMetrics.likes,
                  shares: updatedMetrics.shares,
                  reposts: updatedMetrics.reposts,
                },
              }));
            }
          }
        }}
      />
    </div>
  );
}

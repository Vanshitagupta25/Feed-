'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageCircle, Trash2, Reply, Send, X, ChevronUp, ChevronDown, ThumbsUp, Share2, Repeat2 } from 'lucide-react';

interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  author: string;
  color: string;
  content: string;
  timestamp: string;
}

interface Post {
  id: string;
  channelId: string;
  author: string;
  color: string;
  timestamp: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  likes: number;
  dislikes: number;
  shares: number;
  reposts: number;
  image?: string;
}

const NestedComment = ({
  comment,
  allComments,
  depth = 0,
  isAdmin,
  onReply,
  onDelete,
}: {
  comment: Comment;
  allComments: Comment[];
  depth?: number;
  isAdmin: boolean;
  onReply: (commentId: string, author: string) => void;
  onDelete: (commentId: string) => void;
}) => {
  const childComments = allComments.filter(c => c.parentId === comment.id);
  const indentClass = depth > 0 ? 'ml-6 md:ml-8' : '';
  const borderClass = depth > 0 ? 'border-l-2 border-[#374151] hover:border-[#00A870]/50 pl-4 transition-colors' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${indentClass} pb-4`}
    >
      <div className={`${borderClass}`}>
        <div className="flex items-start gap-3 group">
          <div className={`w-8 h-8 rounded-full ${comment.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {comment.author.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-semibold text-white text-sm">{comment.author}</span>
                <span className="text-xs text-gray-500">{comment.timestamp}</span>
              </div>
              {isAdmin && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="p-1 text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <p className="text-sm text-gray-200 mt-2 leading-relaxed break-words">{comment.content}</p>

            <button
              onClick={() => onReply(comment.id, comment.author)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#00A870] transition-colors"
            >
              <Reply size={12} />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>

      {childComments.length > 0 && (
        <div className="mt-4">
          {childComments.map((childComment) => (
            <NestedComment
              key={childComment.id}
              comment={childComment}
              allComments={allComments}
              depth={depth + 1}
              isAdmin={isAdmin}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null);
  const [isAdmin] = useState(true);
  const [postVote, setPostVote] = useState<'up' | 'down' | null>(null);
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [shared, setShared] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load post and comments from localStorage
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem('verge_posts');
      const savedComments = localStorage.getItem('verge_comments');

      if (savedPosts) {
        const posts: Post[] = JSON.parse(savedPosts);
        const foundPost = posts.find(p => p.id === postId);
        if (foundPost) {
          setPost(foundPost);
        }
      }

      if (savedComments) {
        const allComments: Comment[] = JSON.parse(savedComments);
        const postComments = allComments.filter(c => c.postId === postId);
        setComments(postComments);
      }

      // If no saved data, load mock data
      if (!savedPosts) {
        const mockPosts: Post[] = [
          {
            id: '1',
            channelId: '1',
            author: 'Anon Beaver',
            color: 'bg-blue-600',
            timestamp: '2 hours ago',
            title: 'Feedback Process Transparency',
            content: 'I think we should reconsider the current feedback process. It would be great to have more transparency without attribution. The team has been doing amazing work, but there are still areas where we can improve our communication flow and make sure everyone feels heard in the process.',
            upvotes: 12,
            downvotes: 2,
            likes: 18,
            dislikes: 3,
            shares: 5,
            reposts: 7,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
          },
          {
            id: '2',
            channelId: '1',
            author: 'Secret Otter',
            color: 'bg-purple-600',
            timestamp: '4 hours ago',
            title: 'New Onboarding Flow Success',
            content: 'The new onboarding process is cleaner than before. Well done to the team on the UI improvements!',
            upvotes: 8,
            downvotes: 0,
            likes: 14,
            dislikes: 0,
            shares: 3,
            reposts: 4,
            image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
          },
        ];
        const foundPost = mockPosts.find(p => p.id === postId);
        if (foundPost) setPost(foundPost);
      }

      if (!savedComments) {
        const mockComments: Comment[] = [
          { id: '1-1', postId: '1', parentId: null, author: 'Secret Otter', color: 'bg-purple-600', content: 'Totally agree! Anonymity helps people speak up.', timestamp: '1.5 hours ago' },
          { id: '1-2', postId: '1', parentId: null, author: 'Ghost Learner', color: 'bg-cyan-600', content: 'What about accountability though?', timestamp: '1.2 hours ago' },
          { id: '1-3', postId: '1', parentId: '1-1', author: 'Anon Fox', color: 'bg-indigo-600', content: 'Accountability can be tracked internally by admins.', timestamp: '1 hour ago' },
          { id: '2-1', postId: '2', parentId: null, author: 'Silent Owl', color: 'bg-indigo-600', content: 'Agreed, much better experience overall.', timestamp: '3.5 hours ago' },
        ];
        const postComments = mockComments.filter(c => c.postId === postId);
        setComments(postComments);
      }
    } catch (error) {
      console.error('Error loading thread data:', error);
    }
  }, [postId]);

  const handleGoBack = () => {
    router.back();
  };

  const handleReply = () => {
    if (replyContent.trim() && post) {
      const newComment: Comment = {
        id: `${post.id}-${Date.now()}`,
        postId: post.id,
        parentId: replyingTo?.id || null,
        author: 'Anonymous User',
        color: 'bg-emerald-600',
        content: replyContent,
        timestamp: 'just now',
      };
      
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      
      // Save to localStorage
      try {
        const savedComments = localStorage.getItem('verge_comments');
        const allComments: Comment[] = savedComments ? JSON.parse(savedComments) : [];
        const otherComments = allComments.filter(c => c.postId !== postId);
        localStorage.setItem('verge_comments', JSON.stringify([...otherComments, ...updatedComments]));
      } catch (error) {
        console.error('Error saving comment:', error);
      }
      
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const handleReplyToComment = (commentId: string, author: string) => {
    setReplyingTo({ id: commentId, author });
    inputRef.current?.focus();
  };

  const handleDeleteComment = (commentId: string) => {
    const updatedComments = comments.filter(c => c.id !== commentId && c.parentId !== commentId);
    setComments(updatedComments);
    
    try {
      const savedComments = localStorage.getItem('verge_comments');
      const allComments: Comment[] = savedComments ? JSON.parse(savedComments) : [];
      const otherComments = allComments.filter(c => c.postId !== postId);
      localStorage.setItem('verge_comments', JSON.stringify([...otherComments, ...updatedComments]));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const toggleVote = (direction: 'up' | 'down') => {
    if (postVote === direction) {
      setPostVote(null);
    } else {
      setPostVote(direction);
    }
  };

  const rootComments = comments.filter(c => c.parentId === null);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00A870] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading thread...</p>
        </div>
      </div>
    );
  }

  const getVoteCount = () => {
    let base = post.upvotes - post.downvotes;
    if (postVote === 'up') base += 1;
    if (postVote === 'down') base -= 1;
    return base;
  };

  const getLikes = () => post.likes + (liked ? 1 : 0);
  const getReposts = () => post.reposts + (reposted ? 1 : 0);
  const getShares = () => post.shares + (shared ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#111827] text-gray-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 bg-[#111827]/95 backdrop-blur-sm border-b border-[#374151]"
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div>
            <h1 className="text-lg font-bold text-white">Thread</h1>
            <p className="text-xs text-gray-500">{rootComments.length} replies</p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Parent Post */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1f2937] rounded-xl border border-[#374151] overflow-hidden mb-6"
        >
          <div className="p-4 md:p-6">
            <div className="flex gap-3 md:gap-4">
              {/* Vote Column */}
              <div className="flex flex-col items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleVote('up')}
                  className={`p-1.5 rounded-lg transition-all ${
                    postVote === 'up'
                      ? 'bg-[#00A870]/30 text-[#00A870]'
                      : 'text-gray-400 hover:bg-[#374151] hover:text-white'
                  }`}
                >
                  <ChevronUp size={18} />
                </motion.button>

                <span className={`text-sm font-bold ${
                  postVote === 'up' ? 'text-[#00A870]' : postVote === 'down' ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {getVoteCount()}
                </span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleVote('down')}
                  className={`p-1.5 rounded-lg transition-all ${
                    postVote === 'down'
                      ? 'bg-red-500/30 text-red-400'
                      : 'text-gray-400 hover:bg-red-500/10 hover:text-red-400'
                  }`}
                >
                  <ChevronDown size={18} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${post.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <span className="font-mono font-semibold text-white">{post.author}</span>
                    <span className="text-xs text-gray-500 ml-2">· {post.timestamp}</span>
                  </div>
                </div>

                <p className="text-gray-200 leading-relaxed mb-4">{post.content}</p>

                {post.image && (
                  <div className="mb-4 w-full h-[280px] md:h-[360px] rounded-xl overflow-hidden">
                    <img
                      src={post.image}
                      alt="Post media"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                )}

                {/* Metrics */}
                <div className="flex items-center gap-4 md:gap-6 pt-3 border-t border-[#374151] text-xs font-medium">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      liked ? 'text-pink-400 font-semibold' : 'text-gray-400 hover:text-pink-400'
                    }`}
                  >
                    <ThumbsUp size={14} fill={liked ? 'currentColor' : 'none'} />
                    <span>{getLikes()}</span>
                  </motion.button>

                  <div className="flex items-center gap-1.5 text-[#00A870]">
                    <MessageCircle size={14} />
                    <span>{rootComments.length}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setReposted(!reposted)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      reposted ? 'text-green-400 font-semibold' : 'text-gray-400 hover:text-green-400'
                    }`}
                  >
                    <Repeat2 size={14} />
                    <span>{getReposts()}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShared(!shared)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      shared ? 'text-blue-400 font-semibold' : 'text-gray-400 hover:text-blue-400'
                    }`}
                  >
                    <Share2 size={14} />
                    <span>{getShares()}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Comments Section */}
        <section className="mb-32">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={18} className="text-[#00A870]" />
            <h2 className="text-sm font-semibold text-white">Replies ({rootComments.length})</h2>
          </div>

          {rootComments.length > 0 ? (
            <div className="space-y-4">
              {rootComments.map((comment) => (
                <NestedComment
                  key={comment.id}
                  comment={comment}
                  allComments={comments}
                  depth={0}
                  isAdmin={isAdmin}
                  onReply={handleReplyToComment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#1f2937] rounded-xl border border-[#374151]">
              <MessageCircle size={32} className="mx-auto mb-3 text-gray-600" />
              <p className="text-sm text-gray-400">No replies yet. Start the conversation!</p>
            </div>
          )}
        </section>
      </main>

      {/* Fixed Reply Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-[#374151] p-4"
      >
        <div className="max-w-2xl mx-auto space-y-3">
          <AnimatePresence>
            {replyingTo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#1f2937] px-3 py-2 rounded-lg flex items-center justify-between text-xs border border-[#374151]"
              >
                <span className="text-gray-400">
                  Replying to <strong className="text-[#00A870]">@{replyingTo.author}</strong>
                </span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={replyingTo ? `Reply to @${replyingTo.author}...` : "Add a reply..."}
              className="flex-1 min-h-12 max-h-32 px-4 py-3 bg-[#1f2937] border border-[#374151] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A870]/50 resize-none"
              rows={1}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReply}
              disabled={!replyContent.trim()}
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#00A870] to-[#006239] hover:from-[#00A870]/90 hover:to-[#006239]/90 disabled:from-[#374151] disabled:to-[#374151] disabled:cursor-not-allowed text-white font-semibold transition-all"
            >
              <Send size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import { X, MessageCircle, Trash2, Reply, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Post, Comment } from '@/app/page';

interface ThreadDrawerProps {
  post: Post;
  comments: Comment[];
  isAdmin: boolean;
  onClose: () => void;
  onAddComment: (postId: string, content: string, parentId: string | null) => void;
  onDeleteComment: (commentId: string) => void;
  onHideCreatePost?: (hide: boolean) => void;
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
  const indentClass = depth > 0 ? 'ml-6' : '';
  const borderClass = depth > 0 ? 'border-l-2 border-[#3a3a3a] hover:border-[#006239] pl-4 transition-colors' : '';

  return (
    <div className={`${indentClass}`}>
      <div className={`${borderClass} pb-4`}>
        {/* Comment Header */}
        <div className="flex items-start gap-3 group">
          <div className={`w-7 h-7 rounded-full ${comment.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
            {comment.author.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#DDE8E3] text-sm">{comment.author}</span>
              <span className="text-xs text-[#666]">{comment.timestamp}</span>
              {isAdmin && (
                <button onClick={() => onDelete(comment.id)} className="ml-auto p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={12} />
                </button>
              )}
            </div>

            {/* Comment Content */}
            <p className="text-sm text-[#ccc] mt-1 leading-relaxed break-words">{comment.content}</p>

            {/* Reply Button */}
            <button
              onClick={() => onReply(comment.id, comment.author)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#666] hover:text-[#006239] transition-colors"
            >
              <Reply size={12} />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nested Replies - No overflow hidden */}
      {childComments.length > 0 && (
        <div className="mt-2">
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
    </div>
  );
};

export default function ThreadDrawer({
  post,
  comments,
  isAdmin,
  onClose,
  onAddComment,
  onDeleteComment,
  onHideCreatePost,
}: ThreadDrawerProps) {
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hasScrolledIntoComments, setHasScrolledIntoComments] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const commentsStartRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const rootComments = comments.filter(c => c.parentId === null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const commentsStart = commentsStartRef.current;

    if (!scrollContainer || !commentsStart) return;

    const handleScroll = () => {
      const commentsRect = commentsStart.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      const isInCommentZone = commentsRect.top < containerRect.top + 100;
      
      if (isInCommentZone !== hasScrolledIntoComments) {
        setHasScrolledIntoComments(isInCommentZone);
        if (onHideCreatePost) {
          onHideCreatePost(isInCommentZone);
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [hasScrolledIntoComments, onHideCreatePost]);

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (onHideCreatePost) {
      onHideCreatePost(true);
    }
  };

  const handleInputBlur = () => {
    if (!replyContent.trim()) {
      setIsInputFocused(false);
      if (onHideCreatePost && !hasScrolledIntoComments) {
        onHideCreatePost(false);
      }
    }
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onAddComment(post.id, replyContent, replyingTo?.id || null);
      setReplyContent('');
      setReplyingTo(null);
      setIsInputFocused(false);
      if (onHideCreatePost && !hasScrolledIntoComments) {
        onHideCreatePost(false);
      }
    }
  };

  const handleReplyToComment = (commentId: string, author: string) => {
    setReplyingTo({ id: commentId, author });
    inputRef.current?.focus();
  };

  const handleCancelReply = () => {
    setReplyContent('');
    setReplyingTo(null);
    setIsInputFocused(false);
    if (onHideCreatePost && !hasScrolledIntoComments) {
      onHideCreatePost(false);
    }
  };

  return (
    <div className="w-96 border-l border-[#3a3a3a] bg-[#242424] flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#3a3a3a] flex items-center justify-between bg-[#1a1a1a] flex-shrink-0">
        <div className="flex items-center gap-2 text-[#DDE8E3] font-semibold">
          <MessageCircle size={18} />
          <span>Thread</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-[#333] rounded-lg transition-all text-[#666] hover:text-[#DDE8E3]"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content - Fixed overflow */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        {/* Parent Post */}
        <div className="px-5 py-5 border-b border-[#3a3a3a] bg-[#1a1a1a]">
          <div className="mb-3">
            <span className="text-xs font-bold text-[#006239] uppercase tracking-wider">Parent Post</span>
          </div>

          <div className="flex items-start gap-3 group">
            <div className={`w-8 h-8 rounded-full ${post.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {post.author.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#DDE8E3] text-sm">{post.author}</span>
                <span className="text-xs text-[#666]">{post.timestamp}</span>
              </div>

              <h3 className="font-semibold text-[#DDE8E3] text-sm mt-2">{post.title}</h3>
              <p className="text-sm text-[#aaa] mt-2 leading-relaxed">{post.content}</p>

              {/* Post Image - Controlled Size */}
              {post.image && (
                <div className="mt-3">
                  <img
                    src={post.image}
                    alt="Post media"
                    className="max-h-[200px] max-w-full w-auto rounded-lg object-contain bg-[#0a0a0a]"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section - No restrictive overflow */}
        <div ref={commentsStartRef} className="px-5 py-5">
          {rootComments.length > 0 ? (
            <div className="space-y-2">
              {rootComments.map((comment) => (
                <NestedComment
                  key={comment.id}
                  comment={comment}
                  allComments={comments}
                  depth={0}
                  isAdmin={isAdmin}
                  onReply={handleReplyToComment}
                  onDelete={onDeleteComment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle size={32} className="mx-auto mb-3 text-[#444]" />
              <p className="text-sm text-[#666]">No replies yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Input - Fixed at bottom */}
      <div className="px-5 py-4 border-t border-[#3a3a3a] bg-[#1a1a1a] flex-shrink-0 space-y-3">
        {replyingTo && (
          <div className="bg-[#2a2a2a] px-3 py-2 rounded-lg flex items-center justify-between text-xs border border-[#3a3a3a]">
            <span className="text-[#888]">Replying to <strong className="text-[#006239]">@{replyingTo.author}</strong></span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-[#666] hover:text-[#DDE8E3] transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <textarea
          ref={inputRef}
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={replyingTo ? `Reply to @${replyingTo.author}...` : "Reply to this thread..."}
          className="w-full min-h-16 px-4 py-3 bg-[#000000] border border-[#3a3a3a] rounded-lg text-[#DDE8E3] text-sm placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#006239]/50 focus:border-transparent resize-none transition-all"
        />

        <div className="flex gap-2">
          <button
            onClick={handleCancelReply}
            className="flex-1 px-4 py-2 rounded-lg bg-[#333] hover:bg-[#444] text-[#aaa] font-medium transition-colors text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleReply}
            disabled={!replyContent.trim()}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#006239] hover:bg-[#005230] disabled:bg-[#333] disabled:text-[#666] disabled:cursor-not-allowed text-white font-semibold transition-all text-xs"
          >
            <Send size={14} />
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
}

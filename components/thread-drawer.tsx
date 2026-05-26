'use client';

import { X, MessageCircle, Trash2, Reply, Send } from 'lucide-react';
import { useState } from 'react';
import type { Post, Comment } from '@/app/page';

interface ThreadDrawerProps {
  post: Post;
  comments: Comment[];
  isAdmin: boolean;
  onClose: () => void;
  onAddComment: (postId: string, content: string, parentId: string | null) => void;
  onDeleteComment: (commentId: string) => void;
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
  onReply: (commentId: string, depth: number) => void;
  onDelete: (commentId: string) => void;
}) => {
  const childComments = allComments.filter(c => c.parentId === comment.id);
  const indentClass = depth > 0 ? 'ml-8' : '';
  const borderClass = depth > 0 ? 'border-l-2 border-slate-700 hover:border-primary/50 pl-4 transition-colors' : '';

  return (
    <div className={`${indentClass} pb-6`}>
      <div className={`${borderClass}`}>
        {/* Comment Header */}
        <div className="flex items-start gap-3 group">
          <div className={`w-8 h-8 rounded-full ${comment.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {comment.author.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-semibold text-foreground text-sm">{comment.author}</span>
                <span className="text-xs text-foreground/50">{comment.timestamp}</span>
              </div>
              {isAdmin && (
                <button onClick={() => onDelete(comment.id)} className="p-1 rounded-lg text-destructive hover:bg-destructive/20 transition-all">
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Comment Content */}
            <p className="text-sm text-foreground/90 mt-2 leading-relaxed break-words">{comment.content}</p>

            {/* Reply Button */}
            <button
              onClick={() => onReply(comment.id, depth)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/60 hover:text-primary transition-colors"
            >
              <Reply size={12} />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nested Replies */}
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
}: ThreadDrawerProps) {
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const rootComments = comments.filter(c => c.parentId === null);

  const handleReply = () => {
    if (replyContent.trim()) {
      onAddComment(post.id, replyContent, replyingTo);
      setReplyContent('');
      setReplyingTo(null);
    }
  };
  return (
    <div className="w-96 border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <MessageCircle size={18} />
          <span>Thread</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-border/30 rounded-lg transition-all text-foreground/60 hover:text-foreground"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Parent Post - Pinned */}
        <div className="px-6 py-5 border-b border-border/50 bg-secondary/30 sticky top-0 z-5">
          <div className="mb-3">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Parent Post</span>
          </div>

          <div className="flex items-start gap-3 group">
            <div className={`w-8 h-8 rounded-full ${post.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {post.author.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-semibold text-foreground text-sm">{post.author}</span>
                  <span className="text-xs text-foreground/50">{post.timestamp}</span>
                </div>
              </div>

              <h3 className="font-bold text-foreground text-sm mt-2">{post.title}</h3>
              <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{post.content}</p>

              {/* Post Image in Thread */}
              {post.image && (
                <div className="mt-3 w-full h-40 rounded-xl overflow-hidden">
                  <img
                    src={post.image}
                    alt="Post media"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="px-6 py-6">
          {rootComments.length > 0 ? (
            <div className="space-y-4">
              {rootComments.map((comment) => (
                <NestedComment
                  key={comment.id}
                  comment={comment}
                  allComments={comments}
                  depth={0}
                  isAdmin={isAdmin}
                  onReply={setReplyingTo}
                  onDelete={onDeleteComment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle size={32} className="mx-auto mb-3 text-foreground/30" />
              <p className="text-sm text-foreground/60">No replies yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Input */}
      <div className="px-6 py-5 border-t border-border bg-card/50 backdrop-blur-sm space-y-3">
        {replyingTo && (
          <div className="bg-secondary/30 px-3 py-2 rounded-lg flex items-center justify-between text-xs">
            <span className="text-foreground/70">Replying to comment...</span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-foreground/50 hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Reply anonymously to this thread..."
          className="w-full min-h-16 px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground text-sm placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none transition-all"
        />

        <div className="flex gap-2">
          <button
            onClick={() => {
              setReplyContent('');
              setReplyingTo(null);
            }}
            className="flex-1 px-4 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 text-foreground/70 font-medium transition-colors text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleReply}
            disabled={!replyContent.trim()}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:from-muted disabled:to-muted disabled:cursor-not-allowed text-white font-semibold transition-all text-xs"
          >
            <Send size={14} />
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
}

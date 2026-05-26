"use client";

import { useState } from "react";
import { X, Send, Reply } from "lucide-react";
import type { Post, Comment } from "@/lib/types";

interface ThreadDrawerProps {
  post: Post;
  comments: Comment[];
  currentUserId: string;
  onClose: () => void;
  onAddComment: (postId: string, content: string, parentId?: string) => void;
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

interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  depth: number;
  onReply: (parentId: string) => void;
  replyingTo: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onSubmitReply: (parentId: string) => void;
}

function CommentItem({
  comment,
  allComments,
  depth,
  onReply,
  replyingTo,
  replyContent,
  setReplyContent,
  onSubmitReply,
}: CommentItemProps) {
  const replies = allComments.filter((c) => c.parentId === comment.id);
  const maxDepth = 4;

  return (
    <div className={depth > 0 ? "ml-6 border-l border-[#3a3a3a] pl-4" : ""}>
      <div className="py-3">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-[#006239] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-white">
              {comment.username.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-[#f5f5f5]">
                {comment.username}
              </span>
              <span className="text-[#a0a0a0]">·</span>
              <span className="text-[#a0a0a0] text-xs">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>

            <p className="mt-1 text-[#f5f5f5] text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </p>

            {depth < maxDepth && (
              <button
                onClick={() => onReply(comment.id)}
                className="mt-2 flex items-center gap-1 text-xs text-[#a0a0a0] hover:text-[#006239] transition-colors"
              >
                <Reply className="w-3 h-3" />
                Reply
              </button>
            )}

            {replyingTo === comment.id && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 py-2 px-3 rounded-lg text-sm text-[#f5f5f5] placeholder-[#a0a0a0]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && replyContent.trim()) {
                      onSubmitReply(comment.id);
                    }
                  }}
                />
                <button
                  onClick={() => onSubmitReply(comment.id)}
                  disabled={!replyContent.trim()}
                  className="p-2 bg-[#006239] text-white rounded-lg hover:bg-[#00472a] transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {replies.length > 0 && (
        <div>
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              allComments={allComments}
              depth={depth + 1}
              onReply={onReply}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onSubmitReply={onSubmitReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ThreadDrawer({
  post,
  comments,
  currentUserId,
  onClose,
  onAddComment,
}: ThreadDrawerProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const topLevelComments = comments.filter((c) => !c.parentId);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(post.id, newComment.trim());
      setNewComment("");
    }
  };

  const handleReply = (parentId: string) => {
    setReplyingTo(replyingTo === parentId ? null : parentId);
    setReplyContent("");
  };

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim()) {
      onAddComment(post.id, replyContent.trim(), parentId);
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#242424] z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
          <h2 className="text-lg font-semibold text-[#f5f5f5]">Thread</h2>
          <button
            onClick={onClose}
            className="p-2 text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-[#3a3a3a]">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#006239] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-white">
                  {post.username.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-[#f5f5f5]">
                    {post.username}
                  </span>
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
                      className="max-h-[300px] max-w-full w-auto rounded-lg object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-sm font-medium text-[#a0a0a0] mb-4">
              {comments.length > 0
                ? `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`
                : "No comments yet"}
            </h3>

            <div>
              {topLevelComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  allComments={comments}
                  depth={0}
                  onReply={handleReply}
                  replyingTo={replyingTo}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  onSubmitReply={handleSubmitReply}
                />
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmitComment}
          className="p-4 border-t border-[#3a3a3a]"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 py-2 px-4 rounded-lg text-[#f5f5f5] placeholder-[#a0a0a0]"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-[#006239] text-white rounded-lg font-medium hover:bg-[#00472a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppState, Post, Comment, User } from "./types";

const STORAGE_KEY = "feed-app-state";

const defaultState: AppState = {
  user: null,
  posts: [],
  comments: [],
  hasCompletedOnboarding: false,
};

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export function useAppState() {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch {
        setState(defaultState);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const setUser = useCallback((user: User | null) => {
    setState((prev) => ({ ...prev, user }));
  }, []);

  const completeOnboarding = useCallback((username: string) => {
    const newUser: User = {
      id: generateId(),
      username,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      user: newUser,
      hasCompletedOnboarding: true,
    }));
  }, []);

  const skipOnboarding = useCallback(() => {
    const guestUser: User = {
      id: generateId(),
      username: `Guest_${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      user: guestUser,
      hasCompletedOnboarding: true,
    }));
  }, []);

  const addPost = useCallback((content: string, imageUrl?: string) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const newPost: Post = {
        id: generateId(),
        userId: prev.user.id,
        username: prev.user.username,
        content,
        imageUrl,
        likes: 0,
        commentCount: 0,
        likedBy: [],
        createdAt: new Date().toISOString(),
      };
      return { ...prev, posts: [newPost, ...prev.posts] };
    });
  }, []);

  const toggleLike = useCallback((postId: string) => {
    setState((prev) => {
      if (!prev.user) return prev;
      return {
        ...prev,
        posts: prev.posts.map((post) => {
          if (post.id !== postId) return post;
          const isLiked = post.likedBy.includes(prev.user!.id);
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked
              ? post.likedBy.filter((id) => id !== prev.user!.id)
              : [...post.likedBy, prev.user!.id],
          };
        }),
      };
    });
  }, []);

  const addComment = useCallback(
    (postId: string, content: string, parentId?: string) => {
      setState((prev) => {
        if (!prev.user) return prev;
        const newComment: Comment = {
          id: generateId(),
          postId,
          userId: prev.user.id,
          username: prev.user.username,
          content,
          parentId,
          createdAt: new Date().toISOString(),
        };
        return {
          ...prev,
          comments: [...prev.comments, newComment],
          posts: prev.posts.map((post) =>
            post.id === postId
              ? { ...post, commentCount: post.commentCount + 1 }
              : post
          ),
        };
      });
    },
    []
  );

  const getCommentsForPost = useCallback(
    (postId: string) => {
      return state.comments.filter((c) => c.postId === postId);
    },
    [state.comments]
  );

  return {
    ...state,
    isLoaded,
    setUser,
    completeOnboarding,
    skipOnboarding,
    addPost,
    toggleLike,
    addComment,
    getCommentsForPost,
  };
}

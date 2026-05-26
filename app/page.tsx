"use client";

import { useAppState } from "@/lib/store";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { Feed } from "@/components/Feed";

export default function Home() {
  const {
    user,
    posts,
    hasCompletedOnboarding,
    isLoaded,
    completeOnboarding,
    skipOnboarding,
    addPost,
    toggleLike,
    addComment,
    getCommentsForPost,
  } = useAppState();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#006239] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasCompletedOnboarding || !user) {
    return (
      <WelcomeScreen
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
      />
    );
  }

  return (
    <Feed
      posts={posts}
      currentUserId={user.id}
      username={user.username}
      onAddPost={addPost}
      onLike={toggleLike}
      onAddComment={addComment}
      getCommentsForPost={getCommentsForPost}
    />
  );
}

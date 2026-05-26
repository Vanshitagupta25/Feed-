export interface User {
  id: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  imageUrl?: string;
  likes: number;
  commentCount: number;
  likedBy: string[];
  createdAt: string;
}

export interface AppState {
  user: User | null;
  posts: Post[];
  comments: Comment[];
  hasCompletedOnboarding: boolean;
}

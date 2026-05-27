'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '@/components/sidebar';
import Feed from '@/components/feed';
import FloatingPostFAB from '@/components/floating-post-fab';
import PostCreationScreen from '@/components/post-creation-screen';
import ChannelOnboarding from '@/components/channel-onboarding';

export interface Channel {
  id: string;
  name: string;
  description: string;
}

export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  author: string;
  color: string;
  content: string;
  timestamp: string;
}

export interface Post {
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

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  followers: number;
  recentPosts: number;
}

const animalAliases = [
  'Anon Beaver', 'Secret Otter', 'Ghost Learner', 'Anon Fox',
  'Silent Owl', 'Mystery Panda', 'Quiet Eagle', 'Shy Dolphin',
  'Clever Raccoon', 'Swift Falcon', 'Wise Sage', 'Noble Wolf',
];

const colorOptions = [
  'bg-blue-600', 'bg-purple-600', 'bg-cyan-600', 'bg-indigo-600',
  'bg-teal-600', 'bg-green-600', 'bg-pink-600', 'bg-orange-600',
];

const getRandomAlias = () => animalAliases[Math.floor(Math.random() * animalAliases.length)];
const getRandomColor = () => colorOptions[Math.floor(Math.random() * colorOptions.length)];

export default function Page() {
  const [isAdminView] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [joinedChannelIds, setJoinedChannelIds] = useState<string[]>([]);
  const [showPostCreation, setShowPostCreation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [channels, setChannels] = useState<Channel[]>([
    { id: '1', name: 'product-feedback', description: 'Share feedback on our products and features' },
    { id: '2', name: 'engineering-core', description: 'Technical discussions and engineering updates' },
    { id: '3', name: 'anonymous-bites', description: 'Quick thoughts and random ideas' },
  ]);

  const [activeChannelId, setActiveChannelId] = useState('1');

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      channelId: '1',
      author: 'Anon Beaver',
      color: 'bg-blue-600',
      timestamp: '2 hours ago',
      title: 'Feedback Process Transparency',
      content: 'I think we should reconsider the current feedback process. It would be great to have more transparency without attribution. This is something that many team members have been asking for, and I believe implementing an anonymous feedback system could really help improve our overall communication and decision-making processes.',
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
    {
      id: '3',
      channelId: '2',
      author: 'Ghost Learner',
      color: 'bg-cyan-600',
      timestamp: '6 hours ago',
      title: 'Improving API Performance',
      content: 'We should consider migrating to a more efficient caching layer for our backend services. This could significantly reduce response times.',
      upvotes: 15,
      downvotes: 1,
      likes: 22,
      dislikes: 2,
      shares: 8,
      reposts: 11,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '4',
      channelId: '2',
      author: 'Silent Owl',
      color: 'bg-indigo-600',
      timestamp: '3 hours ago',
      title: 'Database Optimization Ideas',
      content: 'Has anyone looked at query optimization? We might be able to reduce database load by implementing better indexing strategies.',
      upvotes: 9,
      downvotes: 0,
      likes: 13,
      dislikes: 1,
      shares: 4,
      reposts: 6,
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '5',
      channelId: '3',
      author: 'Mystery Panda',
      color: 'bg-teal-600',
      timestamp: '1 hour ago',
      title: 'Coffee Break Thoughts',
      content: 'Just had a random idea during lunch - what if we added dark mode? Would that help productivity?',
      upvotes: 5,
      downvotes: 1,
      likes: 9,
      dislikes: 2,
      shares: 2,
      reposts: 3,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '6',
      channelId: '3',
      author: 'Quiet Eagle',
      color: 'bg-green-600',
      timestamp: '30 minutes ago',
      title: 'Weekend Project Idea',
      content: 'Would love to contribute to open source. Any projects the team recommends?',
      upvotes: 7,
      downvotes: 0,
      likes: 11,
      dislikes: 0,
      shares: 3,
      reposts: 2,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    { id: '1-1', postId: '1', parentId: null, author: 'Secret Otter', color: 'bg-purple-600', content: 'Totally agree! Anonymity helps people speak up.', timestamp: '1.5 hours ago' },
    { id: '1-2', postId: '1', parentId: null, author: 'Ghost Learner', color: 'bg-cyan-600', content: 'What about accountability though?', timestamp: '1.2 hours ago' },
    { id: '1-3', postId: '1', parentId: '1-1', author: 'Anon Fox', color: 'bg-indigo-600', content: 'Accountability can be tracked internally by admins.', timestamp: '1 hour ago' },
    { id: '2-1', postId: '2', parentId: null, author: 'Silent Owl', color: 'bg-indigo-600', content: 'Agreed, much better experience overall.', timestamp: '3.5 hours ago' },
    { id: '3-1', postId: '3', parentId: null, author: 'Quiet Eagle', color: 'bg-teal-600', content: 'Yes! Nested threads are essential for clarity.', timestamp: '5 hours ago' },
    { id: '3-2', postId: '3', parentId: null, author: 'Anon Beaver', color: 'bg-blue-600', content: 'This is exactly why we built this platform.', timestamp: '4.8 hours ago' },
  ]);

  const activeChannel = channels.find(c => c.id === activeChannelId);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hydrate session from localStorage
  useEffect(() => {
    try {
      const loggedInStatus = window.localStorage.getItem('verge_logged_in');
      const savedUserData = window.localStorage.getItem('verge_user');
      const hasCompletedOnboarding = window.localStorage.getItem('verge_onboarding_complete');

      if (loggedInStatus === 'true' && savedUserData) {
        setCurrentUser(JSON.parse(savedUserData));
        setIsAuthenticated(true);
        
        // Show onboarding if not completed
        if (!hasCompletedOnboarding) {
          setShowOnboarding(true);
        }
      }
    } catch (error) {
      console.error("Hydration error reading localStorage session:", error);
    }
  }, []);

  const handleAuthenticate = (user: User) => {
    localStorage.setItem('verge_logged_in', 'true');
    localStorage.setItem('verge_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowOnboarding(true); // Show onboarding after sign in
  };

  const handleLogout = () => {
    localStorage.removeItem('verge_logged_in');
    localStorage.removeItem('verge_user');
    localStorage.removeItem('verge_onboarding_complete');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowPostCreation(false);
    setJoinedChannelIds([]);
  };

  const addChannel = (name: string, description: string) => {
    const newChannel: Channel = {
      id: String(channels.length + 1),
      name,
      description,
    };
    setChannels([...channels, newChannel]);
  };

  const addPost = (title: string, content: string) => {
    const newPost: Post = {
      id: String(posts.length + 1),
      channelId: activeChannelId,
      author: getRandomAlias(),
      color: getRandomColor(),
      timestamp: 'just now',
      title,
      content,
      upvotes: 0,
      downvotes: 0,
      likes: 0,
      dislikes: 0,
      shares: 0,
      reposts: 0,
    };
    setPosts([newPost, ...posts]);
  };

  const addComment = (postId: string, content: string, parentId: string | null = null) => {
    const newComment: Comment = {
      id: `${postId}-${comments.length + 1}`,
      postId,
      parentId,
      author: getRandomAlias(),
      color: getRandomColor(),
      content,
      timestamp: 'just now',
    };
    setComments([...comments, newComment]);
  };

  const deletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
    setComments(comments.filter(c => c.postId !== postId));
  };

  const deleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
  };

  const handleJoinChannel = (channelId: string) => {
    if (!joinedChannelIds.includes(channelId)) {
      setJoinedChannelIds([...joinedChannelIds, channelId]);
    }
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('verge_onboarding_complete', 'true');
    setShowOnboarding(false);
    if (joinedChannelIds.length > 0) {
      setActiveChannelId(joinedChannelIds[0]);
    }
  };

  const handleCreatePost = (content: string, image?: string) => {
    const newPost: Post = {
      id: String(posts.length + 1),
      channelId: activeChannelId,
      author: currentUser?.username || 'Anonymous',
      color: 'bg-blue-600',
      timestamp: 'just now',
      title: content.substring(0, 50),
      content,
      upvotes: 0,
      downvotes: 0,
      likes: 0,
      dislikes: 0,
      shares: 0,
      reposts: 0,
      image,
    };
    setPosts([newPost, ...posts]);
  };

  const handleUpdateUsername = (newUsername: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, username: newUsername };
      setCurrentUser(updatedUser);
      localStorage.setItem('verge_user', JSON.stringify(updatedUser));
    }
  };

  const handleUpdateAvatar = (avatarImage: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, avatar: avatarImage };
      setCurrentUser(updatedUser);
      localStorage.setItem('verge_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111827] text-foreground overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Only render when authenticated */}
        <AnimatePresence mode="wait">
          {isAuthenticated && (
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'} ${isMobile && !sidebarOpen ? 'hidden' : ''}`}
            >
              <Sidebar
                channels={channels}
                activeChannelId={activeChannelId}
                onSelectChannel={(id) => {
                  setActiveChannelId(id);
                  if (isMobile) setSidebarOpen(false);
                }}
                onCreateChannel={addChannel}
                isAdmin={isAdminView}
                onAdminToggle={() => {}}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobile && sidebarOpen && isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Feed Component */}
        <Feed
          posts={posts.filter(p => p.channelId === activeChannelId)}
          comments={comments}
          channels={channels}
          users={[]} // For search
          channel={activeChannel}
          isAdmin={isAdminView}
          currentUser={currentUser}
          isAuthenticated={isAuthenticated}
          onAuthenticate={handleAuthenticate}
          onCreatePost={addPost}
          onDeletePost={deletePost}
          onAddComment={addComment}
          onDeleteComment={deleteComment}
          onLogout={handleLogout}
          onUpdateUsername={handleUpdateUsername}
          onUpdateAvatar={handleUpdateAvatar}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />

        {/* Floating Post Creation FAB - Only when authenticated */}
        {isAuthenticated && (
          <FloatingPostFAB onClick={() => setShowPostCreation(true)} isVisible={true} />
        )}

        {/* Post Creation Screen */}
        <PostCreationScreen
          isOpen={showPostCreation}
          currentUser={currentUser}
          onClose={() => setShowPostCreation(false)}
          onSubmit={handleCreatePost}
        />

        {/* Channel Onboarding - After sign in */}
        <AnimatePresence>
          {showOnboarding && isAuthenticated && (
            <ChannelOnboarding
              channels={channels}
              joinedChannelIds={joinedChannelIds}
              onJoinChannel={handleJoinChannel}
              onComplete={handleCompleteOnboarding}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

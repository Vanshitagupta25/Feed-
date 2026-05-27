'use client';

import { ChevronDown, LogOut, Pencil, Users, Camera, X as XIcon, Sun, Moon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { User } from '@/app/page';

interface ProfileToggleProps {
  currentUser: User | null;
  onUpdateUsername: (newUsername: string) => void;
  onUpdateAvatar?: (avatarImage: string) => void;
  onLogout: () => void;
}

export default function ProfileToggle({ currentUser, onUpdateUsername, onUpdateAvatar, onLogout }: ProfileToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(currentUser?.username || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up blob URL on unmount or when avatar changes
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  if (!currentUser) return null;

  const handleSaveUsername = () => {
    if (usernameInput.trim()) {
      onUpdateUsername(usernameInput);
      setEditingUsername(false);
    }
  };

  const handleCancel = () => {
    setEditingUsername(false);
    setUsernameInput(currentUser.username);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous blob URL if it exists
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
      // Create new blob URL using URL.createObjectURL
      const blobUrl = URL.createObjectURL(file);
      setAvatarPreview(blobUrl);
      // Push to global state
      if (onUpdateAvatar) {
        onUpdateAvatar(blobUrl);
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would toggle a global theme
  };

  // Use global avatar if available, otherwise use local preview
  const displayAvatar = currentUser.avatar?.startsWith('blob:') ? currentUser.avatar : avatarPreview;

  return (
    <div className="flex items-center gap-3">
      {/* Light/Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? (
          <Sun size={18} className="text-yellow-300" />
        ) : (
          <Moon size={18} className="text-white/70" />
        )}
      </button>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
        >
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="Avatar"
              className="w-7 h-7 rounded-lg object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00A870] to-[#006239] flex items-center justify-center text-white text-xs font-bold">
              {currentUser.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <span className="text-sm font-semibold text-white">{currentUser.username}</span>
          <ChevronDown size={16} className={`text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-[#006239] border border-[#00845C] rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            {/* Profile Header */}
            <div className="bg-[#0a0a0a] p-4 space-y-4">
              {/* Avatar & Info */}
              <div className="flex items-center gap-3">
                <div className="relative group">
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt="Avatar"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00A870] to-[#006239] flex items-center justify-center text-white text-sm font-bold">
                      {currentUser.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <Camera size={14} className="text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{currentUser.email}</p>
                  <p className="text-xs text-white/60">{currentUser.username}</p>
                </div>
              </div>

              {/* Edit Username */}
              {editingUsername ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00A870]/50 transition-all"
                    placeholder="Enter username"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveUsername}
                      className="flex-1 px-3 py-1.5 bg-[#00A870]/30 hover:bg-[#00A870]/40 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingUsername(true);
                    setUsernameInput(currentUser.username);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white/70 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Pencil size={14} />
                  Edit Profile / Edit Username
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="border-t border-[#00845C] p-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#00A870]">{currentUser.followers}</p>
                <p className="text-xs text-white/60 flex items-center justify-center gap-1 mt-1">
                  <Users size={12} />
                  Followers
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{currentUser.recentPosts}</p>
                <p className="text-xs text-white/60">Posts</p>
              </div>
            </div>

            {/* Logout */}
            <div className="border-t border-[#00845C] p-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-semibold transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

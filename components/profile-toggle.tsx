'use client';

import { ChevronDown, LogOut, Pencil, Users, Camera, X as XIcon } from 'lucide-react';
import { useState, useRef } from 'react';
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
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setAvatarPreview(imageData);
        if (onUpdateAvatar) {
          onUpdateAvatar(imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/50 transition-all"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
          {currentUser.avatar}
        </div>
        <span className="text-sm font-semibold text-foreground">{currentUser.username}</span>
        <ChevronDown size={16} className={`text-foreground/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Profile Header */}
          <div className="bg-secondary/20 p-4 space-y-4">
            {/* Avatar & Info */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {currentUser.avatar}
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
                <p className="text-sm font-semibold text-foreground">{currentUser.email}</p>
                <p className="text-xs text-foreground/60">{currentUser.username}</p>
              </div>
            </div>

            {/* Edit Username */}
            {editingUsername ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Enter username"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveUsername}
                    className="flex-1 px-3 py-1.5 bg-primary/30 hover:bg-primary/40 text-primary text-xs font-semibold rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-3 py-1.5 bg-border/50 hover:bg-border text-foreground/70 text-xs font-semibold rounded-lg transition-colors"
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
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-border/30 hover:bg-border/50 text-foreground/70 text-xs font-semibold rounded-lg transition-colors"
              >
                <Pencil size={14} />
                Edit Username
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="border-t border-border p-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{currentUser.followers}</p>
              <p className="text-xs text-foreground/60 flex items-center justify-center gap-1 mt-1">
                <Users size={12} />
                Followers
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{currentUser.recentPosts}</p>
              <p className="text-xs text-foreground/60">Posts</p>
            </div>
          </div>

          {/* Logout */}
          <div className="border-t border-border p-4">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-destructive/20 hover:bg-destructive/30 text-destructive rounded-lg text-sm font-semibold transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

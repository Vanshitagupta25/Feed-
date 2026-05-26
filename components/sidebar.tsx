'use client';

import { Plus, Shield, X } from 'lucide-react';
import { useState } from 'react';
import type { Channel } from '@/app/page';

interface SidebarProps {
  channels: Channel[];
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
  onCreateChannel: (name: string, description: string) => void;
  isAdmin: boolean;
  onAdminToggle: (admin: boolean) => void;
}

export default function Sidebar({
  channels,
  activeChannelId,
  onSelectChannel,
  onCreateChannel,
  isAdmin,
  onAdminToggle,
}: SidebarProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      onCreateChannel(newChannelName, newChannelDesc);
      setNewChannelName('');
      setNewChannelDesc('');
      setShowCreateModal(false);
    }
  };

  return (
    <div className="w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border/30">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">WorkspaceHub</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Internal Community Platform</p>
      </div>

      {/* Create Channel Button */}
      <div className="p-4 border-b border-sidebar-border/30">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-primary/50"
        >
          <Plus size={18} />
          <span>Create Channel</span>
        </button>
        <p className="text-xs text-sidebar-foreground/50 mt-2 text-center">Admin Feature</p>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 px-2 py-1 mb-2">Channels</div>
        {channels.map((channel) => (
          <div key={channel.id} className="group">
            <button
              onClick={() => onSelectChannel(channel.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 ${
                activeChannelId === channel.id
                  ? 'bg-primary/20 text-primary border border-primary/40 font-semibold'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-border/20'
              }`}
            >
              <span className="text-sm font-mono">#{channel.name}</span>
            </button>
            {activeChannelId === channel.id && (
              <div className="px-4 py-2 text-xs text-sidebar-foreground/60 border-l-2 border-primary/40 ml-2">
                {channel.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border/30 text-xs text-sidebar-foreground/50 text-center space-y-1">
        <div className="flex items-center justify-center gap-1">
          <Shield size={14} />
          <span>Anonymous by Design</span>
        </div>
        <p>v1.0.0</p>
      </div>

      {/* Create Channel Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-96 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Create New Channel</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-border/30 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/70 block mb-1">Channel Name</label>
                <input
                  type="text"
                  placeholder="e.g., feedback-requests"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/70 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="What is this channel for?"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 text-foreground/70 font-medium transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChannel}
                disabled={!newChannelName.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:from-muted disabled:to-muted text-white font-semibold transition-all text-sm"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div className="w-64 border-r border-[#00845C] bg-[#006239] text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#00845C]/30">
        <div className="flex items-center gap-2 text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
            <path d="M4 4H9L14 15L19 4H24L16.5 20.5H11.5L4 4Z" fill="currentColor" />
            <path d="M10.5 4H13.5L8.5 15H5.5L10.5 4Z" fill="currentColor" opacity="0.4" />
          </svg>
          <h1 className="text-xl font-extrabold tracking-tight text-white">Verge</h1>
        </div>
        <p className="text-xs text-white/60 mt-1">Internal Community Platform</p>
      </div>

      {/* Create Channel Button */}
      <div className="p-4 border-b border-[#00845C]/30">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00A870] to-[#006239] hover:from-[#00A870]/90 hover:to-[#006239]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-[#00A870]/50"
        >
          <Plus size={18} />
          <span>Create Channel</span>
        </button>
        <p className="text-xs text-white/50 mt-2 text-center">Admin Feature</p>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-white/60 px-2 py-1 mb-2">Channels</div>
        {channels.map((channel) => (
          <div key={channel.id} className="group">
            <button
              onClick={() => onSelectChannel(channel.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 ${
                activeChannelId === channel.id
                  ? 'bg-white/20 text-white border border-white/40 font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-sm font-mono">#{channel.name}</span>
            </button>
            {activeChannelId === channel.id && (
              <div className="px-4 py-2 text-xs text-white/60 border-l-2 border-[#00A870]/40 ml-2">
                {channel.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#00845C]/30 text-xs text-white/50 text-center space-y-1">
        <div className="flex items-center justify-center gap-1">
          <Shield size={14} />
          <span>Anonymous by Design</span>
        </div>
        <p>v1.0.0</p>
      </div>

      {/* Create Channel Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#006239] border border-[#00845C] rounded-xl p-6 w-96 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create New Channel</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block mb-1">Channel Name</label>
                <input
                  type="text"
                  placeholder="e.g., feedback-requests"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00A870]/50 text-sm transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="What is this channel for?"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00A870]/50 text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 font-medium transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChannel}
                disabled={!newChannelName.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00A870] to-[#006239] hover:from-[#00A870]/90 hover:to-[#006239]/90 disabled:from-[#4A7A66] disabled:to-[#4A7A66] text-white font-semibold transition-all text-sm"
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

'use client';

import { Plus, Shield, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="w-64 border-r border-[#374151] bg-[#111827] text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#374151]">
        <div className="flex items-center gap-2 text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
            <path d="M4 4H9L14 15L19 4H24L16.5 20.5H11.5L4 4Z" fill="currentColor" />
            <path d="M10.5 4H13.5L8.5 15H5.5L10.5 4Z" fill="currentColor" opacity="0.4" />
          </svg>
          <h1 className="text-xl font-extrabold tracking-tight text-white">Verge</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">Internal Community Platform</p>
      </div>

      {/* Create Channel Button */}
      <div className="p-4 border-b border-[#374151]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00A870] to-[#006239] hover:from-[#00A870]/90 hover:to-[#006239]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-[#00A870]/30"
        >
          <Plus size={18} />
          <span>Create Channel</span>
        </motion.button>
        <p className="text-xs text-gray-600 mt-2 text-center">Admin Feature</p>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-2 py-1 mb-2">Channels</div>
        {channels.map((channel, index) => (
          <motion.div 
            key={channel.id} 
            className="group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              onClick={() => onSelectChannel(channel.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 ${
                activeChannelId === channel.id
                  ? 'bg-[#006239] text-white border border-[#00A870] font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'
              }`}
            >
              <span className="text-sm font-mono">#{channel.name}</span>
            </button>
            {activeChannelId === channel.id && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 py-2 text-xs text-gray-500 border-l-2 border-[#00A870]/40 ml-2"
              >
                {channel.description}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#374151] text-xs text-gray-600 text-center space-y-1">
        <div className="flex items-center justify-center gap-1">
          <Shield size={14} />
          <span>Anonymous by Design</span>
        </div>
        <p>v1.0.0</p>
      </div>

      {/* Create Channel Modal with Backdrop Blur */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111827] border border-[#374151] rounded-xl p-6 w-96 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Create New Channel</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-[#1f2937] rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1">Channel Name</label>
                  <input
                    type="text"
                    placeholder="e.g., feedback-requests"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-[#374151] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A870]/50 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="What is this channel for?"
                    value={newChannelDesc}
                    onChange={(e) => setNewChannelDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1f2937] border border-[#374151] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A870]/50 text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#1f2937] hover:bg-[#374151] text-gray-400 font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateChannel}
                  disabled={!newChannelName.trim()}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00A870] to-[#006239] hover:from-[#00A870]/90 hover:to-[#006239]/90 disabled:from-[#374151] disabled:to-[#374151] text-white font-semibold transition-all text-sm"
                >
                  Create
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

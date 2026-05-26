'use client';

import { ArrowRight } from 'lucide-react';
import type { Channel } from '@/app/page';

interface ChannelOnboardingProps {
  channels: Channel[];
  joinedChannelIds: string[];
  onJoinChannel: (channelId: string) => void;
  onComplete: () => void;
}

const channelImages = {
  '1': 'linear-gradient(135deg, #00A870 0%, #006239 100%)',
  '2': 'linear-gradient(135deg, #006239 0%, #004A2D 100%)',
  '3': 'linear-gradient(135deg, #00845C 0%, #006239 100%)',
};

export default function ChannelOnboarding({
  channels,
  joinedChannelIds,
  onJoinChannel,
  onComplete,
}: ChannelOnboardingProps) {
  const allJoined = channels.length > 0 && joinedChannelIds.length === channels.length;

  return (
    <div className="fixed inset-0 bg-[#DDE8E3]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#006239] border border-[#00845C] rounded-xl p-8 max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Welcome to Echo</h2>
          <p className="text-white/60">Join channels to start sharing feedback with your team</p>
        </div>

        {/* Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {channels.map((channel) => {
            const isJoined = joinedChannelIds.includes(channel.id);
            const gradient = channelImages[channel.id as keyof typeof channelImages] || channelImages['1'];

            return (
              <div
                key={channel.id}
                className="group relative overflow-hidden rounded-lg border border-[#00845C] hover:border-[#00A870] transition-all duration-200"
              >
                {/* Channel Image Background */}
                <div
                  className="absolute inset-0"
                  style={{ background: gradient, opacity: isJoined ? 0.3 : 0.1 }}
                />

                {/* Content */}
                <div className="relative p-4 space-y-3 flex flex-col h-full">
                  {/* Channel Name */}
                  <div>
                    <h3 className="font-semibold text-white">#{channel.name}</h3>
                    <p className="text-xs text-white/60 mt-1">{channel.description}</p>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={() => onJoinChannel(channel.id)}
                    disabled={isJoined}
                    className={`mt-auto w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      isJoined
                        ? 'bg-[#00A870]/20 text-[#00A870] cursor-default'
                        : 'bg-[#00A870] hover:bg-[#00A870]/90 text-white hover:shadow-lg hover:shadow-[#00A870]/30'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <span>Joined</span>
                        <span className="text-lg">✓</span>
                      </>
                    ) : (
                      <>
                        <span>Join Channel</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="flex justify-end pt-4 border-t border-[#00845C]/30">
          <button
            onClick={onComplete}
            disabled={!allJoined}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              allJoined
                ? 'bg-[#00A870] hover:bg-[#00A870]/90 text-white hover:shadow-lg hover:shadow-[#00A870]/30'
                : 'bg-[#4A7A66] text-white/50 cursor-not-allowed'
            }`}
          >
            {allJoined ? 'Continue to Feed' : 'Join all channels to continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

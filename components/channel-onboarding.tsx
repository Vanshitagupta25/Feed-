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
  '1': 'linear-gradient(135deg, #E0533C 0%, #C94A35 100%)',
  '2': 'linear-gradient(135deg, #D54C37 0%, #B34432 100%)',
  '3': 'linear-gradient(135deg, #E8704F 0%, #C94A35 100%)',
};

export default function ChannelOnboarding({
  channels,
  joinedChannelIds,
  onJoinChannel,
  onComplete,
}: ChannelOnboardingProps) {
  const allJoined = channels.length > 0 && joinedChannelIds.length === channels.length;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl p-8 max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Welcome to Echo</h2>
          <p className="text-foreground/60">Join channels to start sharing feedback with your team</p>
        </div>

        {/* Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {channels.map((channel) => {
            const isJoined = joinedChannelIds.includes(channel.id);
            const gradient = channelImages[channel.id as keyof typeof channelImages] || channelImages['1'];

            return (
              <div
                key={channel.id}
                className="group relative overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-all duration-200"
              >
                {/* Channel Image Background */}
                <div
                  className="absolute inset-0"
                  style={{ background: gradient }}
                  opacity={isJoined ? 0.3 : 0.1}
                />

                {/* Content */}
                <div className="relative p-4 space-y-3 flex flex-col h-full">
                  {/* Channel Name */}
                  <div>
                    <h3 className="font-semibold text-foreground">#{channel.name}</h3>
                    <p className="text-xs text-foreground/60 mt-1">{channel.description}</p>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={() => onJoinChannel(channel.id)}
                    disabled={isJoined}
                    className={`mt-auto w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      isJoined
                        ? 'bg-primary/20 text-primary cursor-default'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:shadow-primary/30'
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
        <div className="flex justify-end pt-4 border-t border-border/30">
          <button
            onClick={onComplete}
            disabled={!allJoined}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              allJoined
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:shadow-primary/30'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {allJoined ? 'Continue to Feed' : 'Join all channels to continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

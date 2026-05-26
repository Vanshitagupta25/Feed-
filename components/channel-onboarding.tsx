'use client';

import { ArrowRight } from 'lucide-react';
import type { Channel } from '@/app/page';

interface ChannelOnboardingProps {
  channels: Channel[];
  joinedChannelIds: string[];
  onJoinChannel: (channelId: string) => void;
  onComplete: () => void;
}

export default function ChannelOnboarding({
  channels,
  joinedChannelIds,
  onJoinChannel,
  onComplete,
}: ChannelOnboardingProps) {
  const allJoined = channels.length > 0 && joinedChannelIds.length === channels.length;

  const handleJoinAll = () => {
    channels.forEach(channel => {
      if (!joinedChannelIds.includes(channel.id)) {
        onJoinChannel(channel.id);
      }
    });
  };

  const handleSkip = () => {
    onComplete();
  };

  const VergeLogoSVG = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M4 4H9L14 15L19 4H24L16.5 20.5H11.5L4 4Z" fill="currentColor" />
      <path d="M10.5 4H13.5L8.5 15H5.5L10.5 4Z" fill="currentColor" opacity="0.4" />
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-[#242424]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl p-8 max-w-2xl w-full space-y-6">
        {/* Header with Verge branding */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#006239] mb-2">
            <VergeLogoSVG />
            <span className="text-lg font-extrabold tracking-tight">Verge</span>
          </div>
          <h2 className="text-2xl font-bold text-[#DDE8E3]">Welcome to Verge</h2>
          <p className="text-[#888]">Join channels to start sharing feedback with your team</p>
        </div>

        {/* Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {channels.map((channel) => {
            const isJoined = joinedChannelIds.includes(channel.id);

            return (
              <div
                key={channel.id}
                className="group relative overflow-hidden rounded-lg border border-[#3a3a3a] bg-[#000000] hover:border-[#006239] transition-all duration-200"
              >
                {/* Content */}
                <div className="relative p-4 space-y-3 flex flex-col h-full">
                  {/* Channel Name */}
                  <div>
                    <h3 className="font-semibold text-[#DDE8E3]">#{channel.name}</h3>
                    <p className="text-xs text-[#666] mt-1">{channel.description}</p>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={() => onJoinChannel(channel.id)}
                    disabled={isJoined}
                    className={`mt-auto w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      isJoined
                        ? 'bg-[#006239]/20 text-[#006239] cursor-default'
                        : 'bg-[#006239] hover:bg-[#005230] text-white'
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

        {/* Action Footer with Skip on left */}
        <div className="flex justify-between items-center pt-4 border-t border-[#3a3a3a]">
          {/* Skip button - far left - explicitly wired up */}
          <button
            type="button"
            onClick={handleSkip}
            className="text-[#888] hover:text-[#DDE8E3] text-sm font-medium transition-colors cursor-pointer"
          >
            Skip
          </button>

          <div className="flex gap-3">
            {/* Join All Button */}
            <button
              type="button"
              onClick={handleJoinAll}
              disabled={allJoined}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                allJoined
                  ? 'bg-[#333] text-[#666] cursor-not-allowed'
                  : 'bg-[#333] hover:bg-[#444] text-[#DDE8E3]'
              }`}
            >
              {allJoined ? 'All Joined' : 'Join All Channels'}
            </button>

            {/* Continue Button */}
            <button
              type="button"
              onClick={handleSkip}
              className="px-6 py-2 rounded-lg font-semibold transition-all bg-[#006239] hover:bg-[#005230] text-white flex items-center gap-2"
            >
              Continue to Feed
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

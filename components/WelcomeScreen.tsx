"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: (username: string) => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onComplete, onSkip }: WelcomeScreenProps) {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onComplete(username.trim());
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {step === 0 && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#006239] flex items-center justify-center">
                <span className="text-2xl font-bold text-white">F</span>
              </div>
              <h1 className="text-3xl font-bold text-[#f5f5f5]">
                Welcome to Feed
              </h1>
              <p className="text-[#a0a0a0] text-lg">
                Your space to share, discuss, and connect with the community.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setStep(1)}
                className="w-full py-3 px-6 bg-[#006239] text-white rounded-lg font-medium hover:bg-[#00472a] transition-colors flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleSkip}
                type="button"
                className="w-full py-3 px-6 text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors font-medium"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-[#f5f5f5]">
                Choose your username
              </h2>
              <p className="text-[#a0a0a0]">
                This is how others will see you in the community.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                className="w-full py-3 px-4 rounded-lg text-[#f5f5f5] placeholder-[#a0a0a0] focus:ring-2 focus:ring-[#006239]"
                autoFocus
              />

              <button
                type="submit"
                disabled={!username.trim()}
                className="w-full py-3 px-6 bg-[#006239] text-white rounded-lg font-medium hover:bg-[#00472a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>

              <button
                onClick={handleSkip}
                type="button"
                className="w-full py-3 px-6 text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors font-medium"
              >
                Skip for now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

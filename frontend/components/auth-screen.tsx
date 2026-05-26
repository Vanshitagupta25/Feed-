'use client';

import { Mail, Lock, LogIn, User as UserIcon, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { User } from '@/app/page';

export default function AuthScreen({ onAuthenticate }: { onAuthenticate: (user: User) => void }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && username.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        const newUser: User = {
          id: `user_${Date.now()}`,
          email,
          username,
          avatar: `${username.charAt(0).toUpperCase()}${username.charAt(username.length - 1).toUpperCase()}`,
          followers: Math.floor(Math.random() * 50) + 5,
          recentPosts: Math.floor(Math.random() * 20) + 1,
        };
        onAuthenticate(newUser);
      }, 500);
    }
  };

  const VergeLogoSVG = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M4 4H9L14 15L19 4H24L16.5 20.5H11.5L4 4Z" fill="currentColor" />
      <path d="M10.5 4H13.5L8.5 15H5.5L10.5 4Z" fill="currentColor" opacity="0.4" />
    </svg>
  );

  return (
    <div className="h-screen overflow-hidden bg-[#DDE8E3] text-[#242424] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#006239] flex items-center justify-center text-white">
              <VergeLogoSVG />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#006239]">
              Verge
            </h1>
          </div>
          <p className="text-[#242424]/60 text-sm">Anonymous & Structured Feedback Platform</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#006239] border border-[#00845C] rounded-xl p-8 space-y-6">
          {/* Back/Switch Button */}
          {showSignUp && (
            <button
              onClick={() => setShowSignUp(false)}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Sign In</span>
            </button>
          )}

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">{showSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-sm text-white/60">{showSignUp ? 'Sign up to join the community' : 'Sign in to your account to continue'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-white/40" size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00A870]/50 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Username Input */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-white/40" size={18} />
                <input
                  id="username"
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00A870]/50 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-white/40" size={18} />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00A870]/50 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !username || !password}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-6 rounded-lg bg-gradient-to-r from-[#00A870] to-[#006239] hover:from-[#00A870]/90 hover:to-[#006239]/90 disabled:from-[#4A7A66] disabled:to-[#4A7A66] disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg hover:shadow-[#00A870]/30"
            >
              <LogIn size={18} />
              <span>{isLoading ? (showSignUp ? 'Creating Account...' : 'Signing in...') : (showSignUp ? 'Create Account' : 'Sign In')}</span>
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="text-center pt-4 border-t border-[#00845C]/30">
            <p className="text-sm text-white/60">
              {showSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setShowSignUp(!showSignUp)}
                className="ml-2 text-[#00A870] hover:text-[#00A870]/80 font-semibold transition-colors"
              >
                {showSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-[#242424]/50">
          <p>Enterprise Anonymous Feedback & Collaboration</p>
          <p className="mt-1">Your feedback remains protected</p>
        </div>
      </div>
    </div>
  );
}

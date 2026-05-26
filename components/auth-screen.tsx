'use client';

import { Mail, Lock, LogIn, Shield, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import type { User } from '@/app/page';

export default function AuthScreen({ onAuthenticate }: { onAuthenticate: (user: User) => void }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#DDE8E3] text-[#006239] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00A870] to-[#006239] flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#006239]">
              Echo
            </h1>
          </div>
          <p className="text-[#006239]/60 text-sm">Anonymous & Structured Feedback Platform</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#006239] border border-[#00845C] rounded-xl p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Welcome Back</h2>
            <p className="text-sm text-white/60">Sign in to your account to continue</p>
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
                  className="w-full pl-10 pr-4 py-3 bg-[#005230] border border-[#00845C] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00A870]/50 focus:border-transparent transition-all"
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
                  className="w-full pl-10 pr-4 py-3 bg-[#005230] border border-[#00845C] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00A870]/50 focus:border-transparent transition-all"
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
                  className="w-full pl-10 pr-4 py-3 bg-[#005230] border border-[#00845C] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00A870]/50 focus:border-transparent transition-all"
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
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Demo Info */}
          <div className="pt-6 border-t border-[#00845C]/30 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Demo Credentials</p>
            <div className="space-y-2 text-xs text-white/60 bg-[#005230] rounded-lg p-3">
              <p><strong>Email:</strong> demo@company.com</p>
              <p><strong>Password:</strong> demo123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-[#006239]/50">
          <p>Enterprise Anonymous Feedback & Collaboration</p>
          <p className="mt-1">Your feedback remains protected</p>
        </div>
      </div>
    </div>
  );
}

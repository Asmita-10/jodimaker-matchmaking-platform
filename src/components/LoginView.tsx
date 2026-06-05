'use client';

import React, { useState } from 'react';
import { Lock, User, Sparkles } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (
        (username === 'admin' && password === 'password') ||
        (username === 'matchmaker' && password === 'secret')
      ) {
        onLoginSuccess();
      } else {
        setError('Invalid username or password. Try using admin / password');
        setLoading(false);
      }
    }, 850);
  };

  return (
    <div className="relative bg-[url('/clean-vibe-bg_3.png')] bg-cover bg-center bg-no-repeat w-full min-h-screen flex flex-col items-center justify-start pt-20 md:pt-28 pb-12 px-4 select-none">
      
      {/* 
        STRUCTURED FLEX LAYOUT ALIGNMENT BOX:
        Shifts the interactive glass box down below "To Fall In Love." text line in the background.
      */}
      <div className="w-full flex-shrink-0 h-[12vh] md:h-[14vh]" />

      {/* 
        CLEAN GLASS CARD RENDERING:
        One single interactive card block to house the form elements.
      */}
      <div className="bg-white/85 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-8 max-w-md w-full mx-auto mt-6">
        
        <div className="w-full flex flex-col items-center">
          
          <h2 className="text-lg font-black tracking-tight text-[#1e1b4b] flex items-center gap-1.5 font-sans">
            JodiMaker Portal <Sparkles className="w-4 h-4 text-[#b45309] fill-current" />
          </h2>
          <p className="text-slate-450 text-[9px] tracking-widest uppercase font-extrabold mt-0.5 mb-6">
            Access Credentials Required
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {error && (
              <div className="bg-[#fff1f2] border border-[#ffe4e6] text-[#e11d48] text-[11px] px-3.5 py-2.5 rounded-2xl text-center font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[#1e1b4b] text-[9px] font-extrabold uppercase tracking-wider mb-1.5 pl-4" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full bg-white/90 border border-[#f0eae0] focus:border-[#f43f5e]/40 rounded-full py-2.5 pl-10 pr-4 text-xs font-semibold text-[#1e1b4b] placeholder-slate-400 focus:outline-none transition-all duration-300 shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#1e1b4b] text-[9px] font-extrabold uppercase tracking-wider mb-1.5 pl-4" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/90 border border-[#f0eae0] focus:border-[#f43f5e]/40 rounded-full py-2.5 pl-10 pr-4 text-xs font-semibold text-[#1e1b4b] placeholder-slate-400 focus:outline-none transition-all duration-300 shadow-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#f43f5e] to-[#fb7185] hover:from-[#e11d48] hover:to-[#f43f5e] text-white font-extrabold text-xs py-3.5 px-4 rounded-full shadow-md shadow-[#f43f5e]/15 focus:outline-none transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4 uppercase tracking-wider cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          {/* Testing credentials block directly below the form */}
          <div className="mt-8 text-center text-[10px] text-slate-450 w-full">
            <p className="font-bold text-[#1e1b4b] mb-1">Testing Credentials</p>
            <p className="font-mono bg-[#faf7f2]/60 backdrop-blur-sm py-2 rounded-2xl border border-[#f5f1ea] shadow-sm text-slate-600">
              User: <span className="text-[#f43f5e] font-bold">admin</span> / Pass: <span className="text-[#f43f5e] font-bold">password</span>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

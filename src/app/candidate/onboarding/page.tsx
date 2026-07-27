'use client';

import React from 'react';
import OnboardingWizard from '@/components/OnboardingWizard';

export default function CandidateOnboardingPage() {
  return (
    <div className="bg-[#faf7f2] min-h-screen flex flex-col items-center justify-center p-4 py-12 font-sans text-indigo-950">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-indigo-950 tracking-tight">Setup Your JodiMaker Profile ✨</h1>
        <p className="text-xs text-slate-500 mt-1">Fill out the three quick steps below to start matching immediately.</p>
      </div>
      <OnboardingWizard />
    </div>
  );
}

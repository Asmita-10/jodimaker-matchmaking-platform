'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/context/ProfileContext';
import { Profile } from '@/types';
import { Heart, Sparkles, LogOut, Settings, Award, Layers, Calendar, User, UserCheck } from 'lucide-react';

const mockMatchesDatabase = [
  { name: 'Rahul Sharma', age: 29, city: 'Mumbai', occupation: 'Software Engineer', compatibility: 96, image: 'RS' },
  { name: 'Priya Patel', age: 27, city: 'Mumbai', occupation: 'Product Manager', compatibility: 95, image: 'PP' },
  { name: 'Amit Verma', age: 31, city: 'Bangalore', occupation: 'Product Designer', compatibility: 92, image: 'AV' },
  { name: 'Sneha Reddy', age: 29, city: 'Bangalore', occupation: 'Marketing Director', compatibility: 91, image: 'SR' }
];

export default function CandidateDashboardPage() {
  const router = useRouter();
  const { profiles } = useProfiles();
  const [candidate, setCandidate] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentEmail = localStorage.getItem('currentUserEmail');
      if (currentEmail) {
        const found = profiles.find(p => p.email === currentEmail);
        if (found) {
          setCandidate(found);
          const results = mockMatchesDatabase.filter(m => m.city.toLowerCase() === found.city.toLowerCase());
          setMatches(results.length > 0 ? results : mockMatchesDatabase);
          return;
        }
      }
    }

    // Find the latest dynamic profile added as candidate
    const dynamicProfiles = profiles.filter(p => p.isDynamic);
    if (dynamicProfiles.length > 0) {
      const currentCandidate = dynamicProfiles[dynamicProfiles.length - 1];
      setCandidate(currentCandidate);

      // Find compatible matches matching city or basic profiles
      const results = mockMatchesDatabase.filter(m => m.city.toLowerCase() === currentCandidate.city.toLowerCase());
      setMatches(results.length > 0 ? results : mockMatchesDatabase);
    } else {
      // Fallback fallback candidate details
      setCandidate({
        id: 'cand_101',
        name: 'Rahul Sharma',
        gender: 'Male',
        age: 29,
        city: 'Mumbai',
        maritalStatus: 'Never Married',
        height: 178,
        heightStr: "5'10\"",
        income: 18,
        incomeStr: '18 LPA',
        company: 'TechCorp Solutions',
        designation: 'Software Lead',
        religion: 'Hindu',
        caste: 'Sharma',
        kids: 'No',
        relocate: 'Yes',
        pets: 'Maybe',
        dietaryPreference: 'Veg',
        manglikStatus: 'No',
        coreValues: ['Career Focus', 'Family values'],
        status: 'Active',
        isDynamic: true
      });
      setMatches(mockMatchesDatabase);
    }
  }, [profiles]);

  const handleLogout = () => {
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentCandidate');
    router.push('/');
  };

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-rose-50 via-slate-50 to-indigo-50 min-h-screen pb-16 font-sans text-indigo-950">
      
      {/* Header Bar */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#f0eae0] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-tr from-rose-500 to-rose-400 rounded-lg flex items-center justify-center">
            <Heart className="text-white w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-sm font-black tracking-tight">JodiMaker Candidate Dashboard</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#f43f5e] bg-white hover:bg-[#fdf3f3] px-3.5 py-2 rounded-xl border border-[#f0eae0] hover:border-[#fbc4c4] transition-all duration-300 font-bold cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Exit
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-8 animate-fade-in">
        
        {/* Profile Card Section */}
        <section className="bg-white/85 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-950 text-white rounded-full flex items-center justify-center text-xl font-black">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-indigo-950">{candidate.name}</h1>
                <span className="text-[9px] bg-rose-50 border border-rose-100 text-rose-600 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{candidate.designation} at {candidate.company}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">{candidate.age} yrs • {candidate.city} • {candidate.incomeStr}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/candidate/onboarding')}
            className="bg-[#e11d48] hover:bg-[#be123c] text-white font-extrabold text-xs py-2.5 px-6 rounded-full shadow transition-all cursor-pointer"
          >
            Edit Biodata Profile
          </button>
        </section>

        {/* Compatibility matches Grid */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-black text-indigo-950 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" /> Compatible Match Proposals
            </h2>
            <p className="text-xs text-slate-500">Based on your religion, caste, diet, and relocation preferences, we found these matches:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match, i) => (
              <div key={i} className="bg-white/90 border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-50 text-[#e11d48] rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
                    {match.image}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-indigo-950">{match.name}</h4>
                    <p className="text-[10px] text-slate-550 font-semibold">{match.age} yrs • {match.city}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{match.occupation}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                    {match.compatibility}% Match
                  </span>
                  <p className="text-[9px] text-slate-400 mt-2">AI Calculated</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

    </div>
  );
}

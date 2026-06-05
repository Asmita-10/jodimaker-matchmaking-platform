'use client';

import React, { useState, useMemo } from 'react';
import { Profile, MatchResult } from '@/types';
import { getTopMatches } from '@/utils/matchingEngine';
import { 
  User, Briefcase, Heart, Sparkles, Send, 
  MapPin, DollarSign, Scale, Calendar, Compass, GraduationCap
} from 'lucide-react';

interface ClientProfileProps {
  client: Profile;
  allProfiles: Profile[];
  onOpenMatchModal: (match: MatchResult) => void;
  onSendMatchDirect: (candidate: Profile) => void;
}

export default function ClientProfile({ client, allProfiles, onOpenMatchModal, onSendMatchDirect }: ClientProfileProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'cultural'>('personal');

  // Compute top 5 matches
  const matches = useMemo(() => {
    return getTopMatches(client, allProfiles, 5);
  }, [client, allProfiles]);

  const getTabClass = (tab: 'personal' | 'professional' | 'cultural') => {
    const base = 'flex-1 text-center py-3.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all duration-350 select-none ';
    if (activeTab === tab) {
      return base + 'bg-gradient-to-r from-[#f43f5e] to-[#fb7185] text-white shadow-md shadow-[#f43f5e]/15';
    }
    return base + 'text-[#1e1b4b] hover:text-[#f43f5e] bg-[#fbf9f5] border border-[#f0eae0] hover:border-[#fbc4c4]';
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfbf8] text-[#1e1b4b] overflow-y-auto custom-scrollbar p-6 space-y-6 select-none">
      
      {/* Header Bio Card */}
      <div className="bg-white border border-[#f5f1ea] rounded-3xl p-6 shadow-[0_15px_45px_rgba(79,70,40,0.035)] relative overflow-hidden flex-shrink-0 hover:shadow-[0_20px_50px_rgba(79,70,40,0.055)] transition-all duration-300">
        {/* Soft background glow */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-[#fdf3f3] rounded-full blur-[50px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-extrabold text-[#1e1b4b] tracking-tight">{client.name}</h2>
              <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-md ${
                client.gender === 'Male' 
                  ? 'bg-blue-50 text-blue-600 border border-blue-150' 
                  : 'bg-rose-50 text-rose-600 border border-rose-150'
              }`}>
                {client.gender}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-500 mt-1">
              <span className="font-bold text-[#1e1b4b]">{client.designation}</span> at <span className="font-bold text-[#b45309]">{client.company}</span>
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-[11px] font-bold text-slate-450">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#f43f5e]" />
                {client.city}
              </span>
              <span className="text-[#f0eae0]">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#b45309]" />
                {client.age} Yrs
              </span>
              <span className="text-[#f0eae0]">•</span>
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-indigo-500" />
                {client.heightStr} ({client.height} cm)
              </span>
            </div>
          </div>

          <div className="bg-[#faf7f2] border border-[#f0eae0] px-5 py-3 rounded-2xl text-left md:text-right flex-shrink-0">
            <p className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">Status Tag</p>
            <p className="text-xs font-extrabold mt-0.5 text-[#f43f5e]">{client.status}</p>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex bg-[#faf7f2] p-1.5 rounded-2xl border border-[#f0eae0] gap-2">
        <button onClick={() => setActiveTab('personal')} className={getTabClass('personal')}>
          <span className="flex items-center justify-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Personal
          </span>
        </button>
        <button onClick={() => setActiveTab('professional')} className={getTabClass('professional')}>
          <span className="flex items-center justify-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> Professional
          </span>
        </button>
        <button onClick={() => setActiveTab('cultural')} className={getTabClass('cultural')}>
          <span className="flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5" /> Cultural
          </span>
        </button>
      </div>

      {/* High-Contrast Biodata Layout */}
      <div className="bg-white border border-[#f5f1ea] rounded-3xl p-6 shadow-[0_15px_45px_rgba(79,70,40,0.03)] hover:shadow-[0_20px_50px_rgba(79,70,40,0.05)] transition-all duration-300">
        {activeTab === 'personal' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Marital Status</span>
              <p className="text-sm font-extrabold text-[#1e1b4b]">{client.maritalStatus}</p>
            </div>
            <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Kids Preference</span>
              <p className="text-sm font-extrabold text-[#1e1b4b]">{client.kids}</p>
            </div>
            <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Age Preference</span>
              <p className="text-sm font-extrabold text-[#1e1b4b]">
                {client.gender === 'Male' ? 'Younger Partners' : 'Same age or Older'}
              </p>
            </div>
            <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Religion</span>
              <p className="text-sm font-extrabold text-[#1e1b4b]">{client.religion}</p>
            </div>
            <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Caste</span>
              <p className="text-sm font-extrabold text-[#1e1b4b]">{client.caste}</p>
            </div>
            <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Height Preference</span>
              <p className="text-sm font-extrabold text-[#1e1b4b]">
                {client.gender === 'Male' ? 'Shorter Partners' : 'Taller Partners'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'professional' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Designation</span>
              <p className="text-sm font-extrabold text-[#1e1b4b]">{client.designation}</p>
            </div>
            <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Company</span>
              <p className="text-sm font-extrabold text-[#1e1b4b]">{client.company}</p>
            </div>
            <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Annual Income</span>
              <p className="text-sm font-extrabold text-emerald-600 flex items-center">
                <DollarSign className="w-3.5 h-3.5" /> {client.incomeStr}
              </p>
            </div>
            <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Relocation Preferred</span>
              <p className="text-sm font-extrabold text-[#1e1b4b]">{client.relocate}</p>
            </div>
            <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Career Synergy</span>
              <p className="text-sm font-extrabold text-[#1e1b4b]">
                {client.gender === 'Female' ? 'Highly Valued' : 'Neutral'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'cultural' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dietary Pref</span>
                <p className="text-sm font-extrabold text-[#1e1b4b]">{client.dietaryPreference}</p>
              </div>
              <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Manglik Status</span>
                <p className="text-sm font-extrabold text-[#b45309]">{client.manglikStatus}</p>
              </div>
              <div className="bg-[#fbf9f5] p-3 rounded-xl border border-[#fdfbf7] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pets OK</span>
                <p className="text-sm font-extrabold text-[#1e1b4b]">{client.pets}</p>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-slate-450 uppercase font-extrabold tracking-wider block mb-2">Core Values</span>
              <div className="flex flex-wrap gap-2">
                {client.coreValues.map((value, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs bg-[#fdf3f3] border border-[#fce7e7] text-[#f43f5e] px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#f43f5e]" />
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Compatibility Matches Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold tracking-wider text-slate-450 uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#b45309] fill-current" />
          Top Compatibility Matches
        </h3>

        <div className="space-y-4">
          {matches.map((match) => {
            const pct = match.overallScore;
            let scoreColor = 'border-[#f43f5e] text-[#f43f5e] bg-[#fdf3f3]';
            if (pct >= 85) {
              scoreColor = 'border-emerald-500 text-emerald-600 bg-emerald-50/50';
            } else if (pct >= 70) {
              scoreColor = 'border-amber-500 text-amber-600 bg-amber-50/50';
            }

            return (
              <div 
                key={match.profile.id}
                className="bg-white border border-[#f5f1ea] rounded-3xl p-5 shadow-[0_10px_35px_rgba(79,70,40,0.025)] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(79,70,40,0.055)]"
              >
                {/* Score Indicator */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full border-2 ${scoreColor} flex flex-col items-center justify-center font-sans font-extrabold text-sm shadow-sm`}>
                    {pct}%
                    <span className="text-[7px] text-slate-500 font-extrabold uppercase tracking-wider">Score</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-[#1e1b4b] group-hover:text-[#f43f5e] transition-colors duration-300 text-base">
                        {match.profile.name}
                      </h4>
                      <span className="text-xs text-slate-400 font-bold">
                        ({match.profile.age})
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      {match.profile.designation} at <span className="font-bold">{match.profile.company}</span>
                    </p>

                    <div className="flex items-center gap-3.5 mt-1.5 text-[11px] font-bold text-slate-400">
                      <span>{match.profile.city}</span>
                      <span className="text-[#f0eae0]">•</span>
                      <span>{match.profile.incomeStr}</span>
                      <span className="text-[#f0eae0]">•</span>
                      <span>{match.profile.maritalStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Score Synergy Snippet */}
                <div className="max-w-xs text-[11px] font-medium text-slate-500 leading-relaxed bg-[#fbf9f5] p-3 rounded-2xl border border-[#f0eae0] hidden lg:block">
                  <span className="text-[8px] uppercase font-extrabold tracking-wider text-[#b45309] block mb-0.5">Primary Compatibility Factor</span>
                  <p className="line-clamp-2">
                    {client.gender === 'Male' 
                      ? (match.breakdown['age']?.score >= 20 ? match.breakdown['age'].reason : match.breakdown['kids']?.reason)
                      : (match.breakdown['profession']?.score >= 25 ? match.breakdown['profession'].reason : match.breakdown['relocation']?.reason)}
                  </p>
                </div>

                {/* Button Actions */}
                <div className="flex items-center gap-2 mt-2 md:mt-0 flex-shrink-0">
                  <button 
                    onClick={() => onOpenMatchModal(match)}
                    className="flex-1 md:flex-none text-xs bg-white hover:bg-[#faf7f2] text-[#1e1b4b] font-bold px-4 py-3 rounded-xl border border-[#f0eae0] hover:border-[#fbc4c4] transition-all duration-300 text-center"
                  >
                    Analyze Match
                  </button>

                  <button 
                    onClick={() => onSendMatchDirect(match.profile)}
                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-[#f43f5e] to-[#fb7185] hover:from-[#e11d48] hover:to-[#fb7185] text-white shadow-md shadow-[#f43f5e]/15 transition-all duration-305 transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
                    title="Send Match Biodata"
                    aria-label="Send Match Biodata"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

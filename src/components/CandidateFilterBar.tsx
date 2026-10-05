'use client';

import React from 'react';
import { Sparkles, MapPin, Briefcase, Tag, X } from 'lucide-react';

export type ProfessionFilter = 'Any' | 'Engineering' | 'Business/Entrepreneur' | 'Finance' | 'Design';
export type LocationFilter = 'Any Location' | 'Local City' | 'International / Abroad';
export type InterestTag = 'Travel' | 'Tech' | 'Fitness' | 'Music' | 'Art';

export interface FilterState {
  profession: ProfessionFilter;
  location: LocationFilter;
  interests: InterestTag[];
}

interface CandidateFilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  isLoading?: boolean;
}

const PROFESSIONS: ProfessionFilter[] = ['Any', 'Engineering', 'Business/Entrepreneur', 'Finance', 'Design'];
const LOCATIONS: LocationFilter[] = ['Any Location', 'Local City', 'International / Abroad'];
const INTERESTS: InterestTag[] = ['Travel', 'Tech', 'Fitness', 'Music', 'Art'];

const INTEREST_EMOJI: Record<InterestTag, string> = {
  Travel:  '✈️',
  Tech:    '💻',
  Fitness: '🏋️',
  Music:   '🎵',
  Art:     '🎨',
};

export default function CandidateFilterBar({ filters, onChange, isLoading }: CandidateFilterBarProps) {
  const toggleInterest = (tag: InterestTag) => {
    const already = filters.interests.includes(tag);
    onChange({
      ...filters,
      interests: already
        ? filters.interests.filter(t => t !== tag)
        : [...filters.interests, tag],
    });
  };

  const clearAll = () => {
    onChange({ profession: 'Any', location: 'Any Location', interests: [] });
  };

  const hasActiveFilters =
    filters.profession !== 'Any' ||
    filters.location !== 'Any Location' ||
    filters.interests.length > 0;

  return (
    <div className="bg-white/90 backdrop-blur-md border border-[#f0eae0] rounded-2xl p-4 shadow-sm space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-tr from-[#f64d68] to-rose-400 rounded-lg flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-black text-indigo-950 tracking-tight">AI Discovery Filters</span>
          {isLoading && (
            <span className="w-3.5 h-3.5 border-2 border-[#f64d68]/40 border-t-[#f64d68] rounded-full animate-spin ml-1" />
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-[#f64d68] transition-colors"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Row 1: Profession + Location */}
      <div className="flex flex-wrap gap-3">

        {/* Profession dropdown */}
        <div className="flex items-center gap-2 flex-1 min-w-[160px]">
          <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <div className="relative flex-1">
            <select
              value={filters.profession}
              onChange={e => onChange({ ...filters, profession: e.target.value as ProfessionFilter })}
              className="w-full appearance-none bg-[#eef2ff] border border-[#e0e7ff] text-[#1e1b4b] text-xs font-bold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f64d68]/30 cursor-pointer"
            >
              {PROFESSIONS.map(p => (
                <option key={p} value={p}>{p === 'Any' ? 'Any Profession' : p}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">▾</span>
          </div>
        </div>

        {/* Location dropdown */}
        <div className="flex items-center gap-2 flex-1 min-w-[160px]">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <div className="relative flex-1">
            <select
              value={filters.location}
              onChange={e => onChange({ ...filters, location: e.target.value as LocationFilter })}
              className="w-full appearance-none bg-[#eef2ff] border border-[#e0e7ff] text-[#1e1b4b] text-xs font-bold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f64d68]/30 cursor-pointer"
            >
              {LOCATIONS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">▾</span>
          </div>
        </div>
      </div>

      {/* Row 2: Interest Chips */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Tag className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shared Interests</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(tag => {
            const active = filters.interests.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleInterest(tag)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-[#f64d68] text-white border-[#f64d68] shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-[#f64d68]/40 hover:text-[#f64d68]'
                }`}
              >
                <span>{INTEREST_EMOJI[tag]}</span>
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

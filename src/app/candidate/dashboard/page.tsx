'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/context/ProfileContext';
import { Profile } from '@/types';
import { Heart, Sparkles, LogOut, Zap, MapPin, Briefcase, TrendingUp } from 'lucide-react';
import CandidateFilterBar, { FilterState } from '@/components/CandidateFilterBar';

// ─── Types ───────────────────────────────────────────────────────────────────

interface RecommendedCandidate {
  candidate: any;
  aiMatchScore: number;
  matchReasons: string[];
}

const DEFAULT_FILTERS: FilterState = {
  profession: 'Any',
  location: 'Any Location',
  interests: [],
};

// ─── Score colour helper ──────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
  if (score >= 60) return { text: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100'   };
  return              { text: 'text-rose-600',         bg: 'bg-rose-50',    border: 'border-rose-100'    };
}

// ─── Initials avatar ──────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CandidateDashboardPage() {
  const router = useRouter();
  const { profiles } = useProfiles();

  const [candidate, setCandidate]       = useState<Profile | null>(null);
  const [filters, setFilters]           = useState<FilterState>(DEFAULT_FILTERS);
  const [results, setResults]           = useState<RecommendedCandidate[]>([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [hasFetched, setHasFetched]     = useState(false);

  // ── Resolve the logged-in candidate ────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentEmail = localStorage.getItem('currentUserEmail');
    if (currentEmail) {
      const found = profiles.find(p => p.email?.toLowerCase() === currentEmail.toLowerCase());
      if (found) { setCandidate(found); return; }
    }
    const dynamic = profiles.filter(p => p.isDynamic);
    if (dynamic.length > 0) setCandidate(dynamic[dynamic.length - 1]);
  }, [profiles]);

  // ── Fetch recommendations from API ─────────────────────────────────────────
  const fetchRecommendations = useCallback(async (f: FilterState, c: Profile | null) => {
    setIsLoading(true);
    try {
      const targetGender = c?.gender === 'Male' ? 'Female' : 'Male';
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserEmail:   c?.email || '',
          targetGender,
          profession:         f.profession,
          locationPreference: f.location,
          interests:          f.interests,
          currentUserCity:    c?.city || '',
        }),
      });
      const data = await res.json();
      if (data.success && data.results) {
        setResults(data.results);
      }
    } catch (err) {
      console.error('Recommendation fetch error:', err);
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  }, []);

  // ── Auto-fetch on mount once candidate is resolved ─────────────────────────
  useEffect(() => {
    if (candidate && !hasFetched) {
      fetchRecommendations(filters, candidate);
    }
  }, [candidate, hasFetched, filters, fetchRecommendations]);

  // ── Re-fetch when filters change ───────────────────────────────────────────
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    fetchRecommendations(newFilters, candidate);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentCandidate');
    router.push('/');
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-slate-50 to-indigo-50">
        <span className="w-8 h-8 border-4 border-[#f64d68] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gradient-to-br from-rose-50 via-slate-50 to-indigo-50 min-h-screen pb-16 font-sans text-indigo-950">

      {/* ── Sticky Header ── */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#f0eae0] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-tr from-[#f64d68] to-rose-400 rounded-lg flex items-center justify-center">
            <Heart className="text-white w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-sm font-black tracking-tight">JodiMaker Candidate Dashboard</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#f64d68] bg-white hover:bg-[#fdf3f3] px-3.5 py-2 rounded-xl border border-[#f0eae0] hover:border-[#fbc4c4] transition-all font-bold cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Exit
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-6">

        {/* ── Profile Summary Card ── */}
        <section className="bg-white/85 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-950 to-indigo-800 text-white rounded-full flex items-center justify-center text-base font-black shadow-md">
              {initials(candidate.name)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-lg font-black text-indigo-950">{candidate.name}</h1>
                <span className="text-[9px] bg-rose-50 border border-rose-100 text-[#f64d68] px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500">{candidate.designation} · {candidate.company}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                {candidate.age} yrs · {candidate.city} · {candidate.incomeStr}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/candidate/onboarding')}
            className="bg-[#f64d68] hover:bg-[#e03d57] text-white font-extrabold text-xs py-2.5 px-6 rounded-full shadow transition-all cursor-pointer"
          >
            Edit Biodata
          </button>
        </section>

        {/* ── AI Discovery Filter Bar ── */}
        <section>
          <CandidateFilterBar
            filters={filters}
            onChange={handleFilterChange}
            isLoading={isLoading}
          />
        </section>

        {/* ── Results Feed ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-indigo-950 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                AI Match Recommendations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isLoading
                  ? 'Finding your best matches…'
                  : results.length > 0
                    ? `${results.length} candidates scored by AI compatibility`
                    : 'No candidates found for these filters'}
              </p>
            </div>
            {results.length > 0 && (
              <span className="text-[10px] font-black text-[#f64d68] bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                ✨ AI Powered
              </span>
            )}
          </div>

          {/* Loading skeleton rows */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/70 border border-slate-100 rounded-2xl p-5 animate-pulse h-24" />
              ))}
            </div>
          )}

          {/* Result cards */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((r, i) => {
                const c   = r.candidate;
                const col = scoreColor(r.aiMatchScore);
                const name = c.name || 'Candidate';

                return (
                  <div
                    key={i}
                    className="bg-white/90 border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    {/* Rank badge for top 3 */}
                    {i < 3 && (
                      <span className="absolute top-3 right-3 w-5 h-5 bg-amber-400 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                        #{i + 1}
                      </span>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-[#f64d68]/20 to-rose-100 text-[#f64d68] rounded-full flex items-center justify-center font-black text-sm shadow-inner flex-shrink-0">
                        {initials(name)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-black text-indigo-950">{name}</h4>
                          {c.age && <span className="text-[10px] text-slate-400 font-semibold">{c.age} yrs</span>}
                        </div>

                        {/* Designation + location */}
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          {c.designation && (
                            <span className="flex items-center gap-0.5 text-[10px] text-slate-500 font-semibold">
                              <Briefcase className="w-2.5 h-2.5" />
                              {c.designation}
                            </span>
                          )}
                          {c.city && (
                            <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                              <MapPin className="w-2.5 h-2.5" />
                              {c.city}
                            </span>
                          )}
                        </div>

                        {/* Income */}
                        {c.incomeStr && (
                          <span className="flex items-center gap-0.5 text-[10px] text-slate-400 mt-0.5">
                            <TrendingUp className="w-2.5 h-2.5" />
                            {c.incomeStr}
                          </span>
                        )}

                        {/* AI Match Reasons */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {r.matchReasons.map((reason, j) => (
                            <span
                              key={j}
                              className="flex items-center gap-1 text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full"
                            >
                              <Zap className="w-2.5 h-2.5 text-indigo-400" />
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AI Score Badge */}
                      <div className="flex-shrink-0 text-right">
                        <div className={`${col.bg} ${col.border} border rounded-2xl px-3 py-2 text-center`}>
                          <span className={`text-sm font-black ${col.text} block leading-none`}>
                            {r.aiMatchScore}%
                          </span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wide block mt-0.5">
                            AI Match
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && hasFetched && results.length === 0 && (
            <div className="text-center py-12 bg-white/60 border border-slate-100 rounded-2xl">
              <Heart className="w-10 h-10 text-slate-200 mx-auto mb-3 fill-current" />
              <p className="text-sm font-bold text-slate-400">No matches found for these filters</p>
              <p className="text-xs text-slate-300 mt-1">Try adjusting the profession or location filters</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

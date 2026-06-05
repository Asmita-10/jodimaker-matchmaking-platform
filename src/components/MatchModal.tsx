'use client';

import React, { useState, useEffect } from 'react';
import { Profile, MatchResult } from '@/types';
import { 
  X, Sparkles, Send, UserCheck, MessageSquare, 
  MapPin, Calendar, Scale, Award 
} from 'lucide-react';

interface MatchModalProps {
  client: Profile;
  matchResult: MatchResult;
  onClose: () => void;
  onSendMatch: (candidate: Profile, emailBody: string) => void;
}

export default function MatchModal({ client, matchResult, onClose, onSendMatch }: MatchModalProps) {
  const { profile: candidate, overallScore, breakdown } = matchResult;
  const [loading, setLoading] = useState(true);
  const [compatibilityText, setCompatibilityText] = useState('');
  const [outreachText, setOutreachText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    fetch('/api/match-reasoning', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client,
        candidate,
        score: overallScore
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('API failed to generate reasoning');
        }
        return res.json();
      })
      .then((data) => {
        if (active) {
          setCompatibilityText(data.compatibility);
          setOutreachText(data.outreach);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) {
          setError('Failed to fetch AI insights. Showing system compatibility calculations instead.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [client, candidate, overallScore]);

  const handleSend = () => {
    onSendMatch(candidate, outreachText);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#1e1b4b]/40 backdrop-blur-md p-4 overflow-y-auto select-none">
      {/* Modal Card */}
      <div className="bg-white border border-[#f5f1ea] rounded-3xl w-full max-w-4xl shadow-[0_20px_60px_rgba(79,70,40,0.065)] flex flex-col max-h-[90vh] animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-[#f5f1ea] flex items-center justify-between bg-[#faf7f2]/55 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#fdf3f3] rounded-full flex items-center justify-center border border-[#fce7e7]">
              <Sparkles className="w-5 h-5 text-[#f43f5e] fill-current" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1e1b4b] flex items-center gap-1.5">
                Match Report: {client.name} &amp; {candidate.name}
              </h2>
              <p className="text-[10px] text-slate-450 uppercase tracking-widest font-extrabold">
                Engine Score: <span className="text-[#f43f5e] font-black">{overallScore}%</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-[#f43f5e] transition-colors p-1.5 rounded-xl hover:bg-slate-100"
            aria-label="Close match details modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#fdfbf8]/30">
          
          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client (Left) */}
            <div className="bg-[#faf7f2]/80 border border-[#f0eae0] p-4.5 rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#b45309] bg-[#fef3c7] border border-[#fde68a] px-2 py-0.5 rounded-md">
                  Client (Male)
                </span>
                <span className="text-[10px] text-slate-400 font-bold font-mono">ID: {client.id}</span>
              </div>
              <div>
                <h3 className="font-extrabold text-[#1e1b4b] text-base">{client.name} ({client.age})</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{client.designation} at <span className="font-bold">{client.company}</span></p>
              </div>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 pt-3 border-t border-[#e2dcd0] text-[11px] font-bold text-slate-500">
                <div>Height: <span className="text-[#1e1b4b]">{client.heightStr}</span></div>
                <div>Income: <span className="text-[#1e1b4b]">{client.incomeStr}</span></div>
                <div>City: <span className="text-[#1e1b4b]">{client.city}</span></div>
                <div>Marital: <span className="text-[#1e1b4b]">{client.maritalStatus}</span></div>
                <div>Dietary: <span className="text-[#1e1b4b]">{client.dietaryPreference}</span></div>
                <div>Manglik: <span className="text-[#1e1b4b]">{client.manglikStatus}</span></div>
              </div>
            </div>

            {/* Candidate (Right) */}
            <div className="bg-[#faf7f2]/80 border border-[#f0eae0] p-4.5 rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#f43f5e] bg-[#fdf3f3] border border-[#fce7e7] px-2 py-0.5 rounded-md">
                  Candidate (Female)
                </span>
                <span className="text-[10px] text-slate-400 font-bold font-mono">ID: {candidate.id}</span>
              </div>
              <div>
                <h3 className="font-extrabold text-[#1e1b4b] text-base">{candidate.name} ({candidate.age})</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{candidate.designation} at <span className="font-bold">{candidate.company}</span></p>
              </div>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 pt-3 border-t border-[#e2dcd0] text-[11px] font-bold text-slate-500">
                <div>Height: <span className="text-[#1e1b4b]">{candidate.heightStr}</span></div>
                <div>Income: <span className="text-[#1e1b4b]">{candidate.incomeStr}</span></div>
                <div>City: <span className="text-[#1e1b4b]">{candidate.city}</span></div>
                <div>Marital: <span className="text-[#1e1b4b]">{candidate.maritalStatus}</span></div>
                <div>Dietary: <span className="text-[#1e1b4b]">{candidate.dietaryPreference}</span></div>
                <div>Manglik: <span className="text-[#1e1b4b]">{candidate.manglikStatus}</span></div>
              </div>
            </div>
          </div>

          {/* Engine Score Breakdown */}
          <div className="bg-white border border-[#f5f1ea] p-5 rounded-3xl shadow-[0_10px_35px_rgba(79,70,40,0.025)] space-y-4">
            <h3 className="text-xs font-extrabold text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              Engine Compatibility Score Breakdown
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(breakdown).map(([key, value]) => {
                const percent = (value.score / value.max) * 100;
                return (
                  <div key={key} className="space-y-1.5 bg-[#fbf9f5] p-3.5 rounded-2xl border border-[#fdfbf7]">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="capitalize text-slate-700">
                        {key === 'profession' ? 'Career & Profession' : key === 'kids' ? 'Child-rearing Views' : key === 'relocation' ? 'Geographic Fit' : key === 'values' ? 'Core Values' : key}
                      </span>
                      <span className="font-mono text-[#b45309]">
                        {value.score} / {value.max} pts
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#f0eae0] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          percent >= 80 ? 'bg-emerald-500' : percent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`} 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">
                      {value.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Compatibility Insight */}
          <div className="bg-white border border-[#f5f1ea] p-5 rounded-3xl shadow-[0_10px_35px_rgba(79,70,40,0.025)] space-y-3">
            <h3 className="text-xs font-extrabold text-slate-455 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#f43f5e] fill-current" />
              AI Compatibility Reasoning
            </h3>

            {loading ? (
              <div className="space-y-2 animate-pulse py-2">
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                <div className="h-4 bg-slate-100 rounded w-4/5"></div>
              </div>
            ) : error ? (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs leading-relaxed font-semibold">
                <p className="mb-1 text-[#b45309]">{error}</p>
                <p className="text-slate-600 font-medium">{compatibilityText}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed font-sans bg-[#fdfbf8] p-4 rounded-2xl border border-[#f5f1ea] font-medium">
                {compatibilityText}
              </p>
            )}
          </div>

          {/* Matchmaker Outreach */}
          <div className="bg-white border border-[#f5f1ea] p-5 rounded-3xl shadow-[0_10px_35px_rgba(79,70,40,0.025)] space-y-3">
            <h3 className="text-xs font-extrabold text-slate-455 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-sky-500" />
              Outreach Message (Editable)
            </h3>

            {loading ? (
              <div className="space-y-2 animate-pulse py-2">
                <div className="h-10 bg-slate-100 rounded w-full"></div>
                <div className="h-24 bg-slate-100 rounded w-full"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={outreachText}
                  onChange={(e) => setOutreachText(e.target.value)}
                  rows={6}
                  className="w-full bg-[#fdfbf8] border border-[#f0eae0] focus:border-[#f43f5e]/40 rounded-2xl p-4 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none transition-all resize-y font-mono leading-relaxed"
                  placeholder="Generating outreach text..."
                />
                <p className="text-[10px] text-slate-450 font-bold italic">
                  *Tip: You can edit or copy the text above before sending the biodata.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#f5f1ea] flex justify-end gap-2.5 bg-[#faf7f2]/55 rounded-b-3xl">
          <button 
            onClick={onClose}
            className="text-xs font-bold text-slate-600 bg-white hover:bg-slate-55 border border-[#f0eae0] hover:border-slate-350 px-5 py-3 rounded-xl transition-all duration-300"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSend}
            disabled={loading}
            className="text-xs font-extrabold bg-gradient-to-r from-[#f43f5e] to-[#fb7185] hover:from-[#e11d48] hover:to-[#fb7185] text-white shadow-lg shadow-[#f43f5e]/15 px-5 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Send className="w-3.5 h-3.5" />
            Send Match Biodata
          </button>
        </div>
      </div>
    </div>
  );
}

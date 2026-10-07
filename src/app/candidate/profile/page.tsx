'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/context/ProfileContext';
import { Profile, MatchPair, ChatMessage } from '@/types';
import OnboardingWizard from '@/components/OnboardingWizard';
import { Heart, Sparkles, Send, User, Briefcase, GraduationCap, MapPin, Smile, Check, ShieldAlert, LogOut, CheckCircle, Flame, Mail, Trash2, LayoutDashboard } from 'lucide-react';

export default function CandidateProfilePage() {
  const router = useRouter();
  const { profiles, matches, expressInterest, sendChatMessage, addCandidateProfile } = useProfiles();

  // Active tab state: 'biodata' | 'suggestions' | 'messages'
  const [activeTab, setActiveTab] = useState<'biodata' | 'suggestions' | 'messages'>('biodata');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Selected chat pair ID
  const [selectedPairId, setSelectedPairId] = useState<string | null>(null);
  const [chatText, setChatText] = useState('');
  
  // Local notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeEmail = localStorage.getItem('currentUserEmail')?.toLowerCase().trim();
      
      if (activeEmail) {
        // Find exact matching user by email in profiles context or localStorage
        const foundCandidate = profiles.find(
          (c: any) => c.email?.toLowerCase().trim() === activeEmail
        ) || JSON.parse(localStorage.getItem('jodimaker_profiles') || '[]').find(
          (c: any) => c.email?.toLowerCase().trim() === activeEmail
        );

        if (foundCandidate) {
          setCandidate(foundCandidate);
        } else {
          // Fallback ONLY if new user was created without full array save
          setCandidate({
            id: `cand_${Date.now()}`,
            name: activeEmail.split('@')[0],
            email: activeEmail,
            gender: 'Female',
            age: 28,
            city: 'Mumbai',
            maritalStatus: 'Never Married',
            height: 165,
            heightStr: "5'5\"",
            income: 12,
            incomeStr: '12 LPA',
            company: 'JodiMaker',
            designation: 'Candidate',
            religion: 'Hindu',
            caste: 'Sharma',
            dietaryPreference: 'Veg',
            manglikStatus: 'No',
            status: 'Active',
            isDynamic: true
          });
        }
      } else {
        showToast("Not logged in. Redirecting to login gateway...");
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
      setLoading(false);
    }
  }, [profiles, router]);

  useEffect(() => {
    if (!isEditModalOpen && typeof window !== 'undefined') {
      const activeEmail = localStorage.getItem('currentUserEmail')?.toLowerCase().trim();
      if (activeEmail) {
        // Force reload from localStorage to get the freshest saved values
        const freshProfiles = JSON.parse(localStorage.getItem('jodimaker_profiles') || '[]');
        const found = freshProfiles.find((c: any) => c.email?.toLowerCase().trim() === activeEmail);
        if (found) {
          setCandidate(found);
        }
      }
    }
  }, [isEditModalOpen]);

  const currentCandidate = candidate;

  // Pre-fill editable biodata fields
  const [editableName, setEditableName] = useState('');
  const [editableAge, setEditableAge] = useState('');
  const [editableCity, setEditableCity] = useState('');
  const [editableCompany, setEditableCompany] = useState('');
  const [editableDesignation, setEditableDesignation] = useState('');
  const [editableReligion, setEditableReligion] = useState('');
  const [editableCaste, setEditableCaste] = useState('');
  const [editableDiet, setEditableDiet] = useState<Profile['dietaryPreference']>('Veg');

  useEffect(() => {
    if (currentCandidate) {
      setEditableName(currentCandidate.name);
      setEditableAge(currentCandidate.age.toString());
      setEditableCity(currentCandidate.city);
      setEditableCompany(currentCandidate.company || '');
      setEditableDesignation(currentCandidate.designation || '');
      setEditableReligion(currentCandidate.religion || 'Hindu');
      setEditableCaste(currentCandidate.caste || '');
      setEditableDiet(currentCandidate.dietaryPreference || 'Veg');
    }
  }, [currentCandidate]);

  // Profile completeness percentage
  const completenessPercent = useMemo(() => {
    let count = 0;
    if (editableName) count += 15;
    if (editableAge) count += 15;
    if (editableCity) count += 15;
    if (editableCompany) count += 15;
    if (editableDesignation) count += 15;
    if (editableReligion) count += 15;
    if (editableCaste) count += 10;
    return count;
  }, [editableName, editableAge, editableCity, editableCompany, editableDesignation, editableReligion, editableCaste]);

  // Curated Suggestions (Opposite gender)
  const curatedSuggestions = useMemo(() => {
    if (!currentCandidate) return [];
    const candidateGender = currentCandidate.gender?.toLowerCase();

    return profiles.filter((other) => {
      // Exclude current candidate
      if (other.id === currentCandidate.id || (other.email && other.email === currentCandidate.email)) return false;
      
      if (candidateGender === 'female') {
        return other.gender?.toLowerCase() === 'male';
      } else if (candidateGender === 'male') {
        return other.gender?.toLowerCase() === 'female';
      }
      return true;
    });
  }, [profiles, currentCandidate]);

  // Dynamic list of matches connected to the current candidate
  const candidateMatches = useMemo(() => {
    if (!currentCandidate) return [];
    return matches.filter(m => m.candidate1Id === currentCandidate.id || m.candidate2Id === currentCandidate.id);
  }, [matches, currentCandidate]);

  // Resolve other candidate name in matches
  const getMatchPartnerProfile = (pair: MatchPair) => {
    const partnerId = pair.candidate1Id === currentCandidate.id ? pair.candidate2Id : pair.candidate1Id;
    return profiles.find(p => p.id === partnerId || p.email?.toLowerCase().trim() === partnerId?.toLowerCase().trim() || p.name?.toLowerCase().trim() === partnerId?.toLowerCase().trim()) || { name: 'Unknown Partner', designation: 'Partner', city: 'India', id: partnerId };
  };

  // Express Interest submission
  const handleExpressInterest = (targetId: string) => {
    expressInterest(currentCandidate.id, targetId);
    const partner = profiles.find(p => p.id === targetId);
    showToast(`Interest request accepted! You and ${partner?.name || 'Partner'} are now connected!`);
    setActiveTab('messages');
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !selectedPairId) return;
    sendChatMessage(selectedPairId, currentCandidate.id, chatText);
    setChatText('');
  };

  // Save Biodata Profile Form updates
  const handleSaveBiodata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editableName || !editableAge || !editableCity) {
      showToast('Please fill out all personal details.');
      return;
    }

    const updated: Profile = {
      ...currentCandidate,
      name: editableName,
      age: parseInt(editableAge) || 28,
      city: editableCity,
      company: editableCompany,
      designation: editableDesignation,
      religion: editableReligion,
      caste: editableCaste,
      dietaryPreference: editableDiet
    };

    addCandidateProfile(updated); // Commits updates to context
    setCandidate(updated); // EXPLICITLY UPDATE LOCAL STATE IMMEDIATELY!
    showToast('Biodata settings saved successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentCandidate');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-slate-600 min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></span>
          <span>Loading your profile...</span>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-10 text-center font-bold text-rose-600 min-h-screen flex items-center justify-center bg-[#faf7f2]">
        No active session found. Redirecting to login gateway...
      </div>
    );
  }

  return (
    <div className="bg-[#faf7f2] min-h-screen pb-16 font-sans text-indigo-950">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-indigo-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-indigo-900/50 flex items-center gap-3 z-50 animate-slide-in">
          <div className="w-5 h-5 bg-[#e11d48] rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Banner Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#f0eae0] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-tr from-[#f64d68] to-rose-400 rounded-lg flex items-center justify-center">
            <Heart className="text-white w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-sm font-black tracking-tight">JodiMaker Candidate Workspace</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/candidate/dashboard')}
            className="flex items-center gap-1.5 text-xs text-[#f64d68] hover:text-white bg-[#f64d68]/10 hover:bg-[#f64d68] px-3.5 py-2 rounded-xl border border-[#f64d68]/20 hover:border-[#f64d68] transition-all duration-300 font-bold cursor-pointer shadow-sm"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Go to Dashboard</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#f64d68] bg-white hover:bg-[#fdf3f3] px-3.5 py-2 rounded-xl border border-[#f0eae0] hover:border-[#fbc4c4] transition-all duration-300 font-bold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-8">
        
        {/* ========================================================
            PORTAL HEADER & PROFILE COMPLETENESS BAR
            ======================================================== */}
        <section className="bg-white/85 backdrop-blur-md border border-white/60 shadow-[0_10px_35px_rgba(79,70,40,0.02)] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 bg-indigo-950 text-white rounded-full flex items-center justify-center text-xl font-black shadow ring-4 ring-rose-200/50">
              {currentCandidate.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-lg font-black text-indigo-950">{currentCandidate.name}</h1>
                <span className="text-[9px] bg-rose-50 border border-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-rose-500" /> Verified Candidate
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentCandidate.designation || 'Onboarding'} • {currentCandidate.city}</p>
            </div>
          </div>

          {/* Completeness Bar & Edit Wizard Button */}
          <div className="w-full md:w-64 flex flex-col gap-3">
            <div>
              <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                <span>Profile Completeness</span>
                <span className="text-indigo-650 font-black">{completenessPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completenessPercent}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-[#e11d48] hover:bg-[#be123c] text-white font-extrabold text-[11px] py-2 px-4 rounded-xl shadow transition-all cursor-pointer text-center"
            >
              Edit Profile Wizard
            </button>
          </div>
        </section>

        {/* ========================================================
            NAVIGATION TABS
            ======================================================== */}
        {/* Glassmorphic Tab switcher header bar */}
        <div className="bg-slate-100/80 p-1 border border-slate-200/50 rounded-2xl flex gap-1 mb-8">
          <button
            onClick={() => setActiveTab('biodata')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'biodata'
                ? 'bg-[#f64d68] text-white shadow-sm'
                : 'text-slate-500 hover:text-indigo-950 hover:bg-white/40'
            }`}
          >
            👤 My Biodata
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'suggestions'
                ? 'bg-[#f64d68] text-white shadow-sm'
                : 'text-slate-500 hover:text-indigo-950 hover:bg-white/40'
            }`}
          >
            💖 Curated Suggestions
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-[#f64d68] text-white shadow-sm'
                : 'text-slate-500 hover:text-indigo-950 hover:bg-white/40'
            }`}
          >
            💬 Messages & Requests
          </button>
        </div>

        {/* ========================================================
            TAB 1: MY BIODATA EDITOR
            ======================================================== */}
        {activeTab === 'biodata' && (
          <form onSubmit={handleSaveBiodata} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Details Card */}
            <div className="bg-white/85 backdrop-blur-md border border-white/60 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-base font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <User className="w-4.5 h-4.5 text-[#f64d68]" /> Personal Details
              </h3>
              
              <div className="space-y-3.5">
                <div>
                  <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    value={editableName}
                    onChange={(e) => setEditableName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-base font-semibold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Age</label>
                  <input 
                    type="number" 
                    value={editableAge}
                    onChange={(e) => setEditableAge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-base font-semibold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">City / Location</label>
                  <input 
                    type="text" 
                    value={editableCity}
                    onChange={(e) => setEditableCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-base font-semibold focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Career & Lifestyle Card */}
            <div className="bg-white/85 backdrop-blur-md border border-white/60 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-base font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Briefcase className="w-4.5 h-4.5 text-[#f64d68]" /> Profession & Culture
              </h3>
              
              <div className="grid grid-cols-2 gap-3.5">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Occupation / Job Title</label>
                  <input 
                    type="text" 
                    value={editableDesignation}
                    onChange={(e) => setEditableDesignation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-base font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Company</label>
                  <input 
                    type="text" 
                    value={editableCompany}
                    onChange={(e) => setEditableCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-base font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Religion</label>
                  <input 
                    type="text" 
                    value={editableReligion}
                    onChange={(e) => setEditableReligion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-base font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Caste / Community</label>
                  <input 
                    type="text" 
                    value={editableCaste}
                    onChange={(e) => setEditableCaste(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-base font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Diet Preference</label>
                  <select 
                    value={editableDiet}
                    onChange={(e) => setEditableDiet(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-base font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Eggetarian">Eggetarian</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="md:col-span-2 flex justify-end">
              <button 
                type="submit"
                className="bg-[#f64d68] hover:bg-[#e03d57] text-white font-bold text-sm py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-premium cursor-pointer"
              >
                Save Biodata Profile
              </button>
            </div>

          </form>
        )}

        {/* ========================================================
            TAB 2: CURATED SUGGESTIONS
            ======================================================== */}
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" /> Curated Match Suggestions
            </h3>
            
            {curatedSuggestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {curatedSuggestions.map((candidate) => (
                  <div 
                    key={candidate.id}
                    className="bg-white/85 backdrop-blur-md border border-white/60 shadow-[0_10px_35px_rgba(79,70,40,0.02)] rounded-[28px] p-6 flex flex-col justify-between"
                  >
                    <div>
                      {/* Score Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100/50 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-rose-500 fill-current" /> Match Score: 94%
                        </span>
                        <span className="text-[9px] bg-slate-50 text-slate-400 font-bold border border-slate-100 px-2 py-0.5 rounded">
                          {candidate.city}
                        </span>
                      </div>

                      {/* Info body */}
                      <div className="flex items-center gap-3.5 my-4">
                        <div className="w-12 h-12 bg-indigo-950 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-indigo-950">{candidate.name} ({candidate.age})</h4>
                          <p className="text-[10px] text-slate-500 font-medium">{candidate.designation} at {candidate.company}</p>
                          <p className="text-[9px] text-[#b45309] font-bold mt-0.5">{candidate.religion} • {candidate.caste}</p>
                        </div>
                      </div>

                      {/* Biodata facts list */}
                      <div className="my-5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-[10px] font-semibold text-slate-600">
                        <p>👔 Income: {candidate.incomeStr}</p>
                        <p>🥘 Diet Preference: {candidate.dietaryPreference}</p>
                        <p>⭐ Horoscope: {candidate.manglikStatus === 'Yes' ? 'Manglik' : 'Non-Manglik'}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-150">
                      <button
                        onClick={() => handleExpressInterest(candidate.id)}
                        className="bg-[#e11d48] hover:bg-[#be123c] text-white font-extrabold text-[10px] py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current text-white" />
                        INTEREST
                      </button>
                      <button
                        onClick={() => showToast(`Passed suggestions for ${candidate.name}`)}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-550 font-extrabold text-[10px] py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        PASS
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/85 backdrop-blur-md border border-white/60 p-12 text-center rounded-3xl max-w-md mx-auto">
                <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-4" />
                <p className="text-xs font-bold">No suggestions found yet.</p>
                <p className="text-[10px] text-slate-450 mt-1">Please register other profiles of the opposite gender in the database to curate suggestions.</p>
              </div>
            )}

          </div>
        )}

        {/* ========================================================
            TAB 3: MESSAGES & REQUESTS
            ======================================================== */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Matches List (Sidebar) */}
            <div className="bg-white/85 backdrop-blur-md border border-white/60 rounded-3xl p-5 space-y-4 shadow-sm flex flex-col">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                Mutual Connections
              </h3>

              {candidateMatches.length > 0 ? (
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {candidateMatches.map((pair) => {
                    const partner = getMatchPartnerProfile(pair);
                    const isSelected = selectedPairId === pair.id;
                    return (
                      <button
                        key={pair.id}
                        onClick={() => setSelectedPairId(pair.id)}
                        className={`w-full text-left p-3.5 rounded-2xl transition-premium flex items-center justify-between border cursor-pointer ${
                          isSelected 
                            ? 'bg-[#eef2ff] border-indigo-200 text-indigo-950' 
                            : 'bg-slate-50 hover:bg-slate-100 border-transparent text-slate-600'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-extrabold">{partner.name}</p>
                          <p className="text-[10px] text-slate-450 mt-0.5 truncate max-w-[150px]">{partner.designation}</p>
                        </div>
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                          Connected
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-[11px] leading-relaxed">
                  No active mutual connections yet. Head to **"Curated Suggestions"** and click **"Express Interest"** to form a match!
                </div>
              )}
            </div>

            {/* Chat Messages Container */}
            <div className="lg:col-span-2 bg-white/85 backdrop-blur-md border border-white/60 rounded-3xl shadow-sm flex flex-col min-h-[450px]">
              
              {selectedPairId ? (
                <React.Fragment>
                  {/* Chat partner header */}
                  {(() => {
                    const pair = matches.find(m => m.id === selectedPairId);
                    if (!pair) return null;
                    const partner = getMatchPartnerProfile(pair);
                    return (
                      <div className="p-4 bg-slate-50 border-b border-slate-100 rounded-t-3xl flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-indigo-950">{partner.name}</h4>
                          <p className="text-[9px] text-slate-400 font-bold">{partner.designation} • {partner.city}</p>
                        </div>
                        <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-black border border-emerald-100">
                          Active Chat
                        </span>
                      </div>
                    );
                  })()}

                  {/* Messages scroll content */}
                  <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[350px] custom-scrollbar">
                    {(() => {
                      const pair = matches.find(m => m.id === selectedPairId);
                      if (!pair) return null;
                      return pair.messages.map((msg, index) => {
                        const isMe = msg.senderId === currentCandidate.id;
                        return (
                          <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                              isMe 
                                ? 'bg-indigo-950 text-white rounded-tr-none' 
                                : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200/50'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Chat input submit footer */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#e11d48]/40 px-4 py-2.5 rounded-full text-xs font-semibold focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-10 h-10 bg-[#e11d48] hover:bg-[#be123c] text-white rounded-full flex items-center justify-center shadow-md transition-premium cursor-pointer flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </React.Fragment>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-2 text-slate-400">
                  <Mail className="w-10 h-10 text-slate-300" />
                  <p className="text-xs font-bold">No Connection Selected</p>
                  <p className="text-[10px] text-slate-450">Select a mutual connection from the list on the left to start chatting in real time.</p>
                </div>
              )}

            </div>

          </div>
        )}

      </main>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8">
            <OnboardingWizard isModal={true} onClose={() => setIsEditModalOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
}

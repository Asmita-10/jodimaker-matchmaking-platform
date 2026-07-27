'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Profile, MatchResult } from '@/types';
import LoginView from '@/components/LoginView';
import ClientList from '@/components/ClientList';
import ClientProfile from '@/components/ClientProfile';
import MatchModal from '@/components/MatchModal';
import { Toast } from '@/components/ui/Toast';
import { useProfiles } from '@/context/ProfileContext';
import { Heart, LogOut, Users, UserCheck, ShieldAlert, BarChart3, Star } from 'lucide-react';

export default function Home() {
  const { profiles, resetToDefault } = useProfiles();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Profile | null>(null);
  const [activeMatch, setActiveMatch] = useState<MatchResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Auth status from local storage
  useEffect(() => {
    const authStatus = localStorage.getItem('matchmaker_logged_in');
    if (authStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem('matchmaker_logged_in', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('matchmaker_logged_in');
    setIsLoggedIn(false);
    setSelectedClient(null);
    setActiveMatch(null);
  };

  const handleSendMatch = (candidate: Profile, emailBody?: string) => {
    setToastMessage(`Match Biodata successfully sent to ${candidate.name}! (Mock email dispatched)`);
    setActiveMatch(null); // Close modal
  };

  const handleSendMatchDirect = (candidate: Profile) => {
    setToastMessage(`Match Biodata successfully sent to ${candidate.name}! (Mock email dispatched)`);
  };

  // Metrics for empty dashboard view
  const metrics = React.useMemo(() => {
    const total = profiles.length;
    const active = profiles.filter(p => p.status === 'Active').length;
    const matched = profiles.filter(p => p.status === 'Matched').length;
    const pending = profiles.filter(p => p.status === 'Pending Match').length;
    const males = profiles.filter(p => p.gender === 'Male').length;
    const females = profiles.filter(p => p.gender === 'Female').length;
    
    return { total, active, matched, pending, males, females };
  }, [profiles]);

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#fcfaf6] font-sans text-[#1e1b4b] overflow-hidden select-none">
      {/* Top Banner Nav */}
      <header className="h-16 bg-white border-b border-[#f0eae0] px-6 flex items-center justify-between flex-shrink-0 relative z-20 shadow-[0_2px_15px_rgba(79,70,40,0.015)]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-tr from-[#f43f5e] to-[#fb7185] rounded-xl flex items-center justify-center shadow shadow-[#f43f5e]/10">
            <Heart className="text-white w-4.5 h-4.5 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-[#1e1b4b] flex items-center gap-1.5">
              JodiMaker
              <span className="text-[8px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.25 rounded-md uppercase tracking-wider">
                MVP
              </span>
            </h1>
            <p className="text-[9px] text-slate-400 font-extrabold tracking-wider uppercase">Matchmaker Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link 
            href="/profile" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer text-right group"
            title="View Profile & SaaS Billing Portal"
          >
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-[#1e1b4b] group-hover:text-rose-500 transition-colors">Asmita Tiwari</p>
              <p className="text-[9px] text-slate-400 font-bold">Senior Matchmaker</p>
            </div>
            <div className="w-8 h-8 bg-indigo-950 text-white rounded-full flex items-center justify-center font-bold text-xs shadow ring-2 ring-rose-200/50 group-hover:ring-rose-400 transition-all">
              AT
            </div>
          </Link>

          <div className="hidden sm:block h-6 w-px bg-[#f0eae0]"></div>

          <div className="flex items-center gap-4">
            <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Connected
            </span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#f43f5e] bg-white hover:bg-[#fdf3f3] px-3 py-2 rounded-xl border border-[#f0eae0] hover:border-[#fbc4c4] transition-all duration-300 font-bold cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Split Pane Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Pane: Clients Directory */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
          <ClientList 
            profiles={profiles}
            selectedClientId={selectedClient?.id || null}
            onSelectClient={(client) => setSelectedClient(client)}
          />
        </div>

        {/* Right Side Pane: Detailed Profile & Matches */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#fdfbf8] relative">
          {selectedClient ? (
            <ClientProfile 
              client={selectedClient}
              allProfiles={profiles}
              onOpenMatchModal={(match) => setActiveMatch(match)}
              onSendMatchDirect={handleSendMatchDirect}
            />
          ) : (
            // Overhauled Empty State Dashboard Overview matching wckt-mockup.png screenshot layout
            <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto custom-scrollbar relative">
              
              {/* Subtle background circles for watercolor effect */}
              <div className="absolute top-1/4 left-1/3 w-[30vw] h-[30vw] bg-[#fbf6ec] rounded-full blur-[90px] pointer-events-none"></div>
              <div className="absolute bottom-1/4 right-1/3 w-[25vw] h-[25vw] bg-[#fdf3f3] rounded-full blur-[80px] pointer-events-none"></div>

              <div className="max-w-2xl w-full text-center space-y-8 animate-scale-up relative z-10">
                
                {/* Intro Stickers & Welcome Header */}
                <div className="space-y-4 flex flex-col items-center">
                  
                  {/* ILLUSTRATION ROW: TWO EXPLICIT IMAGE STICKERS SIDE-BY-SIDE */}
                  <div className="flex items-center justify-center gap-8 mb-6">
                    <img 
                      src="/couple-pink.png" 
                      alt="Smiling couple in pink striped shirts" 
                      className="w-[140px] h-[140px] object-contain rounded-2xl shadow-[0_8px_30px_rgba(79,70,40,0.02)] bg-white/80 p-1.5 border border-[#f5f1ea] transition-premium hover:scale-105" 
                    />
                    <img 
                      src="/couple-heart.png" 
                      alt="Minimalist heart outline couple doodle" 
                      className="w-[140px] h-[140px] object-contain rounded-2xl shadow-[0_8px_30px_rgba(79,70,40,0.02)] bg-white/80 p-1.5 border border-[#f5f1ea] transition-premium hover:scale-105" 
                    />
                  </div>

                  {/* Typography Header */}
                  <h2 className="text-2xl font-extrabold text-[#1e1b4b] tracking-tight">
                    Welcome back, JodiMaker Matchmaker!
                  </h2>
                  <p className="text-xs font-semibold text-slate-550 max-w-md mx-auto leading-relaxed">
                    Select a client from the directory roster on the left <br />
                    to review detailed biodata details and run compatibility calculations.
                  </p>
                </div>

                {/* Dashboard Metrics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <div className="bg-white border border-[#f5f1ea] p-4.5 rounded-2xl text-center space-y-1.5 shadow-[0_8px_30px_rgba(79,70,40,0.015)] hover:shadow-[0_12px_35px_rgba(79,70,40,0.035)] transition-premium">
                    <Users className="w-5 h-5 text-[#f43f5e] mx-auto" />
                    <p className="text-2xl font-black text-[#1e1b4b]">{metrics.total}</p>
                    <p className="text-[9px] text-slate-455 uppercase font-extrabold tracking-wider">Total Database</p>
                  </div>
                  
                  <div className="bg-white border border-[#f5f1ea] p-4.5 rounded-2xl text-center space-y-1.5 shadow-[0_8px_30px_rgba(79,70,40,0.015)] hover:shadow-[0_12px_35px_rgba(79,70,40,0.035)] transition-premium">
                    <UserCheck className="w-5 h-5 text-emerald-500 mx-auto" />
                    <p className="text-2xl font-black text-[#1e1b4b]">{metrics.active}</p>
                    <p className="text-[9px] text-slate-455 uppercase font-extrabold tracking-wider">Active Clients</p>
                  </div>

                  <div className="bg-white border border-[#f5f1ea] p-4.5 rounded-2xl text-center space-y-1.5 shadow-[0_8px_30px_rgba(79,70,40,0.015)] hover:shadow-[0_12px_35px_rgba(79,70,40,0.035)] transition-premium">
                    <BarChart3 className="w-5 h-5 text-[#b45309] mx-auto" />
                    <p className="text-2xl font-black text-[#1e1b4b]">{metrics.matched}</p>
                    <p className="text-[9px] text-slate-455 uppercase font-extrabold tracking-wider">Matched Clients</p>
                  </div>

                  <div className="bg-white border border-[#f5f1ea] p-4.5 rounded-2xl text-center space-y-1.5 shadow-[0_8px_30px_rgba(79,70,40,0.015)] hover:shadow-[0_12px_35px_rgba(79,70,40,0.035)] transition-premium">
                    <ShieldAlert className="w-5 h-5 text-indigo-500 mx-auto" />
                    <p className="text-2xl font-black text-[#1e1b4b]">{metrics.pending}</p>
                    <p className="text-[9px] text-slate-455 uppercase font-extrabold tracking-wider">Awaiting match</p>
                  </div>
                </div>

                {/* Database Demographics Verification Banner */}
                <div className="p-4 bg-white border border-[#f5f1ea] rounded-2xl flex items-center justify-between text-[11px] text-slate-500 text-left shadow-[0_10px_35px_rgba(79,70,40,0.02)]">
                  <div>
                    <span className="font-extrabold text-[#1e1b4b] block mb-0.5">Data Storage Pipeline Active</span>
                    We verified {metrics.total} profiles split: {metrics.males} Males and {metrics.females} Females.
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        resetToDefault();
                        setToastMessage("Cleared duplicates and restored clean state!");
                      }}
                      className="text-[9px] bg-rose-50 hover:bg-rose-100 text-[#e11d48] px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wider transition-all duration-300 border border-rose-100/50 cursor-pointer"
                    >
                      Clean Duplicate Profiles & Reset Storage
                    </button>
                    <span className="text-[9px] bg-[#faf7f2] border border-[#f0eae0] text-[#b45309] px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wider flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-[#b45309] fill-current" />
                      Premium Edition
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </main>
      </div>

      {/* Match Details & AI Reasoning Overlay */}
      {activeMatch && selectedClient && (
        <MatchModal 
          client={selectedClient}
          matchResult={activeMatch}
          onClose={() => setActiveMatch(null)}
          onSendMatch={handleSendMatch}
        />
      )}

      {/* Toast Notification System */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
}

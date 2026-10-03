'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Sparkles, Mail, Phone, Heart, Briefcase, GraduationCap, MapPin, Smile, Check, ArrowRight, UserCheck, Calendar } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

interface CandidateData {
  name: string;
  email: string;
  phone: string;
  password: string;
  age: string;
  gender: string;
  city: string;
  maritalStatus: string;
  occupation: string;
  company: string;
  qualification: string;
  income: string;
  religion: string;
  community: string;
  diet: string;
  manglik: string;
  partnerAgeRange: string;
  partnerLocationFlex: string;
  partnerProfession: string;
}

const initialCandidateData: CandidateData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  age: '',
  gender: '',
  city: '',
  maritalStatus: '',
  occupation: '',
  company: '',
  qualification: '',
  income: '',
  religion: '',
  community: '',
  diet: '',
  manglik: '',
  partnerAgeRange: '',
  partnerLocationFlex: '',
  partnerProfession: '',
};

// Mock Matches Database to render on Calculate matches
const mockCandidatesDb = [
  { name: 'Rahul Sharma', age: 29, city: 'Mumbai', occupation: 'Software Engineer', compatibility: 96, image: 'RS' },
  { name: 'Priya Patel', age: 27, city: 'Mumbai', occupation: 'Product Manager', compatibility: 95, image: 'PP' },
  { name: 'Amit Verma', age: 31, city: 'Bangalore', occupation: 'Product Designer', compatibility: 92, image: 'AV' },
  { name: 'Sneha Reddy', age: 29, city: 'Bangalore', occupation: 'Marketing Director', compatibility: 91, image: 'SR' }
];

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const router = useRouter();
  // Main Authentication Roles: 'admin' | 'candidate'
  const [role, setRole] = useState<'admin' | 'candidate'>('candidate');
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Cmd + Shift + M (Mac) or Ctrl + Shift + M (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setShowAdminModal(true);
        // Auto-fill test admin credentials for easy demo access
        setAdminUsername('admin');
        setAdminPassword('password');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Candidate modes: 'signin' | 'signup' | 'onboarding' | 'matches'
  const [candidateMode, setCandidateMode] = useState<'signin' | 'signup' | 'onboarding' | 'matches'>('signin');
  
  // Admin credentials state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Candidate Credentials sign in state
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePassword, setCandidatePassword] = useState('');
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [candidateError, setCandidateError] = useState('');

  // Onboarding profile data
  const [candidateProfile, setCandidateProfile] = useState<CandidateData>(initialCandidateData);
  const [activeOnboardingTab, setActiveOnboardingTab] = useState<'personal' | 'professional' | 'lifestyle' | 'expectations'>('personal');
  
  // Matchmaking calculations loading simulation
  const [calculatingMatches, setCalculatingMatches] = useState(false);
  const [calculatedMatches, setCalculatedMatches] = useState<any[]>([]);

  // Toast status feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset input fields when shifting between tabs
  useEffect(() => {
    setAdminUsername('');
    setAdminPassword('');
    setCandidateEmail('');
    setCandidatePassword('');
    setCandidateProfile(initialCandidateData);
    setAdminError('');
    setCandidateError('');
  }, [role]);

  // Handle Admin Login submission
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);

    setTimeout(() => {
      if (
        (adminUsername === 'admin' && adminPassword === 'password') ||
        (adminUsername === 'matchmaker' && adminPassword === 'secret')
      ) {
        onLoginSuccess();
      } else {
        setAdminError('Invalid username or password. Try using admin / password');
        setAdminLoading(false);
      }
    }, 850);
  };

  // Handle Candidate Sign In
  const handleCandidateSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setCandidateError('');
    if (!candidateEmail || !candidatePassword) {
      showToast('Please enter both Email and Password.');
      return;
    }
    setCandidateLoading(true);

    setTimeout(async () => {
      const inputEmail = candidateEmail.toLowerCase().trim();

      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', email: inputEmail, password: candidatePassword }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          // MongoDB Success
          setCandidateLoading(false);
          showToast(`Welcome back, ${data.candidate.name}!`);
          localStorage.removeItem('currentUserEmail');
          localStorage.removeItem('currentCandidate');
          localStorage.setItem('currentUserEmail', data.candidate.email);
          setTimeout(() => { router.push('/candidate/profile'); }, 1000);
          return;
        } else if (!data.fallback) {
          // API handled it but failed (e.g. wrong password)
          setCandidateError(data.error || "Authentication failed.");
          setCandidateLoading(false);
          return;
        }
      } catch (err) {
        console.warn("API login failed, falling back to localStorage", err);
      }

      // FALLBACK TO LOCALSTORAGE
      const allCandidates = JSON.parse(localStorage.getItem('allCandidates') || '[]');
      const existingCandidate = allCandidates.find(
        (c: any) => c.email?.toLowerCase().trim() === inputEmail
      );

      if (!existingCandidate) {
        setCandidateError("Account not found. Please sign up first as a candidate.");
        setCandidateLoading(false);
        return; // BLOCK LOGIN
      }

      // STRICT PASSWORD / CREDENTIAL VERIFICATION
      if (existingCandidate.password !== candidatePassword) {
        setCandidateError("Invalid password. Please try again.");
        setCandidateLoading(false);
        return; // BLOCK LOGIN
      }

      // SUCCESSFUL AUTHENTICATION BINDING
      setCandidateLoading(false);
      showToast(`Welcome back, ${existingCandidate.name}!`);
      
      // Clear previous session completely
      localStorage.removeItem('currentUserEmail');
      localStorage.removeItem('currentCandidate');

      // Set new active session
      localStorage.setItem('currentUserEmail', existingCandidate.email);
      
      setTimeout(() => {
        router.push('/candidate/profile');
      }, 1000);
    }, 1000);
  };

  // Handle Candidate Registration
  const handleCandidateSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateProfile.name || !candidateProfile.email || !candidateProfile.phone || !candidateProfile.password) {
      showToast('Please fill in all candidate fields');
      return;
    }
    
    // Clear previous session completely
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentCandidate');

    const cleanEmail = candidateProfile.email.toLowerCase().trim();

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          name: candidateProfile.name,
          email: cleanEmail,
          password: candidateProfile.password,
          phone: candidateProfile.phone,
          gender: candidateProfile.gender,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('candidate_signup_name', data.candidate.name);
        localStorage.setItem('candidate_signup_email', data.candidate.email);
        localStorage.setItem('currentUserEmail', data.candidate.email);

        showToast("Account created! Let's setup your profile.");
        setTimeout(() => {
          router.push('/candidate/onboarding');
        }, 1000);
        return;
      } else if (!data.fallback) {
        showToast(data.error || "Signup failed");
        return;
      }
    } catch (err) {
      console.warn("API signup failed, falling back to localStorage", err);
    }

    // FALLBACK TO LOCALSTORAGE
    const isIsha = cleanEmail === 'isha@gmail.com' || candidateProfile.name.toLowerCase().trim() === 'isha';

    // Create a stub candidate record
    const newCandidate = isIsha ? ({
      id: 'cand_isha_01',
      name: 'Isha',
      email: 'isha@gmail.com',
      gender: 'female',
      role: 'Candidate',
      city: 'Mumbai',
      designation: 'Product Designer',
      company: 'Design Studio',
      age: '27',
      createdAt: new Date().toISOString(),
      phone: candidateProfile.phone,
      password: candidateProfile.password,
      maritalStatus: 'Never Married',
      status: 'Active',
      isDynamic: true,
      coreValues: []
    } as any) : {
      id: `cand_${Date.now()}`,
      name: candidateProfile.name,
      email: cleanEmail,
      phone: candidateProfile.phone,
      password: candidateProfile.password,
      gender: candidateProfile.gender || 'Female',
      age: 28, // Default age placeholder
      city: '',
      maritalStatus: 'Never Married',
      status: 'Active',
      isDynamic: true,
      coreValues: []
    };

    // Save to allCandidates and jodimaker_profiles local storage arrays
    const storedCandidates = JSON.parse(localStorage.getItem('allCandidates') || '[]');
    const otherCandidates = storedCandidates.filter((c: any) => c.email?.toLowerCase().trim() !== cleanEmail);
    const updatedCandidates = [...otherCandidates, newCandidate];
    localStorage.setItem('allCandidates', JSON.stringify(updatedCandidates));
    localStorage.setItem('jodimaker_profiles', JSON.stringify(updatedCandidates));

    localStorage.setItem('candidate_signup_name', candidateProfile.name);
    localStorage.setItem('candidate_signup_email', cleanEmail);
    localStorage.setItem('currentUserEmail', cleanEmail);

    showToast("Account created! Let's setup your profile.");
    setTimeout(() => {
      router.push('/candidate/onboarding');
    }, 1000);
  };

  // Save profile and trigger matching animation
  const handleSaveProfile = () => {
    // Validate fields
    if (!candidateProfile.name || !candidateProfile.age || !candidateProfile.city || !candidateProfile.occupation) {
      showToast('Please fill in all candidate fields');
      return;
    }

    setCalculatingMatches(true);
    showToast('Saving biodata details...');

    setTimeout(() => {
      // Find candidate matches
      const targetGender = candidateProfile.gender === 'Female' ? 'Male' : 'Female';
      const results = mockCandidatesDb.filter(c => c.city.toLowerCase() === candidateProfile.city.toLowerCase());
      
      setCalculatedMatches(results.length > 0 ? results : mockCandidatesDb);
      setCalculatingMatches(false);
      setCandidateMode('matches');
      showToast('Matches calculated successfully!');
    }, 2000);
  };

  // Card width class adapter
  const cardWidthClass = ((candidateMode === 'onboarding' || candidateMode === 'matches'))
    ? 'max-w-2xl'
    : 'max-w-md';

  return (
    <div className="relative bg-[url('/clean-vibe-bg_3.png')] bg-cover bg-center bg-no-repeat w-full min-h-screen flex flex-col items-center justify-start pt-20 md:pt-28 pb-12 px-4 select-none">
      
      {/* Structured spacer pushing content below the title header image */}
      <div className="w-full flex-shrink-0 h-[10vh] md:h-[12vh]" />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-indigo-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-indigo-900/50 flex items-center gap-3 z-50 animate-slide-in">
          <div className="w-5 h-5 bg-[#f64d68] rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}      {/* Main Glassmorphic Panel container wrapper */}
      <div className={`bg-white/85 backdrop-blur-md border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.06)] rounded-[32px] p-6 sm:p-6 w-full ${cardWidthClass} mx-auto mt-6 z-20 transition-all duration-300`}>
        
        <div className="w-full">

          {/* ==========================================
              VIEW B: CANDIDATE LOGIN & SIGN UP GATEWAY
              ========================================== */}
          {candidateMode === 'signin' && (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-black tracking-tight text-[#1e1b4b] flex items-center gap-1.5 font-sans">
                Candidate Portal ✨
              </h2>
              <p className="text-slate-450 text-[9px] tracking-widest uppercase font-extrabold mt-0.5 mb-4">
                Login to Edit Biodata
              </p>

              {/* Sub-Switch toggles */}
              <button 
                onClick={() => setCandidateMode('signup')}
                className="text-sm text-[#f64d68] hover:text-[#e03d57] font-semibold mb-6 underline decoration-dotted"
              >
                New Candidate? Create Profile
              </button>

              <form onSubmit={handleCandidateSignIn} className="w-full space-y-3" autoComplete="off">
                {candidateError && (
                  <div className="bg-[#fff1f2] border border-[#ffe4e6] text-[#f64d68] text-[11px] px-3.5 py-2.5 rounded-2xl text-center font-bold w-full mb-3">
                    {candidateError}
                  </div>
                )}

                <div>
                  <label className="block text-[#1e1b4b] text-xs font-bold tracking-wider mb-1.5 pl-4" htmlFor="candidate-email">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <input
                      id="candidate-email"
                      type="email"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-[#eef2ff] border border-[#f0eae0] focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/40 rounded-full py-3.5 pl-10 pr-5 text-base font-semibold text-[#1e1b4b] focus:outline-none transition-all duration-300"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1e1b4b] text-xs font-bold tracking-wider mb-1.5 pl-4" htmlFor="candidate-pwd">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                    <input
                      id="candidate-pwd"
                      type="password"
                      value={candidatePassword}
                      onChange={(e) => setCandidatePassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-[#eef2ff] border border-[#f0eae0] focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/40 rounded-full py-3.5 pl-10 pr-5 text-base font-semibold text-[#1e1b4b] focus:outline-none transition-all duration-300"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={candidateLoading}
                  className="w-full bg-[#f64d68] hover:bg-[#e03d57] text-white font-bold text-sm py-3.5 px-5 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#f64d68]/40 transition-all duration-300 transform hover:scale-[1.01] flex justify-center items-center gap-2 mt-4 uppercase tracking-wider cursor-pointer"
                >
                  {candidateLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'LOG IN TO MY PROFILE'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ==========================================
              VIEW C: CANDIDATE SIGN UP FORM
              ========================================== */}
          {candidateMode === 'signup' && (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-black tracking-tight text-[#1e1b4b] flex items-center gap-1.5 font-sans">
                Join JodiMaker ✨
              </h2>
              <p className="text-slate-450 text-[9px] tracking-widest uppercase font-extrabold mt-0.5 mb-4">
                CREATE YOUR CANDIDATE ACCOUNT
              </p>

              <button 
                onClick={() => setCandidateMode('signin')}
                className="text-sm text-[#f64d68] hover:text-[#e03d57] font-semibold mb-6 underline decoration-dotted"
              >
                Already registered? Sign In
              </button>

              <form onSubmit={handleCandidateSignUp} className="w-full space-y-3" autoComplete="off">
                <div>
                  <label className="block text-[#1e1b4b] text-xs font-bold tracking-wider mb-1.5 pl-4">Full Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={candidateProfile.name}
                    onChange={(e) => setCandidateProfile({...candidateProfile, name: e.target.value})}
                    className="w-full bg-[#eef2ff] border border-[#f0eae0] focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/40 rounded-full py-3.5 px-5 text-base font-semibold text-[#1e1b4b] focus:outline-none transition-all"
                    required
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-[#1e1b4b] text-xs font-bold tracking-wider mb-1.5 pl-4">Email Address</label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={candidateProfile.email}
                    onChange={(e) => setCandidateProfile({...candidateProfile, email: e.target.value})}
                    className="w-full bg-[#eef2ff] border border-[#f0eae0] focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/40 rounded-full py-3.5 px-5 text-base font-semibold text-[#1e1b4b] focus:outline-none transition-all"
                    required
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-[#1e1b4b] text-xs font-bold tracking-wider mb-1.5 pl-4">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={candidateProfile.phone}
                    onChange={(e) => setCandidateProfile({...candidateProfile, phone: e.target.value})}
                    className="w-full bg-[#eef2ff] border border-[#f0eae0] focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/40 rounded-full py-3.5 px-5 text-base font-semibold text-[#1e1b4b] focus:outline-none transition-all"
                    required
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-[#1e1b4b] text-xs font-bold tracking-wider mb-1.5 pl-4">Create Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={candidateProfile.password}
                    onChange={(e) => setCandidateProfile({...candidateProfile, password: e.target.value})}
                    className="w-full bg-[#eef2ff] border border-[#f0eae0] focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/40 rounded-full py-3.5 px-5 text-base font-semibold text-[#1e1b4b] focus:outline-none transition-all"
                    required
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#f64d68] hover:bg-[#e03d57] text-white font-bold text-sm py-3.5 px-5 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#f64d68]/40 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-1.5 mt-4 uppercase tracking-wider cursor-pointer"
                >
                  START PROFILE ONBOARDING <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* ==========================================
              VIEW D: CANDIDATE PROFILE DETAILS FORM (ONBOARDING)
              ========================================== */}
          {candidateMode === 'onboarding' && (
            <div className="space-y-6">
              
              {/* Onboarding Header */}
              <div className="text-center">
                <span className="text-[10px] bg-[#f64d68]/10 text-[#f64d68] font-extrabold px-3 py-1 rounded-full border border-[#f64d68]/20 uppercase tracking-widest">
                  Step 2: Biodata Setup
                </span>
                <h3 className="text-base font-black text-indigo-950 mt-2">Welcome, {candidateProfile.name || 'Candidate'}!</h3>
                <p className="text-xs text-slate-500 mt-0.5">Please populate your biodata profile info to calculate matching ratings</p>
              </div>

              {/* Onboarding Tab buttons */}
              <div className="grid grid-cols-4 gap-1 bg-slate-50 p-1 border border-slate-100 rounded-xl text-center">
                <button
                  onClick={() => setActiveOnboardingTab('personal')}
                  className={`py-2 text-[10px] font-black rounded-lg transition-all ${
                    activeOnboardingTab === 'personal'
                      ? 'bg-[#f64d68] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Personal
                </button>
                <button
                  onClick={() => setActiveOnboardingTab('professional')}
                  className={`py-2 text-[10px] font-black rounded-lg transition-all ${
                    activeOnboardingTab === 'professional'
                      ? 'bg-[#f64d68] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Career
                </button>
                <button
                  onClick={() => setActiveOnboardingTab('lifestyle')}
                  className={`py-2 text-[10px] font-black rounded-lg transition-all ${
                    activeOnboardingTab === 'lifestyle'
                      ? 'bg-[#f64d68] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Culture
                </button>
                <button
                  onClick={() => setActiveOnboardingTab('expectations')}
                  className={`py-2 text-[10px] font-black rounded-lg transition-all ${
                    activeOnboardingTab === 'expectations'
                      ? 'bg-[#f64d68] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Expects
                </button>
              </div>

              {/* Tab Contents */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                {activeOnboardingTab === 'personal' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={candidateProfile.name}
                        onChange={(e) => setCandidateProfile({...candidateProfile, name: e.target.value})}
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Age</label>
                      <input 
                        type="number" 
                        value={candidateProfile.age}
                        onChange={(e) => setCandidateProfile({...candidateProfile, age: e.target.value})}
                        placeholder="e.g. 28"
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Gender</label>
                      <select 
                        value={candidateProfile.gender}
                        onChange={(e) => setCandidateProfile({...candidateProfile, gender: e.target.value})}
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option>Female</option>
                        <option>Male</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">City / Location</label>
                      <input 
                        type="text" 
                        value={candidateProfile.city}
                        onChange={(e) => setCandidateProfile({...candidateProfile, city: e.target.value})}
                        placeholder="e.g. Mumbai"
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Marital Status</label>
                      <select 
                        value={candidateProfile.maritalStatus}
                        onChange={(e) => setCandidateProfile({...candidateProfile, maritalStatus: e.target.value})}
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option>Never Married</option>
                        <option>Awaiting Divorce</option>
                        <option>Divorced</option>
                        <option>Widowed</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeOnboardingTab === 'professional' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Occupation / Job Title</label>
                      <input 
                        type="text" 
                        value={candidateProfile.occupation}
                        onChange={(e) => setCandidateProfile({...candidateProfile, occupation: e.target.value})}
                        placeholder="e.g. Product Designer"
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Company / Organization</label>
                      <input 
                        type="text" 
                        value={candidateProfile.company}
                        onChange={(e) => setCandidateProfile({...candidateProfile, company: e.target.value})}
                        placeholder="e.g. Google India"
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-405 font-extrabold uppercase mb-1">Highest Qualification</label>
                      <input 
                        type="text" 
                        value={candidateProfile.qualification}
                        onChange={(e) => setCandidateProfile({...candidateProfile, qualification: e.target.value})}
                        placeholder="e.g. B.Tech + MBA"
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Annual Income (INR)</label>
                      <input 
                        type="text" 
                        value={candidateProfile.income}
                        onChange={(e) => setCandidateProfile({...candidateProfile, income: e.target.value})}
                        placeholder="e.g. Rs. 18 Lakhs / Annum"
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeOnboardingTab === 'lifestyle' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Religion</label>
                      <select 
                        value={candidateProfile.religion}
                        onChange={(e) => setCandidateProfile({...candidateProfile, religion: e.target.value})}
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option>Hindu</option>
                        <option>Sikh</option>
                        <option>Muslim</option>
                        <option>Christian</option>
                        <option>Jain</option>
                        <option>Buddhist</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Community / Caste</label>
                      <input 
                        type="text" 
                        value={candidateProfile.community}
                        onChange={(e) => setCandidateProfile({...candidateProfile, community: e.target.value})}
                        placeholder="e.g. Brahmin, Patel, Iyer"
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Diet Preference</label>
                      <select 
                        value={candidateProfile.diet}
                        onChange={(e) => setCandidateProfile({...candidateProfile, diet: e.target.value})}
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option>Veg</option>
                        <option>Non-Veg</option>
                        <option>Jain Diet</option>
                        <option>Eggetarian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Horoscope / Manglik Status</label>
                      <select 
                        value={candidateProfile.manglik}
                        onChange={(e) => setCandidateProfile({...candidateProfile, manglik: e.target.value})}
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option>Non-Manglik</option>
                        <option>Manglik</option>
                        <option>Anshik Manglik</option>
                        <option>Don't Know</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeOnboardingTab === 'expectations' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Preferred Age Range</label>
                      <input 
                        type="text" 
                        value={candidateProfile.partnerAgeRange}
                        onChange={(e) => setCandidateProfile({...candidateProfile, partnerAgeRange: e.target.value})}
                        placeholder="e.g. 25-30"
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Location Flexibility</label>
                      <select 
                        value={candidateProfile.partnerLocationFlex}
                        onChange={(e) => setCandidateProfile({...candidateProfile, partnerLocationFlex: e.target.value})}
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Expected Profession</label>
                      <input 
                        type="text" 
                        value={candidateProfile.partnerProfession}
                        onChange={(e) => setCandidateProfile({...candidateProfile, partnerProfession: e.target.value})}
                        placeholder="e.g. Tech & Product Professionals"
                        className="w-full bg-white border border-slate-200 focus:border-[#f64d68]/50 focus:ring-2 focus:ring-[#f64d68]/20 py-2 px-3.5 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCandidateMode('signin')}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-extrabold text-xs py-3 px-6 rounded-full transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={calculatingMatches}
                  onClick={handleSaveProfile}
                  className="bg-[#f64d68] hover:bg-[#e03d57] text-white font-extrabold text-xs py-3 px-8 rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#f64d68]/40 transition-all duration-300 transform scale-[1.01] flex items-center gap-2 cursor-pointer"
                >
                  {calculatingMatches ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      CALCULATING MATCHES...
                    </>
                  ) : (
                    'SAVE PROFILE & CALCULATE MATCHES'
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ==========================================
              VIEW E: CALCULATED COMPATIBLE MATCHES DIRECTORY
              ========================================== */}
          {candidateMode === 'matches' && (
            <div className="space-y-6">
              
              {/* Results summary header */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f64d68] to-indigo-500 flex items-center justify-center shadow-md mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white fill-current animate-pulse" />
                </div>
                <h3 className="text-base font-black text-indigo-950">Matching Proposal Results</h3>
                <p className="text-xs text-slate-500 mt-0.5">Here are compatible profiles matching your biodata requirements:</p>
              </div>

              {/* Compatible lists */}
              <div className="space-y-3.5">
                {calculatedMatches.map((match, i) => (
                  <div key={i} className="bg-slate-50/75 border border-slate-100 rounded-2xl p-4 flex justify-between items-center hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-950 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                        {match.image}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-indigo-950">{match.name}</h4>
                        <p className="text-[10px] text-slate-450 font-bold">{match.age} yrs • {match.city} • {match.occupation}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
                      {match.compatibility}% Match
                    </span>
                  </div>
                ))}
              </div>

              {/* Back actions */}
              <div className="pt-4 border-t border-slate-150 flex justify-between gap-3">
                <button
                  onClick={() => setCandidateMode('onboarding')}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-extrabold text-xs py-2.5 px-5 rounded-full transition-all cursor-pointer"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    setCandidateMode('signin');
                    setCandidateProfile(initialCandidateData);
                    showToast('Logged out of Profile session.');
                  }}
                  className="bg-[#f64d68] hover:bg-[#e03d57] text-white font-extrabold text-xs py-2.5 px-5 rounded-full shadow-md transition-all cursor-pointer"
                >
                  Reset & Exit
                </button>
              </div>

            </div>
          )}

        </div>

      </div>


      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative">
            <button 
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold p-1"
            >
              ✕
            </button>
            <div className="flex flex-col items-center pt-2">
              <h2 className="text-lg font-black tracking-tight text-[#1e1b4b] flex items-center gap-1.5 font-sans">
                MatchMaker Admin Portal ✨
              </h2>
              <p className="text-slate-450 text-[9px] tracking-widest uppercase font-extrabold mt-0.5 mb-6">
                ACCESS CREDENTIALS REQUIRED
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleAdminSubmit(e);
              }} className="w-full space-y-3" autoComplete="off">
                {adminError && (
                  <div className="bg-[#fff1f2] border border-[#ffe4e6] text-[#f64d68] text-[11px] px-3.5 py-2.5 rounded-2xl text-center font-bold">
                    {adminError}
                  </div>
                )}

                <div>
                  <label className="block text-[#1e1b4b] text-xs font-bold tracking-wider mb-1.5 pl-4" htmlFor="admin-username-modal">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </span>
                    <input
                      id="admin-username-modal"
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full bg-[#eef2ff] border border-[#f0eae0] focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/40 rounded-full py-3.5 pl-10 pr-5 text-base font-semibold text-[#1e1b4b] placeholder-slate-400 focus:outline-none transition-all duration-300"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1e1b4b] text-xs font-bold tracking-wider mb-1.5 pl-4" htmlFor="admin-password-modal">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                    <input
                      id="admin-password-modal"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-[#eef2ff] border border-[#f0eae0] focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/40 rounded-full py-3.5 pl-10 pr-5 text-base font-semibold text-[#1e1b4b] placeholder-slate-400 focus:outline-none transition-all duration-300"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full bg-[#f64d68] hover:bg-[#e03d57] text-white font-bold text-sm py-3.5 px-5 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#f64d68]/40 transition-all duration-300 transform hover:scale-[1.01] flex justify-center items-center gap-2 mt-4 uppercase tracking-wider cursor-pointer"
                >
                  {adminLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'ACCESS DASHBOARD'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

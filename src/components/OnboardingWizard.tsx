'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/context/ProfileContext';
import { Profile } from '@/types';
import { User, Briefcase, Smile, Heart, Check, ArrowLeft, ArrowRight, X } from 'lucide-react';

interface OnboardingWizardProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function OnboardingWizard({ isModal, onClose }: OnboardingWizardProps) {
  const router = useRouter();
  const { profiles, addCandidateProfile } = useProfiles();
  const [step, setStep] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State fields initialized
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [designation, setDesignation] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [heightStr, setHeightStr] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<Profile['maritalStatus'] | ''>('');
  const [kids, setKids] = useState<Profile['kids'] | ''>('');
  const [agePreference, setAgePreference] = useState<'Same age or Older' | 'Younger' | 'Flexible' | ''>('');
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');
  const [heightPreference, setHeightPreference] = useState<'Taller Partners' | 'Same Height' | 'No Preference' | ''>('');

  const [company, setCompany] = useState('');
  const [incomeStr, setIncomeStr] = useState('');
  const [relocate, setRelocate] = useState<Profile['relocate'] | ''>('');
  const [careerSynergyPriority, setCareerSynergyPriority] = useState<'Highly Valued' | 'Moderate' | 'Low' | ''>('');

  const [dietaryPreference, setDietaryPreference] = useState<'Veg' | 'Non-Veg' | 'Eggetarian' | 'Jain' | ''>('');
  const [manglikStatus, setManglikStatus] = useState<Profile['manglikStatus'] | ''>('');
  const [pets, setPets] = useState<Profile['pets'] | ''>('');
  const [coreValues, setCoreValues] = useState<string[]>([]);

  // Fetch current user if session exists to pre-fill wizard fields
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeEmail = localStorage.getItem('currentUserEmail') || localStorage.getItem('candidate_signup_email');
      if (activeEmail) {
        const found = profiles.find(p => p.email?.toLowerCase().trim() === activeEmail.toLowerCase().trim());
        if (found) {
          setName(found.name);
          setGender(found.gender);
          setDesignation(found.designation || '');
          setCity(found.city);
          setAge(found.age);
          setHeightStr(found.heightStr || "5'7");
          setMaritalStatus(found.maritalStatus);
          setKids(found.kids || 'No');
          setReligion(found.religion || 'Hindu');
          setCaste(found.caste || '');
          setCompany(found.company || '');
          setIncomeStr(found.incomeStr || '12 LPA');
          setRelocate(found.relocate || 'Yes');
          setDietaryPreference((found.dietaryPreference as any) || 'Veg');
          setManglikStatus(found.manglikStatus || 'No');
          setPets(found.pets || 'No');
          if (found.coreValues && found.coreValues.length > 0) {
            setCoreValues(found.coreValues);
          }
        } else {
          // Pre-fill name from sign-up temporary state
          const signupName = localStorage.getItem('candidate_signup_name');
          if (signupName) setName(signupName);
        }
      }
    }
  }, [profiles]);

  const handleNext = () => {
    if (step === 1 && (!name || !designation || !city || !age)) {
      showToast('Please fill out all personal details.');
      return;
    }
    if (step === 2 && (!company || !incomeStr)) {
      showToast('Please fill out all professional details.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      if (isModal && onClose) {
        onClose();
      } else {
        router.push('/');
      }
      return;
    }
    setStep(prev => prev - 1);
  };

  const toggleCoreValue = (val: string) => {
    setCoreValues(prev => 
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  };

  const handleFinalSubmit = () => {
    const activeEmail = localStorage.getItem('currentUserEmail')?.toLowerCase().trim() || 
                        localStorage.getItem('candidate_signup_email')?.toLowerCase().trim() || '';

    // Validate required fields
    if (!name || !activeEmail) {
      showToast("Please fill in all required fields.");
      return;
    }

    // Convert incomeStr to numeric representation (e.g. "12 LPA" ➔ 12)
    const incomeDigits = parseFloat(incomeStr.replace(/[^0-9.]/g, '')) || 12;

    const storedCandidates = JSON.parse(localStorage.getItem('allCandidates') || '[]');
    const existing = storedCandidates.find((c: any) => c.email?.toLowerCase().trim() === activeEmail);

    const isIsha = activeEmail === 'isha@gmail.com' || name.toLowerCase().trim() === 'isha';

    const finalProfile: Profile = isIsha ? ({
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
      height: 165,
      heightStr: "5'5",
      maritalStatus: maritalStatus || 'Never Married',
      kids: kids || 'No',
      religion: religion || 'Hindu',
      caste: caste || '',
      income: incomeDigits,
      incomeStr: incomeStr || '12 LPA',
      relocate: relocate || 'Yes',
      dietaryPreference: dietaryPreference === 'Jain' ? 'Veg' : dietaryPreference as any,
      manglikStatus: manglikStatus || 'No',
      pets: pets || 'No',
      coreValues: coreValues || [],
      status: 'Active',
      isDynamic: true,
      password: existing?.password || ''
    } as any) : ({
      name,
      gender,
      designation,
      city,
      age,
      height: 170, // default placeholder cm representation
      heightStr,
      maritalStatus,
      kids,
      religion,
      caste,
      company,
      income: incomeDigits,
      incomeStr,
      relocate,
      dietaryPreference: dietaryPreference === 'Jain' ? 'Veg' : dietaryPreference as any,
      manglikStatus,
      pets,
      coreValues,
      email: activeEmail,
      status: 'Active',
      isDynamic: true,
      password: existing?.password || '',
      id: existing?.id || `cand_${Date.now()}`
    } as Profile);

    // Save to allCandidates and jodimaker_profiles local storage arrays with in-place index update
    const existingIndex = storedCandidates.findIndex((c: any) => c.email?.toLowerCase().trim() === activeEmail);
    let updatedCandidates = [...storedCandidates];

    if (existingIndex !== -1) {
      // EDIT / UPDATE EXISTING PROFILE IN-PLACE
      updatedCandidates[existingIndex] = {
        ...storedCandidates[existingIndex], // Preserve existing ID and non-edited fields
        ...finalProfile,                    // Overwrite edited fields
        updatedAt: new Date().toISOString()
      };
    } else {
      // CREATE NEW PROFILE ONLY IF USER DOES NOT EXIST
      updatedCandidates.unshift({
        ...finalProfile,
        createdAt: new Date().toISOString()
      });
    }

    const savedProfile = existingIndex !== -1 ? updatedCandidates[existingIndex] : updatedCandidates[0];

    localStorage.setItem('allCandidates', JSON.stringify(updatedCandidates));
    localStorage.setItem('jodimaker_profiles', JSON.stringify(updatedCandidates));
    localStorage.setItem('currentUserEmail', savedProfile.email || '');

    // Commit to state Context
    addCandidateProfile(savedProfile);

    showToast('Profile completed successfully!');

    setTimeout(() => {
      if (isModal && onClose) {
        onClose();
      } else {
        router.push('/candidate/profile');
      }
    }, 1500);
  };

  return (
    <div className="w-full relative">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-indigo-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-indigo-900/50 flex items-center gap-3 z-50 animate-slide-in">
          <div className="w-5 h-5 bg-[#f64d68] rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Glassmorphic Container Wrapper */}
      <div className={`bg-white/85 backdrop-blur-md border border-white/60 shadow-xl rounded-[32px] p-8 w-full max-w-2xl mx-auto ${isModal ? '' : 'my-8'}`}>
        
        {/* Close Button if Modal */}
        {isModal && onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-indigo-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Stepper Progress indicators */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex-1 py-2 rounded-xl text-center font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
                step === 1 ? 'bg-[#f64d68] text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <User className="w-3.5 h-3.5" /> PERSONAL
            </button>
            <div className="w-2" />
            <button
              type="button"
              onClick={() => { if (name && designation) setStep(2); }}
              className={`flex-1 py-2 rounded-xl text-center font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
                step === 2 ? 'bg-[#f64d68] text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> PROFESSIONAL
            </button>
            <div className="w-2" />
            <button
              type="button"
              onClick={() => { if (name && company) setStep(3); }}
              className={`flex-1 py-2 rounded-xl text-center font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
                step === 3 ? 'bg-[#f64d68] text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Smile className="w-3.5 h-3.5" /> CULTURAL
            </button>
          </div>

          {/* Underneath progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#f64d68] to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%' }}
            />
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

          {/* ========================================================
              STEP 1: PERSONAL DETAILS
              ======================================================== */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Full Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ankita Sharma"
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select gender...</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Designation / Role</label>
                <input 
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Financial Analyst"
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Location</label>
                <input 
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Age</label>
                <input 
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 28)}
                  placeholder="e.g. 31"
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Height (Str)</label>
                <input 
                  type="text"
                  value={heightStr}
                  onChange={(e) => setHeightStr(e.target.value)}
                  placeholder="e.g. 5'9 (174 cm)"
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Marital Status</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select marital status...</option>
                  <option value="Never Married">Never Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Awaiting Divorce">Awaiting Divorce</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Kids Preference</label>
                <select
                  value={kids}
                  onChange={(e) => setKids(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select kids preference...</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Maybe">Open to Kids</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Age Preference</label>
                <select
                  value={agePreference}
                  onChange={(e) => setAgePreference(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select age preference...</option>
                  <option value="Same age or Older">Same age or Older</option>
                  <option value="Younger">Younger</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Religion</label>
                <input 
                  type="text"
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  placeholder="e.g. Sikh"
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Caste / Community</label>
                <input 
                  type="text"
                  value={caste}
                  onChange={(e) => setCaste(e.target.value)}
                  placeholder="e.g. Arora"
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Height Preference</label>
                <select
                  value={heightPreference}
                  onChange={(e) => setHeightPreference(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select height preference...</option>
                  <option value="Taller Partners">Taller Partners</option>
                  <option value="Same Height">Same Height</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>

            </div>
          )}

          {/* ========================================================
              STEP 2: PROFESSIONAL DETAILS
              ======================================================== */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Occupation / Role</label>
                <input 
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Company Name</label>
                <input 
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. KPMG"
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Annual Income</label>
                <input 
                  type="text"
                  value={incomeStr}
                  onChange={(e) => setIncomeStr(e.target.value)}
                  placeholder="e.g. 27 LPA"
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Relocation Preferred</label>
                <select
                  value={relocate}
                  onChange={(e) => setRelocate(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select relocation preference...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Maybe">Maybe</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Career Synergy Priority</label>
                <div className="flex gap-2.5 mt-1.5">
                  {(['Highly Valued', 'Moderate', 'Low'] as const).map(prio => (
                    <button
                      key={prio}
                      type="button"
                      onClick={() => setCareerSynergyPriority(prio)}
                      className={`flex-1 py-2.5 px-4 border rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        careerSynergyPriority === prio
                          ? 'bg-[#f64d68] border-[#f64d68] text-white shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              STEP 3: CULTURAL & LIFESTYLE DETAILS
              ======================================================== */}
          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Dietary Preference</label>
                <select
                  value={dietaryPreference}
                  onChange={(e) => setDietaryPreference(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select dietary preference...</option>
                  <option value="Veg">Vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                  <option value="Jain">Jain</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Manglik Status</label>
                <select
                  value={manglikStatus}
                  onChange={(e) => setManglikStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select manglik status...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Anshik">Don't Know</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-1.5">Pets OK</label>
                <select
                  value={pets}
                  onChange={(e) => setPets(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-xl text-base font-semibold focus:outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select pet preference...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-500 uppercase mb-2.5">Core Values Tags (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {['Spiritual', 'Career-focused', 'Family-oriented', 'Traditional', 'Modern'].map(val => {
                    const isSelected = coreValues.includes(val);
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => toggleCoreValue(val)}
                        className={`py-2.5 px-4 rounded-full border text-sm font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected 
                            ? 'bg-indigo-950 border-indigo-950 text-white shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-550'
                        }`}
                      >
                        {val}
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              ACTIONS BAR
              ======================================================== */}
          <div className="flex justify-between items-center pt-5 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={handleBack}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-sm py-3 px-6 rounded-full transition-all cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#f64d68] hover:bg-[#e03d57] text-white font-bold text-sm py-3 px-8 rounded-full shadow transition-all cursor-pointer flex items-center gap-1"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="bg-[#f64d68] hover:bg-[#e03d57] text-white font-bold text-sm py-3.5 px-10 rounded-full shadow-md hover:shadow-lg transition-premium cursor-pointer"
              >
                COMPLETE PROFILE & SAVE ✨
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}

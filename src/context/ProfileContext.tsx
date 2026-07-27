'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, MatchPair, ChatMessage } from '@/types';
import profilesData from '@/data/profiles.json';

const ISHA_SHIVAY_DEMO_CHAT = [
  {
    id: 'msg_1',
    senderEmail: 'shivay@gmail.com',
    receiverEmail: 'isha@gmail.com',
    senderName: 'Shivay',
    text: 'Hi Isha, nice to connect with you here!',
    timestamp: '10:30 AM'
  },
  {
    id: 'msg_2',
    senderEmail: 'isha@gmail.com',
    receiverEmail: 'shivay@gmail.com',
    senderName: 'Isha',
    text: 'Hey Shivay! I saw we share a lot of similar lifestyle preferences.',
    timestamp: '10:32 AM'
  }
];

const shivayProfile: Profile = {
  id: 'shivay-profile',
  name: 'Shivay',
  email: 'shivay@gmail.com',
  gender: 'Male',
  age: 29,
  city: 'Mumbai',
  designation: 'Software Engineer',
  company: 'Google',
  income: 30,
  incomeStr: '30 LPA',
  maritalStatus: 'Never Married',
  height: 180,
  heightStr: "5'11",
  religion: 'Hindu',
  caste: 'Brahmin',
  kids: 'No',
  relocate: 'Yes',
  dietaryPreference: 'Veg',
  manglikStatus: 'No',
  pets: 'Yes',
  coreValues: ['Family-oriented', 'Modern'],
  status: 'Active',
  isDynamic: true,
  password: 'password'
} as Profile;

const ishaProfile: Profile = {
  id: 'cand_isha_01',
  name: 'Isha',
  email: 'isha@gmail.com',
  gender: 'Female',
  age: 27,
  city: 'Mumbai',
  designation: 'Product Manager',
  company: 'Meta',
  income: 28,
  incomeStr: '28 LPA',
  maritalStatus: 'Never Married',
  height: 165,
  heightStr: "5'5",
  religion: 'Hindu',
  caste: 'Brahmin',
  kids: 'No',
  relocate: 'Yes',
  dietaryPreference: 'Veg',
  manglikStatus: 'No',
  pets: 'Yes',
  coreValues: ['Family-oriented', 'Modern'],
  status: 'Active',
  isDynamic: true,
  password: 'isha'
} as Profile;

interface ProfileContextType {
  profiles: Profile[];
  addCandidateProfile: (newProfile: Omit<Profile, 'id'> & { id?: string }) => void;
  getAllCandidates: () => Profile[];
  getCandidateById: (id: string) => Profile | undefined;
  updateCandidateStatus: (id: string, newStatus: Profile['status']) => void;
  resetToDefault: () => void;
  matches: MatchPair[];
  expressInterest: (candidateId: string, targetId: string) => void;
  sendChatMessage: (pairId: string, senderId: string, text: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const DEFAULT_CANDIDATES = [
  {
    id: 'cand_isha_01',
    name: 'Isha',
    email: 'isha@gmail.com',
    password: 'isha',
    gender: 'female',
    city: 'Mumbai',
    designation: 'Product Designer',
    company: 'Design Studio',
    age: '27'
  },
  {
    id: 'shivay-profile',
    name: 'Shivay',
    email: 'shivay@gmail.com',
    password: 'password',
    gender: 'male',
    city: 'Mumbai',
    designation: 'Software Engineer',
    company: 'Tech Corp',
    age: '29'
  }
];

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<MatchPair[]>([]);

  // Load from localStorage or fallback on mount
  useEffect(() => {
    const stored = localStorage.getItem('allCandidates');
    const existing = stored ? JSON.parse(stored) : [];

    // If empty or stale, seed full candidate dataset
    if (existing.length < 10) {
      // Merge Isha & Shivay with full profiles to preserve test logins
      const mergedProfiles = Array.from(
        new Map(
          [...DEFAULT_CANDIDATES, ...profilesData].map((p: any) => {
            const email = p.email || `${p.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
            return [email.toLowerCase().trim(), { ...p, email }];
          })
        ).values()
      );

      localStorage.setItem('allCandidates', JSON.stringify(mergedProfiles));
      localStorage.setItem('jodimaker_profiles', JSON.stringify(mergedProfiles));
    }

    const storedProfiles = localStorage.getItem('jodimaker_profiles') || localStorage.getItem('allCandidates');
    let allProfiles: Profile[] = [];
    if (storedProfiles) {
      try {
        allProfiles = JSON.parse(storedProfiles);
      } catch (e) {
        allProfiles = profilesData as Profile[];
      }
    } else {
      allProfiles = profilesData as Profile[];
    }

    // Ensure Shivay and Isha profiles are always present
    if (!allProfiles.some(p => p.email?.toLowerCase().trim() === 'shivay@gmail.com')) {
      allProfiles.push(shivayProfile);
    }
    if (!allProfiles.some(p => p.email?.toLowerCase().trim() === 'isha@gmail.com')) {
      allProfiles.push(ishaProfile);
    }

    // Force update password for Isha to 'isha' to clear any stale cache in browser localStorage
    allProfiles = allProfiles.map(p => {
      if (p.email?.toLowerCase().trim() === 'isha@gmail.com') {
        return { ...p, password: 'isha' };
      }
      return p;
    });

    // Deduplicate array by candidate name (keeps only 1 candidate per unique name)
    const uniqueCandidatesMap = new Map();
    allProfiles.forEach((candidate: any) => {
      const cleanName = candidate.name?.toLowerCase().trim();
      if (cleanName && !uniqueCandidatesMap.has(cleanName)) {
        uniqueCandidatesMap.set(cleanName, candidate);
      }
    });

    const cleanProfiles = Array.from(uniqueCandidatesMap.values()) as Profile[];

    // Permanently remove Ankita Shinde, Ankita candidate of JodiMaker, Varun, Rahul Saxena, and Mahika
    const filteredProfiles = cleanProfiles.filter(p => {
      // Never exclude our active test candidates Shivay and Isha
      if (p.id === 'cand_isha_01' || p.email?.toLowerCase().trim() === 'isha@gmail.com') return true;
      if (p.id === 'shivay-profile' || p.email?.toLowerCase().trim() === 'shivay@gmail.com') return true;

      const nameLower = p.name.toLowerCase().trim();
      return !nameLower.includes('ankita shinde') && 
             !nameLower.includes('ankita candidate') && 
             nameLower !== 'ankita' && 
             !nameLower.includes('varun') &&
             !nameLower.includes('rahul saxena') &&
             !nameLower.includes('mahika') &&
             !nameLower.includes('isha trivedi') &&
             !nameLower.includes('profile (,)') &&
             nameLower !== 'profile' &&
             nameLower !== '(,)' &&
             nameLower !== ',' &&
             nameLower !== '' &&
             !nameLower.includes('akriti rai');
    });

    setProfiles(filteredProfiles);
    localStorage.setItem('jodimaker_profiles', JSON.stringify(filteredProfiles));
    localStorage.setItem('allCandidates', JSON.stringify(filteredProfiles));

    const storedMatches = localStorage.getItem('jodimaker_matches');
    let parsedMatches: MatchPair[] = [];
    if (storedMatches) {
      try {
        parsedMatches = JSON.parse(storedMatches);
      } catch (e) {
        parsedMatches = [];
      }
    } else {
      // Setup a default match between Rahul Sharma (profile-1) and Priya Patel (profile-2)
      parsedMatches = [
        {
          id: 'pair_1',
          candidate1Id: 'profile-1',
          candidate2Id: 'profile-2',
          compatibilityScore: 95,
          highlights: 'Both Mumbai-based • Tech & Product Alignment • Veg Preference',
          status: 'Connected',
          dateMatched: '2026-07-20',
          messages: [
            { senderId: 'profile-1', text: 'Hi Priya, nice to connect with you!', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { senderId: 'profile-2', text: 'Hi Rahul! Happy to connect. How is your week going?', timestamp: new Date(Date.now() - 1800000).toISOString() }
          ]
        }
      ];
    }

    // Ensure Shivay & Isha match is always present in parsedMatches
    const hasShivayIshaMatch = parsedMatches.some(m => m.id === 'match_shivay_isha');
    if (!hasShivayIshaMatch) {
      parsedMatches.push({
        id: 'match_shivay_isha',
        candidate1Id: 'shivay-profile',
        candidate2Id: 'isha-profile',
        compatibilityScore: 98,
        highlights: 'High compatibility on career, religion, and dietary preferences',
        status: 'Connected',
        dateMatched: '2026-07-27',
        messages: []
      });
    }

    const filteredMatches = parsedMatches.filter(m => {
      const c1 = filteredProfiles.find(p => p.id === m.candidate1Id || p.email?.toLowerCase().trim() === m.candidate1Id?.toLowerCase().trim() || p.name?.toLowerCase().trim() === m.candidate1Id?.toLowerCase().trim());
      const c2 = filteredProfiles.find(p => p.id === m.candidate2Id || p.email?.toLowerCase().trim() === m.candidate2Id?.toLowerCase().trim() || p.name?.toLowerCase().trim() === m.candidate2Id?.toLowerCase().trim());
      return c1 && c2;
    });

    if (typeof window !== 'undefined') {
      const chatSeed = localStorage.getItem('chat_isha_shivay') || localStorage.getItem('chat_shivay_isha');
      if (!chatSeed) {
        localStorage.setItem('chat_isha_shivay', JSON.stringify(ISHA_SHIVAY_DEMO_CHAT));
        localStorage.setItem('chat_shivay_isha', JSON.stringify(ISHA_SHIVAY_DEMO_CHAT));
      }
    }

    const mappedMatches = filteredMatches.map(m => {
      if (m.id === 'match_shivay_isha') {
        const chatSeed = typeof window !== 'undefined' ? (localStorage.getItem('chat_isha_shivay') || localStorage.getItem('chat_shivay_isha')) : null;
        const messages = chatSeed ? JSON.parse(chatSeed) : ISHA_SHIVAY_DEMO_CHAT;
        return {
          ...m,
          messages: messages.map((msg: any) => ({
            senderId: msg.senderEmail === 'shivay@gmail.com' ? 'shivay-profile' : 'cand_isha_01',
            text: msg.text,
            timestamp: msg.timestamp || new Date().toISOString()
          }))
        };
      }
      return m;
    });

    setMatches(mappedMatches);
    localStorage.setItem('jodimaker_matches', JSON.stringify(mappedMatches));
  }, []);

  const addCandidateProfile = (newProfile: Omit<Profile, 'id'> & { id?: string }) => {
    setProfiles(prev => {
      const activeEmail = newProfile.email?.toLowerCase().trim();
      
      const existingIndex = prev.findIndex(
        p => (activeEmail && p.email?.toLowerCase().trim() === activeEmail) || (newProfile.id && p.id === newProfile.id)
      );

      let updated: Profile[];
      if (existingIndex !== -1) {
        // EDIT / UPDATE EXISTING PROFILE IN-PLACE
        const updatedProfiles = [...prev];
        updatedProfiles[existingIndex] = {
          ...updatedProfiles[existingIndex],
          ...newProfile,
          id: newProfile.id || updatedProfiles[existingIndex].id, // Preserve existing ID
          isDynamic: true,
          updatedAt: new Date().toISOString()
        } as Profile;
        updated = updatedProfiles;
      } else {
        // CREATE NEW PROFILE
        const generatedId = newProfile.id || `cand_${Date.now()}`;
        const fullProfile: Profile = {
          ...newProfile,
          id: generatedId,
          isDynamic: true,
          createdAt: new Date().toISOString()
        } as Profile;
        updated = [...prev, fullProfile];
      }
      
      localStorage.setItem('jodimaker_profiles', JSON.stringify(updated));
      localStorage.setItem('allCandidates', JSON.stringify(updated));
      return updated;
    });
  };

  const getAllCandidates = () => profiles;

  const getCandidateById = (id: string) => profiles.find(p => p.id === id);

  const updateCandidateStatus = (id: string, newStatus: Profile['status']) => {
    setProfiles(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, status: newStatus } : p);
      localStorage.setItem('jodimaker_profiles', JSON.stringify(updated));
      return updated;
    });
  };

  const expressInterest = (candidateId: string, targetId: string) => {
    setMatches(prev => {
      const exists = prev.find(p => 
        (p.candidate1Id === candidateId && p.candidate2Id === targetId) ||
        (p.candidate1Id === targetId && p.candidate2Id === candidateId)
      );
      if (exists) return prev;

      const newPair: MatchPair = {
        id: `pair_${Date.now()}`,
        candidate1Id: candidateId,
        candidate2Id: targetId,
        compatibilityScore: Math.floor(88 + Math.random() * 11),
        highlights: 'Dynamic Match • Shared Interests & Values',
        status: 'Connected', 
        dateMatched: new Date().toISOString().split('T')[0],
        messages: [
          { senderId: targetId, text: 'Hello! I saw your interest request and would love to connect and chat.', timestamp: new Date().toISOString() }
        ]
      };

      const updated = [...prev, newPair];
      localStorage.setItem('jodimaker_matches', JSON.stringify(updated));
      return updated;
    });
  };

  const sendChatMessage = (pairId: string, senderId: string, text: string) => {
    if (pairId === 'match_shivay_isha') {
      const chatSeed = localStorage.getItem('chat_shivay_isha');
      const messages = chatSeed ? JSON.parse(chatSeed) : [];
      
      const newMsgObj = {
        id: `msg_${Date.now()}`,
        senderEmail: senderId === 'shivay-profile' || senderId === 'shivay@gmail.com' ? 'shivay@gmail.com' : 'isha@gmail.com',
        receiverEmail: senderId === 'shivay-profile' || senderId === 'shivay@gmail.com' ? 'isha@gmail.com' : 'shivay@gmail.com',
        senderName: senderId === 'shivay-profile' || senderId === 'shivay@gmail.com' ? 'Shivay' : 'Isha',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const updatedMessages = [...messages, newMsgObj];
      localStorage.setItem('chat_shivay_isha', JSON.stringify(updatedMessages));
    }

    setMatches(prev => {
      const updated = prev.map(p => {
        if (p.id === pairId) {
          const newMsg: ChatMessage = {
            senderId,
            text,
            timestamp: new Date().toISOString()
          };
          return {
            ...p,
            status: 'Connected' as const,
            messages: [...p.messages, newMsg]
          };
        }
        return p;
      });
      localStorage.setItem('jodimaker_matches', JSON.stringify(updated));
      return updated;
    });
  };

  const resetToDefault = () => {
    localStorage.removeItem('jodimaker_profiles');
    localStorage.removeItem('allCandidates');
    localStorage.removeItem('jodimaker_matches');
    localStorage.removeItem('chat_shivay_isha');
    localStorage.removeItem('chat_isha_shivay');
    
    let allProfiles = profilesData as Profile[];
    // Ensure Shivay and Isha profiles are always present
    if (!allProfiles.some(p => p.email?.toLowerCase().trim() === 'shivay@gmail.com')) {
      allProfiles.push(shivayProfile);
    }
    if (!allProfiles.some(p => p.email?.toLowerCase().trim() === 'isha@gmail.com')) {
      allProfiles.push(ishaProfile);
    }

    // Deduplicate array by candidate name (keeps only 1 candidate per unique name)
    const uniqueCandidatesMap = new Map();
    allProfiles.forEach((candidate: any) => {
      const cleanName = candidate.name?.toLowerCase().trim();
      if (cleanName && !uniqueCandidatesMap.has(cleanName)) {
        uniqueCandidatesMap.set(cleanName, candidate);
      }
    });

    const cleanProfiles = Array.from(uniqueCandidatesMap.values()) as Profile[];

    const filteredProfiles = cleanProfiles.filter(p => {
      // Never exclude our active test candidates Shivay and Isha
      if (p.id === 'cand_isha_01' || p.email?.toLowerCase().trim() === 'isha@gmail.com') return true;
      if (p.id === 'shivay-profile' || p.email?.toLowerCase().trim() === 'shivay@gmail.com') return true;

      const nameLower = p.name.toLowerCase().trim();
      return !nameLower.includes('ankita shinde') && 
             !nameLower.includes('ankita candidate') && 
             nameLower !== 'ankita' && 
             !nameLower.includes('varun') &&
             !nameLower.includes('rahul saxena') &&
             !nameLower.includes('mahika') &&
             !nameLower.includes('isha trivedi') &&
             !nameLower.includes('profile (,)') &&
             nameLower !== 'profile' &&
             nameLower !== '(,)' &&
             nameLower !== ',' &&
             nameLower !== '' &&
             !nameLower.includes('akriti rai');
    });

    setProfiles(filteredProfiles);
    localStorage.setItem('jodimaker_profiles', JSON.stringify(filteredProfiles));
    localStorage.setItem('allCandidates', JSON.stringify(filteredProfiles));
    
    const defaultMatches: MatchPair[] = [
      {
        id: 'pair_1',
        candidate1Id: 'profile-1',
        candidate2Id: 'profile-2',
        compatibilityScore: 95,
        highlights: 'Both Mumbai-based • Tech & Product Alignment • Veg Preference',
        status: 'Connected',
        dateMatched: '2026-07-20',
        messages: [
          { senderId: 'profile-1', text: 'Hi Priya, nice to connect with you!', timestamp: new Date(Date.now() - 3600000).toISOString() },
          { senderId: 'profile-2', text: 'Hi Rahul! Happy to connect. How is your week going?', timestamp: new Date(Date.now() - 1800000).toISOString() }
        ]
      },
      {
        id: 'match_shivay_isha',
        candidate1Id: 'shivay-profile',
        candidate2Id: 'cand_isha_01',
        compatibilityScore: 98,
        highlights: 'High compatibility on career, religion, and dietary preferences',
        status: 'Connected',
        dateMatched: '2026-07-27',
        messages: []
      }
    ];

    const filteredMatches = defaultMatches.filter(m => {
      const c1 = filteredProfiles.find(p => p.id === m.candidate1Id || p.email?.toLowerCase().trim() === m.candidate1Id?.toLowerCase().trim() || p.name?.toLowerCase().trim() === m.candidate1Id?.toLowerCase().trim());
      const c2 = filteredProfiles.find(p => p.id === m.candidate2Id || p.email?.toLowerCase().trim() === m.candidate2Id?.toLowerCase().trim() || p.name?.toLowerCase().trim() === m.candidate2Id?.toLowerCase().trim());
      return c1 && c2;
    });

    localStorage.setItem('chat_isha_shivay', JSON.stringify(ISHA_SHIVAY_DEMO_CHAT));
    localStorage.setItem('chat_shivay_isha', JSON.stringify(ISHA_SHIVAY_DEMO_CHAT));

    const mappedMatches = filteredMatches.map(m => {
      if (m.id === 'match_shivay_isha') {
        return {
          ...m,
          messages: ISHA_SHIVAY_DEMO_CHAT.map((msg: any) => ({
            senderId: msg.senderEmail === 'shivay@gmail.com' ? 'shivay-profile' : 'cand_isha_01',
            text: msg.text,
            timestamp: msg.timestamp || new Date().toISOString()
          }))
        };
      }
      return m;
    });

    setMatches(mappedMatches);
    localStorage.setItem('jodimaker_matches', JSON.stringify(mappedMatches));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).resetJodiMaker = resetToDefault;
    }
  }, []);

  return (
    <ProfileContext.Provider value={{
      profiles,
      addCandidateProfile,
      getAllCandidates,
      getCandidateById,
      updateCandidateStatus,
      resetToDefault,
      matches,
      expressInterest,
      sendChatMessage
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfiles() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfiles must be used within a ProfileProvider');
  }
  return context;
}

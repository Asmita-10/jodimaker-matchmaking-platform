'use client';

import React, { useState, useMemo } from 'react';
import { useProfiles } from '@/context/ProfileContext';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import { 
  Heart, 
  Search, 
  User, 
  Copy, 
  ExternalLink, 
  Settings, 
  CreditCard, 
  ArrowLeft, 
  Mail, 
  Check, 
  Filter, 
  Sparkles, 
  Activity, 
  Award,
  Layers,
  Calendar,
  X,
  Users,
  TrendingUp,
  Download,
  CheckCircle2
} from 'lucide-react';

// ==========================================
// 1. TypeScript Interfaces
// ==========================================

export interface UserProfile {
  name: string;
  role: string;
  agency: string;
  email: string;
  avatarUrl: string;
  totalProfilesManaged: number;
  activeMatchesMade: number;
  subscriptionTier: string;
  creditsUsed: number;
  creditsMax: number;
}

export interface Candidate {
  name: string;
  age: number;
  city: string;
  occupation: string;
  gender: 'Male' | 'Female';
}

export interface MatchedPair {
  id: string;
  candidate1: Candidate;
  candidate2: Candidate;
  compatibilityScore: number;
  highlights: string;
  status: 'Pending Outreach' | 'Connected' | 'Scheduled Call';
  dateMatched: string;
  aiEmailTemplate: {
    subject: string;
    body: string;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  profiles: string;
  features: string[];
}

export interface CalculatorState {
  matchmakers: number;
  aiCreditsNeeded: number;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  planName: string;
  credits: number;
  status: 'PAID' | 'FAILED';
}

// ==========================================
// 2. Mock Data
// ==========================================

const mockUserProfile: UserProfile = {
  name: "Asmita Tiwari",
  role: "Senior Matchmaker Coordinator",
  agency: "JodiMaker Premium Matchmaking",
  email: "asmita.tiwari@jodimaker.com",
  avatarUrl: "", 
  totalProfilesManaged: 108,
  activeMatchesMade: 42,
  subscriptionTier: "Pro Plan",
  creditsUsed: 85,
  creditsMax: 100,
};

const mockMatchedPairs: MatchedPair[] = [
  {
    id: "match-1",
    candidate1: { name: "Rahul Sharma", age: 29, city: "Mumbai", occupation: "Software Engineer", gender: "Male" },
    candidate2: { name: "Priya Patel", age: 27, city: "Mumbai", occupation: "Product Manager", gender: "Female" },
    compatibilityScore: 95,
    highlights: "Both Mumbai-based • Tech & Product Alignment • Veg Preference",
    status: "Connected",
    dateMatched: "2026-07-20",
    aiEmailTemplate: {
      subject: "Exciting match suggestion: Rahul Sharma & Priya Patel",
      body: "Hi Priya,\n\nI hope you are doing well. I've found an exceptional match for you! Meet Rahul, a 29-year-old Software Engineer based in Mumbai. Like you, he values healthy lifestyle habits, loves exploring weekend cafes, and shares your preference for vegetarian dining. With a compatibility score of 95%, you both share deep values regarding family balance and career growth. Let me know if you would like me to share his detailed biodata.\n\nWarm regards,\nAsmita Tiwari"
    }
  },
  {
    id: "match-2",
    candidate1: { name: "Amit Verma", age: 31, city: "Bangalore", occupation: "Product Designer", gender: "Male" },
    candidate2: { name: "Sneha Reddy", age: 29, city: "Bangalore", occupation: "Marketing Director", gender: "Female" },
    compatibilityScore: 91,
    highlights: "Both Bangalore-based • Creative & Leadership roles • Non-Veg Preference",
    status: "Pending Outreach",
    dateMatched: "2026-07-24",
    aiEmailTemplate: {
      subject: "New JodiMaker Match Proposal: Sneha & Amit",
      body: "Hi Sneha,\n\nI hope this email finds you in high spirits. I've prepared a high-potential Match Profile with Amit (31), a Product Designer in Bangalore. He matches your expectations for location, values, and educational standard. You both share a love for traveling and pets. I highly recommend introducing you two.\n\nWarm regards,\nAsmita Tiwari"
    }
  },
  {
    id: "match-3",
    candidate1: { name: "Vikram Malhotra", age: 33, city: "Delhi", occupation: "Finance VP", gender: "Male" },
    candidate2: { name: "Anjali Sen", age: 30, city: "Noida", occupation: "Corporate Lawyer", gender: "Female" },
    compatibilityScore: 88,
    highlights: "Delhi & Noida • High Income Bracket • Shared Educational Level",
    status: "Scheduled Call",
    dateMatched: "2026-07-18",
    aiEmailTemplate: {
      subject: "JodiMaker Match: Vikram & Anjali (88% Score)",
      body: "Hi Vikram,\n\nI have successfully aligned a conversation request with Anjali Sen (30), the Corporate Lawyer from Noida. Since you both operate in similar professional circles in Delhi NCR and have indicated high compatibility scores, we have scheduled a brief call to align interests. Please confirm if Saturday afternoon works for you.\n\nBest,\nAsmita"
    }
  },
  {
    id: "match-4",
    candidate1: { name: "Rohan Joshi", age: 28, city: "Pune", occupation: "Data Scientist", gender: "Male" },
    candidate2: { name: "Divya Iyer", age: 26, city: "Mumbai", occupation: "Biotech Researcher", gender: "Female" },
    compatibilityScore: 93,
    highlights: "Pune & Mumbai • Academic Backgrounds • Relocation Friendly",
    status: "Connected",
    dateMatched: "2026-07-15",
    aiEmailTemplate: {
      subject: "Match Update: Rohan & Divya (93% Match Score)",
      body: "Hi Rohan,\n\nI'm pleased to report that Divya Iyer (26) from Mumbai has shown positive interest in your profile. Given your scientific backgrounds and geographic flexibility, there is an excellent foundation here. I have shared her direct contact details with you.\n\nWarmly,\nAsmita"
    }
  },
  {
    id: "match-5",
    candidate1: { name: "Kabir Mehta", age: 30, city: "Ahmedabad", occupation: "Business Owner", gender: "Male" },
    candidate2: { name: "Meera Nair", age: 28, city: "Ahmedabad", occupation: "HR Consultant", gender: "Female" },
    compatibilityScore: 86,
    highlights: "Both Ahmedabad-based • Family Business Ties • Veg Preference",
    status: "Pending Outreach",
    dateMatched: "2026-07-25",
    aiEmailTemplate: {
      subject: "Match profile suggestion: Meera & Kabir",
      body: "Hi Meera,\n\nI have curated a profile matching Kabir Mehta (30), who runs his family textile enterprise in Ahmedabad. Given your preference for local matching and traditional cultural values, this represents a stable 86% match rating.\n\nBest regards,\nAsmita"
    }
  },
  {
    id: "match-6",
    candidate1: { name: "Rajat Gupta", age: 32, city: "San Francisco", occupation: "Tech Lead", gender: "Male" },
    candidate2: { name: "Shreya Bansal", age: 29, city: "Delhi", occupation: "Resident Doctor", gender: "Female" },
    compatibilityScore: 92,
    highlights: "US Relocation-ready • High Career Alignment • Liberal Values",
    status: "Scheduled Call",
    dateMatched: "2026-07-22",
    aiEmailTemplate: {
      subject: "JodiMaker US Match: Shreya & Rajat",
      body: "Hi Shreya,\n\nWe have coordinated a virtual discussion time slot with Rajat Gupta (32), the Tech Lead based in SF. He is visiting Delhi next month, and you both indicated positive match interest. The virtual introduction call is set.\n\nBest,\nAsmita"
    }
  }
];

const planList: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 29,
    credits: 30,
    profiles: 'Up to 25 Profiles',
    features: ['30 AI Credits / mo', 'Up to 25 Active Profiles', 'Standard Matching Engine', 'Email Support']
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 49,
    credits: 100,
    profiles: 'Up to 150 Profiles',
    features: ['100 AI Credits / mo', 'Up to 150 Active Profiles', 'Premium Match Report AI', 'Priority Email Support']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 199,
    credits: 1000,
    profiles: 'Unlimited Profiles',
    features: ['1000 AI Credits / mo', 'Unlimited Active Profiles', 'Dedicated Custom API', '24/7 Account Executive']
  }
];

// ==========================================
// 3. Component Definition
// ==========================================

export default function ProfilePage() {
  const { profiles, matches } = useProfiles();
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'preferences' | 'billing'>('preferences');
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // User Profile & Credits State
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [credits, setCredits] = useState(mockUserProfile.creditsUsed);
  
  // B2B SaaS Calculator Sliders State
  const [matchmakersCount, setMatchmakersCount] = useState<number>(3);
  const [aiCreditsCount, setAiCreditsCount] = useState<number>(100);

  // Invoices State
  const [invoiceHistory, setInvoiceHistory] = useState<Invoice[]>([
    { id: 'INV-09482', date: 'Jul 26, 2026', amount: 49.00, planName: 'Pro Plan', credits: 100, status: 'PAID' },
    { id: 'INV-08920', date: 'Jun 26, 2026', amount: 49.00, planName: 'Pro Plan', credits: 100, status: 'PAID' }
  ]);
  
  // Stripe Checkout Loader
  const [checkoutLoadingPlanId, setCheckoutLoadingPlanId] = useState<string | null>(null);

  // Detail Modal State
  const [selectedPair, setSelectedPair] = useState<MatchedPair | null>(null);
  const [copiedPairId, setCopiedPairId] = useState<string | null>(null);
  
  // Custom Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reactive logic calculation for B2BPricing recommendation
  const recommendedPlanId = useMemo(() => {
    if (matchmakersCount <= 1 && aiCreditsCount <= 50) {
      return 'starter';
    } else if (matchmakersCount <= 5 && aiCreditsCount <= 250) {
      return 'pro';
    } else {
      return 'enterprise';
    }
  }, [matchmakersCount, aiCreditsCount]);

  // Dynamically map matches context into MatchedPair model structure
  const allMatchedPairs = useMemo(() => {
    const sortedMatches = [...matches].sort((a, b) => b.id.localeCompare(a.id));
    return sortedMatches.map(m => {
      const candidate1 = profiles.find(p => p.id === m.candidate1Id || p.email?.toLowerCase().trim() === m.candidate1Id?.toLowerCase().trim() || p.name?.toLowerCase().trim() === m.candidate1Id?.toLowerCase().trim()) || { name: 'Unknown Candidate', age: 28, city: '', designation: 'Candidate', gender: 'Female' as const };
      const candidate2 = profiles.find(p => p.id === m.candidate2Id || p.email?.toLowerCase().trim() === m.candidate2Id?.toLowerCase().trim() || p.name?.toLowerCase().trim() === m.candidate2Id?.toLowerCase().trim()) || { name: 'Unknown Candidate', age: 28, city: '', designation: 'Candidate', gender: 'Male' as const };
      return {
        id: m.id,
        candidate1: {
          name: candidate1.name,
          age: candidate1.age,
          city: candidate1.city,
          occupation: candidate1.designation || 'Candidate',
          gender: candidate1.gender as 'Male' | 'Female'
        },
        candidate2: {
          name: candidate2.name,
          age: candidate2.age,
          city: candidate2.city,
          occupation: candidate2.designation || 'Candidate',
          gender: candidate2.gender as 'Male' | 'Female'
        },
        compatibilityScore: m.compatibilityScore,
        highlights: m.highlights,
        status: m.status,
        dateMatched: m.dateMatched,
        aiEmailTemplate: {
          subject: `Exciting Match Suggestion: ${candidate1.name} & ${candidate2.name}`,
          body: `Hi,\n\nWe have generated a mutual connection report for ${candidate1.name} and ${candidate2.name} with a compatibility score of ${m.compatibilityScore}%.\n\nWarm regards,\nAsmita Tiwari`
        }
      };
    });
  }, [matches, profiles]);

  // Filter matched pairs dynamically
  const filteredPairs = useMemo(() => {
    return allMatchedPairs.filter(pair => {
      const matchesSearch = 
        pair.candidate1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.candidate2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.candidate1.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.candidate2.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || pair.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allMatchedPairs, searchQuery, statusFilter]);

  // Handle AI credit Top-up simulation
  const handleTopUp = () => {
    if (credits < userProfile.creditsMax) {
      setCredits(prev => Math.min(prev + 10, userProfile.creditsMax));
      showToast("Successfully added 10 AI Credits to your account!");
    } else {
      showToast("Your AI Credits are already fully charged!");
    }
  };

  // Toast trigger
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handle copy biodata link simulation
  const handleCopyLink = (pair: MatchedPair) => {
    const mockLink = `https://jodimaker.com/share/biodata/${pair.id}`;
    navigator.clipboard.writeText(mockLink).then(() => {
      setCopiedPairId(pair.id);
      showToast(`Copied Biodata Link for ${pair.candidate1.name} & ${pair.candidate2.name}!`);
      setTimeout(() => {
        setCopiedPairId(null);
      }, 2000);
    }).catch(() => {
      showToast("Failed to copy link. Please try again.");
    });
  };

  // Stripe Checkout Action Handler
  const handleStripeCheckout = async (plan: SubscriptionPlan) => {
    setCheckoutLoadingPlanId(plan.id);
    showToast(`Initiating Stripe Checkout for ${plan.name}...`);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId: plan.id,
          amount: plan.price,
          matchmakersCount: matchmakersCount
        })
      });

      if (response.ok) {
        const session = await response.json();
        showToast("Redirecting to Stripe Billing Portal...");

        // Simulate Stripe redirection and redirect callback response (1.5 seconds)
        setTimeout(() => {
          // Success Response simulation
          setUserProfile(prev => ({
            ...prev,
            subscriptionTier: plan.name,
            creditsMax: plan.credits
          }));
          setCredits(plan.credits);
          setCheckoutLoadingPlanId(null);
          showToast(`Subscription upgraded successfully to ${plan.name}!`);

          // Add to Invoice History dynamically
          const newInvoiceId = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
          const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
          setInvoiceHistory(prev => [
            {
              id: newInvoiceId,
              date: today,
              amount: plan.price,
              planName: plan.name,
              credits: plan.credits,
              status: 'PAID'
            },
            ...prev
          ]);
        }, 1500);

      } else {
        showToast("Checkout routing failed. Please try again.");
        setCheckoutLoadingPlanId(null);
      }

    } catch (error) {
      console.error(error);
      showToast("Connection error while setting up Stripe session.");
      setCheckoutLoadingPlanId(null);
    }
  };

  // jsPDF Invoice Generation
  const downloadInvoicePDF = (invoice: Invoice) => {
    showToast(`Downloading Invoice ${invoice.id} (PDF)...`);

    try {
      const doc = new jsPDF();

      // Heading block (Deep indigo fill)
      doc.setFillColor(30, 27, 75); // #1e1b4b
      doc.rect(0, 0, 210, 38, 'F');

      // Title & Branding
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('JodiMaker SaaS Invoice', 15, 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Premium Matchmaker Portal & Dashboard', 15, 29);

      // Billed To Section
      doc.setTextColor(30, 27, 75);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('BILLED TO:', 15, 55);

      doc.setTextColor(75, 85, 99); // Slate Gray
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(userProfile.name, 15, 62);
      doc.text(userProfile.role, 15, 67);
      doc.text(userProfile.email, 15, 72);

      // Invoice metadata
      doc.setTextColor(30, 27, 75);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE DETAILS:', 130, 55);

      doc.setTextColor(75, 85, 99);
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice No: ${invoice.id}`, 130, 62);
      doc.text(`Date: ${invoice.date}`, 130, 67);
      doc.text(`Payment Status: Paid`, 130, 72);

      // Line items table header
      doc.setFillColor(243, 244, 246); // Light Gray
      doc.rect(15, 85, 180, 10, 'F');
      doc.setTextColor(30, 27, 75);
      doc.setFont('helvetica', 'bold');
      doc.text('Description', 20, 91);
      doc.text('Credits', 120, 91);
      doc.text('Amount', 170, 91);

      // Table Row Data
      doc.setTextColor(75, 85, 99);
      doc.setFont('helvetica', 'normal');
      doc.text(`${invoice.planName} - Monthly Subscription`, 20, 103);
      doc.text(`${invoice.credits} AI Credits`, 120, 103);
      doc.text(`$${invoice.amount.toFixed(2)}`, 170, 103);

      // Divider line
      doc.setDrawColor(229, 231, 235);
      doc.line(15, 110, 195, 110);

      // Total pricing section
      doc.setTextColor(30, 27, 75);
      doc.setFont('helvetica', 'bold');
      doc.text('Total Amount Paid (USD):', 110, 122);
      doc.text(`$${invoice.amount.toFixed(2)}`, 170, 122);

      // Transaction verification footer
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      const mockTxId = `ch_stripe_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      doc.text(`Paid via Credit Card (Stripe Transaction ID: ${mockTxId})`, 15, 140);

      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text('Thank you for choosing JodiMaker! For inquiries, contact billing@jodimaker.com', 15, 275);

      // File download trigger
      doc.save(`Invoice_${invoice.id}.pdf`);

    } catch (err) {
      console.error(err);
      showToast("Error generating PDF receipt. Please retry.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-rose-50 via-slate-50 to-indigo-50 min-h-screen pb-16 font-sans text-indigo-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-indigo-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-indigo-900/50 flex items-center gap-3 z-50 animate-slide-in">
          <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Banner Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#f0eae0] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="px-4 py-2 bg-white/80 hover:bg-white text-indigo-950 rounded-full border border-slate-200 text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            ← Back to Dashboard
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-tr from-rose-500 to-rose-400 rounded-lg flex items-center justify-center shadow shadow-rose-500/20">
              <Heart className="text-white w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-sm font-black tracking-tight">JodiMaker Profile</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-rose-50 text-rose-600 font-extrabold px-2.5 py-1 rounded-full border border-rose-100 uppercase tracking-widest">
            Matchmaker Portal
          </span>
        </div>
      </header>

      {/* Main View Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-8">

        {/* ========================================================
            SECTION A: MATCHMAKER PROFILE HEADER
            ======================================================== */}
        <section className="bg-white/85 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-6 md:p-8 transition-premium">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
            
            {/* Identity Block */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-gradient-to-tr from-rose-400 via-pink-400 to-indigo-500 rounded-full p-1 shadow-lg ring-4 ring-rose-200/50 flex-shrink-0">
                <div className="w-full h-full bg-indigo-950 rounded-full flex items-center justify-center text-white text-2xl font-black tracking-wider">
                  AT
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-black text-indigo-950">{userProfile.name}</h1>
                  <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-2.5 h-2.5" /> PRO
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{userProfile.role}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-450 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" /> {userProfile.agency}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" /> {userProfile.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Bar Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-grow max-w-3xl lg:ml-6">
              
              <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block">Managed Profiles</span>
                <span className="text-2xl font-black text-indigo-950 mt-1 block">{profiles.length}</span>
              </div>

              <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block">Active Matches</span>
                <span className="text-2xl font-black text-[#10b981] mt-1 block">{matches.length}</span>
              </div>

              <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 text-center col-span-2 sm:col-span-1 flex flex-col justify-center">
                <span className="text-[9px] uppercase tracking-wider text-rose-500 font-extrabold block">Billing Plan</span>
                <span className="text-xs font-black text-indigo-950 mt-1.5 block truncate" title={userProfile.subscriptionTier}>
                  {userProfile.subscriptionTier}
                </span>
              </div>

              {/* AI Credits Usage */}
              <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" /> AI Credits
                  </span>
                  <span className="text-[10px] font-black text-indigo-950">{credits}/{userProfile.creditsMax}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(credits / userProfile.creditsMax) * 100}%` }}
                  ></div>
                </div>
                <button
                  onClick={handleTopUp}
                  className="w-full bg-indigo-950 hover:bg-rose-600 text-white font-extrabold text-[9px] tracking-wider py-1.5 px-3 rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  TOP UP (+10)
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION B: MATCHED CANDIDATES DIRECTORY
            ======================================================== */}
        <section className="space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-indigo-950 tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-500" /> Matched Candidates Directory
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage and view AI generated match reports for successfully paired profiles</p>
            </div>
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#f0eae0] focus:border-rose-500/40 rounded-full py-2 pl-9 pr-4 text-xs font-semibold text-indigo-950 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-[#f0eae0] rounded-full py-2 pl-9 pr-8 text-xs font-bold text-indigo-950 focus:outline-none focus:border-rose-500/40 transition-all cursor-pointer appearance-none min-w-[150px]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Outreach">Pending Outreach</option>
                  <option value="Connected">Connected</option>
                  <option value="Scheduled Call">Scheduled Call</option>
                </select>
                <div className="absolute right-3.5 top-3 w-2 h-2 border-r-2 border-b-2 border-slate-400 transform rotate-45 pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Matches Grid Layout */}
          {filteredPairs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPairs.map((pair) => (
                <div 
                  key={pair.id}
                  className="bg-white/85 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-6 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Score & Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100/50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {pair.compatibilityScore}% Compatibility
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        pair.status === 'Connected' 
                          ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                          : pair.status === 'Scheduled Call'
                          ? 'text-indigo-600 bg-indigo-50 border-indigo-100'
                          : 'text-amber-600 bg-amber-50 border-amber-100'
                      }`}>
                        {pair.status}
                      </span>
                    </div>

                    {/* Dual Candidates Avatars & Names */}
                    <div className="flex items-center justify-center gap-3 my-5">
                      
                      {/* Candidate 1 */}
                      <div className="text-center flex-1">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full mx-auto flex items-center justify-center border-2 border-indigo-200/50 font-black text-indigo-900 text-xs shadow-sm">
                          {pair.candidate1.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="text-lg font-bold mt-2 text-indigo-950 truncate">{pair.candidate1.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{pair.candidate1.age} yrs • {pair.candidate1.city}</p>
                      </div>

                      {/* Connection Icon */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center shadow-md">
                          <Heart className="w-3.5 h-3.5 text-white fill-current animate-pulse" />
                        </div>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-rose-200 to-indigo-200 mt-2"></div>
                      </div>

                      {/* Candidate 2 */}
                      <div className="text-center flex-1">
                        <div className="w-12 h-12 bg-rose-50 rounded-full mx-auto flex items-center justify-center border-2 border-rose-200/50 font-black text-rose-900 text-xs shadow-sm">
                          {pair.candidate2.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="text-lg font-bold mt-2 text-indigo-950 truncate">{pair.candidate2.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{pair.candidate2.age} yrs • {pair.candidate2.city}</p>
                      </div>

                    </div>

                    {/* Highlights */}
                    <p className="text-sm bg-slate-50 border border-slate-100 rounded-xl p-3 text-slate-700 font-semibold leading-relaxed mb-6">
                      {pair.highlights}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedPair(pair)}
                      className="bg-indigo-950 hover:bg-indigo-900 text-white font-extrabold text-[10px] tracking-wider py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      REPORT
                    </button>
                    <button
                      onClick={() => handleCopyLink(pair)}
                      className="bg-white hover:bg-slate-50 border border-[#f0eae0] text-slate-600 font-extrabold text-[10px] tracking-wider py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedPairId === pair.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          COPIED
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          COPY LINK
                        </>
                      )}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            /* Fallback State */
            <div className="bg-white/85 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-12 text-center max-w-md mx-auto">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <Search className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="text-sm font-black text-indigo-950">No Matched Pairs Found</h3>
              <p className="text-xs text-slate-500 mt-2">We couldn't find matches matching "{searchQuery}" or the selected status filter. Reset your query filters to review other entries.</p>
              <button 
                onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                className="mt-5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs py-2 px-4 rounded-full transition-all duration-300"
              >
                Clear Search & Filters
              </button>
            </div>
          )}

        </section>

        {/* ========================================================
            SECTION C: QUICK ACCOUNT SETTINGS TABS
            ======================================================== */}
        <section className="bg-white/85 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl overflow-hidden transition-premium">
          
          {/* Tabs Navigation Header */}
          <div className="bg-slate-50/70 border-b border-slate-100 px-6 pt-4 flex gap-6">
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-3.5 text-xs font-black tracking-wide uppercase transition-all duration-300 relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'preferences' 
                  ? 'text-rose-500' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Settings className="w-4 h-4" /> Preferences
              {activeTab === 'preferences' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-rose-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`pb-3.5 text-xs font-black tracking-wide uppercase transition-all duration-300 relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'billing' 
                  ? 'text-rose-500' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Billing & Invoices
              {activeTab === 'billing' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-rose-500 rounded-full"></span>
              )}
            </button>
          </div>

          <div className="p-6 md:p-8">
            
            {/* PREFERENCES TAB CONTENT */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Matching Priorities */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-rose-500 rounded-full"></span> Default Matching Priorities
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#f0eae0] text-rose-500 focus:ring-rose-500/20" />
                        <div>
                          <span className="text-xs font-bold text-indigo-950">Prioritize Same-City Matching</span>
                          <p className="text-[10px] text-slate-500">Minimize relocation constraints on first suggestions</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#f0eae0] text-rose-500 focus:ring-rose-500/20" />
                        <div>
                          <span className="text-xs font-bold text-indigo-950">Dietary Compatibility Filter</span>
                          <p className="text-[10px] text-slate-500">Strictly cross-verify Vegetarian & Non-Vegetarian preferences</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-[#f0eae0] text-rose-500 focus:ring-rose-500/20" />
                        <div>
                          <span className="text-xs font-bold text-indigo-950">Strict Horoscope (Manglik) Alignment</span>
                          <p className="text-[10px] text-slate-500">Flag Manglik vs Non-Manglik status mismatches immediately</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Cultural Filters */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-indigo-500 rounded-full"></span> Dynamic Search Settings
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Age Margin Tolerance</label>
                        <select 
                          defaultValue="± 4 years"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-rose-500/40"
                        >
                          <option>± 2 years</option>
                          <option>± 4 years</option>
                          <option>± 6 years</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Min Compatibility Score</label>
                        <select 
                          defaultValue="85% Match Rating"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-rose-500/40"
                        >
                          <option>75% Match Rating</option>
                          <option>85% Match Rating</option>
                          <option>90% Match Rating</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => showToast("Matching Preferences successfully saved!")}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs py-2.5 px-6 rounded-full transition-all duration-300 cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* BILLING TAB CONTENT */}
            {activeTab === 'billing' && (
              <div className="space-y-10">
                
                {/* Active subscription summary */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-slate-50/70 border border-slate-100 p-6 rounded-2xl">
                  <div>
                    <span className="text-[10px] bg-rose-50 text-rose-600 font-extrabold px-3 py-1 rounded-full border border-rose-100/50 uppercase tracking-widest">
                      Active Subscription Plan
                    </span>
                    <h3 className="text-base font-black text-indigo-950 mt-2">{userProfile.subscriptionTier}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Recurring billing details managed via Stripe gateway dashboard. Renewal scheduled on Aug 26, 2026.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">Active</span>
                  </div>
                </div>

                {/* ========================================================
                    Interactive B2B Pricing Calculator & Tier Matrix
                    ======================================================== */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-indigo-950 tracking-tight flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-rose-500" /> B2B SaaS Plan Pricing Calculator
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Adjust team size and credit limits to find the optimal plan for your matchmaking agency</p>
                  </div>

                  <div className="bg-slate-50/75 border border-slate-150 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    
                    {/* Range Sliders Controls */}
                    <div className="space-y-6">
                      
                      {/* Matchmakers on Team */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-indigo-500" /> Matchmakers on Team
                          </span>
                          <span className="text-xs font-extrabold text-rose-500 bg-rose-50 border border-rose-100/50 px-3 py-0.5 rounded-lg">
                            {matchmakersCount} {matchmakersCount === 1 ? 'User' : 'Users'}
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="20" 
                          step="1"
                          value={matchmakersCount} 
                          onChange={(e) => setMatchmakersCount(parseInt(e.target.value))}
                          className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          <span>1 User</span>
                          <span>10 Users</span>
                          <span>20 Users</span>
                        </div>
                      </div>

                      {/* AI Credits Required */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" /> AI Reports Needed / Mo
                          </span>
                          <span className="text-xs font-extrabold text-indigo-500 bg-indigo-50 border border-indigo-100/50 px-3 py-0.5 rounded-lg">
                            {aiCreditsCount} Credits
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="1000" 
                          step="50"
                          value={aiCreditsCount} 
                          onChange={(e) => setAiCreditsCount(parseInt(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          <span>50 Credits</span>
                          <span>500 Credits</span>
                          <span>1,000 Credits</span>
                        </div>
                      </div>

                    </div>

                    {/* Recommendation Output Display */}
                    <div className="bg-white/80 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Recommended Configuration</span>
                      
                      <span className="text-2xl font-black text-indigo-950 mt-2 block">
                        {recommendedPlanId === 'starter' && 'Starter Plan'}
                        {recommendedPlanId === 'pro' && 'Pro Plan'}
                        {recommendedPlanId === 'enterprise' && 'Enterprise Plan'}
                      </span>

                      <div className="flex items-baseline gap-1 mt-1 justify-center">
                        <span className="text-3xl font-black text-rose-500">
                          ${recommendedPlanId === 'starter' && '29'}
                          {recommendedPlanId === 'pro' && '49'}
                          {recommendedPlanId === 'enterprise' && '199'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">/ month</span>
                      </div>

                      <p className="text-[10px] text-slate-500 font-medium mt-2 leading-relaxed max-w-xs">
                        Provides {recommendedPlanId === 'starter' && '30 AI match credits and up to 25 managed candidates.'}
                        {recommendedPlanId === 'pro' && '100 AI match credits and up to 150 managed candidates.'}
                        {recommendedPlanId === 'enterprise' && '1,000 AI match credits, unlimited candidates, and dedicated API access.'}
                      </p>
                    </div>

                  </div>

                  {/* Plan Options Matrix (Grid Layout Cards) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {planList.map((plan) => {
                      const isRecommended = plan.id === recommendedPlanId;
                      const isActive = userProfile.subscriptionTier.includes(plan.name);

                      return (
                        <div 
                          key={plan.id}
                          className={`bg-white rounded-3xl p-6 flex flex-col justify-between relative transition-all duration-300 border-2 ${
                            isRecommended 
                              ? 'ring-4 ring-rose-200/50 border-rose-500 shadow-rose-100/50 shadow-xl scale-[1.02] z-10' 
                              : 'border-slate-100 shadow-md hover:border-slate-200'
                          }`}
                        >
                          {/* Recommended Indicator badge */}
                          {isRecommended && (
                            <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                              Optimal Choice
                            </span>
                          )}

                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">{plan.name}</h4>
                              {isActive && (
                                <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Current
                                </span>
                              )}
                            </div>

                            <div className="flex items-baseline gap-1 my-3">
                              <span className="text-3xl font-black text-indigo-950">${plan.price}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">/mo</span>
                            </div>

                            <p className="text-xs font-bold text-rose-500 mb-4">{plan.profiles}</p>

                            <ul className="space-y-2 mb-6">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="text-[11px] text-slate-500 font-semibold flex items-center gap-2">
                                  <Check className="w-3.5 h-3.5 text-[#10b981] flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <button
                            disabled={isActive || checkoutLoadingPlanId !== null}
                            onClick={() => handleStripeCheckout(plan)}
                            className={`w-full py-3 px-4 rounded-xl font-extrabold text-[10px] tracking-widest uppercase transition-all duration-350 cursor-pointer ${
                              isActive 
                                ? 'bg-slate-100 text-slate-450 border border-slate-200 cursor-not-allowed'
                                : checkoutLoadingPlanId === plan.id
                                ? 'bg-indigo-950 text-white cursor-wait flex justify-center items-center gap-2'
                                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 hover:scale-[1.02]'
                            }`}
                          >
                            {checkoutLoadingPlanId === plan.id ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                REDIRECTING...
                              </>
                            ) : isActive ? (
                              'Current Plan'
                            ) : (
                              'Upgrade via Stripe'
                            )}
                          </button>

                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Mock Invoices History */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-extrabold text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Recent Billing Transactions
                  </h4>
                  
                  <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/40 text-[9px] uppercase tracking-wider text-slate-400 font-extrabold border-b border-slate-100">
                          <th className="py-3 px-4">Invoice ID</th>
                          <th className="py-3 px-4">Billing Date</th>
                          <th className="py-3 px-4">Plan Description</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs font-semibold text-slate-650">
                        {invoiceHistory.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-slate-100/50 hover:bg-slate-50/20">
                            <td className="py-3.5 px-4 font-mono text-indigo-950">{invoice.id}</td>
                            <td className="py-3.5 px-4">{invoice.date}</td>
                            <td className="py-3.5 px-4">{invoice.planName} ({invoice.credits} AI Credits)</td>
                            <td className="py-3.5 px-4">${invoice.amount.toFixed(2)}</td>
                            <td className="py-3.5 px-4">
                              <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100">
                                {invoice.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button 
                                onClick={() => downloadInvoicePDF(invoice)} 
                                className="text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 justify-end ml-auto bg-transparent hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-rose-100/50 transition-all duration-350 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" /> PDF
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>
        </section>

      </main>

      {/* ========================================================
          MODAL: VIEW MATCH REPORT / AI OUTREACH EMAIL
          ======================================================== */}
      {selectedPair && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-md border border-white/50 shadow-2xl rounded-3xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-indigo-950 text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-rose-400 bg-rose-950/60 border border-rose-900/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  AI Match Report
                </span>
                <h3 className="text-base font-black tracking-tight mt-2 flex items-center gap-2">
                  Outreach Template: {selectedPair.candidate1.name} & {selectedPair.candidate2.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedPair(null)}
                className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs custom-scrollbar">
              
              {/* Profile Comparison Mini Panel */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 grid grid-cols-2 gap-4 text-slate-700">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-indigo-950 mb-2">Candidate A</h4>
                  <p className="font-bold text-slate-900">{selectedPair.candidate1.name}</p>
                  <p className="font-medium mt-0.5">{selectedPair.candidate1.age} yrs • {selectedPair.candidate1.city}</p>
                  <p className="font-semibold text-slate-450 mt-1 text-[11px]">{selectedPair.candidate1.occupation}</p>
                </div>
                <div className="border-l border-slate-200/65 pl-4">
                  <h4 className="text-[10px] font-black uppercase text-indigo-950 mb-2">Candidate B</h4>
                  <p className="font-bold text-slate-900">{selectedPair.candidate2.name}</p>
                  <p className="font-medium mt-0.5">{selectedPair.candidate2.age} yrs • {selectedPair.candidate2.city}</p>
                  <p className="font-semibold text-slate-450 mt-1 text-[11px]">{selectedPair.candidate2.occupation}</p>
                </div>
              </div>

              {/* Email Content Box */}
              <div className="space-y-2">
                <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400">AI Generated Email Outreach Preview</label>
                
                <div className="bg-white border border-[#f0eae0] rounded-2xl overflow-hidden shadow-sm">
                  {/* Mock Email Headers */}
                  <div className="bg-slate-50/50 border-b border-[#f0eae0] px-4 py-3 text-[11px] text-slate-500 font-bold space-y-1">
                    <p><span className="text-slate-400">Subject:</span> {selectedPair.aiEmailTemplate.subject}</p>
                    <p><span className="text-slate-400">From:</span> {mockUserProfile.email}</p>
                  </div>
                  {/* Mock Email Body */}
                  <textarea
                    readOnly
                    value={selectedPair.aiEmailTemplate.body}
                    className="w-full min-h-[180px] p-4 text-xs font-semibold text-slate-700 focus:outline-none bg-white resize-none"
                  ></textarea>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center gap-3">
              <span className="text-[10px] text-slate-450 font-bold">1 AI Credit will be deducted upon mailing.</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPair(null)}
                  className="bg-white hover:bg-slate-100 border border-[#f0eae0] text-slate-600 font-extrabold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPair.aiEmailTemplate.body);
                    showToast("Outreach Email template copied to clipboard!");
                    setSelectedPair(null);
                  }}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl shadow-md shadow-rose-500/10 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy outreach
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

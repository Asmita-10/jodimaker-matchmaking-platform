import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Candidate from '@/models/Candidate';
import profilesData from '@/data/profiles.json';

// ─── Scoring helpers ────────────────────────────────────────────────────────

const PROFESSION_KEYWORDS: Record<string, string[]> = {
  Engineering:           ['engineer', 'developer', 'software', 'tech', 'programmer', 'devops', 'data scientist', 'ai', 'ml', 'architect'],
  'Business/Entrepreneur': ['business', 'entrepreneur', 'ceo', 'founder', 'director', 'manager', 'vp', 'president', 'consultant', 'strategy'],
  Finance:               ['finance', 'banker', 'analyst', 'investment', 'ca', 'chartered', 'accounting', 'economist', 'trading', 'wealth'],
  Design:                ['design', 'ux', 'ui', 'creative', 'art', 'product design', 'graphic', 'brand', 'visual'],
};

const LOCATION_KEYWORDS: Record<string, string[]> = {
  'Local City':          [],          // matched dynamically from user city
  'International / Abroad': ['international', 'abroad', 'usa', 'uk', 'dubai', 'singapore', 'australia', 'canada', 'germany', 'europe', 'remote'],
};

const INTEREST_KEYWORDS: Record<string, string[]> = {
  Travel:   ['travel', 'explore', 'adventure', 'wanderlust', 'trekking', 'backpack'],
  Tech:     ['tech', 'technology', 'code', 'programming', 'startup', 'ai', 'data'],
  Fitness:  ['fitness', 'gym', 'yoga', 'running', 'sport', 'health', 'workout'],
  Music:    ['music', 'guitar', 'piano', 'sing', 'concert', 'musician'],
  Art:      ['art', 'paint', 'sketch', 'design', 'creative', 'photography'],
};

function containsKeyword(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw));
}

interface FilterParams {
  currentUserEmail?: string;
  targetGender?: string;
  profession?: string;
  locationPreference?: string;
  interests?: string[];
  currentUserCity?: string;
}

interface ScoredCandidate {
  candidate: any;
  aiMatchScore: number;
  matchReasons: string[];
}

function scoreCandidate(candidate: any, filters: FilterParams): ScoredCandidate {
  let score = 40; // base score
  const reasons: string[] = [];

  const designation  = (candidate.designation || '').toLowerCase();
  const city         = (candidate.city || '').toLowerCase();
  const bio          = (candidate.bio || '').toLowerCase();
  const coreValues   = ((candidate.coreValues || []) as string[]).join(' ').toLowerCase();
  const fullText     = `${designation} ${bio} ${coreValues}`;
  const income       = candidate.income || 0;

  // ── Profession match (up to 25 pts) ──────────────────────────────────────
  if (filters.profession && filters.profession !== 'Any') {
    const profKws = PROFESSION_KEYWORDS[filters.profession] || [];
    if (containsKeyword(fullText, profKws)) {
      score += 25;
      reasons.push(`${filters.profession} Background`);
    }
  } else {
    score += 10; // neutral bonus when no filter applied
  }

  // ── Location match (up to 20 pts) ────────────────────────────────────────
  if (filters.locationPreference === 'Local City' && filters.currentUserCity) {
    if (city === filters.currentUserCity.toLowerCase()) {
      score += 20;
      reasons.push(`Same City (${candidate.city})`);
    }
  } else if (filters.locationPreference === 'International / Abroad') {
    if (containsKeyword(fullText, LOCATION_KEYWORDS['International / Abroad'])) {
      score += 20;
      reasons.push('International Experience');
    }
  } else {
    score += 10; // neutral
  }

  // ── Interest match (up to 15 pts — 3 per matching interest) ──────────────
  const selectedInterests = filters.interests || [];
  const matchedInterests: string[] = [];
  for (const interest of selectedInterests) {
    const kws = INTEREST_KEYWORDS[interest] || [];
    if (containsKeyword(fullText, kws)) {
      score += 3;
      matchedInterests.push(interest);
    }
  }
  if (matchedInterests.length > 0) {
    reasons.push(`Shared Interest in ${matchedInterests.join(' & ')}`);
  }

  // ── Wealth / income indicator (up to 10 pts) ─────────────────────────────
  if (income >= 30) {
    score += 10;
    reasons.push('High Income Profile');
  } else if (income >= 15) {
    score += 5;
  }

  // Cap at 99
  score = Math.min(score, 99);

  // Default reason fallback
  if (reasons.length === 0) {
    reasons.push('Compatible Profile');
  }

  return { candidate, aiMatchScore: score, matchReasons: reasons };
}

// ─── Static fallback scoring (when MongoDB is unavailable) ──────────────────

function scoreFromStaticProfiles(filters: FilterParams) {
  const targetGender = filters.targetGender || 'Female';
  const genderFiltered = (profilesData as any[]).filter(
    p => (p.gender || '').toLowerCase() === targetGender.toLowerCase()
  );

  return genderFiltered
    .map(p => scoreCandidate(p, filters))
    .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
    .slice(0, 20);
}

// ─── POST /api/recommendations ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      currentUserEmail,
      targetGender = 'Female',
      profession = 'Any',
      locationPreference = 'Any Location',
      interests = [],
      currentUserCity = '',
    } = body as FilterParams & {
      targetGender?: string;
      profession?: string;
      locationPreference?: string;
      interests?: string[];
      currentUserCity?: string;
    };

    const filters: FilterParams = { currentUserEmail, targetGender, profession, locationPreference, interests, currentUserCity };

    // ── Try MongoDB ──────────────────────────────────────────────────────────
    const db = await connectToDatabase();

    if (!db) {
      // Fallback: score from static profiles.json
      const results = scoreFromStaticProfiles(filters);
      return NextResponse.json({ success: true, source: 'local', results });
    }

    const query: Record<string, any> = {
      gender: new RegExp(`^${targetGender}$`, 'i'),
    };

    // Exclude current user
    if (currentUserEmail) {
      query.email = { $ne: currentUserEmail.toLowerCase().trim() };
    }

    const candidates = await Candidate.find(query).lean();

    if (candidates.length === 0) {
      // No MongoDB data yet — fall back to static
      const results = scoreFromStaticProfiles(filters);
      return NextResponse.json({ success: true, source: 'local', results });
    }

    const scored = candidates
      .map(c => scoreCandidate(c, filters))
      .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
      .slice(0, 20);

    return NextResponse.json({ success: true, source: 'mongodb', results: scored });
  } catch (error: any) {
    console.error('Recommendations API error:', error);
    return NextResponse.json({ error: 'Internal server error', fallback: true }, { status: 500 });
  }
}

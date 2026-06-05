export interface Profile {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  city: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';
  height: number; // in cm
  heightStr: string; // e.g. 5'7"
  income: number; // in LPA
  incomeStr: string; // e.g. "12 LPA"
  company: string;
  designation: string;
  religion: string;
  caste: string;
  kids: 'Yes' | 'No' | 'Maybe';
  relocate: 'Yes' | 'No' | 'Maybe';
  pets: 'Yes' | 'No' | 'Maybe';
  dietaryPreference: 'Veg' | 'Non-Veg' | 'Eggetarian';
  manglikStatus: 'Yes' | 'No' | 'Anshik';
  coreValues: string[];
  status: 'Active' | 'Pending Match' | 'Matched' | 'On Hold';
}

export interface ScoreBreakdown {
  [key: string]: {
    score: number;
    max: number;
    reason: string;
  };
}

export interface MatchResult {
  profile: Profile;
  overallScore: number;
  breakdown: ScoreBreakdown;
}

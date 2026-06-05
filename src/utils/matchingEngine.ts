import { Profile, MatchResult, ScoreBreakdown } from '../types';

export function calculateMatchScore(client: Profile, candidate: Profile): MatchResult {
  const breakdown: ScoreBreakdown = {};
  
  if (client.gender === 'Male') {
    // 1. Age (Max 25)
    // Score women who are younger
    const ageDiff = client.age - candidate.age;
    let ageScore = 0;
    let ageReason = '';
    
    if (ageDiff > 0) {
      ageScore = Math.min(25, 10 + ageDiff * 2.5);
      ageReason = `Candidate is younger by ${ageDiff} years, matching client's preference.`;
    } else if (ageDiff === 0) {
      ageScore = 12;
      ageReason = `Candidate is the same age as the client.`;
    } else {
      ageScore = Math.max(0, 10 + ageDiff * 2);
      ageReason = `Candidate is older by ${Math.abs(ageDiff)} years (prefers younger).`;
    }
    breakdown['age'] = { score: Math.round(ageScore), max: 25, reason: ageReason };

    // 2. Income (Max 25)
    // Score women who earn less
    const incomeDiff = client.income - candidate.income;
    let incomeScore = 0;
    let incomeReason = '';
    
    if (incomeDiff > 0) {
      incomeScore = 25;
      incomeReason = `Candidate's income (${candidate.incomeStr}) is lower than client's (${client.incomeStr}).`;
    } else if (incomeDiff === 0) {
      incomeScore = 15;
      incomeReason = `Candidate shares the same income level (${candidate.incomeStr}).`;
    } else {
      incomeScore = Math.max(0, 10 - Math.abs(incomeDiff) * 0.5);
      incomeReason = `Candidate earns more by ${Math.abs(incomeDiff)} LPA (prefers earning less).`;
    }
    breakdown['income'] = { score: Math.round(incomeScore), max: 25, reason: incomeReason };

    // 3. Height (Max 25)
    // Score women who are shorter
    const isShorter = candidate.height < client.height;
    let heightScore = 0;
    let heightReason = '';
    
    if (isShorter) {
      heightScore = 25;
      heightReason = `Candidate is shorter (${candidate.heightStr}) than the client (${client.heightStr}).`;
    } else if (candidate.height === client.height) {
      heightScore = 12;
      heightReason = `Candidate is the exact same height (${candidate.heightStr}).`;
    } else {
      heightScore = Math.max(0, 5 - (candidate.height - client.height));
      heightReason = `Candidate is taller (${candidate.heightStr} vs client's ${client.heightStr}).`;
    }
    breakdown['height'] = { score: Math.round(heightScore), max: 25, reason: heightReason };

    // 4. Child-rearing views / Kids (Max 25)
    // Share child-rearing views
    let kidsScore = 0;
    let kidsReason = '';
    
    if (client.kids === candidate.kids) {
      kidsScore = 25;
      kidsReason = `Both share identical child-rearing views (${client.kids}).`;
    } else if (client.kids === 'Maybe' || candidate.kids === 'Maybe') {
      kidsScore = 15;
      kidsReason = `Flexible alignment: Client says '${client.kids}' and Candidate says '${candidate.kids}'.`;
    } else {
      kidsScore = 0;
      kidsReason = `Conflicting child-rearing views (Client: ${client.kids}, Candidate: ${candidate.kids}).`;
    }
    breakdown['kids'] = { score: kidsScore, max: 25, reason: kidsReason };

  } else {
    // Client is Female (Matching Male Candidates)
    
    // 1. Career Profession Similarity (Max 35)
    let careerScore = 5;
    let careerReason = `Different professional fields (Client: ${client.designation}, Candidate: ${candidate.designation}).`;
    
    const clientDesig = client.designation.toLowerCase();
    const candDesig = candidate.designation.toLowerCase();
    
    const fields = ['software', 'engineer', 'developer', 'product', 'manager', 'analyst', 'consultant', 'finance', 'hr', 'marketing'];
    let matches = 0;
    fields.forEach(field => {
      if (clientDesig.includes(field) && candDesig.includes(field)) {
        matches++;
      }
    });

    if (client.designation === candidate.designation) {
      careerScore = 35;
      careerReason = `Perfect career match: Both are ${client.designation}s.`;
    } else if (client.company === candidate.company) {
      careerScore = 30;
      careerReason = `Both work at the same company (${client.company}).`;
    } else if (matches > 0) {
      careerScore = 25;
      careerReason = `High professional similarity: Overlapping roles/skills in ${client.designation} and ${candidate.designation}.`;
    } else if (
      (client.company === 'Google' || client.company === 'Microsoft' || client.company === 'Meta' || client.company === 'Amazon' || client.company === 'TCS' || client.company === 'Infosys') &&
      (candidate.company === 'Google' || candidate.company === 'Microsoft' || candidate.company === 'Meta' || candidate.company === 'Amazon' || candidate.company === 'TCS' || candidate.company === 'Infosys')
    ) {
      careerScore = 18;
      careerReason = `Both work in tech-oriented corporations (${client.company} and ${candidate.company}).`;
    }
    breakdown['profession'] = { score: careerScore, max: 35, reason: careerReason };

    // 2. Relocation Preferences (Max 35)
    let relocateScore = 0;
    let relocateReason = '';
    
    const sameCity = client.city === candidate.city;
    if (sameCity) {
      if (client.relocate === 'No' && candidate.relocate === 'No') {
        relocateScore = 35;
        relocateReason = `Perfect geographic fit: Both reside in ${client.city} and prefer staying there.`;
      } else {
        relocateScore = 30;
        relocateReason = `Same city (${client.city}) with flexible relocation views.`;
      }
    } else {
      // Different cities
      if (client.relocate !== 'No' && candidate.relocate !== 'No') {
        relocateScore = 35;
        relocateReason = `Different cities (${client.city} vs ${candidate.city}) but both are open to relocation.`;
      } else if (client.relocate !== 'No' && candidate.relocate === 'No') {
        relocateScore = 22;
        relocateReason = `Client is willing to relocate to candidate's city (${candidate.city}).`;
      } else if (client.relocate === 'No' && candidate.relocate !== 'No') {
        relocateScore = 22;
        relocateReason = `Candidate is willing to relocate to client's city (${client.city}).`;
      } else {
        relocateScore = 0;
        relocateReason = `Location conflict: Reside in different cities (${client.city} vs ${candidate.city}) and neither wants to relocate.`;
      }
    }
    breakdown['relocation'] = { score: relocateScore, max: 35, reason: relocateReason };

    // 3. Core Values Match (Max 30)
    const sharedValues = client.coreValues.filter(val => candidate.coreValues.includes(val));
    const valuesScore = Math.min(30, sharedValues.length * 15);
    let valuesReason = '';
    if (sharedValues.length > 0) {
      valuesReason = `Shared core values: ${sharedValues.join(', ')}.`;
    } else {
      valuesReason = `No shared core values identified.`;
    }
    breakdown['values'] = { score: valuesScore, max: 30, reason: valuesReason };
  }

  // Calculate overall score
  const overallScore = Object.values(breakdown).reduce((acc, curr) => acc + curr.score, 0);
  
  return {
    profile: candidate,
    overallScore,
    breakdown
  };
}

export function getTopMatches(client: Profile, allProfiles: Profile[], limit = 5): MatchResult[] {
  // Filter for opposite gender
  const oppositeGender = client.gender === 'Male' ? 'Female' : 'Male';
  const candidates = allProfiles.filter(p => p.gender === oppositeGender);
  
  const results = candidates.map(candidate => calculateMatchScore(client, candidate));
  
  // Sort by overall score descending
  return results.sort((a, b) => b.overallScore - a.overallScore).slice(0, limit);
}

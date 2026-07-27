import { NextResponse } from 'next/server';
import { Profile } from '@/types';

export async function POST(request: Request) {
  try {
    const { client, candidate, score } = (await request.json()) as {
      client: Profile;
      candidate: Profile;
      score: number;
    };

    if (!client || !candidate) {
      return NextResponse.json({ error: 'Missing client or candidate profiles' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `You are an expert matchmaker assistant. Analyze these two Indian profiles and generate a compatibility breakdown.

Client:
- Name: ${client.name} (${client.gender})
- Age: ${client.age}
- City: ${client.city}
- Marital Status: ${client.maritalStatus}
- Height: ${client.heightStr}
- Income: ${client.incomeStr}
- Profession: ${client.designation} at ${client.company}
- Religion/Caste: ${client.religion} (${client.caste})
- Lifestyle: Kids: ${client.kids}, Relocation openness: ${client.relocate}, Pets: ${client.pets}, Diet: ${client.dietaryPreference}, Manglik: ${client.manglikStatus}
- Core Values: ${client.coreValues ? client.coreValues.join(', ') : 'None'}

Candidate Match:
- Name: ${candidate.name} (${candidate.gender})
- Age: ${candidate.age}
- City: ${candidate.city}
- Marital Status: ${candidate.maritalStatus}
- Height: ${candidate.heightStr}
- Income: ${candidate.incomeStr}
- Profession: ${candidate.designation} at ${candidate.company}
- Religion/Caste: ${candidate.religion} (${candidate.caste})
- Lifestyle: Kids: ${candidate.kids}, Relocation openness: ${candidate.relocate}, Pets: ${candidate.pets}, Diet: ${candidate.dietaryPreference}, Manglik: ${candidate.manglikStatus}
- Core Values: ${candidate.coreValues ? candidate.coreValues.join(', ') : 'None'}

Matching Engine Score: ${score}%

Please generate two things:
1. A personalized, high-potential compatibility explanation paragraph (4-5 sentences) highlighting specific professional, geographic, values, and lifestyle synergies. Highlight cultural compatibility (e.g. Diet/Manglik/Religion) when relevant.
2. A warm, professional mock outreach introductory message (3-4 sentences) that the matchmaker can send to the Candidate (${candidate.name}) on behalf of the Client (${client.name}) to introduce the match and ask for interest.

Return a JSON response with the following format:
{
  "compatibility": "Explanation paragraph goes here...",
  "outreach": "Intro text goes here..."
}
Make sure you return ONLY the JSON object. Do not include markdown code block syntax (like \`\`\`json) in your reply.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        if (response.ok) {
          const data = await response.json();
          const contentText = data.choices[0].message.content.trim();
          
          // Parse JSON, strip out markdown formatting if any
          const cleanText = contentText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
          const parsed = JSON.parse(cleanText);
          if (parsed.compatibility && parsed.outreach) {
            return NextResponse.json(parsed);
          }
        }
      } catch (err) {
        console.error('Error fetching from OpenAI, falling back to mock text generator:', err);
      }
    }

    // Fallback generator
    const clientCoreValues = Array.isArray(client.coreValues) ? client.coreValues : [];
    const candidateCoreValues = Array.isArray(candidate.coreValues) ? candidate.coreValues : [];
    const sharedValues = clientCoreValues.filter(val => candidateCoreValues.includes(val));
    const valuesText = sharedValues.length > 0 
      ? `sharing key core values like ${sharedValues.join(' and ')}`
      : `complementing core values like ${clientCoreValues[0] || 'Family'} and ${candidateCoreValues[0] || 'Respect'}`;

    const locationText = client.city === candidate.city
      ? `both living in ${client.city}, minimizing any location challenges`
      : `with ${client.name} based in ${client.city} and ${candidate.name} in ${candidate.city}, supported by ${client.gender === 'Male' ? (candidate.relocate === 'Yes' ? 'candidate\'s willingness' : 'flexible attitudes') : (client.relocate === 'Yes' ? 'client\'s willingness' : 'flexible attitudes')} to relocate`;

    const professionText = client.designation.toLowerCase() === candidate.designation.toLowerCase()
      ? `both working as ${client.designation}s which establishes immediate professional understanding`
      : `${client.name}'s role as ${client.designation} at ${client.company} and ${candidate.name}'s role as ${candidate.designation} at ${candidate.company} show a balanced professional compatibility`;

    const lifestyleText = `They have aligned views regarding children (Client: ${client.kids}, Candidate: ${candidate.kids}) and show matching dietary lifestyles (${client.dietaryPreference} & ${candidate.dietaryPreference}).`;

    const compatibility = `Based on their biodata, ${client.name} and ${candidate.name} demonstrate a highly compatible match (Scoring ${score}%). Their alignment is anchored in ${valuesText}, alongside ${locationText}. Professionally, ${professionText}. Additionally, they share excellent lifestyle harmony; ${lifestyleText} Astrologically, their Manglik status is ${client.manglikStatus} and ${candidate.manglikStatus} respectively, suggesting a comfortable compatibility.`;

    const outreachShared = clientCoreValues.slice(0, 2).join(' & ') || 'mutual respect';
    const outreach = `Dear ${candidate.name.split(' ')[0]},\n\nI hope you are doing well! I am reaching out to share a high-potential match from our premium circle. ${client.name} is a ${client.age}-year-old ${client.designation} at ${client.company} based in ${client.city}. Based on our matching analysis, the two of you share key core values of ${outreachShared} and have highly aligned lifestyle goals. If you are open to reviewing their profile, I'd be delighted to share their detailed biodata and help facilitate a warm introduction.\n\nWarm regards,\nYour Personal Matchmaker`;

    return NextResponse.json({ compatibility, outreach });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

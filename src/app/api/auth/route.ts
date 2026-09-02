import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Candidate from '@/models/Candidate';
import profilesData from '@/data/profiles.json';
import bcrypt from 'bcryptjs';

const DEFAULT_DEMO_CANDIDATES = [
  {
    name: 'Isha',
    email: 'isha@gmail.com',
    password: 'isha',
    gender: 'Female',
    city: 'Mumbai',
    designation: 'Product Manager',
    company: 'Meta',
    age: 27,
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
    role: 'Candidate',
  },
  {
    name: 'Shivay',
    email: 'shivay@gmail.com',
    password: 'password',
    gender: 'Male',
    city: 'Mumbai',
    designation: 'Software Engineer',
    company: 'Google',
    age: 29,
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
    role: 'Candidate',
  },
];

async function seedDatabaseIfEmpty() {
  const count = await Candidate.countDocuments();
  if (count === 0) {
    const allSeedData = [...DEFAULT_DEMO_CANDIDATES];

    for (const profile of profilesData as any[]) {
      const email = profile.email || `${profile.name.toLowerCase().replace(/\s+/g, '.')}@jodimaker.com`;
      if (!allSeedData.some((d) => d.email.toLowerCase() === email.toLowerCase())) {
        allSeedData.push({
          ...profile,
          email,
          password: 'password123',
          isDynamic: false,
          role: 'Candidate',
        });
      }
    }

    // Hash passwords before inserting
    const salt = await bcrypt.genSalt(10);
    for (const profile of allSeedData) {
      profile.password = await bcrypt.hash(profile.password, salt);
    }

    await Candidate.insertMany(allSeedData, { ordered: false }).catch((err) => {
      if (err.code !== 11000) throw err;
    });
    console.log(`Seeded ${allSeedData.length} candidates into MongoDB`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured', fallback: true }, { status: 503 });
    }

    await seedDatabaseIfEmpty();

    if (action === 'signup') {
      const { name, email, password, phone, gender } = body;

      if (!name || !email || !password) {
        return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
      }

      const cleanEmail = email.toLowerCase().trim();
      const existing = await Candidate.findOne({ email: cleanEmail });
      if (existing) {
        return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 409 });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newCandidate = await Candidate.create({
        name,
        email: cleanEmail,
        password: hashedPassword,
        phone,
        gender: gender || 'Female',
        age: 28,
        maritalStatus: 'Never Married',
        status: 'Active',
        isDynamic: true,
        role: 'Candidate',
        coreValues: [],
      });

      return NextResponse.json({
        success: true,
        candidate: {
          id: newCandidate._id.toString(),
          name: newCandidate.name,
          email: newCandidate.email,
          gender: newCandidate.gender,
        },
      });
    }

    if (action === 'login') {
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }

      const cleanEmail = email.toLowerCase().trim();
      const candidate = await Candidate.findOne({ email: cleanEmail });

      if (!candidate) {
        return NextResponse.json({ error: 'Account not found. Please sign up first as a candidate.' }, { status: 404 });
      }

      // Check password (support both bcrypt and legacy plain text)
      let isMatch = false;
      if (candidate.password.startsWith('$2a$') || candidate.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, candidate.password);
      } else {
        isMatch = (password === candidate.password);
        if (isMatch) {
          // Upgrade plain text password to hashed
          const salt = await bcrypt.genSalt(10);
          candidate.password = await bcrypt.hash(password, salt);
          await candidate.save();
        }
      }

      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid password. Please try again.' }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        candidate: {
          id: candidate._id.toString(),
          name: candidate.name,
          email: candidate.email,
          gender: candidate.gender,
          city: candidate.city,
          designation: candidate.designation,
          company: candidate.company,
          age: candidate.age,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('Auth API error:', error);
    return NextResponse.json({ error: 'Internal server error', fallback: true }, { status: 500 });
  }
}

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

    const salt = await bcrypt.genSalt(10);
    for (const profile of allSeedData) {
      profile.password = await bcrypt.hash(profile.password, salt);
    }

    await Candidate.insertMany(allSeedData, { ordered: false }).catch((err) => {
      if (err.code !== 11000) throw err;
    });
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured', fallback: true }, { status: 503 });
    }

    await seedDatabaseIfEmpty();

    const candidates = await Candidate.find({}).lean();
    const mapped = candidates.map((c: any) => ({
      ...c,
      id: c._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json({ success: true, candidates: mapped });
  } catch (error: any) {
    console.error('Candidates GET error:', error);
    return NextResponse.json({ error: 'Internal server error', fallback: true }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, ...updateData } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required for updates' }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured', fallback: true }, { status: 503 });
    }

    const cleanEmail = email.toLowerCase().trim();
    delete updateData._id;
    delete updateData.id;

    const updated = await Candidate.findOneAndUpdate(
      { email: cleanEmail },
      { $set: updateData },
      { new: true, upsert: true, lean: true }
    );

    return NextResponse.json({
      success: true,
      candidate: {
        ...updated,
        id: (updated as any)._id.toString(),
      },
    });
  } catch (error: any) {
    console.error('Candidates PUT error:', error);
    return NextResponse.json({ error: 'Internal server error', fallback: true }, { status: 500 });
  }
}

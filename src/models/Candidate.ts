import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICandidate extends Document {
  name: string;
  email: string;
  password: string;
  gender?: string;
  age?: number;
  city?: string;
  designation?: string;
  company?: string;
  income?: number;
  incomeStr?: string;
  maritalStatus?: string;
  height?: number;
  heightStr?: string;
  religion?: string;
  caste?: string;
  kids?: string;
  relocate?: string;
  pets?: string;
  dietaryPreference?: string;
  manglikStatus?: string;
  coreValues?: string[];
  status?: string;
  role?: string;
  isDynamic?: boolean;
  phone?: string;
  bio?: string;
  preferences?: Record<string, any>;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    gender: { type: String },
    age: { type: Number },
    city: { type: String },
    designation: { type: String },
    company: { type: String },
    income: { type: Number },
    incomeStr: { type: String },
    maritalStatus: { type: String },
    height: { type: Number },
    heightStr: { type: String },
    religion: { type: String },
    caste: { type: String },
    kids: { type: String },
    relocate: { type: String },
    pets: { type: String },
    dietaryPreference: { type: String },
    manglikStatus: { type: String },
    coreValues: [{ type: String }],
    status: { type: String, default: 'Active' },
    role: { type: String, default: 'Candidate' },
    isDynamic: { type: Boolean, default: true },
    phone: { type: String },
    bio: { type: String },
    preferences: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true, // auto createdAt + updatedAt
  }
);

// Prevent model recompilation during hot reloads
const Candidate: Model<ICandidate> =
  mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);

export default Candidate;

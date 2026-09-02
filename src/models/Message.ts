import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  senderEmail: string;
  receiverEmail: string;
  senderName?: string;
  text: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderEmail: { type: String, required: true, lowercase: true, trim: true },
    receiverEmail: { type: String, required: true, lowercase: true, trim: true },
    senderName: { type: String },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: false, // we use our own timestamp field
  }
);

// Compound index for efficient conversation queries
MessageSchema.index({ senderEmail: 1, receiverEmail: 1, timestamp: 1 });

// Prevent model recompilation during hot reloads
const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;

// models/OTP.ts
import { Schema, model, models, Document } from 'mongoose';

export type OTPPurpose =
  | 'email_verification'
  | 'password_reset'
  | 'phone_verification';

export interface IOTP extends Document {
  userId:    Schema.Types.ObjectId;
  email:     string;
  otp:       string;       // bcrypt hash — never stored plain
  purpose:   OTPPurpose;
  attempts:  number;       // wrong-guess counter (max 5)
  isUsed:    boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email:  { type: String, required: true, lowercase: true, trim: true },
    otp:    { type: String, required: true },  // bcrypt hash
    purpose: {
      type:     String,
      required: true,
      enum:     ['email_verification', 'password_reset', 'phone_verification'],
    },
    attempts: { type: Number, default: 0 },
    isUsed:   { type: Boolean, default: false },
    expiresAt: {
      type:     Date,
      required: true,
      default:  () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  },
  { timestamps: true },
);

// MongoDB TTL — auto-delete document 60 s after expiresAt
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

// Composite indexes for fast lookup
OTPSchema.index({ userId: 1, purpose: 1, isUsed: 1 });
OTPSchema.index({ email:  1, purpose: 1, isUsed: 1 });

export default models.OTP || model<IOTP>('OTP', OTPSchema);
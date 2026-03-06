// lib/otp.ts
import bcrypt from 'bcryptjs';
import OTPModel, { OTPPurpose } from '@/models/OTP';

const MAX_ATTEMPTS        = 5;
const RESEND_COOLDOWN_SEC = 60;  // 60s before user can request another OTP

// ── Generate a cryptographically-safe 6-digit code ───────────────────────────
export function generateOTP(): string {
  const min = 100_000;
  const max = 999_999;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

// ── Create & persist OTP (invalidates any previous active one) ───────────────
export async function createOTP(
  userId:  string,
  email:   string,
  purpose: OTPPurpose,
): Promise<string> {
  // Rate-limit — prevent OTP spam
  const recent = await OTPModel.findOne({
    userId,
    purpose,
    isUsed:    false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (recent) {
    const elapsed = (Date.now() - new Date(recent.createdAt).getTime()) / 1000;
    if (elapsed < RESEND_COOLDOWN_SEC) {
      const wait = Math.ceil(RESEND_COOLDOWN_SEC - elapsed);
      throw new Error(`Please wait ${wait}s before requesting a new code.`);
    }
  }

  // Invalidate all previous active OTPs for this user + purpose
  await OTPModel.updateMany(
    { userId, purpose, isUsed: false },
    { $set: { isUsed: true } },
  );

  const plain  = generateOTP();
  const hashed = await bcrypt.hash(plain, 10);

  await OTPModel.create({
    userId,
    email:     email.toLowerCase(),
    otp:       hashed,
    purpose,
    attempts:  0,
    isUsed:    false,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  return plain; // return plain — caller sends this to user, never store it
}

// ── Verify an OTP submitted by the user ──────────────────────────────────────
export interface VerifyOTPResult {
  success:       boolean;
  error?:        string;
  attemptsLeft?: number;
}

export async function verifyOTP(
  userId:   string,
  purpose:  OTPPurpose,
  plainOTP: string,
  markAsUsed: boolean = true // Add parameter to control whether to mark as used
): Promise<VerifyOTPResult> {
  const record = await OTPModel.findOne({
    userId,
    purpose,
    isUsed: false,
  }).sort({ createdAt: -1 });

  if (!record) {
    return {
      success: false,
      error:   'No active verification code found. Please request a new one.',
    };
  }

  if (new Date() > record.expiresAt) {
    record.isUsed = true;
    await record.save();
    return { success: false, error: 'Code has expired. Please request a new one.' };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    record.isUsed = true;
    await record.save();
    return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  const match = await bcrypt.compare(plainOTP, record.otp);

  if (!match) {
    record.attempts += 1;
    await record.save();
    const left = MAX_ATTEMPTS - record.attempts;
    if (left <= 0) {
      record.isUsed = true;
      await record.save();
    }
    return {
      success:      false,
      attemptsLeft: Math.max(0, left),
      error:        left > 0
        ? `Incorrect code. ${left} attempt${left === 1 ? '' : 's'} remaining.`
        : 'Too many incorrect attempts. Please request a new code.',
    };
  }

  // ✅ Correct — only mark as used if markAsUsed is true
  if (markAsUsed) {
    record.isUsed = true;
    await record.save();
  }
  
  return { success: true };
}
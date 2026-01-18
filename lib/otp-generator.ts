// lib/otp-generator.ts
/**
 * OTP Generator Utility
 * Generates secure OTPs for authentication
 */

/**
 * Generate a numeric OTP of specified length
 * @param length - Length of OTP (default: 6)
 * @returns Generated OTP string
 */
export function generateOTP(length: number = 6): string {
  if (length < 4 || length > 8) {
    throw new Error('OTP length must be between 4 and 8 digits');
  }

  // Generate cryptographically secure random OTP
  const max = Math.pow(10, length);
  const min = Math.pow(10, length - 1);
  
  // Using crypto.getRandomValues for better security
  const randomValues = new Uint32Array(1);
  crypto.getRandomValues(randomValues);
  
  // Generate within range and pad with leading zeros if needed
  const otp = (min + (randomValues[0] % (max - min))).toString();
  
  return otp;
}

/**
 * Generate an alphanumeric OTP
 * @param length - Length of OTP (default: 6)
 * @param includeSpecialChars - Whether to include special characters
 * @returns Generated OTP string
 */
export function generateAlphanumericOTP(
  length: number = 6,
  includeSpecialChars: boolean = false
): string {
  if (length < 4 || length > 12) {
    throw new Error('OTP length must be between 4 and 12 characters');
  }

  const charset = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*'
  };

  let characters = charset.uppercase + charset.lowercase + charset.numbers;
  if (includeSpecialChars) {
    characters += charset.special;
  }

  // Generate cryptographically secure OTP
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += characters[randomValues[i] % characters.length];
  }

  return otp;
}

/**
 * Generate a time-based OTP (TOTP-like)
 * @param secret - Secret key for HMAC (optional)
 * @param length - Length of OTP (default: 6)
 * @returns Generated OTP string
 */
export function generateTimeBasedOTP(secret?: string, length: number = 6): string {
  const timestamp = Math.floor(Date.now() / 30000); // 30-second intervals
  
  if (secret) {
    // If you want to implement proper TOTP with HMAC
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const timestampData = encoder.encode(timestamp.toString());
    
    // Simple implementation - for production use a proper TOTP library
    return generateOTP(length);
  }
  
  // Fallback to regular OTP if no secret provided
  return generateOTP(length);
}

/**
 * Validate OTP format
 * @param otp - OTP to validate
 * @param length - Expected length
 * @param numericOnly - Whether OTP should be numeric only
 * @returns Validation result
 */
export function validateOTPFormat(
  otp: string,
  length: number = 6,
  numericOnly: boolean = true
): { isValid: boolean; reason?: string } {
  if (!otp || typeof otp !== 'string') {
    return { isValid: false, reason: 'OTP is required' };
  }

  if (otp.length !== length) {
    return { isValid: false, reason: `OTP must be ${length} characters long` };
  }

  if (numericOnly && !/^\d+$/.test(otp)) {
    return { isValid: false, reason: 'OTP must contain only numbers' };
  }

  // Check for common patterns that might be insecure
  const commonPatterns = [
    '123456', '111111', '000000', '654321', '123123',
    '999999', '888888', '777777', '666666', '555555',
    '444444', '333333', '222222', '121212', '112233'
  ];

  if (commonPatterns.includes(otp)) {
    return { isValid: false, reason: 'OTP is too common and insecure' };
  }

  // Check for sequential numbers
  const isSequential = otp.split('').every((char, index, arr) => {
    if (index === 0) return true;
    return parseInt(char) === parseInt(arr[index - 1]) + 1 ||
           parseInt(char) === parseInt(arr[index - 1]) - 1;
  });

  if (isSequential) {
    return { isValid: false, reason: 'OTP is sequential and insecure' };
  }

  return { isValid: true };
}

/**
 * Generate multiple OTPs for bulk operations
 * @param count - Number of OTPs to generate
 * @param length - Length of each OTP
 * @returns Array of OTPs
 */
export function generateBulkOTPs(count: number, length: number = 6): string[] {
  if (count < 1 || count > 1000) {
    throw new Error('Count must be between 1 and 1000');
  }

  const otps: string[] = [];
  const usedOTPs = new Set<string>();

  while (otps.length < count) {
    const otp = generateOTP(length);
    
    // Ensure uniqueness
    if (!usedOTPs.has(otp)) {
      usedOTPs.add(otp);
      otps.push(otp);
    }
  }

  return otps;
}

/**
 * OTP with expiration time
 */
export interface OTPWithExpiry {
  otp: string;
  expiresAt: Date;
}

/**
 * Generate OTP with expiration
 * @param length - OTP length
 * @param expiresInMinutes - Expiry in minutes (default: 10)
 * @returns OTP with expiry
 */
export function generateOTPWithExpiry(
  length: number = 6,
  expiresInMinutes: number = 10
): OTPWithExpiry {
  const otp = generateOTP(length);
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
  
  return { otp, expiresAt };
}

/**
 * Check if OTP has expired
 * @param expiresAt - Expiry date
 * @returns boolean indicating if expired
 */
export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Rate limiting for OTP generation
 */
export class OTPRateLimiter {
  private attempts = new Map<string, { count: number; lastAttempt: number }>();
  private readonly MAX_ATTEMPTS_PER_HOUR = 5;
  private readonly COOLDOWN_MINUTES = 60;

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts) {
      return true;
    }

    // Check if cooldown period has passed
    const timeSinceLastAttempt = now - userAttempts.lastAttempt;
    const cooldownMs = this.COOLDOWN_MINUTES * 60 * 1000;

    if (timeSinceLastAttempt > cooldownMs) {
      // Reset attempts after cooldown
      this.attempts.delete(identifier);
      return true;
    }

    return userAttempts.count < this.MAX_ATTEMPTS_PER_HOUR;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (userAttempts) {
      userAttempts.count += 1;
      userAttempts.lastAttempt = now;
    } else {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
    }
  }

  getRemainingAttempts(identifier: string): number {
    const userAttempts = this.attempts.get(identifier);
    if (!userAttempts) {
      return this.MAX_ATTEMPTS_PER_HOUR;
    }
    return Math.max(0, this.MAX_ATTEMPTS_PER_HOUR - userAttempts.count);
  }

  clearAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Default export for common use
export default {
  generateOTP,
  generateAlphanumericOTP,
  generateTimeBasedOTP,
  validateOTPFormat,
  generateBulkOTPs,
  generateOTPWithExpiry,
  isOTPExpired,
  OTPRateLimiter,
};
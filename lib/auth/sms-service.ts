// lib/auth/sms-service.ts
import { generateOTP } from '@/lib/otp-generator';

export class OTPService {
  private otpStore = new Map<string, { otp: string; expiresAt: Date }>();
  private readonly EXPIRY_MINUTES = 10;

  async sendOTP(mobile: string): Promise<{ success: boolean; otp?: string }> {
    try {
      // Generate OTP
      const otp = generateOTP(6);
      const expiresAt = new Date(Date.now() + this.EXPIRY_MINUTES * 60000);
      
      // Store OTP temporarily (in production, use Redis/DB)
      this.otpStore.set(mobile, { otp, expiresAt });
      
      // Send via SMS service
      // await smsService.sendOTP(mobile, otp);
      
      // For development, log the OTP
      console.log(`📱 OTP for ${mobile}: ${otp} (expires at ${expiresAt.toLocaleTimeString()})`);
      
      return { success: true, otp: process.env.NODE_ENV === 'development' ? otp : undefined };
      
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return { success: false };
    }
  }

  verifyOTP(mobile: string, userOtp: string): boolean {
    const stored = this.otpStore.get(mobile);
    
    if (!stored) {
      return false;
    }
    
    // Check expiry
    if (new Date() > stored.expiresAt) {
      this.otpStore.delete(mobile);
      return false;
    }
    
    // Verify OTP
    const isValid = stored.otp === userOtp;
    
    // Clear OTP after verification (success or failure)
    this.otpStore.delete(mobile);
    
    return isValid;
  }
}

export const otpService = new OTPService();
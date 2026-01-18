// lib/sms.ts - MSG91 Integration
import axios from 'axios';

interface SendSMSOptions {
  to: string; // Mobile number with country code (e.g., "919876543210")
  message: string;
  templateId?: string; // DLT approved template ID
  variables?: Record<string, string>;
}

export class SMSService {
  private apiKey: string;
  private senderId: string;

  constructor() {
    this.apiKey = process.env.MSG91_API_KEY!;
    this.senderId = process.env.MSG91_SENDER_ID || 'ACCUMA';
  }

  async sendOTP(mobile: string, otp: string): Promise<boolean> {
    try {
      const response = await axios.post('https://api.msg91.com/api/v5/otp', {
        mobile: mobile.replace('+', ''),
        otp,
        template_id: process.env.MSG91_OTP_TEMPLATE_ID,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'authkey': this.apiKey,
        },
      });

      return response.data.type === 'success';
    } catch (error) {
      console.error('SMS OTP Error:', error);
      return false;
    }
  }

  async sendTransactionalSMS(options: SendSMSOptions): Promise<boolean> {
    try {
      const response = await axios.post('https://api.msg91.com/api/v2/sendsms', {
        sender: this.senderId,
        route: '4', // Transactional route
        country: '91', // India
        sms: [{
          message: options.message,
          to: [options.to.replace('+', '')],
        }],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'authkey': this.apiKey,
        },
      });

      return response.data.type === 'success';
    } catch (error) {
      console.error('SMS Error:', error);
      return false;
    }
  }

  // Verify OTP
  async verifyOTP(mobile: string, otp: string): Promise<boolean> {
    try {
      const response = await axios.get('https://api.msg91.com/api/v5/otp/verify', {
        params: {
          mobile: mobile.replace('+', ''),
          otp,
        },
        headers: {
          'authkey': this.apiKey,
        },
      });

      return response.data.type === 'success';
    } catch (error) {
      console.error('OTP Verification Error:', error);
      return false;
    }
  }
}

export const smsService = new SMSService();
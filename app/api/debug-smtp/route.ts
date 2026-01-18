// app/api/debug-smtp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(request: NextRequest) {
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD ? '***' + process.env.SMTP_PASSWORD.slice(-4) : 'NOT SET',
    },
  };
  
  console.log('🔧 SMTP Configuration:', {
    ...config,
    auth: { ...config.auth, pass: '***' }
  });
  
  return NextResponse.json({
    success: true,
    smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
    config: {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.auth.user,
      passwordSet: !!process.env.SMTP_PASSWORD,
      from: process.env.SMTP_FROM,
      adminEmail: process.env.ADMIN_EMAIL,
    },
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
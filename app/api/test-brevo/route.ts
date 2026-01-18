// app/api/test-brevo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Create transporter with your Brevo credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // false for port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD, // Your Brevo SMTP key
      },
    });
    
    // Test email
    const info = await transporter.sendMail({
      from: `AccumaManage <${process.env.SMTP_FROM}>`,
      to: process.env.ADMIN_EMAIL, // Your email address
      subject: '✅ Brevo SMTP Test - Working!',
      text: 'Congratulations! Your Brevo SMTP is working perfectly.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4CAF50;">✅ Brevo SMTP Connection Successful!</h2>
          <p>Your contact form emails will now work with:</p>
          <ul>
            <li><strong>Provider:</strong> Brevo (Sendinblue)</li>
            <li><strong>Server:</strong> ${process.env.SMTP_HOST}</li>
            <li><strong>Port:</strong> ${process.env.SMTP_PORT}</li>
            <li><strong>Login:</strong> ${process.env.SMTP_USER}</li>
          </ul>
          <p>You can now receive contact form submissions via email.</p>
        </div>
      `,
    });
    
    console.log('✅ Test email sent:', info.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info), // For email testing services
    });
    
  } catch (error: any) {
    console.error('❌ Brevo SMTP Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
      },
      troubleshooting: 'Check your SMTP key in Brevo dashboard'
    }, { status: 500 });
  }
}
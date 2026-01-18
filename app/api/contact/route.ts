// app/api/contact/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Contact from '@/models/Contact';
import nodemailer from 'nodemailer';

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_WINDOW = 10;

// Email transporter - SPECIFIC FOR BREVO
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // Must be false for Brevo
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false // For testing only
    }
  });
};

export async function POST(request: NextRequest) {
  try {
    console.log('📨 POST /api/contact - Starting...');

    // Rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0].trim() || '127.0.0.1';
    
    const now = Date.now();
    const clientData = requestCounts.get(ip);
    
    if (clientData) {
      if (now < clientData.resetTime) {
        if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
          return NextResponse.json(
            { 
              success: false, 
              message: 'Too many requests. Please try again later.' 
            }, 
            { status: 429 }
          );
        }
        clientData.count += 1;
      } else {
        requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    const body = await request.json();
    
    // Basic validation
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Name, email, and message are required.' 
        }, 
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please provide a valid email address.' 
        }, 
        { status: 400 }
      );
    }

    // For now, skip spam check to test
    console.log('📝 Processing contact form...');

    // Get client IP for logging
    const clientIp = forwardedFor?.split(',')[0].trim() || 'Unknown';

    // Try to connect to database
    try {
      await connectToDatabase();
      console.log('✅ Database connected');
      
      // Save to database
      const contact = new Contact({
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        company: body.company || '',
        subject: body.subject || '',
        message: body.message,
        source: 'website',
        priority: 'medium',
        status: 'new',
        metadata: {
          ipAddress: ip,
          userAgent: request.headers.get('user-agent') || 'unknown',
          referrer: request.headers.get('referer') || '',
          pageUrl: request.url,
        },
        tags: [],
      });
      
      await contact.save();
      console.log('✅ Contact saved:', contact._id);
    } catch (dbError) {
      console.log('⚠️ Database not available, continuing without save:', dbError);
    }

    // Try to send emails
    let emailSuccess = false;
    try {
      // Send admin notification
      await sendAdminNotification(body, clientIp);
      
      // Send auto-response
      await sendAutoResponse(body);
      
      emailSuccess = true;
      console.log('✅ Emails sent successfully');
    } catch (emailError: any) {
      console.error('❌ Email sending failed:', emailError.message);
      // Continue without email - form submission still successful
    }

    // Generate ticket number
    const ticketNumber = `ACC-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      data: {
        ticketNumber,
        estimatedResponseTime: '24 hours',
        emailSent: emailSuccess,
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Contact submission error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to submit contact form. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Email functions - FIXED: Added ip parameter
async function sendAdminNotification(data: any, clientIp: string) {
  try {
    if (!process.env.SMTP_USER || !process.env.ADMIN_EMAIL) {
      throw new Error('SMTP configuration missing');
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `AccumaManage <${process.env.SMTP_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: data.email, // So you can reply directly
      subject: `📨 New Contact: ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>👤 Name:</strong> ${data.name}</p>
            <p style="margin: 5px 0;"><strong>📧 Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.phone ? `<p style="margin: 5px 0;"><strong>📱 Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
            ${data.company ? `<p style="margin: 5px 0;"><strong>🏢 Company:</strong> ${data.company}</p>` : ''}
            ${data.subject ? `<p style="margin: 5px 0;"><strong>📝 Subject:</strong> ${data.subject}</p>` : ''}
          </div>
          
          <div style="background: #fff; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #555;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
          </div>
          
          <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
            <p style="margin: 0; color: #555;">
              <strong>🕒 Submitted:</strong> ${new Date().toLocaleString()}<br>
              <strong>📍 IP Address:</strong> ${clientIp}
            </p>
          </div>
          
          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin-bottom: 15px; color: #666;">
              <strong>Quick Actions:</strong>
            </p>
            <a href="mailto:${data.email}?subject=Re: ${data.subject || 'Your inquiry'}" 
               style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
              ✉️ Reply Now
            </a>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Company: ${data.company || 'Not provided'}
Subject: ${data.subject || 'No subject'}

Message:
${data.message}

Submitted: ${new Date().toLocaleString()}
IP Address: ${clientIp}
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Admin email sent:', info.messageId);
    return true;
    
  } catch (error: any) {
    console.error('Failed to send admin notification:', error.message);
    throw error;
  }
}

async function sendAutoResponse(data: any) {
  try {
    if (!process.env.SMTP_USER) {
      throw new Error('SMTP configuration missing');
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `AccumaManage <${process.env.SMTP_FROM}>`,
      to: data.email,
      subject: `✅ Thank you for contacting AccumaManage!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #667eea; margin: 0 0 10px 0;">AccumaManage</h1>
              <p style="color: #666; margin: 0;">Thank you for reaching out!</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <h2 style="margin: 0 0 10px 0;">✅ Message Received</h2>
              <p style="margin: 0; opacity: 0.9;">We've received your inquiry and will get back to you soon.</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #28a745;">
              <h3 style="margin-top: 0; color: #333;">Your Inquiry Details</h3>
              <p><strong>📝 Name:</strong> ${data.name}</p>
              ${data.subject ? `<p><strong>📋 Subject:</strong> ${data.subject}</p>` : ''}
              <p><strong>📅 Submitted:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>⏱️ Estimated Response Time:</strong> Within 24 hours</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h3 style="color: #333;">What happens next?</h3>
              <ol style="padding-left: 20px; color: #555;">
                <li>Our team will review your message</li>
                <li>We'll categorize it based on priority</li>
                <li>A team member will respond to you directly</li>
              </ol>
            </div>
            
            <div style="background: #fff8e1; padding: 15px; border-radius: 8px; border: 1px solid #ffecb5; margin-bottom: 30px;">
              <p style="margin: 0; color: #856404;">
                <strong>📞 Need immediate assistance?</strong><br>
                Call us: +91 98765 43210 | Email: support@accumanage.com
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin-bottom: 5px;">
                Best regards,
              </p>
              <p style="color: #667eea; font-weight: bold; margin: 0;">
                The AccumaManage Team
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Thank you for contacting AccumaManage!

Dear ${data.name},

We have received your message and will get back to you within 24 hours.

Your Inquiry Details:
- Name: ${data.name}
${data.subject ? `- Subject: ${data.subject}\n` : ''}
- Submitted: ${new Date().toLocaleDateString()}
- Estimated Response Time: Within 24 hours

What happens next?
1. Our team will review your message
2. We'll categorize it based on priority  
3. A team member will respond to you directly

Need immediate assistance?
Call us: +91 98765 43210
Email: support@accumanage.com

Best regards,
The AccumaManage Team
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Auto-response sent to:', data.email);
    return true;
    
  } catch (error: any) {
    console.error('Failed to send auto-response:', error.message);
    throw error;
  }
}

// GET endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Contact API is running',
    endpoints: {
      POST: '/api/contact - Submit contact form',
    },
    emailConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
  });
}
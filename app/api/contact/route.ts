import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Contact from '@/models/Contact';
import nodemailer from 'nodemailer';

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Email transporter for Brevo
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
              message: 'Too many requests. Please wait a minute and try again.' 
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

    // Get client IP for logging
    const clientIp = forwardedFor?.split(',')[0].trim() || 'Unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Generate ticket number
    const ticketNumber = `ACC-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    console.log('📝 Processing contact form for:', body.email);

    // Save to database if available
    let dbSaved = false;
    try {
      await connectToDatabase();
      console.log('✅ Database connected');
      
      const contact = new Contact({
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        company: body.company || '',
        subject: body.subject || '',
        message: body.message,
        ticketNumber,
        source: 'website',
        priority: 'medium',
        status: 'new',
        metadata: {
          ipAddress: clientIp,
          userAgent,
          referrer: request.headers.get('referer') || '',
          pageUrl: request.url,
        },
        tags: [],
      });
      
      await contact.save();
      dbSaved = true;
      console.log('✅ Contact saved to database:', contact._id);
    } catch (dbError) {
      console.log('⚠️ Database not available, continuing without save:', dbError);
    }

    // Try to send emails
    let emailSuccess = false;
    try {
      // Send admin notification
      await sendAdminNotification(body, clientIp, userAgent, ticketNumber);
      
      // Send auto-response
      await sendAutoResponse(body, ticketNumber);
      
      emailSuccess = true;
      console.log('✅ Emails sent successfully');
    } catch (emailError: any) {
      console.error('❌ Email sending failed:', emailError.message);
      // Continue without email - form submission still successful
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      data: {
        ticketNumber,
        estimatedResponseTime: 'Within 24 hours',
        emailSent: emailSuccess,
        savedToDatabase: dbSaved,
        timestamp: new Date().toISOString(),
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

// Admin notification email - Google Material 3 Design
async function sendAdminNotification(data: any, clientIp: string, userAgent: string, ticketNumber: string) {
  try {
    if (!process.env.SMTP_USER || !process.env.ADMIN_EMAIL) {
      console.log('⚠️ SMTP configuration missing, skipping email');
      return;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `AccumaManage Contact <${process.env.SMTP_FROM || 'noreply@accumanage.com'}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: data.email,
      subject: `📨 New Contact Form: ${data.subject || 'No Subject'} [${ticketNumber}]`,
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: 'Google Sans', 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #202124;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: 1px solid #dadce0;
        }
        .header {
            background: linear-gradient(135deg, #4285f4 0%, #0d3064 100%);
            color: white;
            padding: 24px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 500;
        }
        .ticket-number {
            background: rgba(255,255,255,0.2);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            margin-top: 8px;
            display: inline-block;
            font-weight: 500;
        }
        .content {
            padding: 24px;
        }
        .section {
            margin-bottom: 24px;
        }
        .section-title {
            font-size: 16px;
            font-weight: 500;
            color: #4285f4;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 16px;
        }
        .info-item {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #e8eaed;
        }
        .info-label {
            font-size: 12px;
            color: #5f6368;
            margin-bottom: 4px;
        }
        .info-value {
            font-size: 14px;
            font-weight: 500;
            color: #202124;
        }
        .message-box {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #e8eaed;
            white-space: pre-wrap;
            font-size: 14px;
            line-height: 1.6;
            color: #202124;
        }
        .metadata {
            background: #e8f4fd;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #4285f4;
            font-size: 13px;
            color: #5f6368;
        }
        .metadata-item {
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
            flex-wrap: wrap;
        }
        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
        }
        .btn-primary {
            background: #4285f4;
            color: white;
            border: none;
        }
        .btn-primary:hover {
            background: #3367d6;
            transform: translateY(-1px);
        }
        .btn-secondary {
            background: #f1f3f4;
            color: #202124;
            border: 1px solid #dadce0;
        }
        .btn-secondary:hover {
            background: #e8eaed;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #5f6368;
            font-size: 12px;
            border-top: 1px solid #e8eaed;
            background: #f8f9fa;
        }
        @media (max-width: 480px) {
            .container {
                border-radius: 0;
            }
            .content {
                padding: 16px;
            }
            .actions {
                flex-direction: column;
            }
            .btn {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📨 New Contact Form Submission</h1>
            <div class="ticket-number">${ticketNumber}</div>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-title">
                    👤 Contact Information
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Name</div>
                        <div class="info-value">${data.name}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value">${data.email}</div>
                    </div>
                    ${data.phone ? `
                    <div class="info-item">
                        <div class="info-label">Phone</div>
                        <div class="info-value">${data.phone}</div>
                    </div>
                    ` : ''}
                    ${data.company ? `
                    <div class="info-item">
                        <div class="info-label">Company</div>
                        <div class="info-value">${data.company}</div>
                    </div>
                    ` : ''}
                    ${data.subject ? `
                    <div class="info-item">
                        <div class="info-label">Subject</div>
                        <div class="info-value">${data.subject}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">
                    💬 Message
                </div>
                <div class="message-box">
                    ${data.message}
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">
                    📋 Submission Details
                </div>
                <div class="metadata">
                    <div class="metadata-item">
                        <strong>🕒 Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                    </div>
                    <div class="metadata-item">
                        <strong>📍 IP Address:</strong> ${clientIp}
                    </div>
                    <div class="metadata-item">
                        <strong>🌐 User Agent:</strong> ${userAgent.substring(0, 80)}${userAgent.length > 80 ? '...' : ''}
                    </div>
                    <div class="metadata-item">
                        <strong>⚡ Priority:</strong> <span style="color: #34a853;">● Medium</span>
                    </div>
                </div>
            </div>
            
            <div class="actions">
                <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject || 'Your inquiry')}" 
                   class="btn btn-primary">
                    ✉️ Reply Now
                </a>
                <a href="tel:${data.phone || '+919876543210'}" class="btn btn-secondary">
                    📱 Call ${data.phone ? 'Customer' : 'Support'}
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from AccumaManage Contact Form.</p>
            <p>Ticket ID: ${ticketNumber}</p>
        </div>
    </div>
</body>
</html>
      `,
      text: `
NEW CONTACT FORM SUBMISSION
===========================

Ticket Number: ${ticketNumber}
Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

CONTACT INFORMATION
-------------------
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Company: ${data.company || 'Not provided'}
Subject: ${data.subject || 'No subject'}

MESSAGE
-------
${data.message}

SUBMISSION DETAILS
------------------
IP Address: ${clientIp}
User Agent: ${userAgent}
Priority: Medium

QUICK ACTIONS
-------------
• Reply to customer: mailto:${data.email}
• Call: ${data.phone || '+91 98765 43210'}
• View in dashboard: https://accumanage.com/admin/contacts

This is an automated notification from AccumaManage.
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Admin email sent:', info.messageId);
    return true;
    
  } catch (error: any) {
    console.error('❌ Failed to send admin notification:', error.message);
    throw error;
  }
}

// Auto-response email - Google Material 3 Design
async function sendAutoResponse(data: any, ticketNumber: string) {
  try {
    if (!process.env.SMTP_USER) {
      console.log('⚠️ SMTP configuration missing, skipping auto-response');
      return;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `AccumaManage Support <${process.env.SMTP_FROM || 'support@accumanage.com'}>`,
      to: data.email,
      subject: `✅ Thank You for Contacting AccumaManage [${ticketNumber}]`,
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - AccumaManage</title>
    <style>
        body {
            font-family: 'Google Sans', 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #202124;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: 1px solid #dadce0;
        }
        .header {
            background: linear-gradient(135deg, #4285f4 0%, #0d3064 100%);
            color: white;
            padding: 32px 24px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%);
        }
        .header-content {
            position: relative;
            z-index: 1;
        }
        .header-icon {
            width: 64px;
            height: 64px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            backdrop-filter: blur(10px);
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 500;
        }
        .header p {
            margin: 8px 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .ticket-badge {
            background: rgba(255,255,255,0.2);
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            margin-top: 16px;
            display: inline-block;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        .content {
            padding: 32px 24px;
        }
        .section {
            margin-bottom: 28px;
        }
        .section-title {
            font-size: 18px;
            font-weight: 500;
            color: #202124;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .summary-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #e8eaed;
        }
        .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e8eaed;
        }
        .summary-item:last-child {
            border-bottom: none;
        }
        .summary-label {
            color: #5f6368;
            font-size: 14px;
        }
        .summary-value {
            color: #202124;
            font-weight: 500;
            font-size: 14px;
        }
        .process-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 16px;
            margin-top: 20px;
        }
        .step {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
            border: 1px solid #e8eaed;
        }
        .step-icon {
            width: 40px;
            height: 40px;
            background: #e8f0fe;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px;
            color: #4285f4;
            font-size: 18px;
        }
        .step-title {
            font-weight: 500;
            color: #202124;
            margin-bottom: 8px;
        }
        .step-desc {
            font-size: 13px;
            color: #5f6368;
            line-height: 1.4;
        }
        .support-card {
            background: linear-gradient(135deg, #fce8e6 0%, #fef7e0 100%);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #fbbc04;
            margin-top: 24px;
        }
        .support-title {
            font-weight: 600;
            color: #ea4335;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .contact-info {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #5f6368;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            padding: 24px;
            color: #5f6368;
            font-size: 13px;
            border-top: 1px solid #e8eaed;
            background: #f8f9fa;
            line-height: 1.5;
        }
        @media (max-width: 480px) {
            .container {
                border-radius: 0;
            }
            .content {
                padding: 24px 16px;
            }
            .process-steps {
                grid-template-columns: 1fr;
            }
            .contact-info {
                flex-direction: column;
                gap: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-content">
                <div class="header-icon">
                    <span style="font-size: 28px;">✅</span>
                </div>
                <h1>Message Received</h1>
                <p>Thank you for contacting AccumaManage</p>
                <div class="ticket-badge">Ticket: ${ticketNumber}</div>
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-title">
                    📋 Your Inquiry Summary
                </div>
                <div class="summary-card">
                    <div class="summary-item">
                        <span class="summary-label">Name:</span>
                        <span class="summary-value">${data.name}</span>
                    </div>
                    ${data.subject ? `
                    <div class="summary-item">
                        <span class="summary-label">Subject:</span>
                        <span class="summary-value">${data.subject}</span>
                    </div>
                    ` : ''}
                    <div class="summary-item">
                        <span class="summary-label">Submitted:</span>
                        <span class="summary-value">${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Response Time:</span>
                        <span class="summary-value" style="color: #34a853;">● Within 24 hours</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">
                    🔄 What Happens Next
                </div>
                <div class="process-steps">
                    <div class="step">
                        <div class="step-icon">1️⃣</div>
                        <div class="step-title">Review</div>
                        <div class="step-desc">Our team will review your message and categorize it</div>
                    </div>
                    <div class="step">
                        <div class="step-icon">2️⃣</div>
                        <div class="step-title">Process</div>
                        <div class="step-desc">We'll assign it to the appropriate department</div>
                    </div>
                    <div class="step">
                        <div class="step-icon">3️⃣</div>
                        <div class="step-title">Respond</div>
                        <div class="step-desc">You'll receive a detailed response from our team</div>
                    </div>
                </div>
            </div>
            
            <div class="support-card">
                <div class="support-title">
                    ⚡ Need Immediate Assistance?
                </div>
                <div class="contact-info">
                    <div class="contact-item">
                        <span>📞</span>
                        <span>+91 93132 02038</span>
                    </div>
                    <div class="contact-item">
                        <span>📧</span>
                        <span>mehtaneer143@gmail.com</span>
                    </div>
                    <div class="contact-item">
                        <span>💬</span>
                        <span>WhatsApp: +91 93132 02038</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this message.</p>
            <p>If you need to add more information to your inquiry, please reply to the email thread.</p>
            <p>© ${new Date().getFullYear()} AccumaManage. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      `,
      text: `
THANK YOU FOR CONTACTING ACCUMAMANAGE
======================================

Dear ${data.name},

Thank you for reaching out to AccumaManage. We have received your inquiry and will get back to you shortly.

TICKET INFORMATION
------------------
Ticket Number: ${ticketNumber}
Date Submitted: ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
Estimated Response: Within 24 hours

WHAT HAPPENS NEXT?
------------------
1. Our team will review your message and categorize it
2. We'll assign it to the appropriate department  
3. You'll receive a detailed response from our team

YOUR INQUIRY SUMMARY
--------------------
- Name: ${data.name}
${data.subject ? `- Subject: ${data.subject}\n` : ''}
- Submitted: ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
- Response Time: Within 24 hours

⚡ NEED IMMEDIATE ASSISTANCE?
------------------------------
Phone: +91 93132 02038
Email: mehtaneer143@gmail.com
WhatsApp: +91 93132 02038

Thank you for choosing AccumaManage. We look forward to assisting you!

Best regards,
The AccumaManage Team

---
This is an automated confirmation email. Please do not reply to this message.
Ticket ID: ${ticketNumber}
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Auto-response sent to:', data.email);
    return true;
    
  } catch (error: any) {
    console.error('❌ Failed to send auto-response:', error.message);
    throw error;
  }
}

// GET endpoint for API testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'AccumaManage Contact API',
    endpoints: {
      POST: '/api/contact - Submit contact form',
    },
    environment: process.env.NODE_ENV,
    emailConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
    adminEmail: process.env.ADMIN_EMAIL,
    rateLimit: {
      window: '1 minute',
      maxRequests: MAX_REQUESTS_PER_WINDOW,
    },
  });
}
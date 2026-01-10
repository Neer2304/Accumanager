import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

interface MeetingInviteEmailProps {
  to: string;
  senderName: string;
  meetingTitle: string;
  meetingLink: string;
  meetingTime: Date;
  message?: string;
}

interface DirectMessageEmailProps {
  to: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
}

interface SystemNotificationEmailProps {
  to: string;
  subject: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface PasswordResetEmailProps {
  to: string;
  userName: string;
  resetLink: string;
  expiresIn: string;
}

interface WelcomeEmailProps {
  to: string;
  userName: string;
  loginLink: string;
}

export async function sendEmail({ to, subject, html, attachments }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: `"AccuManage" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      attachments,
    });
    console.log(`Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function sendMeetingInviteEmail({
  to,
  senderName,
  meetingTitle,
  meetingLink,
  meetingTime,
  message
}: MeetingInviteEmailProps) {
  try {
    const formattedTime = meetingTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meeting Invitation: ${meetingTitle}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            border-radius: 10px 10px 0 0;
          }
          .content {
            padding: 40px 30px;
            background: white;
          }
          .meeting-details {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            margin: 25px 0;
            border-left: 4px solid #667eea;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 10px;
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eaeaea;
          }
          .calendar-buttons {
            margin-top: 30px;
            text-align: center;
          }
          .calendar-button {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            margin: 5px;
          }
          @media (max-width: 600px) {
            .header, .content {
              padding: 25px 20px;
            }
            .button {
              display: block;
              margin: 15px 0;
              text-align: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">📅 Meeting Invitation</h1>
          <p style="opacity: 0.9; margin-top: 10px; font-size: 16px;">You're invited to join a video meeting</p>
        </div>
        
        <div class="content">
          <h2 style="color: #2d3748; margin-top: 0; margin-bottom: 20px; font-size: 24px;">${meetingTitle}</h2>
          
          <div class="meeting-details">
            <p style="margin: 10px 0;"><strong style="color: #4a5568;">👤 From:</strong> ${senderName}</p>
            <p style="margin: 10px 0;"><strong style="color: #4a5568;">⏰ Time:</strong> ${formattedTime}</p>
            <p style="margin: 10px 0;"><strong style="color: #4a5568;">🔗 Meeting Link:</strong></p>
            <p style="margin: 10px 0 20px 0;">
              <a href="${meetingLink}" style="color: #667eea; text-decoration: none; word-break: break-all;">
                ${meetingLink}
              </a>
            </p>
            ${message ? `<p style="margin: 10px 0;"><strong style="color: #4a5568;">💬 Message:</strong> ${message}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${meetingLink}" class="button">
              Join Meeting Now
            </a>
          </div>
          
          <div class="calendar-buttons">
            <p style="color: #718096; font-size: 14px; margin-bottom: 15px;">Add to your calendar:</p>
            <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meetingTitle)}&dates=${formatForGoogleCalendar(meetingTime)}&details=${encodeURIComponent(`Join meeting: ${meetingLink}`)}" 
               class="calendar-button" 
               target="_blank">
              Google Calendar
            </a>
            <a href="${generateOutlookCalendarLink(meetingTitle, meetingTime, meetingLink)}" 
               class="calendar-button" 
               target="_blank">
              Outlook Calendar
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">This invitation was sent via AccuManage Meeting System</p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #a0aec0;">
            © ${new Date().getFullYear()} AccuManage. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;

    return await sendEmail({
      to,
      subject: `Meeting Invitation: ${meetingTitle}`,
      html,
    });
  } catch (error) {
    console.error('Error sending meeting invite email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function sendDirectMessageEmail({
  to,
  senderName,
  senderEmail,
  subject,
  content
}: DirectMessageEmailProps) {
  try {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message: ${subject}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            border-radius: 10px 10px 0 0;
          }
          .content {
            padding: 40px 30px;
            background: white;
          }
          .message-box {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            margin: 25px 0;
            border-left: 4px solid #3b82f6;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 10px;
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eaeaea;
          }
          @media (max-width: 600px) {
            .header, .content {
              padding: 25px 20px;
            }
            .button {
              display: block;
              margin: 15px 0;
              text-align: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">✉️ New Message</h1>
          <p style="opacity: 0.9; margin-top: 10px; font-size: 16px;">You have a new message from ${senderName}</p>
        </div>
        
        <div class="content">
          <h2 style="color: #2d3748; margin-top: 0; margin-bottom: 20px; font-size: 24px;">${subject}</h2>
          
          <div class="message-box">
            <p style="margin: 10px 0;"><strong style="color: #4a5568;">👤 From:</strong> ${senderName}</p>
            <p style="margin: 10px 0;"><strong style="color: #4a5568;">📧 Sender Email:</strong> ${senderEmail}</p>
            <p style="margin: 10px 0;"><strong style="color: #4a5568;">📋 Subject:</strong> ${subject}</p>
            <div style="margin-top: 20px;">
              <p style="margin: 0 0 10px 0; color: #4a5568; font-weight: 600;">Message:</p>
              <div style="padding: 20px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                ${content.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL || 'https://accumanage.com'}/messages" class="button">
              View Message in AccuManage
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">This message was sent via AccuManage Messaging System</p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #a0aec0;">
            © ${new Date().getFullYear()} AccuManage. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;

    return await sendEmail({
      to,
      subject: `New Message: ${subject}`,
      html,
    });
  } catch (error) {
    console.error('Error sending direct message email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function sendSystemNotificationEmail({
  to,
  subject,
  content,
  type = 'info'
}: SystemNotificationEmailProps) {
  try {
    const typeColors = {
      info: { bg: '#3b82f6', light: '#dbeafe', border: '#93c5fd' },
      warning: { bg: '#f59e0b', light: '#fef3c7', border: '#fcd34d' },
      success: { bg: '#10b981', light: '#d1fae5', border: '#6ee7b7' },
      error: { bg: '#ef4444', light: '#fee2e2', border: '#fca5a5' }
    };

    const colors = typeColors[type];

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>System Notification: ${subject}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}80 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            border-radius: 10px 10px 0 0;
          }
          .content {
            padding: 40px 30px;
            background: white;
          }
          .notification-box {
            background: ${colors.light};
            padding: 25px;
            border-radius: 10px;
            margin: 25px 0;
            border-left: 4px solid ${colors.border};
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}80 100%);
            color: white;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 10px;
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px ${colors.bg}30;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eaeaea;
          }
          @media (max-width: 600px) {
            .header, .content {
              padding: 25px 20px;
            }
            .button {
              display: block;
              margin: 15px 0;
              text-align: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">
            ${type === 'info' ? 'ℹ️' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : '❌'} 
            System Notification
          </h1>
          <p style="opacity: 0.9; margin-top: 10px; font-size: 16px;">${subject}</p>
        </div>
        
        <div class="content">
          <div class="notification-box">
            <div style="font-size: 16px; line-height: 1.8;">
              ${content.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL || 'https://accumanage.com'}/dashboard" class="button">
              Go to Dashboard
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">This is an automated message from AccuManage System</p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #a0aec0;">
            © ${new Date().getFullYear()} AccuManage. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;

    return await sendEmail({
      to,
      subject: `System Notification: ${subject}`,
      html,
    });
  } catch (error) {
    console.error('Error sending system notification email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function sendPasswordResetEmail({
  to,
  userName,
  resetLink,
  expiresIn
}: PasswordResetEmailProps) {
  try {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            border-radius: 10px 10px 0 0;
          }
          .content {
            padding: 40px 30px;
            background: white;
          }
          .info-box {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            margin: 25px 0;
            border-left: 4px solid #8b5cf6;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 10px;
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
          }
          .warning {
            background: #fef3c7;
            border: 1px solid #fcd34d;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
            color: #92400e;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eaeaea;
          }
          @media (max-width: 600px) {
            .header, .content {
              padding: 25px 20px;
            }
            .button {
              display: block;
              margin: 15px 0;
              text-align: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">🔐 Password Reset Request</h1>
          <p style="opacity: 0.9; margin-top: 10px; font-size: 16px;">Reset your AccuManage password</p>
        </div>
        
        <div class="content">
          <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${userName},</p>
          <p style="margin: 0 0 20px 0; font-size: 16px;">We received a request to reset your password for your AccuManage account.</p>
          
          <div class="info-box">
            <p style="margin: 10px 0;"><strong style="color: #4a5568;">📧 Account:</strong> ${to}</p>
            <p style="margin: 10px 0;"><strong style="color: #4a5568;">⏰ Link Expires:</strong> ${expiresIn}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${resetLink}" class="button">
              Reset Password
            </a>
          </div>
          
          <div class="warning">
            <p style="margin: 0; font-weight: 600;">⚠️ Security Notice:</p>
            <p style="margin: 5px 0 0 0;">
              If you didn't request this password reset, please ignore this email. 
              The reset link will expire in 1 hour for security reasons.
            </p>
          </div>
          
          <p style="margin: 20px 0 0 0; font-size: 14px; color: #718096;">
            For security reasons, this link can only be used once and will expire after 1 hour.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">This is an automated security email from AccuManage</p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #a0aec0;">
            © ${new Date().getFullYear()} AccuManage. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;

    return await sendEmail({
      to,
      subject: 'Password Reset Request - AccuManage',
      html,
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function sendWelcomeEmail({
  to,
  userName,
  loginLink
}: WelcomeEmailProps) {
  try {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AccuManage!</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            border-radius: 10px 10px 0 0;
          }
          .content {
            padding: 40px 30px;
            background: white;
          }
          .features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 25px 0;
          }
          .feature {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e2e8f0;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 10px;
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eaeaea;
          }
          @media (max-width: 600px) {
            .header, .content {
              padding: 25px 20px;
            }
            .features {
              grid-template-columns: 1fr;
            }
            .button {
              display: block;
              margin: 15px 0;
              text-align: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 32px; font-weight: 600;">🎉 Welcome to AccuManage!</h1>
          <p style="opacity: 0.9; margin-top: 10px; font-size: 18px;">Your journey to efficient meeting management starts here</p>
        </div>
        
        <div class="content">
          <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${userName},</p>
          <p style="margin: 0 0 25px 0; font-size: 16px;">
            Welcome to AccuManage! We're excited to have you on board. 
            Get ready to transform your meeting and collaboration experience.
          </p>
          
          <h3 style="color: #2d3748; margin-bottom: 15px;">✨ What you can do with AccuManage:</h3>
          <div class="features">
            <div class="feature">
              <div style="font-size: 24px; margin-bottom: 8px;">📹</div>
              <div style="font-weight: 600; font-size: 14px;">Video Meetings</div>
            </div>
            <div class="feature">
              <div style="font-size: 24px; margin-bottom: 8px;">📝</div>
              <div style="font-weight: 600; font-size: 14px;">Meeting Notes</div>
            </div>
            <div class="feature">
              <div style="font-size: 24px; margin-bottom: 8px;">📅</div>
              <div style="font-weight: 600; font-size: 14px;">Calendar Sync</div>
            </div>
            <div class="feature">
              <div style="font-size: 24px; margin-bottom: 8px;">🤝</div>
              <div style="font-weight: 600; font-size: 14px;">Team Collaboration</div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${loginLink}" class="button">
              Get Started Now
            </a>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #4a5568;">Need help getting started?</p>
            <p style="margin: 0; font-size: 14px; color: #718096;">
              Check out our <a href="${process.env.NEXTAUTH_URL || 'https://accumanage.com'}/help" style="color: #10b981;">help center</a> 
              or contact our support team at <a href="mailto:support@accumanage.com" style="color: #10b981;">support@accumanage.com</a>
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">Thank you for choosing AccuManage!</p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #a0aec0;">
            © ${new Date().getFullYear()} AccuManage. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;

    return await sendEmail({
      to,
      subject: 'Welcome to AccuManage! 🎉',
      html,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Helper functions for calendar integration
function formatForGoogleCalendar(date: Date): string {
  const start = new Date(date);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration
  
  const format = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  return `${format(start)}/${format(end)}`;
}

function generateOutlookCalendarLink(title: string, date: Date, link: string): string {
  const start = new Date(date);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration
  
  const format = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0];
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${format(start)}&enddt=${format(end)}&body=${encodeURIComponent(`Join meeting: ${link}`)}`;
}

// Batch email sending
export async function sendBulkEmails(emails: EmailOptions[]): Promise<Array<{ success: boolean; to: string; error?: string }>> {
  const results = [];
  
  for (const email of emails) {
    try {
      const result = await sendEmail(email);
      results.push({ success: result.success, to: Array.isArray(email.to) ? email.to.join(', ') : email.to, error: result.error });
    } catch (error) {
      results.push({ 
        success: false, 
        to: Array.isArray(email.to) ? email.to.join(', ') : email.to,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
  
  return results;
}

// Email verification
export async function sendVerificationEmail(to: string, verificationLink: string, userName: string) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - AccuManage</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f8f9fa;
        }
        .header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
          border-radius: 10px 10px 0 0;
        }
        .content {
          padding: 40px 30px;
          background: white;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 15px 35px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
          margin: 10px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 14px;
          border-top: 1px solid #eaeaea;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">✅ Verify Your Email</h1>
        <p style="opacity: 0.9; margin-top: 10px; font-size: 16px;">Complete your AccuManage registration</p>
      </div>
      
      <div class="content">
        <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${userName},</p>
        <p style="margin: 0 0 20px 0; font-size: 16px;">
          Thank you for registering with AccuManage! Please verify your email address by clicking the button below:
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${verificationLink}" class="button">
            Verify Email Address
          </a>
        </div>
        
        <p style="margin: 30px 0 0 0; font-size: 14px; color: #718096;">
          If you didn't create an account with AccuManage, you can safely ignore this email.
        </p>
      </div>
      
      <div class="footer">
        <p style="margin: 0;">This is an automated verification email from AccuManage</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #a0aec0;">
          © ${new Date().getFullYear()} AccuManage. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to,
    subject: 'Verify Your Email - AccuManage',
    html,
  });
}

export default {
  sendEmail,
  sendMeetingInviteEmail,
  sendDirectMessageEmail,
  sendSystemNotificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendBulkEmails,
};
// lib/email.ts
import nodemailer from 'nodemailer';

// ── Singleton transporter (pool for efficiency) ───────────────────────────────
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter;

  console.log('🔧 Creating new email transporter...');
  console.log('📧 SMTP Config:', {
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: process.env.SMTP_PORT || '587',
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER ? '✅ Present' : '❌ Missing',
    pass: process.env.SMTP_PASSWORD ? '✅ Present' : '❌ Missing',
    from: process.env.SMTP_FROM || '❌ Using default'
  });

  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error('❌ SMTP credentials missing!');
    throw new Error('SMTP_USER and SMTP_PASSWORD must be set in environment variables.');
  }

  try {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      pool: true,
      maxConnections: 5,
      rateLimit: 5,
      rateDelta: 1000,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
      debug: true,
      logger: true,
    });

    // Verify connection
    _transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP Connection Error:', {
          message: error.message,
          code: error.code,
          command: error.command
        });
      } else {
        console.log('✅ SMTP Server is ready to send emails');
      }
    });

    return _transporter;

  } catch (error) {
    console.error('❌ Failed to create transporter:', error);
    throw error;
  }
}

// ── Core send function ────────────────────────────────────────────────────────
export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  console.log('📧 Attempting to send email:', {
    to: opts.to,
    subject: opts.subject,
    timestamp: new Date().toISOString()
  });

  try {
    const transporter = getTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM || '"AccumaManage" <noreply@accumamanage.com>',
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text ?? opts.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    };

    console.log('📧 Mail options prepared:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      htmlLength: mailOptions.html.length
    });

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
      envelope: info.envelope
    });

    if (info.rejected && info.rejected.length > 0) {
      console.error('❌ Email rejected for:', info.rejected);
    }

    if (info.accepted.includes(opts.to)) {
      console.log('⚠️ Email was accepted by server. Please check:');
      console.log('   - SPAM/Junk folder');
      console.log('   - Promotions tab (Gmail)');
      console.log('   - Other folders');
    }

  } catch (error: any) {
    console.error('❌ Failed to send email:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML TEMPLATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function emailShell(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>AccumaManage</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">

        <!-- Header / Logo -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a73e8 0%,#0d47a1 100%);border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">AccumaManage</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.65);letter-spacing:0.12em;text-transform:uppercase;margin-top:4px;">
              Business Management Suite
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px 40px 32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7;">
              If you did not request this email, you can safely ignore it.<br/>
              &copy; ${new Date().getFullYear()} AccumaManage. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

function otpBlock(otp: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr><td align="center">
        <div style="display:inline-block;background:#f0f9ff;border:2px dashed #93c5fd;border-radius:14px;padding:20px 40px;text-align:center;">
          <div style="font-size:11px;font-weight:700;color:#475569;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px;">
            Verification Code
          </div>
          <div style="font-size:40px;font-weight:900;color:#1a73e8;letter-spacing:12px;font-family:'Courier New',monospace;">
            ${otp}
          </div>
          <div style="font-size:12px;color:#94a3b8;margin-top:10px;">
            Expires in <strong style="color:#ef4444;">10 minutes</strong>
          </div>
        </div>
      </td></tr>
    </table>`;
}

function alertBlock(borderColor: string, bg: string, html: string): string {
  return `
    <div style="background:${bg};border-left:4px solid ${borderColor};border-radius:0 8px 8px 0;padding:14px 18px;margin-top:16px;">
      <p style="margin:0;font-size:13px;color:#374151;line-height:1.65;">${html}</p>
    </div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. EMAIL VERIFICATION OTP
// ─────────────────────────────────────────────────────────────────────────────
export async function sendEmailVerificationOTP(
  to: string,
  name: string,
  otp: string,
): Promise<void> {
  console.log('📧 Preparing email verification OTP for:', { to, name });
  
  try {
    await sendEmail({
      to,
      subject: `[${otp}] Verify your AccumaManage account`,
      html: emailShell(`
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
          Verify your email ✉️
        </h1>
        <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
          Hi <strong style="color:#0f172a;">${name}</strong>, welcome to AccumaManage!<br/>
          Enter the code below to verify your email address and activate your
          <strong style="color:#1a73e8;">free 14-day trial</strong>.
        </p>

        ${otpBlock(otp)}

        ${alertBlock(
          '#f59e0b', '#fffbeb',
          '⚠️ <strong>Security tip:</strong> AccumaManage staff will <em>never</em> ask for this code. Do not share it with anyone.',
        )}
      `),
    });
    
    console.log('✅ Email verification OTP sent successfully to:', to);
  } catch (error) {
    console.error('❌ Failed to send email verification OTP:', error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. FORGOT PASSWORD OTP
// ─────────────────────────────────────────────────────────────────────────────
export async function sendPasswordResetOTP(
  to: string,
  name: string,
  otp: string,
): Promise<void> {
  console.log('📧 Preparing password reset OTP for:', { to, name });
  
  try {
    await sendEmail({
      to,
      subject: `[${otp}] Reset your AccumaManage password`,
      html: emailShell(`
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
          Reset your password 🔑
        </h1>
        <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
          Hi <strong style="color:#0f172a;">${name}</strong>,
          we received a request to reset the password for your AccumaManage account.
          Enter the code below — it expires in <strong style="color:#ef4444;">10 minutes</strong>.
        </p>

        ${otpBlock(otp)}

        ${alertBlock(
          '#ef4444', '#fef2f2',
          "🔒 <strong>Didn't request this?</strong> Ignore this email — your password will not change. If you believe your account is at risk, contact support immediately.",
        )}
      `),
    });
    
    console.log('✅ Password reset OTP sent successfully to:', to);
  } catch (error) {
    console.error('❌ Failed to send password reset OTP:', error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PASSWORD CHANGED CONFIRMATION
// ─────────────────────────────────────────────────────────────────────────────
export async function sendPasswordChangedConfirmation(
  to: string,
  name: string,
): Promise<void> {
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  console.log('📧 Preparing password changed confirmation for:', { to, name });

  try {
    await sendEmail({
      to,
      subject: 'Your AccumaManage password has been changed',
      html: emailShell(`
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
          Password updated ✅
        </h1>
        <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
          Hi <strong style="color:#0f172a;">${name}</strong>,
          the password for your AccumaManage account was successfully changed on
          <strong style="color:#0f172a;">${timestamp} IST</strong>.
        </p>

        ${alertBlock('#22c55e', '#f0fdf4', '✅ If you made this change, no further action is required.')}

        ${alertBlock(
          '#ef4444', '#fef2f2',
          `⚠️ <strong>Wasn't you?</strong> Contact us immediately at
          <a href="mailto:${process.env.ADMIN_EMAIL || 'support@accumamanage.com'}" style="color:#1a73e8;">${process.env.ADMIN_EMAIL || 'support@accumamanage.com'}</a>
          to secure your account.`,
        )}
      `),
    });
    
    console.log('✅ Password changed confirmation sent successfully to:', to);
  } catch (error) {
    console.error('❌ Failed to send password changed confirmation:', error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. WELCOME EMAIL (sent after email verified)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(
  to: string,
  name: string,
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://accumamanage.com';

  console.log('📧 Preparing welcome email for:', { to, name });

  const features = [
    ['📦', 'Inventory Management', 'Track products, stock levels & low-stock alerts'],
    ['👥', 'Customer Management', 'Centralised customer records & history'],
    ['🧾', 'GST Invoicing', 'GST-compliant invoices generated in seconds'],
    ['📊', 'Advanced Reporting', 'Business insights that help you grow'],
  ];

  try {
    await sendEmail({
      to,
      subject: `Welcome to AccumaManage, ${name}! 🎉`,
      html: emailShell(`
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
          You're all set, ${name}! 🎉
        </h1>
        <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
          Your email is verified and your <strong style="color:#1a73e8;">free 14-day trial</strong>
          is now active. Here's what you can explore:
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${features.map(([icon, title, desc]) => `
            <tr>
              <td style="padding:5px 0;">
                <table role="presentation" width="100%" cellpadding="12" cellspacing="0"
                       style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
                  <tr>
                    <td width="34" style="font-size:20px;vertical-align:top;">${icon}</td>
                    <td style="vertical-align:top;">
                      <div style="font-size:14px;font-weight:700;color:#0f172a;">${title}</div>
                      <div style="font-size:13px;color:#64748b;margin-top:2px;">${desc}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          `).join('')}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
          <tr><td align="center">
            <a href="${appUrl}/dashboard"
               style="display:inline-block;background:linear-gradient(135deg,#1a73e8,#1557b0);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:10px;">
              Go to Dashboard →
            </a>
          </td></tr>
        </table>
      `),
    });
    
    console.log('✅ Welcome email sent successfully to:', to);
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw error;
  }
}
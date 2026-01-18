// app/api/contact/route.ts - ENHANCED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Contact from '@/models/Contact';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import { validateContactForm } from '@/lib/validators/contact';
import { rateLimit } from '@/lib/rate-limit';
import { getClientInfo } from '@/lib/client-info';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  try {
    console.log('📨 POST /api/contact - Starting...');

    // Check rate limit
    const identifier = request.ip || '127.0.0.1';
    const isRateLimited = await limiter.check(identifier, 10); // 10 requests per minute
    
    if (isRateLimited) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many requests. Please try again later.' 
        }, 
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate form data
    const validation = validateContactForm(body);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          message: validation.message,
          errors: validation.errors 
        }, 
        { status: 400 }
      );
    }

    // Get client information
    const clientInfo = await getClientInfo(request);
    
    // Check for spam (basic check)
    if (await isSpam(body, clientInfo)) {
      console.log('🚫 Spam detected:', body.email);
      
      // Still save as spam for monitoring
      await saveAsSpam(body, clientInfo);
      
      return NextResponse.json({
        success: true, // Return success even for spam to avoid revealing spam detection
        message: 'Thank you for your message! We will get back to you soon.',
      }, { status: 200 });
    }

    await connectToDatabase();
    console.log('✅ Database connected for contact submission');

    // Create contact record
    const contact = new Contact({
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      subject: body.subject,
      message: body.message,
      source: 'website',
      priority: calculatePriority(body),
      metadata: {
        ipAddress: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        referrer: clientInfo.referrer,
        pageUrl: clientInfo.pageUrl,
        formId: body.formId || 'contact-page',
        browser: clientInfo.browser,
        location: clientInfo.location,
      },
      tags: generateTags(body),
    });

    await contact.save();
    console.log('✅ Contact saved to database:', contact._id);

    // Send notifications
    await Promise.allSettled([
      sendAdminNotification(contact),
      sendAutoResponse(contact),
      assignToTeamMember(contact),
    ]);

    console.log('✅ Contact submission completed successfully');
    
    // Track in analytics (if you have analytics setup)
    trackContactEvent(contact);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      data: {
        id: contact._id,
        ticketNumber: generateTicketNumber(contact._id),
        estimatedResponseTime: '24 hours',
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Contact submission error:', error);
    
    // Log error to monitoring service
    logError(error, request);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to submit contact form. Please try again later.',
      supportContact: 'support@accumanage.com',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Helper functions
async function isSpam(data: any, clientInfo: any): Promise<boolean> {
  // Basic spam detection rules
  const spamKeywords = ['viagra', 'casino', 'lottery', '$$$', 'http://', 'https://'];
  const message = `${data.name} ${data.email} ${data.message}`.toLowerCase();
  
  // Check for spam keywords
  if (spamKeywords.some(keyword => message.includes(keyword))) {
    return true;
  }
  
  // Check for excessive links
  const linkCount = (message.match(/http/g) || []).length;
  if (linkCount > 3) {
    return true;
  }
  
  // Check for suspicious email patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(data.email)) {
    return true;
  }
  
  // Check recent submissions from same IP
  if (clientInfo.ip) {
    const recentSubmissions = await Contact.countDocuments({
      'metadata.ipAddress': clientInfo.ip,
      createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
    });
    
    if (recentSubmissions > 5) {
      return true;
    }
  }
  
  return false;
}

async function saveAsSpam(data: any, clientInfo: any) {
  try {
    await connectToDatabase();
    
    const spamContact = new Contact({
      ...data,
      status: 'spam',
      source: 'website',
      priority: 'low',
      metadata: {
        ipAddress: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        referrer: clientInfo.referrer,
        browser: clientInfo.browser,
      },
      tags: ['spam', 'auto-detected'],
    });
    
    await spamContact.save();
    console.log('🚫 Spam saved:', spamContact._id);
  } catch (error) {
    console.error('Failed to save spam:', error);
  }
}

function calculatePriority(data: any): 'low' | 'medium' | 'high' | 'urgent' {
  const urgentKeywords = ['urgent', 'emergency', 'critical', 'asap', 'help'];
  const message = data.message.toLowerCase();
  
  if (urgentKeywords.some(keyword => message.includes(keyword))) {
    return 'urgent';
  }
  
  if (data.subject?.toLowerCase().includes('sales') || data.subject?.toLowerCase().includes('quote')) {
    return 'high';
  }
  
  return 'medium';
}

function generateTags(data: any): string[] {
  const tags = [];
  
  if (data.company) tags.push('business');
  if (data.subject?.toLowerCase().includes('support')) tags.push('support');
  if (data.subject?.toLowerCase().includes('sales')) tags.push('sales');
  if (data.subject?.toLowerCase().includes('partnership')) tags.push('partnership');
  
  return tags;
}

function generateTicketNumber(id: any): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ACC-${timestamp}-${random}`;
}

async function assignToTeamMember(contact: any) {
  try {
    // Find available support team member
    const teamMember = await User.findOne({
      role: { $in: ['admin', 'support'] },
      'subscription.status': 'active',
      isActive: true,
    }).sort({ 'screenTime.totalHours': 1 }); // Assign to least busy team member
    
    if (teamMember) {
      contact.assignedTo = teamMember._id;
      contact.followUpDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await contact.save();
      
      // Send notification to assigned team member
      await sendAssignmentNotification(contact, teamMember);
    }
  } catch (error) {
    console.error('Failed to assign team member:', error);
  }
}

async function sendAssignmentNotification(contact: any, teamMember: any) {
  // Implementation for internal notification system
  // Could be email, Slack webhook, or internal notification
  console.log(`📋 Assigned contact ${contact._id} to ${teamMember.email}`);
}

function trackContactEvent(contact: any) {
  // Integrate with your analytics service (Google Analytics, Mixpanel, etc.)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'contact_submission', {
      event_category: 'engagement',
      event_label: contact.source,
      value: 1
    });
  }
}

function logError(error: any, request: NextRequest) {
  // Log to your error monitoring service (Sentry, LogRocket, etc.)
  console.error('Contact Form Error:', {
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
  });
}

// Export other HTTP methods
export async function GET(request: NextRequest) {
  // Add authentication for admin access
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const skip = (page - 1) * limit;
    
    const query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('assignedTo', 'name email')
        .lean(),
      Contact.countDocuments(query),
    ]);
    
    const stats = await Contact.getStats();
    
    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });
    
  } catch (error: any) {
    console.error('GET contacts error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Update contact status (admin only)
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { id, status, assignedTo, tags, notes } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Contact ID required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (tags) updateData.tags = tags;
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');
    
    if (!contact) {
      return NextResponse.json(
        { success: false, message: 'Contact not found' },
        { status: 404 }
      );
    }
    
    // Add note if provided
    if (notes) {
      contact.addCommunication('note', 'outgoing', notes);
      await contact.save();
    }
    
    return NextResponse.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    });
    
  } catch (error: any) {
    console.error('UPDATE contact error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update contact' },
      { status: 500 }
    );
  }
}
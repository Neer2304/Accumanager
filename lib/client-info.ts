// lib/client-info.ts
import { NextRequest, NextResponse } from 'next/server';

export interface ClientInfo {
  ip: string;
  userAgent: string;
  referrer?: string;
  pageUrl?: string;
  browser: {
    name?: string;
    version?: string;
    os?: string;
    device?: string;
  };
  location?: {
    country?: string;
    city?: string;
    region?: string;
    timezone?: string;
  };
}

export async function getClientInfo(request: NextRequest): Promise<ClientInfo> {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             request.ip || 
             'unknown';
  
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referrer = request.headers.get('referer');
  
  // Parse user agent
  const browserInfo = parseUserAgent(userAgent);
  
  // Get location from IP (you can integrate with IP geolocation service)
  const location = await getLocationFromIP(ip);
  
  return {
    ip,
    userAgent,
    referrer,
    pageUrl: request.headers.get('origin') || request.url,
    browser: browserInfo,
    location,
  };
}

function parseUserAgent(userAgent: string) {
  // Simplified user agent parsing
  // In production, use a library like 'ua-parser-js'
  const browser: any = {};
  
  if (userAgent.includes('Chrome')) browser.name = 'Chrome';
  else if (userAgent.includes('Firefox')) browser.name = 'Firefox';
  else if (userAgent.includes('Safari')) browser.name = 'Safari';
  else if (userAgent.includes('Edge')) browser.name = 'Edge';
  
  if (userAgent.includes('Windows')) browser.os = 'Windows';
  else if (userAgent.includes('Mac')) browser.os = 'macOS';
  else if (userAgent.includes('Linux')) browser.os = 'Linux';
  else if (userAgent.includes('Android')) browser.os = 'Android';
  else if (userAgent.includes('iOS')) browser.os = 'iOS';
  
  if (userAgent.includes('Mobile')) browser.device = 'Mobile';
  else if (userAgent.includes('Tablet')) browser.device = 'Tablet';
  else browser.device = 'Desktop';
  
  return browser;
}

async function getLocationFromIP(ip: string) {
  // In production, use a service like ipapi.co, ipinfo.io, or MaxMind
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'unknown') {
    return undefined;
  }
  
  try {
    // Example with ipinfo.io (free tier available)
    if (process.env.IPINFO_TOKEN) {
      const response = await fetch(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`);
      const data = await response.json();
      
      return {
        country: data.country,
        city: data.city,
        region: data.region,
        timezone: data.timezone,
      };
    }
  } catch (error) {
    console.error('Failed to get location from IP:', error);
  }
  
  return undefined;
}
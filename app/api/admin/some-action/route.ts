import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const token = (await cookies()).get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'No Token' }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    
    // Check role again for sensitive DB actions
    if (decoded.role !== 'superadmin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Now do your Database work...
    return NextResponse.json({ success: true });
    
  } catch (err) {
    return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
  }
}
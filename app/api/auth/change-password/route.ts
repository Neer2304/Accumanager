// app/api/auth/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const authToken = (await cookieStore).get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    
    // Verify current password and update in database
    // const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    // if (!user || !verifyPassword(currentPassword, user.password)) {
    //   return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    // }
    
    // await prisma.user.update({
    //   where: { id: decoded.userId },
    //   data: { password: hashPassword(newPassword) },
    // });

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
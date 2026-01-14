import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/jwt';

// GET /api/note/search - Search notes
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Please provide a search query'
      });
    }

    const notes = await Notes.find({
      $or: [
        { userId: decoded.userId },
        { 'sharedWith.userId': decoded.userId }
      ],
      status: { $ne: 'deleted' },
      $text: { $search: query }
    })
    .select('title content summary category priority tags createdAt updatedAt')
    .limit(limit)
    .sort({ score: { $meta: 'textScore' } })
    .lean();

    return NextResponse.json({
      success: true,
      data: notes,
      count: notes.length
    });

  } catch (error: any) {
    console.error('Search notes error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
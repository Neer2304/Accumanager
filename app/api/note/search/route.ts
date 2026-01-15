import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/note/search - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('🔍 Search query:', query);

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Please provide a search query'
      });
    }

    // Import mongoose for ObjectId
    const mongoose = await import('mongoose');

    const notes = await Notes.find({
      $or: [
        { userId: new mongoose.Types.ObjectId(decoded.userId) },
        { 'sharedWith.userId': new mongoose.Types.ObjectId(decoded.userId) }
      ],
      status: { $ne: 'deleted' },
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { summary: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    })
    .select('title content summary category priority tags createdAt updatedAt')
    .limit(limit)
    .sort({ updatedAt: -1 })
    .lean();

    console.log(`✅ Found ${notes.length} matching notes`);

    return NextResponse.json({
      success: true,
      data: notes,
      count: notes.length
    });

  } catch (error: any) {
    console.error('❌ Search notes error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
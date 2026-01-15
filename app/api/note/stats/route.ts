import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/note/stats - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      console.log('❌ No auth token');
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    console.log('👤 User ID:', decoded.userId);
    
    await connectToDatabase();
    console.log('✅ Database connected');

    // Import mongoose for ObjectId
    const mongoose = await import('mongoose');

    // Get basic counts without complex aggregation
    const totalNotes = await Notes.countDocuments({
      userId: new mongoose.Types.ObjectId(decoded.userId),
      status: { $ne: 'deleted' }
    });

    const notes = await Notes.find({
      userId: new mongoose.Types.ObjectId(decoded.userId),
      status: { $ne: 'deleted' }
    }).select('category priority status wordCount updatedAt title tags createdAt');

    console.log(`📊 Found ${notes.length} notes for stats`);

    // Calculate stats manually
    const categories: Record<string, number> = {};
    const priorities: Record<string, number> = {};
    const statuses: Record<string, number> = {};
    let totalWords = 0;
    const tags: Record<string, number> = {};

    notes.forEach(note => {
      // Category stats
      categories[note.category] = (categories[note.category] || 0) + 1;
      
      // Priority stats
      priorities[note.priority] = (priorities[note.priority] || 0) + 1;
      
      // Status stats
      statuses[note.status] = (statuses[note.status] || 0) + 1;
      
      // Word count
      totalWords += note.wordCount || 0;
      
      // Tags
      note.tags?.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1;
      });
    });

    // Recent activity (last 10 updated notes)
    const recentActivity = notes
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
      .map(note => ({
        _id: note._id,
        title: note.title,
        category: note.category,
        priority: note.priority,
        updatedAt: note.updatedAt,
        editCount: 0,
        readCount: 0
      }));

    // Daily notes created last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyNotesMap: Record<string, number> = {};
    notes.forEach(note => {
      const date = new Date(note.createdAt).toISOString().split('T')[0];
      if (new Date(note.createdAt) >= sevenDaysAgo) {
        dailyNotesMap[date] = (dailyNotesMap[date] || 0) + 1;
      }
    });

    const dailyNotes = Object.entries(dailyNotesMap).map(([_id, count]) => ({ _id, count }))
      .sort((a, b) => a._id.localeCompare(b._id));

    // Prepare summary
    const summary = {
      totalNotes,
      totalWords,
      avgWords: totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0,
      categories: Object.entries(categories).map(([_id, count]) => ({ _id, count })),
      priorities: Object.entries(priorities).map(([_id, count]) => ({ _id, count })),
      statuses: Object.entries(statuses).map(([_id, count]) => ({ _id, count })),
      recentActivity,
      dailyNotes,
      topTags: Object.entries(tags)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }))
    };

    console.log('✅ Stats calculated successfully');

    return NextResponse.json({
      success: true,
      data: summary
    });

  } catch (error: any) {
    console.error('❌ Get note stats error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
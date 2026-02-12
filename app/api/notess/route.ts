// app/api/notes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Note from '@/models/Notess';
import UserCompany from '@/models/UserCompany';
import { NotificationService } from '@/services/notificationService';

// ✅ GET NOTES
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/notes - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const userCompany = await UserCompany.findOne({
        userId: decoded.userId,
        isDefault: true,
        status: 'active'
      });

      if (!userCompany) {
        return NextResponse.json(
          { success: false, error: 'No active company found' },
          { status: 403 }
        );
      }

      const { searchParams } = new URL(request.url);
      const entityType = searchParams.get('entityType');
      const entityId = searchParams.get('entityId');
      const limit = parseInt(searchParams.get('limit') || '50');

      let query: any = { 
        companyId: userCompany.companyId,
        $or: [
          { userId: decoded.userId },
          { isPrivate: false },
          { 'sharedWith.userId': decoded.userId }
        ]
      };

      if (entityType && entityId) {
        query.entityType = entityType;
        query.entityId = entityId;
      }

      const notes = await Note.find(query)
        .sort({ isPinned: -1, createdAt: -1 })
        .limit(limit)
        .lean();

      return NextResponse.json({ 
        success: true,
        notes
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get notes error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ CREATE NOTE
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/notes - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const userCompany = await UserCompany.findOne({
        userId: decoded.userId,
        isDefault: true,
        status: 'active'
      });

      if (!userCompany) {
        return NextResponse.json(
          { success: false, error: 'No active company found' },
          { status: 403 }
        );
      }

      const noteData = await request.json();

      if (!noteData.content || !noteData.entityType || !noteData.entityId || !noteData.entityName) {
        return NextResponse.json(
          { success: false, error: 'Content, entity type, entity ID, and entity name are required' },
          { status: 400 }
        );
      }

      const note = new Note({
        ...noteData,
        companyId: userCompany.companyId,
        userId: decoded.userId,
        createdBy: decoded.userId,
        createdByName: decoded.name || 'Unknown',
        isPinned: noteData.isPinned || false,
        isPrivate: noteData.isPrivate || false,
        type: noteData.type || 'general'
      });

      await note.save();

      // Notify mentioned users
      if (noteData.mentions && noteData.mentions.length > 0) {
        try {
          for (const mention of noteData.mentions) {
            await NotificationService.notifyUserMentioned(
              note,
              mention.userId,
              decoded.userId
            );
          }
        } catch (notifError) {
          console.error('⚠️ Failed to send mention notifications:', notifError);
        }
      }

      console.log('✅ Note created:', note._id);
      return NextResponse.json({ success: true, note }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create note error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
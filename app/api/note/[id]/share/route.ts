import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/jwt';
import { z } from 'zod';
import mongoose from 'mongoose';

const shareNoteSchema = z.object({
  userIds: z.array(z.string()),
  role: z.enum(['viewer', 'editor', 'commenter']).default('viewer')
});

// POST /api/note/[id]/share - Share note with users
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    // Check if note exists and user is owner
    const note = await Notes.findOne({
      _id: params.id,
      userId: decoded.userId,
      status: { $ne: 'deleted' }
    });

    if (!note) {
      return NextResponse.json(
        { success: false, message: 'Note not found or no permission' }, 
        { status: 404 }
      );
    }

    // Validate request
    const body = await request.json();
    const { userIds, role } = shareNoteSchema.parse(body);

    // Convert user IDs to ObjectId
    const validUserIds = userIds
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    // Remove current user if present
    const filteredUserIds = validUserIds.filter(
      id => id.toString() !== decoded.userId
    );

    if (filteredUserIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid users to share with' },
        { status: 400 }
      );
    }

    // Prepare shared users data
    const sharedUsers = filteredUserIds.map(userId => ({
      userId,
      role,
      addedAt: new Date()
    }));

    // Update note with shared users
    const updatedNote = await Notes.findByIdAndUpdate(
      params.id,
      {
        $addToSet: {
          sharedWith: { $each: sharedUsers }
        }
      },
      { new: true }
    ).select('-versions -encryptionKey -passwordHash');

    return NextResponse.json({
      success: true,
      message: `Note shared with ${filteredUserIds.length} user(s)`,
      data: updatedNote
    });

  } catch (error: any) {
    console.error('Share note error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
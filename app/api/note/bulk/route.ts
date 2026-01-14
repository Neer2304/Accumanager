import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/jwt';
import { z } from 'zod';

const bulkActionSchema = z.object({
  noteIds: z.array(z.string()),
  action: z.enum(['archive', 'delete', 'restore', 'changeCategory', 'changePriority']),
  data: z.record(z.any()).optional()
});

// POST /api/note/bulk - Bulk actions on notes
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    const body = await request.json();
    const { noteIds, action, data } = bulkActionSchema.parse(body);

    // Filter valid note IDs
    const validNoteIds = noteIds.filter(id => 
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validNoteIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid note IDs provided' },
        { status: 400 }
      );
    }

    let updateQuery: any = {};
    let message = '';

    switch (action) {
      case 'archive':
        updateQuery = { status: 'archived', archivedAt: new Date() };
        message = `${validNoteIds.length} note(s) archived`;
        break;
      case 'delete':
        updateQuery = { status: 'deleted', deletedAt: new Date() };
        message = `${validNoteIds.length} note(s) deleted`;
        break;
      case 'restore':
        updateQuery = { status: 'active', $unset: { deletedAt: 1, archivedAt: 1 } };
        message = `${validNoteIds.length} note(s) restored`;
        break;
      case 'changeCategory':
        if (!data?.category) {
          return NextResponse.json(
            { success: false, message: 'Category is required' },
            { status: 400 }
          );
        }
        updateQuery = { category: data.category };
        message = `${validNoteIds.length} note(s) category updated`;
        break;
      case 'changePriority':
        if (!data?.priority) {
          return NextResponse.json(
            { success: false, message: 'Priority is required' },
            { status: 400 }
          );
        }
        updateQuery = { priority: data.priority };
        message = `${validNoteIds.length} note(s) priority updated`;
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update notes
    const result = await Notes.updateMany(
      {
        _id: { $in: validNoteIds },
        userId: decoded.userId
      },
      updateQuery
    );

    return NextResponse.json({
      success: true,
      message,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });

  } catch (error: any) {
    console.error('Bulk action error:', error);
    
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
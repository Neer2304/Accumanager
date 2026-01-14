import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/jwt';
import { z } from 'zod';

// GET /api/note/[id] - Get single note
export async function GET(
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

    const note = await Notes.findOne({
      _id: params.id,
      $or: [
        { userId: decoded.userId },
        { 'sharedWith.userId': decoded.userId },
        { isPublic: true }
      ],
      status: { $ne: 'deleted' }
    }).select('-encryptionKey -passwordHash');

    if (!note) {
      return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });
    }

    // Check password if protected
    if (note.passwordProtected) {
      const password = request.headers.get('x-note-password');
      if (!password) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Password required', 
            requiresPassword: true 
          },
          { status: 403 }
        );
      }

      const bcrypt = await import('bcryptjs');
      const isValid = await bcrypt.compare(password, note.passwordHash || '');
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid password' },
          { status: 403 }
        );
      }
    }

    // Increment read count
    await Notes.findByIdAndUpdate(note._id, {
      $inc: { readCount: 1 },
      $set: { lastReadAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      data: note
    });

  } catch (error: any) {
    console.error('Get note error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/note/[id] - Update note
export async function PUT(
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

    // Check permission
    const existingNote = await Notes.findOne({
      _id: params.id,
      $or: [
        { userId: decoded.userId },
        { 
          'sharedWith.userId': decoded.userId,
          'sharedWith.role': { $in: ['editor', 'owner'] }
        }
      ]
    });

    if (!existingNote) {
      return NextResponse.json(
        { success: false, message: 'Note not found or no permission' }, 
        { status: 404 }
      );
    }

    // Validate update
    const body = await request.json();
    const updateNoteSchema = z.object({
      title: z.string().min(1).max(200).optional(),
      content: z.string().min(1).optional(),
      summary: z.string().max(500).optional(),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
      color: z.string().optional(),
      icon: z.string().optional(),
      status: z.enum(['draft', 'active', 'archived', 'deleted']).optional(),
      isPublic: z.boolean().optional(),
      password: z.string().optional(),
      removePassword: z.boolean().optional()
    });

    const validatedData = updateNoteSchema.parse(body);

    // Handle password changes
    const updateData: any = { ...validatedData };
    
    if (validatedData.password) {
      const bcrypt = await import('bcryptjs');
      updateData.passwordHash = await bcrypt.hash(validatedData.password, 10);
      updateData.passwordProtected = true;
      delete updateData.password;
    }
    
    if (validatedData.removePassword) {
      updateData.passwordHash = null;
      updateData.passwordProtected = false;
      delete updateData.removePassword;
    }

    // Update note
    const note = await Notes.findByIdAndUpdate(
      params.id,
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-versions -encryptionKey -passwordHash');

    return NextResponse.json({
      success: true,
      message: 'Note updated successfully',
      data: note
    });

  } catch (error: any) {
    console.error('Update note error:', error);
    
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

// DELETE /api/note/[id] - Soft delete note
export async function DELETE(
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

    const note = await Notes.findOneAndUpdate(
      {
        _id: params.id,
        userId: decoded.userId,
        status: { $ne: 'deleted' }
      },
      {
        status: 'deleted',
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!note) {
      return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Note deleted successfully' 
    });

  } catch (error: any) {
    console.error('Delete note error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
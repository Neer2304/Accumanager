// app/api/note/route.ts - Only adding notifications, no data structure changes
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/jwt';
import { z } from 'zod';
import { NotificationService } from '@/services/notificationService';

// Validation schemas (unchanged)
const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  summary: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().default('general'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  color: z.string().default('#ffffff'),
  icon: z.string().default('📝'),
  isPublic: z.boolean().default(false),
  projectId: z.string().optional(),
  eventId: z.string().optional(),
  taskId: z.string().optional(),
  password: z.string().optional()
});

const updateNoteSchema = createNoteSchema.partial();

// GET /api/note - Get all notes with filters (unchanged)
export async function GET(request: NextRequest) {
  try {
    console.log('📝 GET /api/note - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      console.log('❌ No auth token found');
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    console.log('👤 User ID:', decoded.userId);
    
    await connectToDatabase();
    console.log('✅ Database connected');

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status') || 'active';
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const showShared = searchParams.get('shared') === 'true';

    const mongoose = await import('mongoose');

    const baseQuery: any[] = [
      { status: { $ne: 'deleted' } }
    ];

    if (showShared) {
      baseQuery.push({
        $or: [
          { userId: new mongoose.Types.ObjectId(decoded.userId) },
          { 'sharedWith.userId': new mongoose.Types.ObjectId(decoded.userId) }
        ]
      });
    } else {
      baseQuery.push({ userId: new mongoose.Types.ObjectId(decoded.userId) });
    }

    if (status !== 'all') {
      baseQuery.push({ status });
    }

    if (category) {
      baseQuery.push({ category });
    }

    if (tag) {
      baseQuery.push({ tags: tag });
    }

    if (priority) {
      baseQuery.push({ priority });
    }

    if (search) {
      baseQuery.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { summary: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const query = baseQuery.length > 0 ? { $and: baseQuery } : {};

    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    console.log('🔍 Query:', JSON.stringify(query));
    console.log('📊 Page:', page, 'Limit:', limit);

    const notes = await Notes.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-versions -encryptionKey -passwordHash')
      .lean();

    const total = await Notes.countDocuments(query);

    console.log(`✅ Found ${notes.length} notes out of ${total} total`);

    return NextResponse.json({
      success: true,
      data: notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('❌ Get notes error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/note - Create new note (UPDATED with notifications)
export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/note - Creating new note...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      console.log('❌ No auth token');
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    console.log('👤 User ID:', decoded.userId);
    
    await connectToDatabase();
    console.log('✅ Database connected');

    const body = await request.json();
    console.log('📦 Request body:', body);
    
    const validatedData = createNoteSchema.parse(body);

    const wordCount = validatedData.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const note = new Notes({
      ...validatedData,
      userId: decoded.userId,
      wordCount,
      readTime
    });

    if (validatedData.password) {
      const bcrypt = await import('bcryptjs');
      note.passwordHash = await bcrypt.hash(validatedData.password, 10);
      note.passwordProtected = true;
      console.log('🔒 Password protection enabled');
    }

    await note.save();
    console.log('✅ Note created successfully:', note._id);

    // ✅ ADD NOTIFICATION HERE - Only this part is new
    try {
      await NotificationService.createNotification(
        decoded.userId,
        "New Note Created 📝",
        `Your note "${validatedData.title}" has been created successfully.`,
        "success",
        {
          actionUrl: `/notes/${note._id}`,
          metadata: {
            noteId: note._id.toString(),
            noteTitle: validatedData.title,
            category: validatedData.category,
            priority: validatedData.priority,
            wordCount,
            readTime,
            event: "note_created",
            timestamp: new Date().toISOString()
          }
        }
      );
      console.log('✅ Note creation notification created');
    } catch (notifError) {
      console.error('⚠️ Failed to create note notification:', notifError);
      // Don't fail the request if notification fails
    }

    const noteResponse = note.toObject();
    delete noteResponse.versions;
    delete noteResponse.encryptionKey;
    delete noteResponse.passwordHash;

    return NextResponse.json(
      { 
        success: true,
        message: 'Note created successfully', 
        data: noteResponse
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ Create note error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error', 
          // errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/note - Update a note (UPDATED with notifications)
export async function PUT(request: NextRequest) {
  try {
    console.log('📝 PUT /api/note - Updating note...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('id');
    
    if (!noteId) {
      return NextResponse.json({ success: false, message: 'Note ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateNoteSchema.parse(body);

    const existingNote = await Notes.findOne({ 
      _id: noteId,
      $or: [
        { userId: decoded.userId },
        { 'sharedWith.userId': decoded.userId, 'sharedWith.permission': 'edit' }
      ]
    });

    if (!existingNote) {
      return NextResponse.json({ success: false, message: 'Note not found or access denied' }, { status: 404 });
    }

    if (validatedData.content) {
      validatedData.wordCount = validatedData.content.split(/\s+/).length;
      validatedData.readTime = Math.ceil(validatedData.wordCount / 200);
    }

    const note = await Notes.findByIdAndUpdate(
      noteId,
      { ...validatedData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    // ✅ ADD NOTIFICATION HERE - Only this part is new
    try {
      await NotificationService.createNotification(
        decoded.userId,
        "Note Updated ✏️",
        `Your note "${note.title}" has been updated.`,
        "info",
        {
          actionUrl: `/notes/${noteId}`,
          metadata: {
            noteId,
            noteTitle: note.title,
            event: "note_updated",
            timestamp: new Date().toISOString()
          }
        }
      );
      console.log('✅ Note update notification created');
    } catch (notifError) {
      console.error('⚠️ Failed to create note update notification:', notifError);
    }

    return NextResponse.json({
      success: true,
      message: 'Note updated successfully',
      data: note
    });

  } catch (error: any) {
    console.error('❌ Update note error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error', 
          // errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/note - Delete a note (UPDATED with notifications)
export async function DELETE(request: NextRequest) {
  try {
    console.log('📝 DELETE /api/note - Deleting note...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('id');
    
    if (!noteId) {
      return NextResponse.json({ success: false, message: 'Note ID is required' }, { status: 400 });
    }

    const note = await Notes.findOne({ 
      _id: noteId,
      userId: decoded.userId
    });

    if (!note) {
      return NextResponse.json({ success: false, message: 'Note not found or access denied' }, { status: 404 });
    }

    await Notes.findByIdAndDelete(noteId);

    // ✅ ADD NOTIFICATION HERE - Only this part is new
    try {
      await NotificationService.createNotification(
        decoded.userId,
        "Note Deleted 🗑️",
        `Your note "${note.title}" has been deleted.`,
        "info",
        {
          metadata: {
            noteTitle: note.title,
            event: "note_deleted",
            timestamp: new Date().toISOString()
          }
        }
      );
      console.log('✅ Note deletion notification created');
    } catch (notifError) {
      console.error('⚠️ Failed to create note deletion notification:', notifError);
    }

    return NextResponse.json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error: any) {
    console.error('❌ Delete note error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
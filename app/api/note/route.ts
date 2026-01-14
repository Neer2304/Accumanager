import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/jwt';
import { z } from 'zod';

// Validation schemas
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

// GET /api/note - Get all notes with filters
export async function GET(request: NextRequest) {
  try {
    // Get token and verify
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    // Get query parameters
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

    // Build base query
    const baseQuery: any[] = [
      { status: { $ne: 'deleted' } }
    ];

    if (showShared) {
      // Get both owned and shared notes
      baseQuery.push({
        $or: [
          { userId: decoded.userId },
          { 'sharedWith.userId': decoded.userId }
        ]
      });
    } else {
      // Get only owned notes
      baseQuery.push({ userId: decoded.userId });
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

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const notes = await Notes.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-versions -encryptionKey -passwordHash')
      .lean();

    const total = await Notes.countDocuments(query);

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
    console.error('Get notes error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/note - Create new note
export async function POST(request: NextRequest) {
  try {
    // Authentication
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    // Validate request body
    const body = await request.json();
    const validatedData = createNoteSchema.parse(body);

    // Create note
    const note = new Notes({
      ...validatedData,
      userId: decoded.userId,
      wordCount: validatedData.content.split(/\s+/).length,
      readTime: Math.ceil(validatedData.content.split(/\s+/).length / 200)
    });

    // Handle password protection
    if (validatedData.password) {
      const bcrypt = await import('bcryptjs');
      note.passwordHash = await bcrypt.hash(validatedData.password, 10);
      note.passwordProtected = true;
    }

    await note.save();

    // Remove sensitive fields from response
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
    console.error('Create note error:', error);
    
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
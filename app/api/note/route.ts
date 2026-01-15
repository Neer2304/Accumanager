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
    console.log('📝 GET /api/note - Starting...');
    
    // Get token and verify
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      console.log('❌ No auth token found');
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    console.log('👤 User ID:', decoded.userId);
    
    await connectToDatabase();
    console.log('✅ Database connected');

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

    // Import mongoose for ObjectId
    const mongoose = await import('mongoose');

    // Build base query
    const baseQuery: any[] = [
      { status: { $ne: 'deleted' } }
    ];

    if (showShared) {
      // Get both owned and shared notes
      baseQuery.push({
        $or: [
          { userId: new mongoose.Types.ObjectId(decoded.userId) },
          { 'sharedWith.userId': new mongoose.Types.ObjectId(decoded.userId) }
        ]
      });
    } else {
      // Get only owned notes
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

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    console.log('🔍 Query:', JSON.stringify(query));
    console.log('📊 Page:', page, 'Limit:', limit);

    // Execute query
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

// POST /api/note - Create new note
export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/note - Creating new note...');
    
    // Authentication
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      console.log('❌ No auth token');
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    console.log('👤 User ID:', decoded.userId);
    
    await connectToDatabase();
    console.log('✅ Database connected');

    // Validate request body
    const body = await request.json();
    console.log('📦 Request body:', body);
    
    const validatedData = createNoteSchema.parse(body);

    // Calculate word count and read time
    const wordCount = validatedData.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Create note
    const note = new Notes({
      ...validatedData,
      userId: decoded.userId,
      wordCount,
      readTime
    });

    // Handle password protection
    if (validatedData.password) {
      const bcrypt = await import('bcryptjs');
      note.passwordHash = await bcrypt.hash(validatedData.password, 10);
      note.passwordProtected = true;
      console.log('🔒 Password protection enabled');
    }

    await note.save();
    console.log('✅ Note created successfully:', note._id);

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
    console.error('❌ Create note error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error', 
          // errors: error.message.map(e => ({ path: e.path, message: e.message }))
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
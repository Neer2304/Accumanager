import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notes from '@/models/Notes';
import { verifyToken } from '@/lib/jwt';

// Next.js 14+ requires async params
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('\n🔍 GET /api/note/[id] - START');
    
    // IMPORTANT: Await the params in Next.js 14+
    const params = await context.params;
    const noteIdFromParams = params.id;
    
    console.log('📌 Note ID from params:', noteIdFromParams);
    console.log('📌 Type of noteId:', typeof noteIdFromParams);
    console.log('📌 Length:', noteIdFromParams.length);
    
    // Clean the ID
    const cleanId = noteIdFromParams.trim();
    console.log('📌 Cleaned ID:', cleanId);
    
    // Verify it's not empty
    if (!cleanId || cleanId.length === 0) {
      console.log('❌ Empty note ID');
      return NextResponse.json({ 
        success: false, 
        message: 'Note ID is required' 
      }, { status: 400 });
    }
    
    // Check authentication
    const cookies = request.headers.get('cookie');
    console.log('🍪 Cookies:', cookies?.substring(0, 100) + '...');
    
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    console.log('🔐 Auth token exists:', !!authToken);
    
    if (!authToken || authToken === 'undefined') {
      console.log('❌ No auth token found');
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
      console.log('✅ Token verified');
      console.log('👤 User ID:', decoded.userId);
    } catch (tokenError: any) {
      console.error('❌ Token error:', tokenError.message);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid token' 
      }, { status: 401 });
    }

    await connectToDatabase();
    console.log('✅ Database connected');

    // Import mongoose
    const mongoose = await import('mongoose');
    
    // Check if ID is valid MongoDB ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(cleanId);
    console.log('📝 Is valid ObjectId?:', isValidObjectId);
    
    if (!isValidObjectId) {
      console.log('❌ Invalid note ID format');
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid note ID format',
        debug: {
          receivedId: cleanId,
          length: cleanId.length,
          expectedPattern: '24 hex characters (0-9, a-f, A-F)',
          sampleValidId: '6968956aa54062ff8c008220'
        }
      }, { status: 400 });
    }

    const userId = new mongoose.Types.ObjectId(decoded.userId);
    const noteId = new mongoose.Types.ObjectId(cleanId);
    
    console.log('🔍 Querying database...');
    console.log('   Note ID:', cleanId);
    console.log('   User ID:', decoded.userId);

    // Query database
    const note = await Notes.findOne({
      _id: noteId,
      $or: [
        { userId: userId },
        { 'sharedWith.userId': userId },
        { isPublic: true }
      ],
      status: { $ne: 'deleted' }
    }).select('-versions -encryptionKey').lean();

    console.log('🔍 Note found?:', !!note);
    
    if (!note) {
      console.log('❌ Note not found or no permission');
      
      // Check if note exists at all
      const noteExists = await Notes.findOne({ _id: noteId });
      console.log('   Note exists in DB?:', !!noteExists);
      
      if (noteExists) {
        console.log('   Note owner:', noteExists.userId?.toString());
        console.log('   Requesting user:', userId.toString());
        console.log('   Is owner?:', noteExists.userId?.toString() === userId.toString());
        console.log('   Is public?:', noteExists.isPublic);
        console.log('   Status:', noteExists.status);
      }
      
      return NextResponse.json({ 
        success: false, 
        message: 'Note not found or you don\'t have permission to view it' 
      }, { status: 404 });
    }

    console.log('✅ Note found!');
    console.log('   Title:', note.title);
    console.log('   Status:', note.status);
    console.log('   Password protected?:', note.passwordProtected);
    
    // Check password protection
    if (note.passwordProtected) {
      console.log('🔒 Note is password protected');
      const password = request.headers.get('x-note-password');
      console.log('🔐 Received password header:', password ? 'Yes' : 'No');
      
      if (!password) {
        console.log('❌ No password provided');
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
      
      // IMPORTANT: Check if passwordHash exists
      if (!note.passwordHash) {
        console.log('❌ No password hash stored for this note');
        return NextResponse.json(
          { success: false, message: 'Note configuration error' },
          { status: 500 }
        );
      }
      
      console.log('🔐 Comparing password...');
      const isValid = await bcrypt.compare(password, note.passwordHash);
      console.log('🔐 Password valid?:', isValid);
      
      if (!isValid) {
        console.log('❌ Invalid password');
        return NextResponse.json(
          { success: false, message: 'Invalid password' },
          { status: 403 }
        );
      }
      console.log('✅ Password verified successfully');
    }

    // Increment read count
    await Notes.findByIdAndUpdate(note._id, {
      $inc: { readCount: 1 },
      $set: { lastReadAt: new Date() }
    });

    console.log('✅ Returning note data');
    console.log('🔍 GET /api/note/[id] - END\n');

    return NextResponse.json({
      success: true,
      data: note
    });

  } catch (error: any) {
    console.error('\n❌ GET /api/note/[id] ERROR:');
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);
    console.error('   Error stack:', error.stack);
    
    // ALWAYS return JSON, never let the API crash
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// PUT method for updating notes
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('\n✏️ PUT /api/note/[id] - START');
    
    const params = await context.params;
    const noteIdFromParams = params.id;
    
    console.log('📌 Note ID:', noteIdFromParams);
    
    // Check authentication
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (!authToken || authToken === 'undefined') {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
      console.log('✅ Token verified, user:', decoded.userId);
    } catch (tokenError: any) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid token' 
      }, { status: 401 });
    }

    await connectToDatabase();
    
    // Import mongoose
    const mongoose = await import('mongoose');
    
    // Validate note ID
    if (!mongoose.Types.ObjectId.isValid(noteIdFromParams)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid note ID format' 
      }, { status: 400 });
    }

    const noteId = new mongoose.Types.ObjectId(noteIdFromParams);
    const userId = new mongoose.Types.ObjectId(decoded.userId);
    
    // Check permission
    const existingNote = await Notes.findOne({
      _id: noteId,
      $or: [
        { userId: userId },
        { 
          'sharedWith.userId': userId,
          'sharedWith.role': { $in: ['editor', 'owner'] }
        }
      ]
    });

    if (!existingNote) {
      console.log('❌ Note not found or no permission');
      return NextResponse.json(
        { success: false, message: 'Note not found or no permission' }, 
        { status: 404 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('📦 Request body:', body);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Handle password changes
    const updateData: any = { ...body };
    
    if (body.password) {
      const bcrypt = await import('bcryptjs');
      updateData.passwordHash = await bcrypt.hash(body.password, 10);
      updateData.passwordProtected = true;
      delete updateData.password;
      console.log('🔒 Password updated');
    }
    
    if (body.removePassword) {
      updateData.passwordHash = null;
      updateData.passwordProtected = false;
      delete updateData.removePassword;
      console.log('🔓 Password removed');
    }

    // Update word count and read time if content changed
    if (body.content) {
      const wordCount = body.content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);
      updateData.wordCount = wordCount;
      updateData.readTime = readTime;
    }

    // Update note
    const note = await Notes.findByIdAndUpdate(
      noteId,
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-versions -encryptionKey -passwordHash');

    console.log('✅ Note updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Note updated successfully',
      data: note
    });

  } catch (error: any) {
    console.error('❌ Update note error:', error);
    
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE method
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const noteId = params.id;
    
    console.log('\n🗑️ DELETE /api/note/[id]');
    console.log('📌 Note ID:', noteId);
    
    // Check authentication
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (!authToken || authToken === 'undefined') {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    await connectToDatabase();

    // Import mongoose
    const mongoose = await import('mongoose');

    const note = await Notes.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(noteId),
        userId: new mongoose.Types.ObjectId(decoded.userId),
        status: { $ne: 'deleted' }
      },
      {
        status: 'deleted',
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!note) {
      console.log('❌ Note not found');
      return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });
    }

    console.log('✅ Note soft deleted');

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
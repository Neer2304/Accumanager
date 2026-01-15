import { NextRequest, NextResponse } from 'next/server';

// This will catch /api/test/note/ANYTHING
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('\n🧪 TEST NOTE ENDPOINT');
    
    // Wait for params to resolve (Next.js 14+)
    const params = await context.params;
    const noteId = params.id;
    
    console.log('📌 Note ID from params:', noteId);
    console.log('📌 Type:', typeof noteId);
    console.log('📌 Length:', noteId.length);
    
    // Also get from URL for comparison
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    console.log('📌 Path segments:', pathSegments);
    
    // Character analysis
    console.log('🔤 Character analysis:');
    noteId.split('').forEach((char, index) => {
      const charCode = char.charCodeAt(0);
      const isHex = /^[0-9a-fA-F]$/.test(char);
      console.log(`  [${index}] '${char}' - Code: ${charCode} - Hex: ${isHex}`);
    });
    
    // Check if valid MongoDB ObjectId
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    const isValid = objectIdPattern.test(noteId);
    
    return NextResponse.json({
      success: true,
      message: 'Test endpoint working',
      data: {
        noteIdFromParams: noteId,
        noteIdLength: noteId.length,
        isValidObjectId: isValid,
        expectedId: '6968956aa54062ff8c008220',
        matchesExpected: noteId === '6968956aa54062ff8c008220',
        urlPathname: url.pathname,
        pathSegments: pathSegments
      }
    });
    
  } catch (error: any) {
    console.error('❌ Test error:', error);
    return NextResponse.json({
      success: false,
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
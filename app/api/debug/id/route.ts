import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('\n🔍 DEBUG ID TEST');
    
    // Get the full URL
    const url = new URL(request.url);
    console.log('📌 Full URL:', url.toString());
    console.log('📌 Pathname:', url.pathname);
    
    // Extract ID from the pathname
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    console.log('📌 Path segments:', pathSegments);
    
    // The ID should be the last segment after '/debug/id/'
    let receivedId = '';
    
    if (pathSegments.length >= 3 && pathSegments[0] === 'api' && pathSegments[1] === 'debug' && pathSegments[2] === 'id') {
      // If we have a fourth segment, that's the ID
      if (pathSegments.length >= 4) {
        receivedId = pathSegments[3];
      } else {
        console.log('⚠️ No ID provided after /debug/id/');
        receivedId = '[NO_ID_PROVIDED]';
      }
    } else {
      console.log('⚠️ Unexpected path structure');
      receivedId = '[INVALID_PATH]';
    }
    
    console.log('📌 Received ID:', receivedId);
    console.log('📏 ID length:', receivedId.length);
    
    // Show character analysis
    console.log('🔤 Character analysis:');
    receivedId.split('').forEach((char, index) => {
      const charCode = char.charCodeAt(0);
      const isHex = /^[0-9a-fA-F]$/.test(char);
      console.log(`  [${index}] '${char}' - Code: ${charCode} - Hex: ${isHex}`);
    });
    
    // Check MongoDB ObjectId pattern
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    const isValid = objectIdPattern.test(receivedId);
    
    return NextResponse.json({
      success: true,
      data: {
        receivedId,
        length: receivedId.length,
        isValidObjectId: isValid,
        characterAnalysis: receivedId.split('').map((c, i) => ({
          position: i,
          character: c,
          charCode: c.charCodeAt(0),
          isHex: /^[0-9a-fA-F]$/.test(c)
        })),
        expectedPattern: '24 hex characters (0-9, a-f, A-F)',
        sampleValidId: '6968956aa54062ff8c008220',
        pathSegments: pathSegments,
        requestUrl: url.toString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({
      success: false,
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
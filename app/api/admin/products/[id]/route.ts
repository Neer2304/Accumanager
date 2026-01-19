// app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/jwt';

// GET single product by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Wait for params to resolve (Next.js 13+ App Router)
    const { id } = await context.params;
    
    console.log('🔍 ADMIN GET /api/admin/products/[id] - Starting...');
    console.log('🎯 Product ID from params:', id);
    
    if (!id || id === 'undefined') {
      console.log('❌ Invalid product ID:', id);
      return NextResponse.json({ 
        message: 'Product ID is required' 
      }, { status: 400 });
    }

    // Get token from cookies
    const authToken = request.cookies.get('auth_token')?.value;
    
    console.log('🔐 Auth token from cookie:', authToken ? 'Exists' : 'NOT FOUND');
    
    if (!authToken) {
      console.log('❌ No auth token found in cookies');
      return NextResponse.json({ 
        message: 'Unauthorized - Please log in' 
      }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(authToken);
      console.log('✅ Token verified, user:', decoded.email);
    } catch (authError: any) {
      console.error('❌ Token verification failed:', authError.message);
      return NextResponse.json({ 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }

    // Check if user is admin
    if (!decoded.role || !['superadmin', 'admin'].includes(decoded.role)) {
      console.log('❌ Insufficient permissions. Role:', decoded.role);
      return NextResponse.json({ 
        message: 'Admin privileges required' 
      }, { status: 403 });
    }
    
    console.log('👤 Admin user:', decoded.email);

    // Connect to database
    await connectToDatabase();
    
    console.log('🔍 Searching for product with ID:', id);
    
    // Try to find the product
    let product;
    try {
      product = await Product.findById(id);
    } catch (dbError: any) {
      console.error('❌ Database error:', dbError);
      
      // Handle invalid ObjectId format
      if (dbError.name === 'CastError') {
        return NextResponse.json({ 
          message: 'Invalid product ID format' 
        }, { status: 400 });
      }
      
      throw dbError;
    }
    
    if (!product) {
      console.log('❌ Product not found');
      return NextResponse.json({ 
        message: 'Product not found' 
      }, { status: 404 });
    }
    
    console.log('✅ Product found:', product.name);
    
    // Return the product
    return NextResponse.json(product);
    
  } catch (error: any) {
    console.error('❌ Product detail error:', error);
    
    return NextResponse.json(
      { 
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
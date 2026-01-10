// app/api/dev/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Product from '@/models/Product'

// This route is for development only - remove in production
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'Not available in production' }, { status: 403 })
  }

  try {
    console.log('🔍 GET /api/dev/products - Development mode')
    
    await connectToDatabase()
    console.log('✅ Database connected')

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(50)

    console.log(`📦 Found ${products.length} products`)
    
    return NextResponse.json(products)
  } catch (error: any) {
    console.error('❌ Get products error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'Not available in production' }, { status: 403 })
  }

  try {
    console.log('🔄 POST /api/dev/products - Development mode')
    
    await connectToDatabase()
    console.log('✅ Database connected')

    const productData = await request.json()
    console.log('📦 Received product data:', JSON.stringify(productData, null, 2))

    // Use a default userId for development
    const product = new Product({
      ...productData,
      userId: 'dev-user-id', // Default user ID for development
    })

    console.log('💾 Saving product to database...')
    await product.save()
    console.log('✅ Product saved successfully:', product._id)

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('❌ Create product error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
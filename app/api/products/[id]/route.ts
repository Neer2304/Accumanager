// app/api/products/[id]/route.ts - UPDATED WITH SUBSCRIPTION CHECKS
import { NextRequest, NextResponse } from 'next/server'
import Product from '@/models/Product'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'
import { PaymentService } from '@/services/paymentService'

// Helper function to verify auth and subscription
async function verifyAuthAndSubscription(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const authHeader = request.headers.get('authorization');
  
  const token = authHeader?.replace('Bearer ', '') || authToken;
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const decoded = verifyToken(token);
  await connectToDatabase();
  
  // Check subscription status
  const subscription = await PaymentService.checkSubscription(decoded.userId);
  if (!subscription.isActive) {
    throw new Error('Your subscription has expired. Please upgrade to continue using the service.');
  }
  
  return { userId: decoded.userId, subscription };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 GET /api/products/[id] - Starting...')
    
    const { userId } = await verifyAuthAndSubscription(request);
    
    console.log('👤 GET [id] - User ID:', userId)
    console.log('🎯 GET [id] - Product ID:', params.id)

    const product = await Product.findOne({ 
      _id: params.id, 
      userId: userId 
    })

    if (!product) {
      console.log('❌ GET [id] - Product not found')
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    console.log('✅ GET [id] - Product found:', product.name)
    return NextResponse.json(product)
  } catch (error: any) {
    console.error('❌ GET [id] - Error:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    
    if (error.message.includes('subscription')) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔄 PUT /api/products/[id] - Starting...')
    
    const { userId } = await verifyAuthAndSubscription(request);
    
    console.log('👤 PUT [id] - User ID:', userId)
    console.log('🎯 PUT [id] - Product ID:', params.id)

    const updateData = await request.json()
    console.log('📦 PUT [id] - Update data:', updateData)

    // Validate required fields if they're being updated
    if (updateData.name !== undefined && !updateData.name?.trim()) {
      return NextResponse.json(
        { message: 'Product name is required' },
        { status: 400 }
      );
    }

    if (updateData.category !== undefined && !updateData.category?.trim()) {
      return NextResponse.json(
        { message: 'Category is required' },
        { status: 400 }
      );
    }

    if (updateData.basePrice !== undefined && (!updateData.basePrice || updateData.basePrice <= 0)) {
      return NextResponse.json(
        { message: 'Valid base price is required' },
        { status: 400 }
      );
    }

    if (updateData.gstDetails?.hsnCode !== undefined && !updateData.gstDetails?.hsnCode?.trim()) {
      return NextResponse.json(
        { message: 'HSN Code is required' },
        { status: 400 }
      );
    }

    // Clean and prepare update data
    const cleanUpdateData: any = { ...updateData, updatedAt: new Date() };

    // Clean nested fields if they exist
    if (cleanUpdateData.name) cleanUpdateData.name = cleanUpdateData.name.trim();
    if (cleanUpdateData.description) cleanUpdateData.description = cleanUpdateData.description.trim();
    if (cleanUpdateData.category) cleanUpdateData.category = cleanUpdateData.category.trim();
    if (cleanUpdateData.subCategory) cleanUpdateData.subCategory = cleanUpdateData.subCategory.trim();
    if (cleanUpdateData.brand) cleanUpdateData.brand = cleanUpdateData.brand.trim();
    
    // Clean numeric fields
    if (cleanUpdateData.basePrice) cleanUpdateData.basePrice = Number(cleanUpdateData.basePrice);
    if (cleanUpdateData.baseCostPrice) cleanUpdateData.baseCostPrice = Number(cleanUpdateData.baseCostPrice);
    
    // Clean GST details
    if (cleanUpdateData.gstDetails) {
      cleanUpdateData.gstDetails = {
        type: cleanUpdateData.gstDetails.type || 'cgst_sgst',
        hsnCode: cleanUpdateData.gstDetails.hsnCode?.trim(),
        cgstRate: Number(cleanUpdateData.gstDetails.cgstRate) || 0,
        sgstRate: Number(cleanUpdateData.gstDetails.sgstRate) || 0,
        igstRate: Number(cleanUpdateData.gstDetails.igstRate) || 0,
        utgstRate: Number(cleanUpdateData.gstDetails.utgstRate) || 0,
      };
    }
    
    // Clean variations
    if (cleanUpdateData.variations) {
      cleanUpdateData.variations = cleanUpdateData.variations.map((variation: any) => ({
        ...variation,
        price: Number(variation.price),
        costPrice: Number(variation.costPrice) || 0,
        stock: Number(variation.stock) || 0,
        weight: variation.weight ? Number(variation.weight) : undefined,
      }));
    }
    
    // Clean batches
    if (cleanUpdateData.batches) {
      cleanUpdateData.batches = cleanUpdateData.batches.map((batch: any) => ({
        ...batch,
        quantity: Number(batch.quantity),
        costPrice: Number(batch.costPrice),
        sellingPrice: Number(batch.sellingPrice),
        mfgDate: batch.mfgDate ? new Date(batch.mfgDate) : undefined,
        expDate: batch.expDate ? new Date(batch.expDate) : undefined,
        receivedDate: batch.receivedDate ? new Date(batch.receivedDate) : new Date(),
      }));
    }

    console.log('🧹 PUT [id] - Cleaned update data:', cleanUpdateData)

    const product = await Product.findOneAndUpdate(
      { _id: params.id, userId: userId },
      cleanUpdateData,
      { new: true, runValidators: true }
    )

    if (!product) {
      console.log('❌ PUT [id] - Product not found')
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    console.log('✅ PUT [id] - Product updated:', product.name)
    return NextResponse.json(product)
  } catch (error: any) {
    console.error('❌ PUT [id] - Error:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    
    if (error.message.includes('subscription')) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    
    // MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Product with this SKU already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🗑️ DELETE /api/products/[id] - Starting...')
    
    const { userId } = await verifyAuthAndSubscription(request);
    
    console.log('👤 DELETE [id] - User ID:', userId)
    console.log('🎯 DELETE [id] - Product ID:', params.id)

    const product = await Product.findOneAndDelete({ 
      _id: params.id, 
      userId: userId 
    })

    if (!product) {
      console.log('❌ DELETE [id] - Product not found')
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    // Update product usage (decrement by 1)
    try {
      await PaymentService.updateUsage(userId, 'products', -1);
      console.log('📊 DELETE [id] - Product usage updated (decremented)');
    } catch (usageError) {
      console.warn('⚠️ DELETE [id] - Failed to update product usage:', usageError);
    }

    console.log('✅ DELETE [id] - Product deleted:', product.name)
    return NextResponse.json({ 
      message: 'Product deleted successfully',
      deletedProduct: {
        id: product._id,
        name: product.name
      }
    })
  } catch (error: any) {
    console.error('❌ DELETE [id] - Error:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    
    if (error.message.includes('subscription')) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH endpoint for partial updates (optional)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔧 PATCH /api/products/[id] - Starting...')
    
    const { userId } = await verifyAuthAndSubscription(request);
    
    console.log('👤 PATCH [id] - User ID:', userId)
    console.log('🎯 PATCH [id] - Product ID:', params.id)

    const partialUpdate = await request.json()
    console.log('📦 PATCH [id] - Partial update data:', partialUpdate)

    // Only update specific fields and set updatedAt
    const updateData = {
      ...partialUpdate,
      updatedAt: new Date()
    }

    const product = await Product.findOneAndUpdate(
      { _id: params.id, userId: userId },
      updateData,
      { new: true, runValidators: true }
    )

    if (!product) {
      console.log('❌ PATCH [id] - Product not found')
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    console.log('✅ PATCH [id] - Product partially updated:', product.name)
    return NextResponse.json(product)
  } catch (error: any) {
    console.error('❌ PATCH [id] - Error:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    
    if (error.message.includes('subscription')) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
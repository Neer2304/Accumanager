// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DecodedToken {
  userId: string;
  email?: string;
  role?: string;
}

interface UpdateData {
  name?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  brand?: string;
  tags?: string[];
  mrp?: number;
  sellingPrice?: number;
  costPrice?: number;
  gstRate?: number;
  hsnCode?: string;
  quantity?: number;
  lowStockThreshold?: number;
  trackInventory?: boolean;
  hasVariations?: boolean;
  variations?: unknown[];
  manufacturingDate?: string;
  expiryDate?: string;
  batchNumber?: string;
  manufacturerName?: string;
  countryOfOrigin?: string;
  weight?: number;
  weightUnit?: string;
  dimensions?: { length?: number; width?: number; height?: number; unit?: string };
  status?: 'draft' | 'published' | 'archived';
  visibility?: 'visible' | 'hidden';
  updatedAt?: Date;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

async function getUserIdFromRequest(request: NextRequest): Promise<string> {
  const authToken = request.cookies.get('auth_token')?.value;
  if (!authToken) {
    throw new Error('Authentication required');
  }
  
  try {
    const decoded = verifyToken(authToken) as DecodedToken;
    if (!decoded.userId) {
      throw new Error('Invalid token payload');
    }
    return decoded.userId;
  } catch {
    throw new Error('Invalid token');
  }
}

// ─── GET /api/products/[id] ───────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const userId = await getUserIdFromRequest(request);
    await connectToDatabase();

    const productId = resolvedParams.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ success: false, message: 'Invalid product ID' }, { status: 400 });
    }

    const product = await Product.findOne({
      _id: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate('category', 'name slug')
      .populate('brand', 'name logo')
      .lean();

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('GET product error:', err);
    
    if (err.message === 'Authentication required' || err.message === 'Invalid token') {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    
    return NextResponse.json({ success: false, message: err.message || 'Internal server error' }, { status: 500 });
  }
}

// ─── PUT /api/products/[id] ───────────────────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const userId = await getUserIdFromRequest(request);
    await connectToDatabase();

    const productId = resolvedParams.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ success: false, message: 'Invalid product ID' }, { status: 400 });
    }

    const updateData: UpdateData = await request.json();

    // Validate required fields if they're being updated
    if (updateData.name !== undefined && !updateData.name.trim()) {
      return NextResponse.json({ success: false, message: 'Product name is required' }, { status: 400 });
    }

    if (updateData.category !== undefined && !updateData.category.trim()) {
      return NextResponse.json({ success: false, message: 'Category is required' }, { status: 400 });
    }

    if (updateData.mrp !== undefined && updateData.mrp <= 0) {
      return NextResponse.json({ success: false, message: 'MRP must be greater than 0' }, { status: 400 });
    }

    if (updateData.sellingPrice !== undefined && updateData.sellingPrice <= 0) {
      return NextResponse.json({ success: false, message: 'Selling price must be greater than 0' }, { status: 400 });
    }

    // Prepare update data
    const cleanUpdateData: Record<string, unknown> = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Clean string fields
    if (cleanUpdateData.name) cleanUpdateData.name = (cleanUpdateData.name as string).trim();
    if (cleanUpdateData.description) cleanUpdateData.description = (cleanUpdateData.description as string).trim();
    if (cleanUpdateData.category) cleanUpdateData.category = new mongoose.Types.ObjectId(cleanUpdateData.category as string);
    if (cleanUpdateData.brand) cleanUpdateData.brand = new mongoose.Types.ObjectId(cleanUpdateData.brand as string);
    
    // Clean numeric fields
    if (cleanUpdateData.mrp) cleanUpdateData.mrp = Number(cleanUpdateData.mrp);
    if (cleanUpdateData.sellingPrice) cleanUpdateData.sellingPrice = Number(cleanUpdateData.sellingPrice);
    if (cleanUpdateData.costPrice) cleanUpdateData.costPrice = Number(cleanUpdateData.costPrice);
    if (cleanUpdateData.quantity) cleanUpdateData.quantity = Number(cleanUpdateData.quantity);
    
    // Handle date fields
    if (cleanUpdateData.manufacturingDate) {
      cleanUpdateData.manufacturingDate = new Date(cleanUpdateData.manufacturingDate as string);
    }
    if (cleanUpdateData.expiryDate) {
      cleanUpdateData.expiryDate = new Date(cleanUpdateData.expiryDate as string);
    }

    // Remove undefined values
    Object.keys(cleanUpdateData).forEach(key => {
      if (cleanUpdateData[key] === undefined) {
        delete cleanUpdateData[key];
      }
    });

    const product = await Product.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(productId), userId: new mongoose.Types.ObjectId(userId) },
      { $set: cleanUpdateData },
      { new: true, runValidators: true }
    ).populate('category', 'name slug').populate('brand', 'name logo');

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error: unknown) {
    const err = error as Error & { code?: number };
    console.error('PUT product error:', err);
    
    if (err.message === 'Authentication required' || err.message === 'Invalid token') {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    
    if (err.code === 11000) {
      return NextResponse.json({ success: false, message: 'SKU already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ success: false, message: err.message || 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE /api/products/[id] ────────────────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const userId = await getUserIdFromRequest(request);
    await connectToDatabase();

    const productId = resolvedParams.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ success: false, message: 'Invalid product ID' }, { status: 400 });
    }

    const product = await Product.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Product "${product.name}" deleted successfully`,
      data: { id: product._id, name: product.name },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('DELETE product error:', err);
    
    if (err.message === 'Authentication required' || err.message === 'Invalid token') {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    
    return NextResponse.json({ success: false, message: err.message || 'Internal server error' }, { status: 500 });
  }
}

// ─── PATCH /api/products/[id] (Partial update) ────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const userId = await getUserIdFromRequest(request);
    await connectToDatabase();

    const productId = resolvedParams.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ success: false, message: 'Invalid product ID' }, { status: 400 });
    }

    const partialUpdate: Record<string, unknown> = await request.json();

    // Add updated timestamp
    partialUpdate.updatedAt = new Date();

    const product = await Product.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(productId), userId: new mongoose.Types.ObjectId(userId) },
      { $set: partialUpdate },
      { new: true, runValidators: true }
    ).populate('category', 'name slug').populate('brand', 'name logo');

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('PATCH product error:', err);
    
    if (err.message === 'Authentication required' || err.message === 'Invalid token') {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    
    return NextResponse.json({ success: false, message: err.message || 'Internal server error' }, { status: 500 });
  }
}
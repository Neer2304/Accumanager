import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Material from '@/models/Material';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

// GET - Get all materials with filters
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get user ID from token
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken);
    const userId = decoded.userId;
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const lowStockOnly = searchParams.get('lowStockOnly') === 'true';
    const outOfStockOnly = searchParams.get('outOfStockOnly') === 'true';
    
    // Build filter
    const filter: any = { userId };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (lowStockOnly) {
      filter.status = 'low-stock';
    }
    
    if (outOfStockOnly) {
      filter.status = 'out-of-stock';
    }
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await Material.countDocuments(filter);
    
    // Get materials with pagination
    const materials = await Material.find(filter)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Calculate stats
    const lowStockCount = await Material.countDocuments({ 
      userId, 
      status: 'low-stock' 
    });
    
    const outOfStockCount = await Material.countDocuments({ 
      userId, 
      status: 'out-of-stock' 
    });
    
    return NextResponse.json({
      success: true,
      data: {
        materials,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        stats: {
          lowStockCount,
          outOfStockCount,
          totalCount: total,
        },
      },
    });
    
  } catch (error: any) {
    console.error('Get materials error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new material
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get user ID from token
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken);
    const userId = decoded.userId;
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.sku) {
      return NextResponse.json(
        { success: false, message: 'Name and SKU are required' },
        { status: 400 }
      );
    }
    
    // Check if SKU already exists
    body.sku = body.sku.toUpperCase();
    const existing = await Material.findOne({
      sku: body.sku,
      userId
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'SKU already exists' },
        { status: 400 }
      );
    }
    
    // Calculate derived fields
    const currentStock = body.currentStock || 0;
    const unitCost = body.unitCost || 0;
    const totalValue = currentStock * unitCost;
    
    // Determine status
    let status = 'in-stock';
    if (currentStock === 0) {
      status = 'out-of-stock';
    } else if (currentStock <= (body.minimumStock || 10)) {
      status = 'low-stock';
    }
    
    // Create material
    const material = await Material.create({
      ...body,
      userId,
      totalValue,
      status,
      totalQuantityAdded: currentStock,
      totalQuantityUsed: 0,
      averageMonthlyUsage: 0,
      reorderPoint: body.reorderPoint || (body.minimumStock || 10) * 2,
      usageHistory: [],
      restockHistory: [],
      images: body.images || [],
      documents: body.documents || [],
    });
    
    return NextResponse.json({
      success: true,
      data: material,
      message: 'Material created successfully'
    });
    
  } catch (error: any) {
    console.error('Create material error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'SKU already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
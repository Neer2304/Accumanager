import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Material from '@/models/Material';
import { verifyToken } from '@/lib/jwt';

// GET - List materials with filters
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
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build query
    const query: any = { userId };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { supplierName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const [materials, total] = await Promise.all([
      Material.find(query)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Material.countDocuments(query)
    ]);
    
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
          pages: Math.ceil(total / limit)
        },
        stats: {
          lowStockCount,
          outOfStockCount,
          totalCount: total
        }
      }
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
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.sku || !body.category || !body.unit) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if SKU already exists
    const existingMaterial = await Material.findOne({ sku: body.sku.toUpperCase(), userId });
    if (existingMaterial) {
      return NextResponse.json(
        { success: false, message: 'SKU already exists' },
        { status: 400 }
      );
    }
    
    // Create material
    const materialData = {
      ...body,
      sku: body.sku.toUpperCase(),
      userId,
      currentStock: body.initialStock || 0,
      totalQuantityAdded: body.initialStock || 0,
      totalQuantityUsed: 0,
      unitCost: body.unitCost || 0,
      minimumStock: body.minimumStock || 10,
      lowStockAlert: body.lowStockAlert !== false
    };
    
    const material = new Material(materialData);
    await material.save();
    
    return NextResponse.json({
      success: true,
      data: material,
      message: 'Material created successfully'
    }, { status: 201 });
    
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
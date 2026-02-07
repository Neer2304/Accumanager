import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Material from '@/models/Material';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

// GET - Get all materials from a specific supplier
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: supplierName } = await params;
    
    // Decode URL parameter
    const decodedSupplierName = decodeURIComponent(supplierName);
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const lowStockOnly = searchParams.get('lowStockOnly') === 'true';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    // Build filter
    const filter: any = { 
      userId,
      supplierName: { $regex: new RegExp(`^${decodedSupplierName}$`, 'i') }
    };
    
    if (category) {
      filter.category = category;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (lowStockOnly) {
      filter.status = 'low-stock';
    }
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Get total count
    const total = await Material.countDocuments(filter);
    
    // Get materials with pagination
    const materials = await Material.find(filter)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Calculate supplier statistics
    const totalStockValue = materials.reduce((sum, mat) => sum + (mat.totalValue || 0), 0);
    const totalCurrentStock = materials.reduce((sum, mat) => sum + (mat.currentStock || 0), 0);
    const lowStockCount = materials.filter(mat => mat.status === 'low-stock').length;
    const outOfStockCount = materials.filter(mat => mat.status === 'out-of-stock').length;
    
    // Calculate category distribution
    const categoryStats = materials.reduce((acc, mat) => {
      acc[mat.category] = (acc[mat.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return NextResponse.json({
      success: true,
      data: {
        supplier: {
          name: decodedSupplierName,
          totalMaterials: total,
          totalStockValue,
          totalCurrentStock,
          lowStockCount,
          outOfStockCount,
          categoryStats: Object.entries(categoryStats).map(([category, count]) => ({
            category,
            count,
          })),
        },
        materials,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
    
  } catch (error: any) {
    console.error('Get supplier materials error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
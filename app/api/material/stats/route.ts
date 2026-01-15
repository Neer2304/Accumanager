import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Material from '@/models/Material';
import { verifyToken } from '@/lib/jwt';

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
    
    // Get time range from query params (default: last 30 days)
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get all materials for user
    const materials = await Material.find({ userId }).lean();
    
    // Calculate statistics
    const totalMaterials = materials.length;
    const totalStockValue = materials.reduce((sum, mat) => sum + (mat.currentStock * mat.unitCost), 0);
    const lowStockCount = materials.filter(mat => mat.status === 'low-stock').length;
    const outOfStockCount = materials.filter(mat => mat.status === 'out-of-stock').length;
    
    // Category distribution
    const categoryStats = materials.reduce((acc, mat) => {
      acc[mat.category] = (acc[mat.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Status distribution
    const statusStats = materials.reduce((acc, mat) => {
      acc[mat.status] = (acc[mat.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Most used materials (by total quantity used)
    const mostUsed = materials
      .filter(mat => mat.totalQuantityUsed > 0)
      .sort((a, b) => b.totalQuantityUsed - a.totalQuantityUsed)
      .slice(0, 10)
      .map(mat => ({
        id: mat._id,
        name: mat.name,
        sku: mat.sku,
        totalUsed: mat.totalQuantityUsed,
        unit: mat.unit
      }));
    
    // Recent activity (usage and restock)
    const recentActivity = [];
    
    for (const material of materials.slice(0, 20)) {
      if (material.usageHistory && material.usageHistory.length > 0) {
        const latestUsage = material.usageHistory[material.usageHistory.length - 1];
        if (latestUsage.usedAt > startDate) {
          recentActivity.push({
            type: 'usage',
            materialName: material.name,
            sku: material.sku,
            quantity: latestUsage.quantity,
            unit: material.unit,
            user: latestUsage.usedBy,
            project: latestUsage.project,
            date: latestUsage.usedAt,
            color: 'error'
          });
        }
      }
      
      if (material.restockHistory && material.restockHistory.length > 0) {
        const latestRestock = material.restockHistory[material.restockHistory.length - 1];
        if (latestRestock.restockedAt > startDate) {
          recentActivity.push({
            type: 'restock',
            materialName: material.name,
            sku: material.sku,
            quantity: latestRestock.quantity,
            unit: material.unit,
            supplier: latestRestock.supplier,
            cost: latestRestock.totalCost,
            date: latestRestock.restockedAt,
            color: 'success'
          });
        }
      }
    }
    
    // Sort recent activity by date
    recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalMaterials,
          totalStockValue: Math.round(totalStockValue * 100) / 100,
          lowStockCount,
          outOfStockCount,
          inStockCount: totalMaterials - lowStockCount - outOfStockCount
        },
        categories: Object.entries(categoryStats).map(([category, count]) => ({
          category,
          count
        })),
        status: Object.entries(statusStats).map(([status, count]) => ({
          status,
          count
        })),
        mostUsed,
        recentActivity: recentActivity.slice(0, 20)
      }
    });
    
  } catch (error: any) {
    console.error('Get material stats error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
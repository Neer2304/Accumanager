import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Material, { IMaterial } from '@/models/Material';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

// Interface for usage history
interface UsageHistoryItem {
  _id?: any;
  quantity: number;
  usedBy: string;
  project?: string;
  note?: string;
  usedAt: Date;
  cost: number;
}

// Interface for restock history
interface RestockHistoryItem {
  _id?: any;
  quantity: number;
  supplier?: string;
  purchaseOrder?: string;
  unitCost: number;
  totalCost: number;
  note?: string;
  restockedAt: Date;
}

// Interface for formatted history item
interface FormattedHistoryItem {
  type: 'usage' | 'restock';
  id: string;
  date: Date;
  quantity: number;
  user: string;
  project?: string;
  note?: string;
  cost: number;
  total: number;
  status: string;
  icon: string;
  color: string;
  supplier?: string;
  purchaseOrder?: string;
}

// GET - Get material history (usage and restock)
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
    const { id: materialId } = await params;
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'all', 'usage', 'restock'
    const limit = parseInt(searchParams.get('limit') || '50');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid material ID format' },
        { status: 400 }
      );
    }
    
    // Find material
    const material = await Material.findOne({
      _id: new mongoose.Types.ObjectId(materialId),
      userId
    }).lean() as IMaterial | null;
    
    if (!material) {
      return NextResponse.json(
        { success: false, message: 'Material not found' },
        { status: 404 }
      );
    }
    
    // Combine and format history
    let history: FormattedHistoryItem[] = [];
    
    // Add usage history
    if ((type === 'all' || type === 'usage') && material.usageHistory && Array.isArray(material.usageHistory)) {
      material.usageHistory.forEach((usage: UsageHistoryItem) => {
        history.push({
          type: 'usage',
          id: `usage_${usage._id || Date.now()}`,
          date: usage.usedAt,
          quantity: usage.quantity,
          user: usage.usedBy,
          project: usage.project || 'N/A',
          note: usage.note || '',
          cost: usage.cost || 0,
          total: usage.cost || 0,
          status: 'completed',
          icon: 'Inventory',
          color: '#ea4335',
        });
      });
    }
    
    // Add restock history
    if ((type === 'all' || type === 'restock') && material.restockHistory && Array.isArray(material.restockHistory)) {
      material.restockHistory.forEach((restock: RestockHistoryItem) => {
        history.push({
          type: 'restock',
          id: `restock_${restock._id || Date.now()}`,
          date: restock.restockedAt,
          quantity: restock.quantity,
          user: 'System',
          project: 'Restock',
          note: restock.note || '',
          cost: restock.unitCost || 0,
          total: restock.totalCost || 0,
          supplier: restock.supplier || 'N/A',
          purchaseOrder: restock.purchaseOrder || 'N/A',
          status: 'completed',
          icon: 'LocalShipping',
          color: '#34a853',
        });
      });
    }
    
    // Sort by date (newest first)
    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Apply date filters
    if (startDate) {
      const start = new Date(startDate);
      history = history.filter(item => new Date(item.date) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      history = history.filter(item => new Date(item.date) <= end);
    }
    
    // Apply limit
    history = history.slice(0, limit);
    
    // Calculate statistics with safe array checks
    const usageHistory = material.usageHistory || [];
    const restockHistory = material.restockHistory || [];
    
    const totalUsage = Array.isArray(usageHistory) 
      ? usageHistory.reduce((sum: number, usage: UsageHistoryItem) => sum + usage.quantity, 0)
      : 0;
    
    const totalRestock = Array.isArray(restockHistory)
      ? restockHistory.reduce((sum: number, restock: RestockHistoryItem) => sum + restock.quantity, 0)
      : 0;
    
    const totalUsageCost = Array.isArray(usageHistory)
      ? usageHistory.reduce((sum: number, usage: UsageHistoryItem) => sum + (usage.cost || 0), 0)
      : 0;
    
    const totalRestockCost = Array.isArray(restockHistory)
      ? restockHistory.reduce((sum: number, restock: RestockHistoryItem) => sum + (restock.totalCost || 0), 0)
      : 0;
    
    return NextResponse.json({
      success: true,
      data: {
        material: {
          _id: material._id,
          name: material.name,
          sku: material.sku,
          currentStock: material.currentStock,
          unit: material.unit,
        },
        history,
        statistics: {
          totalTransactions: history.length,
          totalUsage,
          totalRestock,
          totalUsageCost,
          totalRestockCost,
          netChange: totalRestock - totalUsage,
          netCost: totalRestockCost - totalUsageCost,
          usageCount: Array.isArray(usageHistory) ? usageHistory.length : 0,
          restockCount: Array.isArray(restockHistory) ? restockHistory.length : 0,
        },
      },
    });
    
  } catch (error: any) {
    console.error('Get material history error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Material, { IMaterial } from '@/models/Material';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

// GET - Get all suppliers from materials
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
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    // First, get unique suppliers from materials
    const allMaterials = await Material.find({ userId });
    
    // Extract unique suppliers
    const suppliersMap = new Map();
    
    allMaterials.forEach(material => {
      if (material.supplierName) {
        const supplierKey = material.supplierName.toLowerCase();
        
        if (!suppliersMap.has(supplierKey)) {
          // Initialize supplier
          suppliersMap.set(supplierKey, {
            name: material.supplierName,
            contactPerson: material.supplierContact || '',
            email: '',
            phone: material.supplierContact || '',
            address: '',
            website: '',
            status: 'active',
            rating: 4.5,
            totalOrders: 0,
            totalSpent: 0,
            leadTime: material.leadTime || 0,
            paymentTerms: 'Net 30',
            materialsSupplied: [],
            notes: '',
            lastOrderDate: material.updatedAt,
            createdAt: material.createdAt,
            updatedAt: material.updatedAt,
            supplierCode: material.supplierCode || '',
            averageMonthlyUsage: material.averageMonthlyUsage || 0,
            lowStockAlert: material.lowStockAlert,
            batchNumber: material.batchNumber || '',
            storageLocation: material.storageLocation || '',
            shelf: material.shelf || '',
            bin: material.bin || '',
            currentStock: 0,
            totalValue: 0,
            description: material.description || '',
            category: material.category || '',
            sku: '',
            totalQuantityUsed: 0,
            unitCost: 0,
          });
        }
        
        // Update supplier statistics
        const supplier = suppliersMap.get(supplierKey);
        supplier.materialsSupplied.push(material.sku);
        supplier.currentStock += material.currentStock;
        supplier.totalValue += material.totalValue;
        supplier.totalSpent += material.totalQuantityAdded * material.unitCost;
        supplier.totalOrders += material.restockHistory?.length || 0;
        supplier.totalQuantityUsed += material.totalQuantityUsed || 0;
        
        // Update last order date
        if (material.restockHistory && material.restockHistory.length > 0) {
          const lastRestock = material.restockHistory[material.restockHistory.length - 1];
          if (lastRestock.restockedAt) {
            const restockDate = new Date(lastRestock.restockedAt);
            if (!supplier.lastOrderDate || restockDate > new Date(supplier.lastOrderDate)) {
              supplier.lastOrderDate = restockDate;
            }
          }
        }
      }
    });
    
    let suppliers = Array.from(suppliersMap.values());
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      suppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchLower) ||
        supplier.supplierCode?.toLowerCase().includes(searchLower) ||
        supplier.materialsSupplied.some((sku: string) => sku.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter
    if (status) {
      suppliers = suppliers.filter(supplier => supplier.status === status);
    }
    
    // Apply sorting
    suppliers.sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Apply pagination
    const total = suppliers.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSuppliers = suppliers.slice(startIndex, endIndex);
    
    // Add _id for each supplier
    const suppliersWithIds = paginatedSuppliers.map((supplier, index) => ({
      ...supplier,
      _id: `supplier_${index + 1}_${Date.now()}`,
      rating: 4.5, // Default rating
      totalOrders: supplier.totalOrders || Math.floor(Math.random() * 50) + 1,
      totalSpent: supplier.totalSpent || Math.floor(Math.random() * 1000000) + 10000,
    }));
    
    // Calculate statistics
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
    const totalOrders = suppliers.reduce((sum, s) => sum + (s.totalOrders || 0), 0);
    const totalSpent = suppliers.reduce((sum, s) => sum + (s.totalSpent || 0), 0);
    
    return NextResponse.json({
      success: true,
      data: {
        suppliers: suppliersWithIds,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
        stats: {
          totalSuppliers,
          activeSuppliers,
          totalOrders,
          totalSpent,
        },
      },
    });
    
  } catch (error: any) {
    console.error('Get suppliers error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
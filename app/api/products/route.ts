// app/api/products/route.ts
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

interface ProductQuery {
  userId: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId;
  brand?: mongoose.Types.ObjectId;
  status?: string;
  'inventory.stockStatus'?: string;
  'pricing.sellingPrice'?: { $gte?: number; $lte?: number };
  $text?: { $search: string };
  'manufacturing.expiryDate'?: { $exists: boolean; $ne: null } | { $lt: Date } | { $gte: Date };
}

interface VariationOptionInput {
  name: string;
  value: string;
  price?: number;
  sku?: string;
  quantity?: number;
  image?: string;
}

interface VariationInput {
  name: string;
  options: VariationOptionInput[];
}

interface ProductInput {
  name: string;
  description?: string;
  shortDescription?: string;
  category: string;
  brand?: string;
  tags?: string[];
  mrp: number;
  sellingPrice: number;
  costPrice?: number;
  gstRate?: number;
  hsnCode?: string;
  quantity?: number;
  lowStockThreshold?: number;
  trackInventory?: boolean;
  hasVariations?: boolean;
  variations?: VariationInput[];
  manufacturingDate?: string;
  expiryDate?: string;
  batchNumber?: string;
  manufacturerName?: string;
  countryOfOrigin?: string;
  weight?: number;
  weightUnit?: string;
  dimensions?: { length?: number; width?: number; height?: number; unit?: string };
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

async function getUserIdFromRequest(request: NextRequest): Promise<string> {
  const authToken = request.cookies.get('auth_token')?.value;
  if (!authToken) {
    throw new Error('Unauthorized');
  }
  
  try {
    const decoded = verifyToken(authToken) as DecodedToken;
    if (!decoded.userId) {
      throw new Error('Invalid token payload');
    }
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

function generateSKU(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PRD-${random}-${timestamp}`;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function calculateTotalQuantity(productData: ProductInput): number {
  if (productData.hasVariations && productData.variations) {
    let total = 0;
    for (const variation of productData.variations) {
      for (const option of variation.options) {
        total += option.quantity || 0;
      }
    }
    return total;
  }
  return productData.quantity || 0;
}

// ─── GET /api/products ────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;
    
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const status = searchParams.get('status');
    const stockStatus = searchParams.get('stockStatus');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const hasExpiry = searchParams.get('hasExpiry');
    const isExpired = searchParams.get('isExpired');

    const query: ProductQuery = { userId: new mongoose.Types.ObjectId(userId) };

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = new mongoose.Types.ObjectId(category);
    }
    if (brand && mongoose.Types.ObjectId.isValid(brand)) {
      query.brand = new mongoose.Types.ObjectId(brand);
    }
    if (status) query.status = status;
    if (stockStatus) query['inventory.stockStatus'] = stockStatus;
    
    if (minPrice || maxPrice) {
      query['pricing.sellingPrice'] = {};
      if (minPrice) query['pricing.sellingPrice'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.sellingPrice'].$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (hasExpiry === 'true') {
      query['manufacturing.expiryDate'] = { $exists: true, $ne: null };
    }
    
    if (isExpired === 'true') {
      query['manufacturing.expiryDate'] = { $lt: new Date() };
    } else if (isExpired === 'false') {
      query['manufacturing.expiryDate'] = { $gte: new Date() };
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('brand', 'name logo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    // Calculate stock counts
    const stockCounts = await Product.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$inventory.stockStatus', count: { $sum: 1 } } }
    ]);

    const stockCountsMap = stockCounts.reduce<Record<string, number>>((acc, curr) => {
      if (curr._id) {
        acc[curr._id] = curr.count;
      }
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      stockCounts: stockCountsMap,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('GET products error:', err);
    
    if (err.message === 'Unauthorized' || err.message === 'Invalid token') {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    
    return NextResponse.json({ success: false, message: err.message || 'Internal server error' }, { status: 500 });
  }
}

// ─── POST /api/products ───────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    await connectToDatabase();

    const body = await request.json() as ProductInput;
    
    const {
      name,
      description,
      shortDescription,
      category,
      brand,
      tags,
      mrp,
      sellingPrice,
      costPrice,
      gstRate,
      hsnCode,
      quantity,
      lowStockThreshold,
      trackInventory,
      hasVariations,
      variations,
      manufacturingDate,
      expiryDate,
      batchNumber,
      manufacturerName,
      countryOfOrigin,
      weight,
      weightUnit,
      dimensions,
    } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: 'Product name is required' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category is required' }, { status: 400 });
    }
    if (!mrp || mrp <= 0) {
      return NextResponse.json({ success: false, message: 'MRP must be greater than 0' }, { status: 400 });
    }
    if (!sellingPrice || sellingPrice <= 0) {
      return NextResponse.json({ success: false, message: 'Selling price must be greater than 0' }, { status: 400 });
    }
    if (sellingPrice > mrp) {
      return NextResponse.json({ success: false, message: 'Selling price cannot exceed MRP' }, { status: 400 });
    }

    const sku = generateSKU();
    const totalQuantity = calculateTotalQuantity(body);

    const productData = {
      userId: new mongoose.Types.ObjectId(userId),
      sku,
      name: name.trim(),
      slug: generateSlug(name),
      description: description || '',
      shortDescription: shortDescription || '',
      images: [],
      hasVariations: hasVariations || false,
      variations: variations || [],
      inventory: {
        quantity: totalQuantity,
        reservedQuantity: 0,
        availableQuantity: totalQuantity,
        lowStockThreshold: lowStockThreshold || 5,
        trackInventory: trackInventory !== false,
        allowBackorder: false,
        stockStatus: totalQuantity > 0 ? 'in_stock' : 'out_of_stock',
      },
      pricing: {
        mrp,
        sellingPrice,
        costPrice: costPrice || 0,
        wholesalePrice: 0,
        gstRate: gstRate || 18,
        hsnCode: hsnCode || '',
      },
      manufacturing: {
        manufacturerName: manufacturerName || '',
        manufacturedDate: manufacturingDate ? new Date(manufacturingDate) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        batchNumber: batchNumber || '',
        countryOfOrigin: countryOfOrigin || '',
      },
      category: new mongoose.Types.ObjectId(category),
      brand: brand ? new mongoose.Types.ObjectId(brand) : null,
      tags: tags || [],
      dimensions: {
        weight: weight || 0,
        weightUnit: weightUnit || 'kg',
        length: dimensions?.length || 0,
        width: dimensions?.width || 0,
        height: dimensions?.height || 0,
        dimensionUnit: dimensions?.unit || 'cm',
      },
      status: 'published',
      visibility: 'visible',
      sales: { totalSold: 0, revenue: 0, views: 0 },
    };

    const product = new Product(productData);
    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: product,
    }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error & { code?: number };
    console.error('POST product error:', err);
    
    if (err.message === 'Unauthorized' || err.message === 'Invalid token') {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    
    if (err.code === 11000) {
      return NextResponse.json({ success: false, message: 'SKU already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ success: false, message: err.message || 'Internal server error' }, { status: 500 });
  }
}
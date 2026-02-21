// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/jwt';
import { PaymentService } from '@/services/paymentService';
import { NotificationService } from '@/services/notificationService'; // Add this import

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

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/products - Starting...');
    
    const { userId, subscription } = await verifyAuthAndSubscription(request);
    
    console.log('👤 User ID:', userId);
    console.log('📊 Subscription plan:', subscription.plan);
    console.log('📈 Product usage:', subscription.usage.products, '/', subscription.limits.products);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    let query: any = { userId, isActive: true };

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { 'gstDetails.hsnCode': { $regex: search, $options: 'i' } }
      ];
    }

    // Get products with pagination
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    console.log(`✅ Found ${products.length} products for user ${userId}`);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      usage: {
        current: subscription.usage.products,
        limit: subscription.limits.products,
        remaining: subscription.limits.products - subscription.usage.products
      }
    });

  } catch (error: any) {
    console.error('❌ Get products error:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    
    if (error.message.includes('subscription')) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/products - Starting...');
    
    const { userId, subscription } = await verifyAuthAndSubscription(request);
    
    // Check product limit before creating
    const usageCheck = await PaymentService.checkUsageLimit(userId, 'products', 1);
    if (!usageCheck.canProceed) {
      return NextResponse.json(
        { 
          message: `Product limit reached! You have ${usageCheck.currentUsage} out of ${usageCheck.limit} products. Please upgrade your plan to add more products.` 
        },
        { status: 403 }
      );
    }

    const productData = await request.json();
    console.log('📦 Product data received:', productData);

    // Validate required fields
    if (!productData.name?.trim()) {
      return NextResponse.json(
        { message: 'Product name is required' },
        { status: 400 }
      );
    }

    if (!productData.category?.trim()) {
      return NextResponse.json(
        { message: 'Category is required' },
        { status: 400 }
      );
    }

    if (!productData.basePrice || productData.basePrice <= 0) {
      return NextResponse.json(
        { message: 'Valid base price is required' },
        { status: 400 }
      );
    }

    if (!productData.gstDetails?.hsnCode?.trim()) {
      return NextResponse.json(
        { message: 'HSN Code is required' },
        { status: 400 }
      );
    }

    // Clean and prepare data
    const cleanProductData = {
      ...productData,
      name: productData.name.trim(),
      description: productData.description?.trim() || '',
      category: productData.category.trim(),
      subCategory: productData.subCategory?.trim() || '',
      brand: productData.brand?.trim() || '',
      basePrice: Number(productData.basePrice),
      baseCostPrice: Number(productData.baseCostPrice) || 0,
      userId: userId,
      gstDetails: {
        type: productData.gstDetails.type || 'cgst_sgst',
        hsnCode: productData.gstDetails.hsnCode.trim(),
        cgstRate: Number(productData.gstDetails.cgstRate) || 0,
        sgstRate: Number(productData.gstDetails.sgstRate) || 0,
        igstRate: Number(productData.gstDetails.igstRate) || 0,
        utgstRate: Number(productData.gstDetails.utgstRate) || 0,
      },
      variations: productData.variations?.map((variation: any) => ({
        ...variation,
        price: Number(variation.price),
        costPrice: Number(variation.costPrice) || 0,
        stock: Number(variation.stock) || 0,
        weight: variation.weight ? Number(variation.weight) : undefined,
      })) || [],
      batches: productData.batches?.map((batch: any) => ({
        ...batch,
        quantity: Number(batch.quantity),
        costPrice: Number(batch.costPrice),
        sellingPrice: Number(batch.sellingPrice),
        mfgDate: batch.mfgDate ? new Date(batch.mfgDate) : undefined,
        expDate: batch.expDate ? new Date(batch.expDate) : undefined,
        receivedDate: batch.receivedDate ? new Date(batch.receivedDate) : new Date(),
      })) || [],
      tags: productData.tags || [],
      isReturnable: Boolean(productData.isReturnable),
      returnPeriod: Number(productData.returnPeriod) || 0,
    };

    console.log('🧹 Cleaned product data:', cleanProductData);

    // Create product
    const product = new Product(cleanProductData);
    await product.save();

    // ✅ ADD NOTIFICATION HERE
    try {
      await NotificationService.createNotification(
        userId,
        "New Product Created 📦",
        `Product "${product.name}" has been created successfully.`,
        "success",
        {
          actionUrl: `/products/${product._id}`,
          metadata: {
            productId: product._id.toString(),
            productName: product.name,
            category: product.category,
            price: product.basePrice,
            event: "product_created",
            timestamp: new Date().toISOString()
          }
        }
      );
      console.log('✅ Product creation notification created');
    } catch (notifError) {
      console.error('⚠️ Failed to create product notification:', notifError);
      // Don't fail the request if notification fails
    }

    console.log('✅ Product created successfully:', product._id);

    // Update product usage
    await PaymentService.updateUsage(userId, 'products', 1);

    return NextResponse.json(product, { status: 201 });

  } catch (error: any) {
    console.error('❌ Create product error:', error);
    
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
    );
  }
}
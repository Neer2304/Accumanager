// app/api/admin/products/stats/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    
    const totalProducts = await Product.countDocuments();
    
    return NextResponse.json({
      success: true,
      totalProducts
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      totalProducts: 0
    });
  }
}
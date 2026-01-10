// app/api/dashboard/top-products/route.ts - FIXED FOR DRAFT ORDERS
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('🏆 GET /api/dashboard/top-products - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(authToken)
    const userId = decoded.userId
    console.log('👤 User ID:', userId)
    
    await connectToDatabase()

    // Get ALL orders including DRAFT orders
    const orders = await Order.find({
      userId: userId
    }).lean()

    console.log(`📦 Found ${orders.length} total orders for user (including drafts)`)

    // Manual aggregation
    const productMap = new Map()

    // Process each order - INCLUDING DRAFTS
    orders.forEach(order => {
      console.log(`📋 Order ${order._id}: Status=${order.status}, Items=${order.items?.length || 0}`)
      
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          // Extract product name and details
          const productName = item.name || 'Unknown Product'
          const productId = item.productId
          const quantity = item.quantity || 0
          const price = item.price || 0
          const revenue = quantity * price

          if (quantity > 0 && productName && productName !== 'Unknown Product') {
            const key = productId || productName // Use productId as key if available
            
            if (productMap.has(key)) {
              const existing = productMap.get(key)
              productMap.set(key, {
                ...existing,
                productId: productId || existing.productId,
                productName,
                totalSales: existing.totalSales + quantity,
                totalRevenue: existing.totalRevenue + revenue
              })
            } else {
              productMap.set(key, {
                productId,
                productName,
                totalSales: quantity,
                totalRevenue: revenue
              })
            }
            
            console.log(`  ✅ Added item: ${productName}, Qty: ${quantity}, Revenue: ${revenue}`)
          }
        })
      }
    })

    console.log(`\n📊 Found ${productMap.size} unique products with sales in ALL orders (including drafts)`)

    // Convert to array and sort
    let productsArray = Array.from(productMap.values())
      .filter(item => item.totalSales > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10)

    console.log('📈 Sorted products:', productsArray)

    // If we have sales data, try to get product details
    if (productsArray.length > 0) {
      // Get productIds from the map
      const productIds = productsArray
        .map(p => p.productId)
        .filter(id => id && typeof id === 'string')

      console.log(`🔍 Looking for ${productIds.length} products in database...`)

      let products = []
      if (productIds.length > 0) {
        products = await Product.find({
          userId: userId,
          _id: { $in: productIds }
        }).select('name category variations').lean()
      }

      console.log(`✅ Found ${products.length} matching products in database`)

      // Create product map for quick lookup
      const productDetailsMap = new Map()
      products.forEach(product => {
        const totalStock = product.variations?.reduce((sum: number, variation: any) => 
          sum + (variation.stock || 0), 0
        ) || 0
        
        productDetailsMap.set(product._id.toString(), {
          name: product.name,
          category: product.category,
          stock: totalStock
        })
      })

      // Enrich with product details
      productsArray = productsArray.map(salesItem => {
        const productDetails = productDetailsMap.get(salesItem.productId)
        
        return {
          _id: salesItem.productId || Math.random().toString(),
          name: salesItem.productName,
          category: productDetails?.category || 'Uncategorized',
          totalSales: salesItem.totalSales,
          totalRevenue: salesItem.totalRevenue,
          stock: productDetails?.stock || 0
        }
      })
    } else {
      // Fallback to showing products with stock
      console.log('📦 No sales found in ANY orders, showing products with stock...')
      
      const products = await Product.find({
        userId: userId,
        $or: [
          { 'variations.stock': { $gt: 0 } },
          { isActive: true }
        ]
      })
        .sort({ 'variations.stock': -1, createdAt: -1 })
        .limit(10)
        .select('name category variations')
        .lean()

      productsArray = products.map(product => {
        const totalStock = product.variations?.reduce((sum: number, variation: any) => 
          sum + (variation.stock || 0), 0
        ) || 0

        return {
          _id: product._id.toString(),
          name: product.name,
          category: product.category,
          totalSales: 0,
          totalRevenue: 0,
          stock: totalStock
        }
      })
    }

    console.log(`✅ Returning ${productsArray.length} products`)
    console.log('📊 Final data:', productsArray)
    
    return NextResponse.json(productsArray)

  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      { 
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}
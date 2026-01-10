// app/api/settings/backup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Product from '@/models/Product'
import Customer from '@/models/Customer'
import Employee from '@/models/Employee'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('💾 GET /api/settings/backup - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      console.log('❌ No auth token found')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
      const decoded = verifyToken(authToken)
      console.log('👤 User:', decoded.userId)
      
      await connectToDatabase()
      console.log('✅ Database connected')

      // Get all user data for backup
      const [products, customers, employees, orders] = await Promise.all([
        Product.find({ userId: decoded.userId }).lean(),
        Customer.find({ userId: decoded.userId }).lean(),
        Employee.find({ userId: decoded.userId }).lean(),
        Order.find({ userId: decoded.userId }).lean()
      ])

      const backupData = {
        timestamp: new Date().toISOString(),
        user: decoded.userId,
        data: {
          products,
          customers,
          employees,
          orders
        },
        summary: {
          products: products.length,
          customers: customers.length,
          employees: employees.length,
          orders: orders.length
        }
      }

      console.log('✅ Backup created successfully')
      
      // Return as downloadable JSON
      return new NextResponse(JSON.stringify(backupData, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="backup-${new Date().toISOString().split('T')[0]}.json"`
        }
      })

    } catch (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ Backup error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
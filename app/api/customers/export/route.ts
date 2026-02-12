import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'

// POST /api/customers/export - Export customers to CSV/Excel
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authToken = request.cookies.get('auth_token')?.value
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || authToken
    
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    const decoded = verifyToken(token)
    await connectToDatabase()

    const db = mongoose.connection.db
    const customersCollection = db.collection('customers')

    const body = await request.json()
    const { 
      format = 'csv',
      customerIds,
      fields = ['name', 'phone', 'email', 'company', 'address', 'city', 'state', 'pincode', 'gstin', 'totalOrders', 'totalSpent', 'createdAt'],
      filters = {}
    } = body

    // Build query
    let query: any = { userId: decoded.userId }

    if (customerIds && Array.isArray(customerIds) && customerIds.length > 0) {
      const objectIds = customerIds.map(id => {
        try {
          return new mongoose.Types.ObjectId(id)
        } catch {
          return id
        }
      })
      query._id = { $in: objectIds }
    }

    // Apply additional filters
    if (filters.isInterState !== undefined) query.isInterState = filters.isInterState
    if (filters.state) query.state = filters.state
    if (filters.city) query.city = filters.city
    if (filters.hasOrders !== undefined) {
      if (filters.hasOrders) {
        query.totalOrders = { $gt: 0 }
      } else {
        query.totalOrders = 0
      }
    }

    // Get customers
    const customers = await customersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    if (customers.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'No customers found to export' 
        },
        { status: 404 }
      )
    }

    // Prepare data for export
    const exportData = customers.map(customer => {
      const row: any = {}
      fields.forEach(field => {
        if (field === 'id' || field === '_id') {
          row['ID'] = customer._id.toString()
        } else if (field === 'name') {
          row['Name'] = customer.name || ''
        } else if (field === 'phone') {
          row['Phone'] = customer.phone || ''
        } else if (field === 'email') {
          row['Email'] = customer.email || ''
        } else if (field === 'company') {
          row['Company'] = customer.company || ''
        } else if (field === 'address') {
          row['Address'] = customer.address || ''
        } else if (field === 'city') {
          row['City'] = customer.city || ''
        } else if (field === 'state') {
          row['State'] = customer.state || ''
        } else if (field === 'pincode') {
          row['Pincode'] = customer.pincode || ''
        } else if (field === 'gstin') {
          row['GSTIN'] = customer.gstin || ''
        } else if (field === 'isInterState') {
          row['Transaction Type'] = customer.isInterState ? 'Inter-State' : 'Intra-State'
        } else if (field === 'totalOrders') {
          row['Total Orders'] = customer.totalOrders || 0
        } else if (field === 'totalSpent') {
          row['Total Spent (₹)'] = customer.totalSpent || 0
        } else if (field === 'lastOrderDate') {
          row['Last Order Date'] = customer.lastOrderDate 
            ? new Date(customer.lastOrderDate).toLocaleDateString('en-IN')
            : ''
        } else if (field === 'createdAt') {
          row['Created At'] = customer.createdAt 
            ? new Date(customer.createdAt).toLocaleDateString('en-IN')
            : ''
        } else if (field === 'tags') {
          row['Tags'] = customer.tags?.join(', ') || ''
        }
      })
      return row
    })

    // Generate CSV
    if (format === 'csv') {
      const headers = Object.keys(exportData[0]).join(',')
      const rows = exportData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(',')
      )
      const csv = [headers, ...rows].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=customers_export_${new Date().toISOString().split('T')[0]}.csv`
        }
      })
    }

    // Generate JSON
    return NextResponse.json({
      success: true,
      customers: exportData,
      count: exportData.length
    })

  } catch (error: any) {
    console.error('❌ Export customers error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
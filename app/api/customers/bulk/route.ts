import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'

// POST /api/customers/bulk - Bulk operations on customers
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
    const bulkOperationsCollection = db.collection('bulk_operations')

    const body = await request.json()
    const { operation, customerIds, data } = body

    if (!operation || !customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Operation type and customer IDs array are required' 
        },
        { status: 400 }
      )
    }

    // Convert string IDs to ObjectIds
    const objectIds = customerIds.map(id => {
      try {
        return new mongoose.Types.ObjectId(id)
      } catch {
        return id
      }
    })

    let result
    const operationId = new mongoose.Types.ObjectId()

    // Log bulk operation
    const bulkOp = {
      _id: operationId,
      type: operation,
      status: 'processing',
      filters: { customerIds: objectIds },
      affectedCount: customerIds.length,
      processedCount: 0,
      failedCount: 0,
      errorLog: [],
      createdBy: decoded.userId,
      createdAt: new Date().toISOString()
    }
    await bulkOperationsCollection.insertOne(bulkOp)

    // Perform operation
    switch (operation) {
      case 'delete':
        // Soft delete - add deleted flag
        result = await customersCollection.updateMany(
          { _id: { $in: objectIds }, userId: decoded.userId },
          { 
            $set: { 
              isDeleted: true,
              deletedAt: new Date().toISOString(),
              deletedBy: decoded.userId
            } 
          }
        )
        break

      case 'add_tags':
        if (!data?.tags || !Array.isArray(data.tags)) {
          throw new Error('Tags array is required for add_tags operation')
        }
        result = await customersCollection.updateMany(
          { _id: { $in: objectIds }, userId: decoded.userId },
          { $addToSet: { tags: { $each: data.tags } } }
        )
        break

      case 'remove_tags':
        if (!data?.tags || !Array.isArray(data.tags)) {
          throw new Error('Tags array is required for remove_tags operation')
        }
        result = await customersCollection.updateMany(
          { _id: { $in: objectIds }, userId: decoded.userId },
          { $pull: { tags: { $in: data.tags } } }
        )
        break

      case 'update_state':
        if (!data?.state) {
          throw new Error('State is required for update_state operation')
        }
        result = await customersCollection.updateMany(
          { _id: { $in: objectIds }, userId: decoded.userId },
          { 
            $set: { 
              state: data.state,
              isInterState: data.isInterState || false,
              updatedAt: new Date().toISOString()
            } 
          }
        )
        break

      case 'export':
        // Get customers for export
        const customers = await customersCollection
          .find({ _id: { $in: objectIds }, userId: decoded.userId })
          .toArray()
        
        result = {
          modifiedCount: 0,
          customers
        }
        break

      default:
        await bulkOperationsCollection.updateOne(
          { _id: operationId },
          { 
            $set: { 
              status: 'failed',
              error: `Invalid operation type: ${operation}`
            } 
          }
        )
        return NextResponse.json(
          { 
            success: false,
            message: `Invalid operation type: ${operation}` 
          },
          { status: 400 }
        )
    }

    // Update bulk operation status
    await bulkOperationsCollection.updateOne(
      { _id: operationId },
      { 
        $set: { 
          status: 'completed',
          processedCount: result.modifiedCount || customerIds.length,
          completedAt: new Date().toISOString(),
          results: operation === 'export' ? result.customers : undefined
        } 
      }
    )

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${result.modifiedCount || result.customers?.length || 0} customers`,
      operationId,
      modifiedCount: result.modifiedCount || 0,
      totalCount: customerIds.length
    })

  } catch (error: any) {
    console.error('❌ Bulk operation error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
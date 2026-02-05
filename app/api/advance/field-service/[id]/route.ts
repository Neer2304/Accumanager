import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import FieldVisit from '@/models/FieldVisit'
import { verifyToken } from '@/lib/jwt'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`📍 GET /api/advance/field-service/${params.id} - Fetching field visit...`)
    
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId
    
    await connectToDatabase()

    const fieldVisit = await FieldVisit.findOne({
      _id: params.id,
      userId: userId
    }).lean()

    if (!fieldVisit) {
      return NextResponse.json({ 
        success: false,
        message: 'Field visit not found' 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: fieldVisit,
      message: 'Field visit fetched successfully'
    })

  } catch (error: any) {
    console.error('❌ Field Visit GET error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`📍 PUT /api/advance/field-service/${params.id} - Updating field visit...`)
    
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    const data = await request.json()
    
    await connectToDatabase()

    // Find field visit
    const fieldVisit = await FieldVisit.findOne({
      _id: params.id,
      userId: userId
    })

    if (!fieldVisit) {
      return NextResponse.json({ 
        success: false,
        message: 'Field visit not found' 
      }, { status: 404 })
    }

    // Update allowed fields
    const updatableFields = [
      'title', 'description', 'type', 'status', 'priority',
      'scheduledDate', 'startTime', 'endTime', 'estimatedDuration',
      'employeeId', 'employeeName', 'employeePhone',
      'workPerformed', 'issuesFound', 'recommendations', 'notes',
      'checkInTime', 'checkOutTime', 'actualDuration', 'travelTime',
      'isChargeable', 'chargeAmount', 'paymentStatus',
      'customerFeedback', 'photos', 'documents',
      'location'
    ]

    updatableFields.forEach(field => {
      if (data[field] !== undefined) {
        (fieldVisit as any)[field] = data[field]
      }
    })

    // Handle status-specific updates
    if (data.status === 'in-progress' && !fieldVisit.startTime) {
      fieldVisit.startTime = new Date()
    }
    
    if (data.status === 'completed' && !fieldVisit.endTime) {
      fieldVisit.endTime = new Date()
      
      // Calculate actual duration if not provided
      if (!data.actualDuration && fieldVisit.startTime) {
        const start = new Date(fieldVisit.startTime)
        const end = new Date(fieldVisit.endTime)
        fieldVisit.actualDuration = (end.getTime() - start.getTime()) / (1000 * 60 * 60) // hours
      }
    }

    await fieldVisit.save()

    console.log(`✅ Field visit updated: ${fieldVisit.title}`)

    return NextResponse.json({
      success: true,
      data: fieldVisit,
      message: 'Field visit updated successfully'
    })

  } catch (error: any) {
    console.error('❌ Field Visit PUT error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`📍 DELETE /api/advance/field-service/${params.id} - Deleting field visit...`)
    
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId
    
    await connectToDatabase()

    const result = await FieldVisit.findOneAndDelete({
      _id: params.id,
      userId: userId
    })

    if (!result) {
      return NextResponse.json({ 
        success: false,
        message: 'Field visit not found' 
      }, { status: 404 })
    }

    console.log(`✅ Field visit deleted: ${result.title}`)

    return NextResponse.json({
      success: true,
      message: 'Field visit deleted successfully',
      data: null
    })

  } catch (error: any) {
    console.error('❌ Field Visit DELETE error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    )
  }
}

async function getTokenFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  const authToken = request.cookies.get('auth_token')?.value
  if (authToken) {
    return authToken
  }
  
  return null
}
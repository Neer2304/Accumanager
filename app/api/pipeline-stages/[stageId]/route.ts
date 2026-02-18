// app/api/pipeline-stages/[stageId]/route.ts - FIXED version

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PipelineStage from '@/models/PipelineStage';
import { verifyToken } from '@/lib/jwt';
import { CompanyLimitService } from '@/lib/companyLimits';

// ✅ GET /api/pipeline-stages/[stageId] - Get single stage
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stageId: string }> }
) {
  try {
    // Await the params
    const { stageId } = await params;
    console.log(`📊 GET /api/pipeline-stages/${stageId} - Fetching stage`);
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      if (!stageId) {
        return NextResponse.json({ success: false, error: 'Stage ID required' }, { status: 400 });
      }

      await connectToDatabase();

      const stage = await PipelineStage.findById(stageId).lean();
      if (!stage) {
        return NextResponse.json({ success: false, error: 'Stage not found' }, { status: 404 });
      }

      // Check access
      const role = await CompanyLimitService.getUserRoleInCompany(decoded.userId, stage.companyId.toString());
      if (!role) {
        return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
      }

      return NextResponse.json({
        success: true,
        stage: {
          ...stage,
          id: stage._id.toString(),
          companyId: stage.companyId.toString(),
          createdBy: stage.createdBy.toString(),
          notifyUsers: stage.notifyUsers?.map((id: any) => id.toString())
        }
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get stage error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ PUT /api/pipeline-stages/[stageId] - Update stage
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ stageId: string }> }
) {
  try {
    // Await the params
    const { stageId } = await params;
    console.log(`📊 PUT /api/pipeline-stages/${stageId} - Updating stage`);
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      if (!stageId) {
        return NextResponse.json({ success: false, error: 'Stage ID required' }, { status: 400 });
      }

      await connectToDatabase();
      const updateData = await request.json();

      const stage = await PipelineStage.findById(stageId);
      if (!stage) {
        return NextResponse.json({ success: false, error: 'Stage not found' }, { status: 404 });
      }

      // Check permission
      const role = await CompanyLimitService.getUserRoleInCompany(decoded.userId, stage.companyId.toString());
      if (!role || !['admin', 'manager'].includes(role)) {
        return NextResponse.json({ success: false, error: 'Permission denied' }, { status: 403 });
      }

      // Check duplicate name
      if (updateData.name && updateData.name !== stage.name) {
        const existing = await PipelineStage.findOne({
          companyId: stage.companyId,
          name: updateData.name,
          _id: { $ne: stageId }
        });
        if (existing) {
          return NextResponse.json({ success: false, error: 'Stage with this name already exists' }, { status: 400 });
        }
      }

      // Update fields
      const updatableFields = [
        'name', 'probability', 'color', 'category', 'isActive',
        'requiredFields', 'allowedStages', 'autoAdvance', 'autoAdvanceDays',
        'notifyOnEnter', 'notifyOnExit', 'notifyUsers', 'customFields'
      ];

      updatableFields.forEach(field => {
        if (updateData[field] !== undefined) {
          (stage as any)[field] = updateData[field];
        }
      });

      stage.updatedBy = decoded.userId;
      stage.updatedByName = decoded.name || 'User';
      
      await stage.save();

      return NextResponse.json({
        success: true,
        stage: {
          ...stage.toObject(),
          id: stage._id.toString()
        }
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Update stage error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ DELETE /api/pipeline-stages/[stageId] - Delete stage
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ stageId: string }> }
) {
  try {
    // Await the params - THIS IS THE KEY FIX
    const { stageId } = await params;
    console.log(`📊 DELETE /api/pipeline-stages/${stageId} - Deleting stage`);
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      if (!stageId) {
        return NextResponse.json({ success: false, error: 'Stage ID required' }, { status: 400 });
      }

      await connectToDatabase();

      const stage = await PipelineStage.findById(stageId);
      if (!stage) {
        return NextResponse.json({ success: false, error: 'Stage not found' }, { status: 404 });
      }

      // Check permission
      const role = await CompanyLimitService.getUserRoleInCompany(decoded.userId, stage.companyId.toString());
      if (!role || !['admin', 'manager'].includes(role)) {
        return NextResponse.json({ success: false, error: 'Permission denied' }, { status: 403 });
      }

      // Check if default
      if (stage.isDefault) {
        return NextResponse.json({ success: false, error: 'Cannot delete default stages' }, { status: 400 });
      }

      // Soft delete
      stage.isActive = false;
      await stage.save();

      return NextResponse.json({ 
        success: true, 
        message: 'Stage deleted successfully' 
      });

    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Delete stage error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ PATCH /api/pipeline-stages/reorder - Reorder stages (keep this in the main route.ts file, not here)
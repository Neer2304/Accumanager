// app/api/pipeline-stages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PipelineStage from '@/models/PipelineStage';
import Company from '@/models/Company';
import { verifyToken } from '@/lib/jwt';
import { CompanyLimitService } from '@/lib/companyLimits';

const DEFAULT_STAGES = [
  { name: 'Qualification', order: 0, probability: 10, color: '#4285f4', category: 'open', isDefault: true },
  { name: 'Needs Analysis', order: 1, probability: 20, color: '#fbbc04', category: 'open', isDefault: true },
  { name: 'Proposal/Quote', order: 2, probability: 40, color: '#34a853', category: 'open', isDefault: true },
  { name: 'Negotiation', order: 3, probability: 60, color: '#ea4335', category: 'open', isDefault: true },
  { name: 'Closed Won', order: 4, probability: 100, color: '#34a853', category: 'won', isDefault: true },
  { name: 'Closed Lost', order: 5, probability: 0, color: '#80868b', category: 'lost', isDefault: true }
];

// ✅ GET /api/pipeline-stages?companyId=xxx
export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/pipeline-stages - Fetching stages');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      const { searchParams } = new URL(request.url);
      const companyId = searchParams.get('companyId');
      const category = searchParams.get('category');
      const isActive = searchParams.get('isActive');
      
      if (!companyId) {
        return NextResponse.json({ success: false, error: 'Company ID is required' }, { status: 400 });
      }

      await connectToDatabase();

      // Check access
      const role = await CompanyLimitService.getUserRoleInCompany(decoded.userId, companyId);
      if (!role) {
        return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
      }

      // Check if stages exist
      let stages = await PipelineStage.find({ companyId }).sort({ order: 1 }).lean();

      // Create default stages if none exist
      if (stages.length === 0) {
        const company = await Company.findById(companyId);
        if (company) {
          const defaultStagesWithCompany = DEFAULT_STAGES.map(stage => ({
            ...stage,
            companyId,
            companyName: company.name,
            createdBy: decoded.userId,
            createdByName: decoded.name || 'System',
            isActive: true
          }));
          
          const createdStages = await PipelineStage.insertMany(defaultStagesWithCompany);
          stages = createdStages.map(s => s.toObject());
        }
      }

      // Filter stages
      let filteredStages = stages;
      if (category && category !== 'all') {
        filteredStages = filteredStages.filter(s => s.category === category);
      }
      if (isActive !== null) {
        const active = isActive === 'true';
        filteredStages = filteredStages.filter(s => s.isActive === active);
      }

      // Format for frontend
      const formattedStages = filteredStages.map(stage => ({
        ...stage,
        id: stage._id.toString(),
        companyId: stage.companyId.toString(),
        createdBy: stage.createdBy.toString(),
        notifyUsers: stage.notifyUsers?.map(id => id.toString())
      }));

      return NextResponse.json({
        success: true,
        stages: formattedStages,
        total: formattedStages.length
      });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get stages error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ POST /api/pipeline-stages?companyId=xxx
export async function POST(request: NextRequest) {
  try {
    console.log('📊 POST /api/pipeline-stages - Creating stage');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      const { searchParams } = new URL(request.url);
      const companyId = searchParams.get('companyId');
      
      if (!companyId) {
        return NextResponse.json({ success: false, error: 'Company ID is required' }, { status: 400 });
      }

      await connectToDatabase();
      const stageData = await request.json();

      // Check permission
      const role = await CompanyLimitService.getUserRoleInCompany(decoded.userId, companyId);
      if (!role || !['admin', 'manager'].includes(role)) {
        return NextResponse.json({ success: false, error: 'Permission denied' }, { status: 403 });
      }

      // Validate required
      if (!stageData.name) {
        return NextResponse.json({ success: false, error: 'Stage name is required' }, { status: 400 });
      }

      // Check duplicate name
      const existing = await PipelineStage.findOne({
        companyId,
        name: stageData.name
      });
      if (existing) {
        return NextResponse.json({ success: false, error: 'Stage with this name already exists' }, { status: 400 });
      }

      // Get company
      const company = await Company.findById(companyId);
      if (!company) {
        return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 });
      }

      // Get max order
      const maxOrderStage = await PipelineStage.findOne({ companyId })
        .sort({ order: -1 })
        .select('order');

      const order = maxOrderStage ? maxOrderStage.order + 1 : 0;

      // Create stage
      const stage = new PipelineStage({
        companyId,
        companyName: company.name,
        name: stageData.name,
        order: stageData.order !== undefined ? stageData.order : order,
        probability: stageData.probability || 0,
        color: stageData.color || '#4285f4',
        category: stageData.category || 'open',
        isActive: stageData.isActive !== undefined ? stageData.isActive : true,
        isDefault: false,
        requiredFields: stageData.requiredFields || [],
        allowedStages: stageData.allowedStages || [],
        autoAdvance: stageData.autoAdvance || false,
        autoAdvanceDays: stageData.autoAdvanceDays,
        notifyOnEnter: stageData.notifyOnEnter || false,
        notifyOnExit: stageData.notifyOnExit || false,
        notifyUsers: stageData.notifyUsers || [],
        customFields: stageData.customFields || [],
        createdBy: decoded.userId,
        createdByName: decoded.name || 'User'
      });

      await stage.save();

      return NextResponse.json({
        success: true,
        stage: {
          ...stage.toObject(),
          id: stage._id.toString()
        }
      }, { status: 201 });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create stage error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Stage with this name or order already exists' }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ PUT /api/pipeline-stages/[stageId]
export async function PUT(
  request: NextRequest,
  { params }: { params: { stageId: string } }
) {
  try {
    console.log('📊 PUT /api/pipeline-stages - Updating stage');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      const stageId = params.stageId;
      
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

// ✅ DELETE /api/pipeline-stages/[stageId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { stageId: string } }
) {
  try {
    console.log('📊 DELETE /api/pipeline-stages - Deleting stage');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      const stageId = params.stageId;
      
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

      // TODO: Check for deals in this stage
      // const dealsCount = await Deal.countDocuments({ pipelineStage: stageId });
      // if (dealsCount > 0) {
      //   return NextResponse.json({ success: false, error: `Cannot delete stage with ${dealsCount} deals` }, { status: 400 });
      // }

      // Soft delete
      stage.isActive = false;
      await stage.save();

      return NextResponse.json({ success: true, message: 'Stage deleted' });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Delete stage error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ PATCH /api/pipeline-stages/reorder
export async function PATCH(request: NextRequest) {
  try {
    console.log('📊 PATCH /api/pipeline-stages/reorder - Reordering stages');
    
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      const { searchParams } = new URL(request.url);
      const companyId = searchParams.get('companyId');
      const { stages } = await request.json();
      
      if (!companyId) {
        return NextResponse.json({ success: false, error: 'Company ID required' }, { status: 400 });
      }

      if (!stages || !Array.isArray(stages)) {
        return NextResponse.json({ success: false, error: 'Stages array required' }, { status: 400 });
      }

      await connectToDatabase();

      // Check permission
      const role = await CompanyLimitService.getUserRoleInCompany(decoded.userId, companyId);
      if (!role || !['admin', 'manager'].includes(role)) {
        return NextResponse.json({ success: false, error: 'Permission denied' }, { status: 403 });
      }

      // Update orders
      const updates = stages.map(({ id, order }) => ({
        updateOne: {
          filter: { _id: id, companyId },
          update: { order, updatedBy: decoded.userId, updatedByName: decoded.name }
        }
      }));

      await PipelineStage.bulkWrite(updates);

      return NextResponse.json({ success: true, message: 'Stages reordered' });

    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Reorder stages error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
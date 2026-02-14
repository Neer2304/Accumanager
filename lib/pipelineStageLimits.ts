// lib/pipelineStageLimits.ts
import PipelineStage from '@/models/PipelineStage';
import Company from '@/models/Company';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export const PipelineStageService = {
  // Get max stages per company based on plan
  getMaxStagesPerPlan(plan: string): number {
    switch (plan) {
      case 'free':
        return 5;
      case 'pro':
        return 10;
      case 'enterprise':
        return 20;
      default:
        return 5;
    }
  },

  // Check if company can add more stages
  async canAddStage(companyId: string): Promise<{ canAdd: boolean; max: number; current: number }> {
    await connectToDatabase();
    
    const company = await Company.findById(companyId);
    if (!company) {
      return { canAdd: false, max: 0, current: 0 };
    }

    const maxStages = this.getMaxStagesPerPlan(company.plan);
    const currentStages = await PipelineStage.countDocuments({ 
      companyId, 
      isActive: true 
    });

    return {
      canAdd: currentStages < maxStages,
      max: maxStages,
      current: currentStages
    };
  },

  // Get pipeline summary
  async getPipelineSummary(companyId: string) {
    await connectToDatabase();

    const stages = await PipelineStage.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId), isActive: true } },
      { $sort: { order: 1 } },
      {
        $lookup: {
          from: 'deals',
          let: { stageId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$pipelineStage', '$$stageId'] },
                status: 'open'
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                value: { $sum: '$dealValue' }
              }
            }
          ],
          as: 'deals'
        }
      },
      {
        $addFields: {
          dealCount: { $ifNull: [{ $arrayElemAt: ['$deals.count', 0] }, 0] },
          totalValue: { $ifNull: [{ $arrayElemAt: ['$deals.value', 0] }, 0] }
        }
      },
      {
        $project: {
          deals: 0
        }
      }
    ]);

    const totalValue = stages.reduce((sum, stage) => sum + (stage.totalValue || 0), 0);

    return {
      stages,
      totalValue,
      stageCount: stages.length
    };
  },

  // Initialize default stages for new company
  async initializeDefaultStages(companyId: string, companyName: string, createdBy: string, createdByName: string) {
    const DEFAULT_STAGES = [
      { name: 'Qualification', order: 0, probability: 10, color: '#4285f4', category: 'open' },
      { name: 'Needs Analysis', order: 1, probability: 20, color: '#fbbc04', category: 'open' },
      { name: 'Proposal/Quote', order: 2, probability: 40, color: '#34a853', category: 'open' },
      { name: 'Negotiation', order: 3, probability: 60, color: '#ea4335', category: 'open' },
      { name: 'Closed Won', order: 4, probability: 100, color: '#34a853', category: 'won' },
      { name: 'Closed Lost', order: 5, probability: 0, color: '#80868b', category: 'lost' }
    ];

    const stagesWithCompany = DEFAULT_STAGES.map(stage => ({
      ...stage,
      companyId,
      companyName,
      createdBy,
      createdByName,
      isDefault: true,
      isActive: true
    }));

    return await PipelineStage.insertMany(stagesWithCompany);
  }
};
// lib/dashboardStats.ts
import { connectToDatabase } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Contact from '@/models/Contact';
import Account from '@/models/Account';
import Deal from '@/models/Deal';
import Task from '@/models/Task';
import Activity from '@/models/Activity';
import PipelineStage from '@/models/PipelineStage';
import mongoose from 'mongoose';

export const DashboardStatsService = {
  async getCompanyStats(companyId: string, userId: string) {
    await connectToDatabase();
    
    const companyObjectId = new mongoose.Types.ObjectId(companyId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Parallel queries for better performance
    const [
      leadStats,
      contactStats,
      accountStats,
      dealStats,
      taskStats,
      activityStats,
      pipelineStats,
      upcomingActivities
    ] = await Promise.all([
      // Lead Stats
      Lead.aggregate([
        { $match: { companyId: companyObjectId, deletedAt: null } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
            contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
            qualified: { $sum: { $cond: [{ $eq: ['$status', 'qualified'] }, 1, 0] } },
            converted: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } },
            lost: { $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] } }
          }
        }
      ]),

      // Contact Stats
      Contact.aggregate([
        { $match: { companyId: companyObjectId, isActive: true, deletedAt: null } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            withAccount: { $sum: { $cond: [{ $ne: ['$accountId', null] }, 1, 0] } },
            byLifecycle: {
              $push: {
                k: '$lifecycleStage',
                v: 1
              }
            }
          }
        }
      ]),

      // Account Stats
      Account.aggregate([
        { $match: { companyId: companyObjectId, isActive: true, deletedAt: null } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            byTier: {
              $push: {
                k: '$tier',
                v: 1
              }
            },
            byType: {
              $push: {
                k: '$type',
                v: 1
              }
            }
          }
        }
      ]),

      // Deal Stats
      Deal.aggregate([
        { $match: { companyId: companyObjectId, deletedAt: null } },
        {
          $facet: {
            overview: [
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                  totalValue: { $sum: '$dealValue' },
                  won: { $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] } },
                  wonValue: {
                    $sum: { $cond: [{ $eq: ['$status', 'won'] }, '$dealValue', 0] }
                  },
                  lost: { $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] } },
                  lostValue: {
                    $sum: { $cond: [{ $eq: ['$status', 'lost'] }, '$dealValue', 0] }
                  },
                  open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
                  openValue: {
                    $sum: { $cond: [{ $eq: ['$status', 'open'] }, '$dealValue', 0] }
                  }
                }
              }
            ],
            byStage: [
              { $match: { status: 'open' } },
              {
                $group: {
                  _id: '$pipelineStage',
                  count: { $sum: 1 },
                  value: { $sum: '$dealValue' }
                }
              }
            ],
            upcoming: [
              {
                $match: {
                  status: 'open',
                  expectedCloseDate: {
                    $gte: new Date(),
                    $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  }
                }
              },
              { $sort: { expectedCloseDate: 1 } },
              { $limit: 5 },
              {
                $project: {
                  name: 1,
                  dealValue: 1,
                  currency: 1,
                  expectedCloseDate: 1,
                  probability: 1
                }
              }
            ]
          }
        }
      ]),

      // Task Stats
      Task.aggregate([
        { $match: { companyId: companyObjectId, deletedAt: null } },
        {
          $facet: {
            overview: [
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                  completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                  pending: {
                    $sum: {
                      $cond: [
                        { $in: ['$status', ['not_started', 'in_progress']] },
                        1,
                        0
                      ]
                    }
                  },
                  overdue: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $lt: ['$dueDate', new Date()] },
                            { $ne: ['$status', 'completed'] }
                          ]
                        },
                        1,
                        0
                      ]
                    }
                  }
                }
              }
            ],
            assignedToMe: [
              { $match: { assignedTo: userObjectId, status: { $ne: 'completed' } } },
              { $sort: { dueDate: 1 } },
              { $limit: 10 },
              {
                $project: {
                  title: 1,
                  dueDate: 1,
                  priority: 1,
                  status: 1
                }
              }
            ]
          }
        }
      ]),

      // Recent Activity
      Activity.find({ 
        companyId: companyObjectId,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),

      // Pipeline Stages with deal counts
      PipelineStage.aggregate([
        { $match: { companyId: companyObjectId, isActive: true } },
        { $sort: { order: 1 } },
        {
          $lookup: {
            from: 'deals',
            let: { stageId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$pipelineStageId', '$$stageId'] },
                  status: 'open',
                  deletedAt: null
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
            dealValue: { $ifNull: [{ $arrayElemAt: ['$deals.value', 0] }, 0] }
          }
        },
        {
          $project: {
            deals: 0
          }
        }
      ]),

      // Upcoming activities for user
      Activity.find({
        companyId: companyObjectId,
        assignedTo: userObjectId,
        status: { $ne: 'completed' },
        dueDate: { $gte: new Date() }
      })
      .sort({ dueDate: 1 })
      .limit(5)
      .lean()
    ]);

    // Format the stats
    const formattedStats = {
      leads: {
        total: leadStats[0]?.total || 0,
        new: leadStats[0]?.new || 0,
        contacted: leadStats[0]?.contacted || 0,
        qualified: leadStats[0]?.qualified || 0,
        converted: leadStats[0]?.converted || 0,
        lost: leadStats[0]?.lost || 0
      },
      contacts: {
        total: contactStats[0]?.total || 0,
        withAccount: contactStats[0]?.withAccount || 0
      },
      accounts: {
        total: accountStats[0]?.total || 0
      },
      deals: {
        total: dealStats[0]?.overview[0]?.total || 0,
        totalValue: dealStats[0]?.overview[0]?.totalValue || 0,
        won: dealStats[0]?.overview[0]?.won || 0,
        wonValue: dealStats[0]?.overview[0]?.wonValue || 0,
        lost: dealStats[0]?.overview[0]?.lost || 0,
        lostValue: dealStats[0]?.overview[0]?.lostValue || 0,
        open: dealStats[0]?.overview[0]?.open || 0,
        openValue: dealStats[0]?.overview[0]?.openValue || 0,
        byStage: dealStats[0]?.byStage || [],
        upcoming: dealStats[0]?.upcoming || []
      },
      tasks: {
        total: taskStats[0]?.overview[0]?.total || 0,
        completed: taskStats[0]?.overview[0]?.completed || 0,
        pending: taskStats[0]?.overview[0]?.pending || 0,
        overdue: taskStats[0]?.overview[0]?.overdue || 0,
        assignedToMe: taskStats[0]?.assignedToMe || []
      },
      recentActivities: activityStats,
      pipeline: pipelineStats,
      upcomingActivities
    };

    return formattedStats;
  },

  async getUserPerformance(companyId: string, userId: string, days: number = 30) {
    await connectToDatabase();
    
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const companyObjectId = new mongoose.Types.ObjectId(companyId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [dealsWon, tasksCompleted, activitiesLogged] = await Promise.all([
      // Deals won
      Deal.countDocuments({
        companyId: companyObjectId,
        owner: userObjectId,
        status: 'won',
        wonAt: { $gte: startDate }
      }),

      // Tasks completed
      Task.countDocuments({
        companyId: companyObjectId,
        $or: [
          { assignedTo: userObjectId },
          { createdBy: userObjectId }
        ],
        status: 'completed',
        completedAt: { $gte: startDate }
      }),

      // Activities logged
      Activity.countDocuments({
        companyId: companyObjectId,
        createdBy: userObjectId,
        createdAt: { $gte: startDate }
      })
    ]);

    return {
      dealsWon,
      tasksCompleted,
      activitiesLogged,
      period: days
    };
  }
};
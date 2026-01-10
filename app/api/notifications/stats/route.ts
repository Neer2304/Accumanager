// app/api/notifications/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Notification from '@/models/Notification'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/notifications/stats - Starting...')
    
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(authToken)
    await connectToDatabase()

    // Get notification statistics
    const stats = await Notification.aggregate([
      {
        $match: { userId: decoded.userId }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
          },
          byType: {
            $push: {
              type: '$type',
              isRead: '$isRead'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          unread: 1,
          read: { $subtract: ['$total', '$unread'] },
          types: {
            info: {
              total: {
                $size: {
                  $filter: {
                    input: '$byType',
                    as: 'item',
                    cond: { $eq: ['$$item.type', 'info'] }
                  }
                }
              },
              unread: {
                $size: {
                  $filter: {
                    input: '$byType',
                    as: 'item',
                    cond: { 
                      $and: [
                        { $eq: ['$$item.type', 'info'] },
                        { $eq: ['$$item.isRead', false] }
                      ]
                    }
                  }
                }
              }
            },
            success: {
              total: {
                $size: {
                  $filter: {
                    input: '$byType',
                    as: 'item',
                    cond: { $eq: ['$$item.type', 'success'] }
                  }
                }
              },
              unread: {
                $size: {
                  $filter: {
                    input: '$byType',
                    as: 'item',
                    cond: { 
                      $and: [
                        { $eq: ['$$item.type', 'success'] },
                        { $eq: ['$$item.isRead', false] }
                      ]
                    }
                  }
                }
              }
            },
            warning: {
              total: {
                $size: {
                  $filter: {
                    input: '$byType',
                    as: 'item',
                    cond: { $eq: ['$$item.type', 'warning'] }
                  }
                }
              },
              unread: {
                $size: {
                  $filter: {
                    input: '$byType',
                    as: 'item',
                    cond: { 
                      $and: [
                        { $eq: ['$$item.type', 'warning'] },
                        { $eq: ['$$item.isRead', false] }
                      ]
                    }
                  }
                }
              }
            },
            error: {
              total: {
                $size: {
                  $filter: {
                    input: '$byType',
                    as: 'item',
                    cond: { $eq: ['$$item.type', 'error'] }
                  }
                }
              },
              unread: {
                $size: {
                  $filter: {
                    input: '$byType',
                    as: 'item',
                    cond: { 
                      $and: [
                        { $eq: ['$$item.type', 'error'] },
                        { $eq: ['$$item.isRead', false] }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    ])

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentActivity = await Notification.aggregate([
      {
        $match: {
          userId: decoded.userId,
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: '$_id',
          count: 1,
          unread: 1,
          read: { $subtract: ['$count', '$unread'] },
          _id: 0
        }
      }
    ])

    const result = {
      ...(stats[0] || { total: 0, unread: 0, read: 0, types: {} }),
      recentActivity,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error: any) {
    console.error('❌ Get notification stats error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}
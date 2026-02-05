import { verifyToken } from "@/lib/jwt"
import connectToDatabase from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"

// app/api/advance/ai-analytics/insights/route.ts
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
    }
    
    const decoded = verifyToken(authToken)
    await connectToDatabase()
    
    const insights = [
      {
        id: '1',
        title: 'High-value customers prefer email communication',
        description: 'Customers with orders above ₹10,000 are 3x more responsive to email campaigns vs SMS',
        category: 'Communication',
        confidence: 92,
        actionItems: [
          'Segment customers by order value',
          'Create targeted email campaigns',
          'Adjust SMS frequency for high-value segment'
        ],
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Monday morning support ticket surge',
        description: 'Support requests increase by 45% on Monday mornings between 9-11 AM',
        category: 'Operations',
        confidence: 87,
        actionItems: [
          'Add additional support staff on Monday mornings',
          'Create FAQ for common Monday issues',
          'Consider pre-emptive communication on Sundays'
        ],
        timestamp: new Date(Date.now() - 86400000).toISOString() // Yesterday
      },
      {
        id: '3',
        title: 'Optimal discount threshold identified',
        description: 'Discounts between 15-20% yield highest conversion without significant revenue loss',
        category: 'Sales',
        confidence: 95,
        actionItems: [
          'Adjust discount strategy to 15-20% range',
          'Test different discount levels by customer segment',
          'Monitor revenue impact weekly'
        ],
        timestamp: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Product bundle opportunity detected',
        description: 'Customers who buy Product A are 70% likely to also need Product B within 30 days',
        category: 'Product',
        confidence: 83,
        actionItems: [
          'Create bundled offers for A + B',
          'Implement cross-sell recommendations',
          'Track bundle adoption rate'
        ],
        timestamp: new Date().toISOString()
      }
    ]
    
    return NextResponse.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('AI Insights error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
// app/api/projects/sample/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      const sampleProjects = [
        {
          name: 'Website Redesign',
          description: 'Complete overhaul of company website with modern design and improved user experience',
          status: 'active',
          priority: 'high',
          progress: 65,
          startDate: new Date('2024-01-15'),
          deadline: new Date('2024-03-30'),
          budget: 15000,
          clientName: 'Internal',
          category: 'development',
          teamMembers: ['Sarah Wilson', 'Mike Chen', 'Design Team'],
          tags: ['website', 'design', 'development'],
          totalTasks: 48,
          completedTasks: 31,
          inProgressTasks: 12,
          blockedTasks: 5,
        },
        {
          name: 'Q1 Marketing Campaign',
          description: 'Launch new product marketing campaign across digital channels',
          status: 'active',
          priority: 'high',
          progress: 85,
          startDate: new Date('2024-01-01'),
          deadline: new Date('2024-03-31'),
          budget: 25000,
          clientName: 'Marketing Department',
          category: 'marketing',
          teamMembers: ['Emily Davis', 'Alex Rodriguez'],
          tags: ['marketing', 'campaign', 'digital'],
          totalTasks: 36,
          completedTasks: 30,
          inProgressTasks: 6,
          blockedTasks: 0,
        },
        {
          name: 'Client Portal Implementation',
          description: 'Implement new client portal for better customer self-service',
          status: 'delayed',
          priority: 'medium',
          progress: 45,
          startDate: new Date('2024-02-01'),
          deadline: new Date('2024-04-15'),
          budget: 20000,
          clientName: 'ABC Corporation',
          category: 'client',
          teamMembers: ['John Doe', 'Mike Chen'],
          tags: ['portal', 'client', 'implementation'],
          totalTasks: 28,
          completedTasks: 12,
          inProgressTasks: 8,
          blockedTasks: 8,
        },
        {
          name: 'Sales Process Automation',
          description: 'Automate sales workflow and lead management process',
          status: 'active',
          priority: 'medium',
          progress: 25,
          startDate: new Date('2024-02-15'),
          deadline: new Date('2024-05-30'),
          budget: 12000,
          clientName: 'Sales Team',
          category: 'internal',
          teamMembers: ['Alex Rodriguez', 'Emily Davis'],
          tags: ['automation', 'sales', 'process'],
          totalTasks: 52,
          completedTasks: 13,
          inProgressTasks: 15,
          blockedTasks: 24,
        }
      ];

      // Create sample projects for the user
      const createdProjects = await Promise.all(
        sampleProjects.map(projectData => 
          new Project({
            ...projectData,
            userId: decoded.userId
          }).save()
        )
      );

      return NextResponse.json({ 
        success: true, 
        message: 'Sample projects created',
        projects: createdProjects 
      });

    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Create sample projects error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
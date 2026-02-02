import mongoose from 'mongoose';

export interface TeamMember {
  _id: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'away' | 'offline' | 'on_leave';
  performance: number;
  tasksCompleted: number;
  teamProjects: mongoose.Types.ObjectId[];
  teamTasks: mongoose.Types.ObjectId[];
  avatar: string;
  lastActive: Date | string;
  isActive: boolean;
  joinDate: Date | string;
  phone?: string;
  location?: string;
  skills?: string[];
  bio?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface TeamProject {
  _id: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate?: Date | string;
  deadline?: Date | string;
  progress: number;
  assignedTeamMembers: mongoose.Types.ObjectId[];
  teamTasks: mongoose.Types.ObjectId[];
  category: string;
  tags: string[];
  clientName?: string;
  budget?: number;
  hoursSpent: number;
  estimatedHours: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface TeamTask {
  _id: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  teamProjectId?: mongoose.Types.ObjectId | string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedToId?: mongoose.Types.ObjectId | string;
  assignedToName?: string;
  dueDate?: Date | string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  tags: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}


export interface TeamMemberInput {
  name: string;
  email: string;
  role: string;
  department?: string;
  phone?: string;
  location?: string;
  status?: 'active' | 'away' | 'offline' | 'on_leave';
  skills?: string;
  bio?: string;
}

export interface TeamMemberUpdate {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  status?: 'active' | 'away' | 'offline' | 'on_leave';
  performance?: number;
  isActive?: boolean;
  phone?: string;
  location?: string;
  skills?: string[];
  bio?: string;
}

export interface TeamMemberStats {
  totalMembers: number;
  activeMembers: number;
  avgPerformance: number;
  totalTasks: number;
}

export interface DepartmentStats {
  _id: string;
  count: number;
  avgPerformance: number;
  totalTasks: number;
}

export interface TeamActivity {
  _id: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  teamMemberId?: mongoose.Types.ObjectId | string;
  type: string;
  action: string;
  description: string;
  projectId?: mongoose.Types.ObjectId | string;
  projectName?: string;
  taskId?: mongoose.Types.ObjectId | string;
  taskName?: string;
  metadata: {
    points: number;
    priority: string;
    tags: string[];
    [key: string]: any;
  };
  isImportant: boolean;
  isRead: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
  teamMember?: {
    _id: mongoose.Types.ObjectId | string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export interface ActivityStats {
  _id: string;
  count: number;
  totalPoints: number;
}

export interface DailyActivityTrend {
  _id: string; // Date in YYYY-MM-DD format
  count: number;
  totalPoints: number;
  importantCount: number;
}

export interface TeamStatistics {
  team: TeamMemberStats;
  departments: DepartmentStats[];
  activityTrends: DailyActivityTrend[];
  projects: Record<string, number>;
  tasks: Record<string, number>;
  topPerformers: TeamMember[];
  recentImportantActivities: TeamActivity[];
  overallPerformance: {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    description: string;
  };
  generatedAt: string;
}

export interface TeamMembersResponse {
  success: boolean;
  data: {
    teamMembers: TeamMember[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    statistics: {
      total: number;
      active: number;
      away: number;
      offline: number;
    };
  };
}

export interface TeamActivitiesResponse {
  success: boolean;
  data: {
    activities: TeamActivity[];
    statistics: {
      totalActivities: number;
      activityStats: ActivityStats[];
      activeTeamMembers: number;
    };
    activeTeamMembers: Array<{
      _id: mongoose.Types.ObjectId | string;
      name: string;
      email: string;
      role: string;
      lastActive: Date | string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface TeamStatisticsResponse {
  success: boolean;
  data: TeamStatistics;
}

export interface ProjectAssignment {
  memberId: string;
  projectId: string;
  action: 'assign' | 'unassign';
}
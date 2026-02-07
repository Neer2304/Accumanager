// components/team-activity/types.ts
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  currentProjects: string[];
  lastActive: string;
  status: 'active' | 'away' | 'offline';
  avatar: string;
  performance: number;
  tasksCompleted: number;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  type: 'task_update' | 'project_update' | 'status_change' | 'login' | 'meeting' | 'other';
  description: string;
  projectName?: string;
  taskName?: string;
  timestamp: string;
  metadata?: {
    points: number;
  };
}

export interface ProjectProgress {
  id: string;
  name: string;
  progress: number;
  members: number;
  deadline: string;
}

export interface Meeting {
  id: string;
  title: string;
  type: 'sprint_planning' | 'client_review' | 'retrospective' | 'general';
  date: string;
  time: string;
  participants: number;
}

export interface TeamStats {
  totalTeamMembers: number;
  activeMembers: number;
  totalProjects: number;
  avgPerformance: number;
  totalTasks: number;
}
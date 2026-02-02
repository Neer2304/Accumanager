// types/teamActivity.ts
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
  type: string;
  description: string;
  projectName?: string;
  taskName?: string;
  timestamp: string;
  metadata?: {
    points: number;
  };
}

export interface TeamStatistics {
  totalTeamMembers: number;
  activeMembers: number;
  totalProjects: number;
  totalTasks: number;
  avgPerformance: number;
}

export interface ProjectsOverview {
  name: string;
  progress: number;
  teamMembers: number;
  deadline: string;
  status: 'on-track' | 'delayed' | 'completed';
}

export interface UpcomingMeeting {
  id: string;
  title: string;
  time: string;
  type: 'internal' | 'client' | 'partner' | 'team';
  participants: number;
  link?: string;
}
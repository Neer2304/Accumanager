// components/live-projects/types.ts
export interface LiveProject {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'active' | 'paused' | 'completed' | 'delayed';
  team: string[];
  deadline: string;
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
  };
  lastUpdate: string;
  velocity: number;
  userId: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  projectName: string;
  type: 'progress' | 'task_complete' | 'task_blocked' | 'milestone' | 'delay';
  description: string;
  timestamp: string;
  user: string;
}

export interface Stats {
  totalProjects: number;
  completedTasks: number;
  delayedProjects: number;
  averageProgress: number;
}
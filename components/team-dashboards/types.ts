// components/team-dashboard/types.ts
export interface EmployeeTask {
  _id: string;
  title: string;
  description: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'rejected' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  category: string;
  projectName: string;
  assignedAt: string;
  updates: any[];
}

export interface EmployeeData {
  _id: string;
  name: string;
  role: string;
  department: string;
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  };
  recentTasks: EmployeeTask[];
}

export interface DashboardSummary {
  totalEmployees: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface AssignFormData {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  estimatedHours: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
}

export interface TabItem {
  label: string;
  icon: string;
}
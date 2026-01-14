export type TaskStatus = 'assigned' | 'in_progress' | 'completed' | 'rejected' | 'on_hold';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface EmployeeTask {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  category: string;
  projectName: string;
  assignedAt: string;
  updates: TaskUpdate[];
}

export interface TaskUpdate {
  _id: string;
  progress: number;
  hoursWorked: number;
  description: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}
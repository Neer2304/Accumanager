import { TaskStatus, TaskPriority } from '../employee/types';

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'info';
    case 'assigned': return 'warning';
    case 'rejected': return 'error';
    case 'on_hold': return 'default';
    default: return 'default';
  }
};

export const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'completed': return 'CheckCircle';
    case 'in_progress': return 'PlayCircle';
    case 'assigned': return 'Pending';
    case 'rejected': return 'Cancel';
    case 'on_hold': return 'HourglassEmpty';
    default: return 'Pending';
  }
};

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'urgent': return 'error';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'success';
    default: return 'default';
  }
};

export const calculateTaskStats = (tasks: EmployeeTask[]) => {
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    assigned: tasks.filter(t => t.status === 'assigned').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
  };
};

export const formatTaskDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const isTaskOverdue = (task: EmployeeTask) => {
  return new Date(task.dueDate) < new Date() && task.status !== 'completed';
};
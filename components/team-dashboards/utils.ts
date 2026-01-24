// components/team-dashboard/utils.ts
import { EmployeeTask, EmployeeData } from './types';

export const getStatusColor = (status: EmployeeTask['status']) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'info';
    case 'assigned': return 'warning';
    case 'rejected': return 'error';
    case 'on_hold': return 'default';
    default: return 'default';
  }
};

export const getPriorityColor = (priority: EmployeeTask['priority']) => {
  switch (priority) {
    case 'urgent': return 'error';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'success';
    default: return 'default';
  }
};

export const calculateOverallStats = (employees: EmployeeData[]) => {
  if (employees.length === 0) return {
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionRate: 0
  };

  const totalTasks = employees.reduce((sum, emp) => sum + (emp.stats?.totalTasks || 0), 0);
  const completedTasks = employees.reduce((sum, emp) => sum + (emp.stats?.completedTasks || 0), 0);
  const overdueTasks = employees.reduce((sum, emp) => sum + (emp.stats?.overdueTasks || 0), 0);
  
  return {
    totalEmployees: employees.length,
    totalTasks,
    completedTasks,
    overdueTasks,
    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  };
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const isTaskOverdue = (dueDate: string, status: string) => {
  return new Date(dueDate) < new Date() && status !== 'completed';
};

export const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
};
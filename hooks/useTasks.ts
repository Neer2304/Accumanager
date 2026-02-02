// hooks/useTasks.ts
import { useState, useCallback } from 'react';
import { offlineStorage } from '@/utils/offlineStorage';
import { ProjectTask } from './useProjects';

interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  assignedTo?: string;
  projectId?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Online/offline detection
  useState(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  // Fetch all tasks with filters
  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        const offlineTasks = await offlineStorage.getItem<ProjectTask[]>('project_tasks') || [];
        const filteredTasks = filterTasks(offlineTasks, filters);
        setTasks(filteredTasks);
        setLoading(false);
        return filteredTasks;
      }

      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters?.projectId) params.append('projectId', filters.projectId);

      const queryString = params.toString();
      const url = `/api/tasks${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, { credentials: 'include' });

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tasks');
      }

      const fetchedTasks = result.tasks || result.data?.tasks || [];
      setTasks(fetchedTasks);
      setLoading(false);
      return fetchedTasks;

    } catch (err: any) {
      console.error('Fetch tasks error:', err);
      setError(err.message || 'Failed to load tasks');
      setLoading(false);
      return [];
    }
  }, [isOnline]);

  // Update task status
  const updateTaskStatus = useCallback(async (
    taskId: string, 
    status: ProjectTask['status']
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        // Update offline
        const offlineTasks = await offlineStorage.getItem<ProjectTask[]>('project_tasks') || [];
        const taskIndex = offlineTasks.findIndex(t => t._id === taskId);
        
        if (taskIndex === -1) {
          throw new Error('Task not found');
        }

        const updatedTask = {
          ...offlineTasks[taskIndex],
          status,
          isSynced: false,
        };

        offlineTasks[taskIndex] = updatedTask;
        await offlineStorage.setItem('project_tasks', offlineTasks);
        
        // Update local state
        setTasks(prev => prev.map(t => 
          t._id === taskId ? updatedTask : t
        ));
        
        setLoading(false);
        return {
          success: true,
          data: { task: updatedTask },
          message: 'Task updated offline. Will sync when online.',
        };
      }

      const response = await fetch('/api/tasks', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, status }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update task');
      }

      // Update local state
      if (result.data?.task) {
        setTasks(prev => prev.map(t => 
          t._id === taskId ? result.data.task : t
        ));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Update task status error:', err);
      setError(err.message || 'Failed to update task');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, [isOnline]);

  // Assign task to team member
  const assignTask = useCallback(async (
    taskId: string, 
    teamMemberId?: string,
    autoAssign = false
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/team/tasks/assign', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, teamMemberId, autoAssign }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to assign task');
      }

      // Update local state if needed
      if (result.data?.task) {
        setTasks(prev => prev.map(t => 
          t._id === taskId ? result.data.task : t
        ));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Assign task error:', err);
      setError(err.message || 'Failed to assign task');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, []);

  // Get task assignment suggestions
  const getTaskSuggestions = useCallback(async (taskId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/team/tasks/assign?taskId=${taskId}`, {
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to get suggestions');
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Get task suggestions error:', err);
      setError(err.message || 'Failed to get suggestions');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, []);

  // Helper to filter tasks
  const filterTasks = useCallback((taskList: ProjectTask[], filters?: TaskFilters) => {
    return taskList.filter(task => {
      if (filters?.status && filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }
      if (filters?.priority && filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }
      if (filters?.assignedTo && filters.assignedTo !== 'all' && task.assignedToId !== filters.assignedTo) {
        return false;
      }
      if (filters?.projectId && task.projectId !== filters.projectId) {
        return false;
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.projectName.toLowerCase().includes(searchLower) ||
          (task.assignedToName && task.assignedToName.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }, []);

  return {
    tasks,
    loading,
    error,
    isOnline,
    fetchTasks,
    updateTaskStatus,
    assignTask,
    getTaskSuggestions,
    filterTasks,
  };
}
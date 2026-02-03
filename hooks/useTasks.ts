// hooks/useTasks.ts
import { useState, useCallback, useEffect } from 'react';
import { offlineStorage } from '@/utils/offlineStorage';
import { ProjectTask } from './useProjects';

interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  assignedTo?: string;
  projectId?: string;
  teamMemberId?: string;
  category?: string;
}

interface ChecklistItem {
  _id?: string;
  description: string;
  isCompleted: boolean;
  order: number;
  completedBy?: string;
  completedAt?: Date;
}

interface TaskUpdateData {
  progress?: number;
  hoursWorked?: number;
  description?: string;
  status?: string;
  attachments?: any[];
}

interface EmployeeTaskData {
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: string | Date;
  estimatedHours?: number;
  priority?: string;
  projectId?: string;
  projectName?: string;
  category?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Online/offline detection
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

      const fetchedTasks = result.tasks || [];
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

  // Create a new task
  const createTask = useCallback(async (taskData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create task');
      }

      // Add to local state
      setTasks(prev => [result, ...prev]);
      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Create task error:', err);
      setError(err.message || 'Failed to create task');
      setLoading(false);
      return null;
    }
  }, []);

  // Update task
  const updateTask = useCallback(async (taskId: string, updateData: any) => {
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
          ...updateData,
          updatedAt: new Date(),
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
          task: updatedTask,
          message: 'Task updated offline. Will sync when online.',
        };
      }

      const response = await fetch('/api/tasks', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, ...updateData }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update task');
      }

      // Update local state
      if (result) {
        setTasks(prev => prev.map(t => 
          t._id === taskId ? result : t
        ));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Update task error:', err);
      setError(err.message || 'Failed to update task');
      setLoading(false);
      return null;
    }
  }, [isOnline]);

  // Update task status
  const updateTaskStatus = useCallback(async (
    taskId: string, 
    status: ProjectTask['status']
  ) => {
    return updateTask(taskId, { status });
  }, [updateTask]);

  // Delete task
  const deleteTask = useCallback(async (taskId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete task');
      }

      // Remove from local state
      setTasks(prev => prev.filter(t => t._id !== taskId));
      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Delete task error:', err);
      setError(err.message || 'Failed to delete task');
      setLoading(false);
      return null;
    }
  }, []);

  // ===== EMPLOYEE TASK ASSIGNMENT =====
  // Assign task to EMPLOYEE (for managers)
  const assignTaskToEmployee = useCallback(async (taskData: EmployeeTaskData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks/assign', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to assign task to employee');
      }

      // Add to local state
      if (result.task) {
        setTasks(prev => [result.task, ...prev]);
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Assign task to employee error:', err);
      setError(err.message || 'Failed to assign task to employee');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, []);

  // ===== TEAM TASK ASSIGNMENT =====
  // Assign task to TEAM MEMBER (for team tasks)
  const assignTaskToTeamMember = useCallback(async (
    taskId: string, 
    teamMemberId?: string,
    autoAssign = false
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/team/tasks/assigns', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, teamMemberId, autoAssign }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to assign task to team member');
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
      console.error('Assign task to team member error:', err);
      setError(err.message || 'Failed to assign task to team member');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, []);

  // Get task assignment suggestions for TEAM TASKS
  const getTeamTaskSuggestions = useCallback(async (taskId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/team/tasks/assigns?taskId=${taskId}`, {
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to get team task suggestions');
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Get team task suggestions error:', err);
      setError(err.message || 'Failed to get suggestions');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, []);

  // Unassign TEAM TASK
  const unassignTeamTask = useCallback(async (taskId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/team/tasks/assigns?taskId=${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to unassign team task');
      }

      // Update local state
      if (result.data) {
        setTasks(prev => prev.map(t => 
          t._id === taskId ? result.data : t
        ));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Unassign team task error:', err);
      setError(err.message || 'Failed to unassign team task');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, []);

  // ===== CHECKLIST MANAGEMENT =====
  const addChecklist = useCallback(async (taskId: string, checklistItems: ChecklistItem[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/team/tasks/checklist', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, checklistItems }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to add checklist');
      }

      // Update local state
      if (result.task) {
        setTasks(prev => prev.map(t => 
          t._id === taskId ? result.task : t
        ));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Add checklist error:', err);
      setError(err.message || 'Failed to add checklist');
      setLoading(false);
      return null;
    }
  }, []);

  const updateChecklistItem = useCallback(async (
    taskId: string, 
    itemId: string, 
    isCompleted: boolean
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/team/tasks/checklist', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, itemId, isCompleted }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update checklist item');
      }

      // Update local state
      if (result.task) {
        setTasks(prev => prev.map(t => 
          t._id === taskId ? result.task : t
        ));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Update checklist item error:', err);
      setError(err.message || 'Failed to update checklist item');
      setLoading(false);
      return null;
    }
  }, []);

  const deleteChecklistItem = useCallback(async (taskId: string, itemId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/team/tasks/checklist?taskId=${taskId}&itemId=${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete checklist item');
      }

      // Update local state
      if (result.task) {
        setTasks(prev => prev.map(t => 
          t._id === taskId ? result.task : t
        ));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Delete checklist item error:', err);
      setError(err.message || 'Failed to delete checklist item');
      setLoading(false);
      return null;
    }
  }, []);

  // ===== EMPLOYEE TASK MANAGEMENT =====
  const fetchEmployeeTasks = useCallback(async (employeeId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const url = employeeId 
        ? `/api/tasks/employee/${employeeId}`
        : '/api/tasks/employee/current';

      const response = await fetch(url, {
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch employee tasks');
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Fetch employee tasks error:', err);
      setError(err.message || 'Failed to fetch employee tasks');
      setLoading(false);
      return null;
    }
  }, []);

  // ===== MANAGER TASKS OVERVIEW =====
  const fetchManagerTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks/manager', {
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch manager tasks');
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Fetch manager tasks error:', err);
      setError(err.message || 'Failed to fetch manager tasks');
      setLoading(false);
      return null;
    }
  }, []);

  // ===== SUBMIT TASK UPDATE (for employees) =====
  const submitTaskUpdate = useCallback(async (taskId: string, updateData: TaskUpdateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, ...updateData }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit task update');
      }

      // Update local state
      if (result.task) {
        setTasks(prev => prev.map(t => 
          t._id === taskId ? result.task : t
        ));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Submit task update error:', err);
      setError(err.message || 'Failed to submit task update');
      setLoading(false);
      return null;
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
      if (filters?.teamMemberId && task.assignedToId !== filters.teamMemberId) {
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

  // Sync offline changes when coming online
  useEffect(() => {
    if (isOnline) {
      const syncOfflineChanges = async () => {
        try {
          const offlineTasks = await offlineStorage.getItem<ProjectTask[]>('project_tasks') || [];
          const unsyncedTasks = offlineTasks.filter(task => task.isSynced === false);
          
          if (unsyncedTasks.length > 0) {
            console.log(`Syncing ${unsyncedTasks.length} offline tasks...`);
            
            for (const task of unsyncedTasks) {
              try {
                await updateTask(task._id, task);
                // Mark as synced in offline storage
                const updatedOfflineTasks = offlineTasks.map(t => 
                  t._id === task._id ? { ...t, isSynced: true } : t
                );
                await offlineStorage.setItem('project_tasks', updatedOfflineTasks);
              } catch (err) {
                console.error('Failed to sync task:', task._id, err);
              }
            }
          }
        } catch (err) {
          console.error('Sync offline changes error:', err);
        }
      };

      syncOfflineChanges();
    }
  }, [isOnline, updateTask]);

  return {
    // State
    tasks,
    loading,
    error,
    isOnline,
    
    // ===== TASK CRUD OPERATIONS =====
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    
    // ===== EMPLOYEE TASK ASSIGNMENT =====
    assignTaskToEmployee, // For assigning to regular employees
    
    // ===== TEAM TASK ASSIGNMENT =====
    assignTaskToTeamMember, // For assigning to team members
    getTeamTaskSuggestions, // Get suggestions for team tasks
    unassignTeamTask, // Unassign team tasks
    
    // ===== CHECKLIST MANAGEMENT =====
    addChecklist,
    updateChecklistItem,
    deleteChecklistItem,
    
    // ===== EMPLOYEE/MANAGER SPECIFIC =====
    fetchEmployeeTasks,
    fetchManagerTasks,
    submitTaskUpdate,
    
    // ===== UTILITIES =====
    filterTasks,
  };
}
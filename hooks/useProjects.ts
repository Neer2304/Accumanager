// hooks/useProjects.ts
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { offlineStorage } from '@/utils/offlineStorage';

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  startDate: string;
  deadline: string;
  budget: number;
  clientName: string;
  category: 'sales' | 'marketing' | 'development' | 'internal' | 'client' | 'other';
  teamMembers: string[];
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  createdAt: string;
  tags: string[];
  isLocal?: boolean;
  isSynced?: boolean;
  updatedAt?: string;
}

export interface ProjectTask {
  _id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'in_review' | 'completed' | 'blocked' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  progress: number;
  assignedToId?: string;
  assignedToName?: string;
  estimatedHours: number;
  actualHours: number;
  projectId: string;
  projectName: string;
  tags: string[];
  createdAt: string;
  isLocal?: boolean;
  isSynced?: boolean;
}

export interface ProjectComment {
  _id: string;
  text: string;
  type: 'comment' | 'update' | 'milestone' | 'issue';
  userName: string;
  userAvatar?: string;
  createdAt: string;
  projectId: string;
  taskId?: string;
  attachments?: any[];
  isLocal?: boolean;
  isSynced?: boolean;
}

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  status: 'active' | 'away' | 'offline' | 'on_leave';
  performance: number;
  currentWorkload: number;
  skills: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  [key: string]: any;
}

export interface UseProjectsOptions {
  autoFetch?: boolean;
  cacheDuration?: number; // in milliseconds
  retryCount?: number;
  retryDelay?: number;
}

interface CacheItem {
  data: any;
  timestamp: number;
}

interface ProjectTasksResponse {
  tasks: ProjectTask[];
  pagination: any;
  statistics: any;
}

interface ProjectTeamResponse {
  project: any;
  teamAnalysis: any[];
  teamStats: any;
  recommendedMembers: any[];
}

export function useProjects(options: UseProjectsOptions = {}) {
  const {
    autoFetch = true,
    cacheDuration = 5 * 60 * 1000, // 5 minutes
    retryCount = 3,
    retryDelay = 1000,
  } = options;

  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [cache, setCache] = useState<Record<string, CacheItem>>({});

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch all projects
  const fetchProjects = useCallback(async (forceRefresh = false): Promise<Project[]> => {
    const cacheKey = 'all_projects';
    
    // Check cache if not forcing refresh
    if (!forceRefresh && cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < cacheDuration) {
      const cachedData = cache[cacheKey].data as Project[];
      setProjects(cachedData);
      return cachedData;
    }

    setLoading(true);
    setError(null);

    try {
      let data: Project[] = [];

      if (!isOnline) {
        // Try offline storage
        data = await offlineStorage.getItem<Project[]>('projects') || [];
        setProjects(data);
        setLoading(false);
        return data;
      }

      // Online fetch with retry logic
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
          const response = await fetch('/api/projects', {
            credentials: 'include',
            headers: {
              'Cache-Control': 'no-cache',
            },
          });

          if (!response.ok) {
            if (response.status === 401) {
              router.push('/login');
              throw new Error('Unauthorized');
            }
            if (response.status === 402) {
              throw new Error('Subscription required');
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const result: ApiResponse<{ projects: Project[] }> = await response.json();
          
          if (!result.success) {
            throw new Error(result.error || 'Failed to fetch projects');
          }

          data = result.data?.projects || [];
          
          // Update cache
          setCache(prev => ({
            ...prev,
            [cacheKey]: { data, timestamp: Date.now() }
          }));

          // Save to offline storage
          await offlineStorage.setItem('projects', data);
          
          setProjects(data);
          setLoading(false);
          return data;

        } catch (retryError: any) {
          if (attempt === retryCount) throw retryError;
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
      }

      return [];

    } catch (err: any) {
      console.error('Fetch projects error:', err);
      setError(err.message || 'Failed to load projects');
      
      // Fallback to offline storage
      const offlineData = await offlineStorage.getItem<Project[]>('projects') || [];
      setProjects(offlineData);
      
      setLoading(false);
      return offlineData;
    }
  }, [isOnline, cacheDuration, retryCount, retryDelay, router, cache]);

  // Fetch single project
  const fetchProject = useCallback(async (projectId: string): Promise<Project | null> => {
    const cacheKey = `project_${projectId}`;
    
    // Check cache
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < cacheDuration) {
      return cache[cacheKey].data as Project;
    }

    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        const allProjects = await offlineStorage.getItem<Project[]>('projects') || [];
        const project = allProjects.find(p => p._id === projectId);
        setLoading(false);
        return project || null;
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Project not found');
        }
        throw new Error(`Failed to fetch project: ${response.status}`);
      }

      const result: ApiResponse<{ project: Project }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch project');
      }

      // Update cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: { data: result.data?.project, timestamp: Date.now() }
      }));

      setLoading(false);
      return result.data?.project || null;

    } catch (err: any) {
      console.error('Fetch project error:', err);
      setError(err.message || 'Failed to load project');
      setLoading(false);
      return null;
    }
  }, [isOnline, cacheDuration, cache]);

  // Create project
  const createProject = useCallback(async (projectData: Partial<Project>): Promise<ApiResponse<{ project: Project }>> => {
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        // Create offline
        const newProject: Project = {
          _id: `local_${Date.now()}`,
          name: projectData.name || '',
          description: projectData.description || '',
          status: projectData.status || 'planning',
          priority: projectData.priority || 'medium',
          progress: 0,
          startDate: projectData.startDate || new Date().toISOString(),
          deadline: projectData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          budget: projectData.budget || 0,
          clientName: projectData.clientName || '',
          category: projectData.category || 'other',
          teamMembers: projectData.teamMembers || [],
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          blockedTasks: 0,
          createdAt: new Date().toISOString(),
          tags: projectData.tags || [],
          isLocal: true,
          isSynced: false,
        };

        // Save to offline storage
        const existing = await offlineStorage.getItem<Project[]>('projects') || [];
        await offlineStorage.setItem('projects', [...existing, newProject]);
        
        // Update local state
        setProjects(prev => [...prev, newProject]);
        
        setLoading(false);
        return {
          success: true,
          data: { project: newProject },
          message: 'Project created offline. Will sync when online.',
        };
      }

      // Online create
      const response = await fetch('/api/projects', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const result: ApiResponse<{ project: Project }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create project');
      }

      // Update cache and local state
      if (result.data?.project) {
        setProjects(prev => [...prev, result.data.project]);
        setCache(prev => ({
          ...prev,
          [`project_${result.data!.project._id}`]: { 
            data: result.data!.project, 
            timestamp: Date.now() 
          }
        }));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Create project error:', err);
      setError(err.message || 'Failed to create project');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, [isOnline]);

  // Update project
  const updateProject = useCallback(async (
    projectId: string, 
    updates: Partial<Project>
  ): Promise<ApiResponse<{ project: Project }>> => {
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        // Update offline
        const existing = await offlineStorage.getItem<Project[]>('projects') || [];
        const projectIndex = existing.findIndex(p => p._id === projectId);
        
        if (projectIndex === -1) {
          throw new Error('Project not found');
        }

        const updatedProject: Project = {
          ...existing[projectIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
          isSynced: false,
        };

        existing[projectIndex] = updatedProject;
        await offlineStorage.setItem('projects', existing);
        
        // Update local state
        setProjects(prev => prev.map(p => 
          p._id === projectId ? updatedProject : p
        ));
        
        setLoading(false);
        return {
          success: true,
          data: { project: updatedProject },
          message: 'Project updated offline. Will sync when online.',
        };
      }

      // Online update
      const response = await fetch('/api/projects', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          ...updates,
        }),
      });

      const result: ApiResponse<{ project: Project }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update project');
      }

      // Update cache and local state
      if (result.data?.project) {
        setProjects(prev => prev.map(p => 
          p._id === projectId ? result.data!.project : p
        ));
        setCache(prev => ({
          ...prev,
          [`project_${projectId}`]: { 
            data: result.data!.project, 
            timestamp: Date.now() 
          }
        }));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Update project error:', err);
      setError(err.message || 'Failed to update project');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, [isOnline]);

  // Delete project
  const deleteProject = useCallback(async (projectId: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        // Delete offline
        const existing = await offlineStorage.getItem<Project[]>('projects') || [];
        const filtered = existing.filter(p => p._id !== projectId);
        await offlineStorage.setItem('projects', filtered);
        
        // Update local state
        setProjects(prev => prev.filter(p => p._id !== projectId));
        
        // Clear cache
        setCache(prev => {
          const newCache = { ...prev };
          delete newCache[`project_${projectId}`];
          return newCache;
        });
        
        setLoading(false);
        return {
          success: true,
          message: 'Project deleted offline. Will sync when online.',
        };
      }

      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete project');
      }

      // Update local state and cache
      setProjects(prev => prev.filter(p => p._id !== projectId));
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[`project_${projectId}`];
        return newCache;
      });

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Delete project error:', err);
      setError(err.message || 'Failed to delete project');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, [isOnline]);

  // Fetch project tasks
  const fetchProjectTasks = useCallback(async (
    projectId: string, 
    filters?: {
      status?: string;
      priority?: string;
      assignedTo?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<ProjectTasksResponse>> => {
    const cacheKey = `project_tasks_${projectId}_${JSON.stringify(filters || {})}`;
    
    // Check cache
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < cacheDuration) {
      return { success: true, data: cache[cacheKey].data };
    }

    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        // For offline, we need to store tasks separately
        const offlineTasks = await offlineStorage.getItem<ProjectTask[]>('project_tasks') || [];
        const projectTasks = offlineTasks.filter(task => task.projectId === projectId);
        
        setLoading(false);
        return {
          success: true,
          data: {
            tasks: projectTasks,
            pagination: { page: 1, totalPages: 1, totalTasks: projectTasks.length },
            statistics: {},
          },
        };
      }

      // Build query string
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const queryString = params.toString();
      const url = `/api/projects/${projectId}/tasks${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }

      const result: ApiResponse<ProjectTasksResponse> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tasks');
      }

      // Update cache
      if (result.data) {
        setCache(prev => ({
          ...prev,
          [cacheKey]: { data: result.data, timestamp: Date.now() }
        }));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Fetch project tasks error:', err);
      setError(err.message || 'Failed to load tasks');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, [isOnline, cacheDuration, cache]);

  // Create project task
  const createProjectTask = useCallback(async (
    projectId: string, 
    taskData: Partial<ProjectTask>
  ): Promise<ApiResponse<{ task: ProjectTask }>> => {
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        // Create offline task
        const newTask: ProjectTask = {
          _id: `local_task_${Date.now()}`,
          title: taskData.title || '',
          description: taskData.description || '',
          status: taskData.status || 'not_started',
          priority: taskData.priority || 'medium',
          dueDate: taskData.dueDate,
          progress: taskData.progress || 0,
          assignedToId: taskData.assignedToId,
          assignedToName: taskData.assignedToName,
          estimatedHours: taskData.estimatedHours || 0,
          actualHours: taskData.actualHours || 0,
          projectId,
          projectName: taskData.projectName || '',
          tags: taskData.tags || [],
          createdAt: new Date().toISOString(),
          isLocal: true,
          isSynced: false,
        };

        // Save to offline storage
        const existingTasks = await offlineStorage.getItem<ProjectTask[]>('project_tasks') || [];
        await offlineStorage.setItem('project_tasks', [...existingTasks, newTask]);
        
        setLoading(false);
        return {
          success: true,
          data: { task: newTask },
          message: 'Task created offline. Will sync when online.',
        };
      }

      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const result: ApiResponse<{ task: ProjectTask }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create task');
      }

      // Clear cache for this project's tasks
      setCache(prev => {
        const newCache = { ...prev };
        Object.keys(newCache).forEach(key => {
          if (key.startsWith(`project_tasks_${projectId}`)) {
            delete newCache[key];
          }
        });
        return newCache;
      });

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Create project task error:', err);
      setError(err.message || 'Failed to create task');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, [isOnline]);

  // Fetch project team
  const fetchProjectTeam = useCallback(async (
    projectId: string
  ): Promise<ApiResponse<ProjectTeamResponse>> => {
    const cacheKey = `project_team_${projectId}`;
    
    // Check cache
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < cacheDuration) {
      return { success: true, data: cache[cacheKey].data };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/team`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch team: ${response.status}`);
      }

      const result: ApiResponse<ProjectTeamResponse> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch team');
      }

      // Update cache
      if (result.data) {
        setCache(prev => ({
          ...prev,
          [cacheKey]: { data: result.data, timestamp: Date.now() }
        }));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Fetch project team error:', err);
      setError(err.message || 'Failed to load team');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, [cacheDuration, cache]);

  // Assign team members to project
  const assignTeamMembers = useCallback(async (
    projectId: string,
    teamMemberIds: string[],
    action: 'assign' | 'remove' = 'assign'
  ): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/team`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamMemberIds, action }),
      });

      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to assign team members');
      }

      // Clear cache for this project
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[`project_team_${projectId}`];
        delete newCache[`project_${projectId}`];
        return newCache;
      });

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Assign team members error:', err);
      setError(err.message || 'Failed to assign team members');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, []);

  // Fetch project comments
  const fetchProjectComments = useCallback(async (
    projectId: string
  ): Promise<ApiResponse<{ comments: ProjectComment[] }>> => {
    const cacheKey = `project_comments_${projectId}`;
    
    // Check cache
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < cacheDuration) {
      return { success: true, data: cache[cacheKey].data };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }

      const result: ApiResponse<{ comments: ProjectComment[] }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch comments');
      }

      // Update cache
      if (result.data) {
        setCache(prev => ({
          ...prev,
          [cacheKey]: { data: result.data, timestamp: Date.now() }
        }));
      }

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Fetch project comments error:', err);
      setError(err.message || 'Failed to load comments');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, [cacheDuration, cache]);

  // Add project comment
  const addProjectComment = useCallback(async (
    projectId: string,
    commentData: { text: string; type?: string; taskId?: string; attachments?: any[] }
  ): Promise<ApiResponse<{ comment: ProjectComment }>> => {
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        // Create offline comment
        const newComment: ProjectComment = {
          _id: `local_comment_${Date.now()}`,
          text: commentData.text,
          type: commentData.type || 'comment',
          userName: 'You',
          userAvatar: '',
          createdAt: new Date().toISOString(),
          projectId,
          taskId: commentData.taskId,
          attachments: commentData.attachments || [],
          isLocal: true,
          isSynced: false,
        };

        // Save to offline storage
        const existingComments = await offlineStorage.getItem<ProjectComment[]>('project_comments') || [];
        await offlineStorage.setItem('project_comments', [...existingComments, newComment]);
        
        setLoading(false);
        return {
          success: true,
          data: { comment: newComment },
          message: 'Comment added offline. Will sync when online.',
        };
      }

      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      const result: ApiResponse<{ comment: ProjectComment }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to add comment');
      }

      // Clear cache for this project's comments
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[`project_comments_${projectId}`];
        return newCache;
      });

      setLoading(false);
      return result;

    } catch (err: any) {
      console.error('Add project comment error:', err);
      setError(err.message || 'Failed to add comment');
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  }, [isOnline]);

  // Sync offline data
  const syncOfflineData = useCallback(async (): Promise<{ synced: number; failed: number }> => {
    let synced = 0;
    let failed = 0;

    try {
      // Get offline projects
      const offlineProjects = await offlineStorage.getItem<Project[]>('projects') || [];
      const projectsToSync = offlineProjects.filter(p => p.isLocal && !p.isSynced);

      for (const project of projectsToSync) {
        try {
          const response = await createProject(project);
          if (response.success) {
            // Mark as synced in offline storage
            const updatedProjects = offlineProjects.map(p => 
              p._id === project._id ? { ...p, isSynced: true } : p
            );
            await offlineStorage.setItem('projects', updatedProjects);
            synced++;
          } else {
            failed++;
          }
        } catch (err) {
          failed++;
        }
      }

      // Get offline tasks
      const offlineTasks = await offlineStorage.getItem<ProjectTask[]>('project_tasks') || [];
      const tasksToSync = offlineTasks.filter(t => t.isLocal && !t.isSynced);

      for (const task of tasksToSync) {
        try {
          const response = await createProjectTask(task.projectId, task);
          if (response.success) {
            // Mark as synced
            const updatedTasks = offlineTasks.map(t => 
              t._id === task._id ? { ...t, isSynced: true } : t
            );
            await offlineStorage.setItem('project_tasks', updatedTasks);
            synced++;
          } else {
            failed++;
          }
        } catch (err) {
          failed++;
        }
      }

      // Get offline comments
      const offlineComments = await offlineStorage.getItem<ProjectComment[]>('project_comments') || [];
      const commentsToSync = offlineComments.filter(c => c.isLocal && !c.isSynced);

      for (const comment of commentsToSync) {
        try {
          const response = await addProjectComment(comment.projectId, {
            text: comment.text,
            type: comment.type,
            taskId: comment.taskId,
            attachments: comment.attachments,
          });
          if (response.success) {
            // Mark as synced
            const updatedComments = offlineComments.map(c => 
              c._id === comment._id ? { ...c, isSynced: true } : c
            );
            await offlineStorage.setItem('project_comments', updatedComments);
            synced++;
          } else {
            failed++;
          }
        } catch (err) {
          failed++;
        }
      }

      return { synced, failed };

    } catch (err) {
      console.error('Sync offline data error:', err);
      return { synced, failed };
    }
  }, [createProject, createProjectTask, addProjectComment]);

  // Clear cache
  const clearCache = useCallback((keys?: string[]) => {
    if (keys) {
      setCache(prev => {
        const newCache = { ...prev };
        keys.forEach(key => delete newCache[key]);
        return newCache;
      });
    } else {
      setCache({});
    }
  }, []);

  // Auto-fetch projects on mount
  useEffect(() => {
    if (autoFetch) {
      fetchProjects();
    }
  }, [autoFetch, fetchProjects]);

  return {
    // State
    projects,
    loading,
    error,
    isOnline,
    
    // Actions
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    fetchProjectTasks,
    createProjectTask,
    fetchProjectTeam,
    assignTeamMembers,
    fetchProjectComments,
    addProjectComment,
    
    // Utilities
    syncOfflineData,
    clearCache,
    retry: () => fetchProjects(true),
    
    // Helpers
    getProjectById: useCallback((id: string) => 
      projects.find(p => p._id === id), 
      [projects]
    ),
    
    filterProjects: useCallback((filters: {
      status?: string;
      category?: string;
      search?: string;
    }) => {
      return projects.filter(project => {
        if (filters.status && filters.status !== 'all' && project.status !== filters.status) {
          return false;
        }
        if (filters.category && filters.category !== 'all' && project.category !== filters.category) {
          return false;
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          return (
            project.name.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower) ||
            project.clientName.toLowerCase().includes(searchLower) ||
            project.tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
        return true;
      });
    }, [projects]),
  };
}
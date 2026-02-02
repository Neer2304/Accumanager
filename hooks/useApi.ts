// hooks/useApi.ts - Master hook that combines everything
import { useCallback } from 'react';
import { useProjects, Project, ProjectTask, TeamMember, ProjectComment } from './useProjects';
import { useTasks } from './useTasks';
import { useTeamPerformance } from './useTeamPerformance';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  [key: string]: any;
}

interface DashboardStats {
  projects: {
    total: number;
    active: number;
    completed: number;
    delayed: number;
  };
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
  team: any; // Replace with proper TeamPerformanceStats type if available
}

export function useApi() {
  const projects = useProjects();
  const tasks = useTasks();
  const teamPerformance = useTeamPerformance();

  // Unified error handler
  const handleError = useCallback((error: any, context: string) => {
    console.error(`${context} error:`, error);
    return {
      success: false,
      error: error.message || `Failed to ${context}`,
    };
  }, []);

  // Combined project and task operations
  const createProjectWithTasks = useCallback(async (
    projectData: Partial<Project>,
    initialTasks: Partial<ProjectTask>[] = []
  ) => {
    try {
      // Create project
      const projectResult = await projects.createProject(projectData);
      
      if (!projectResult.success || !projectResult.data?.project) {
        return projectResult;
      }

      const projectId = projectResult.data.project._id;

      // Create initial tasks
      const taskPromises = initialTasks.map(task => 
        projects.createProjectTask(projectId, {
          ...task,
          projectName: projectData.name || '',
        })
      );

      const taskResults = await Promise.all(taskPromises);
      const failedTasks = taskResults.filter(r => !r.success);

      if (failedTasks.length > 0) {
        console.warn(`${failedTasks.length} tasks failed to create`);
      }

      return {
        ...projectResult,
        tasksCreated: taskResults.length - failedTasks.length,
        tasksFailed: failedTasks.length,
      };

    } catch (error: any) {
      return handleError(error, 'create project with tasks');
    }
  }, [projects, handleError]);

  // Get project with all related data
  const getProjectWithDetails = useCallback(async (projectId: string) => {
    try {
      const [project, projectTasks, projectTeam] = await Promise.all([
        projects.fetchProject(projectId),
        projects.fetchProjectTasks(projectId),
        projects.fetchProjectTeam(projectId),
      ]);

      if (!project) {
        throw new Error('Project not found');
      }

      return {
        success: true,
        data: {
          project,
          tasks: projectTasks.data?.tasks || [],
          team: projectTeam.data,
        },
      };

    } catch (error: any) {
      return handleError(error, 'fetch project details');
    }
  }, [projects]);

  // Assign task with auto-suggestions
  const assignTaskWithSuggestion = useCallback(async (taskId: string, useAuto = true) => {
    try {
      if (useAuto) {
        // Get suggestions first
        const suggestions = await tasks.getTaskSuggestions(taskId);
        
        if (suggestions.success && suggestions.data?.suggestions?.length > 0) {
          const topSuggestion = suggestions.data.suggestions[0];
          return await tasks.assignTask(taskId, topSuggestion.id);
        }
      }
      
      // Fallback to auto-assign
      return await tasks.assignTask(taskId, undefined, true);

    } catch (error: any) {
      return handleError(error, 'assign task with suggestion');
    }
  }, [tasks, handleError]);

  // Sync all offline data
  const syncAllData = useCallback(async () => {
    try {
      const [projectsSynced, tasksSynced] = await Promise.all([
        projects.syncOfflineData(),
        tasks.fetchTasks(), // This will trigger sync
      ]);

      return {
        success: true,
        data: {
          projects: projectsSynced,
          tasks: Array.isArray(tasksSynced) ? tasksSynced.length : 0,
        },
        message: 'Data sync completed',
      };

    } catch (error: any) {
      return handleError(error, 'sync all data');
    }
  }, [projects, tasks, handleError]);

  // Get dashboard statistics
  const getDashboardStats = useCallback(async () => {
    try {
      const [projectsData, tasksData, performanceData] = await Promise.all([
        projects.fetchProjects(),
        tasks.fetchTasks(),
        teamPerformance.fetchTeamPerformance(),
      ]);

      const stats = {
        projects: {
          total: Array.isArray(projectsData) ? projectsData.length : 0,
          active: Array.isArray(projectsData) ? projectsData.filter(p => p.status === 'active').length : 0,
          completed: Array.isArray(projectsData) ? projectsData.filter(p => p.status === 'completed').length : 0,
          delayed: Array.isArray(projectsData) ? projectsData.filter(p => p.status === 'delayed').length : 0,
        },
        tasks: {
          total: Array.isArray(tasksData) ? tasksData.length : 0,
          completed: Array.isArray(tasksData) ? tasksData.filter(t => t.status === 'completed').length : 0,
          inProgress: Array.isArray(tasksData) ? tasksData.filter(t => t.status === 'in_progress').length : 0,
          overdue: Array.isArray(tasksData) ? tasksData.filter(t => 
            t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
          ).length : 0,
        },
        team: teamPerformance.stats,
      };

      return {
        success: true,
        data: stats,
      };

    } catch (error: any) {
      return handleError(error, 'fetch dashboard stats');
    }
  }, [projects, tasks, teamPerformance]);

  return {
    // Individual hooks
    projects,
    tasks,
    teamPerformance,

    // Combined operations
    createProjectWithTasks,
    getProjectWithDetails,
    assignTaskWithSuggestion,
    syncAllData,
    getDashboardStats,

    // State
    loading: projects.loading || tasks.loading || teamPerformance.loading,
    error: projects.error || tasks.error || teamPerformance.error,
    isOnline: projects.isOnline,
  };
}
// components/live-projects/hooks/useLiveProjectsData.ts
import { useState, useEffect } from 'react';
import { projectsApi } from '@/lib/api/projects';
import { LiveProject, ProjectUpdate } from '../types';

export const useLiveProjectsData = () => {
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Calculate project velocity
  const calculateVelocity = (project: any): number => {
    if (project.createdAt && project.completedTasks) {
      const created = new Date(project.createdAt);
      const now = new Date();
      const days = Math.max(1, (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return (project.completedTasks || 0) / days;
    }
    return Math.random() * 2 + 0.5;
  };

  // Map project status
  const mapProjectStatus = (status: string): LiveProject['status'] => {
    const statusMap: Record<string, LiveProject['status']> = {
      'active': 'active',
      'in-progress': 'active',
      'progress': 'active',
      'paused': 'paused',
      'on-hold': 'paused',
      'completed': 'completed',
      'done': 'completed',
      'finished': 'completed',
      'delayed': 'delayed',
      'behind': 'delayed',
      'overdue': 'delayed'
    };
    return statusMap[status?.toLowerCase()] || 'active';
  };

  // Map update type
  const mapUpdateType = (type: string): ProjectUpdate['type'] => {
    const typeMap: Record<string, ProjectUpdate['type']> = {
      'task_complete': 'task_complete',
      'task_completed': 'task_complete',
      'task_blocked': 'task_blocked',
      'blocked': 'task_blocked',
      'progress': 'progress',
      'milestone': 'milestone',
      'delay': 'delay',
      'deadline': 'delay'
    };
    return typeMap[type?.toLowerCase()] || 'progress';
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  // Calculate days remaining
  const calculateDaysRemaining = (deadline: string) => {
    try {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const diff = deadlineDate.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    } catch {
      return 30; // Default fallback
    }
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setError(null);
      
      // Fetch projects
      const projectsResponse = await projectsApi.getAll();
      
      if (projectsResponse.success && projectsResponse.projects) {
        const liveProjects: LiveProject[] = projectsResponse.projects.map((project: any) => ({
          id: project._id || project.id,
          name: project.name || project.title || 'Unnamed Project',
          description: project.description || 'No description available',
          progress: project.progress || 0,
          status: mapProjectStatus(project.status),
          team: project.teamMembers || [project.owner] || ['You'],
          deadline: project.deadline || project.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          tasks: {
            total: project.totalTasks || 0,
            completed: project.completedTasks || 0,
            inProgress: project.inProgressTasks || 0,
            blocked: project.blockedTasks || 0
          },
          lastUpdate: project.updatedAt || project.lastUpdated || new Date().toISOString(),
          velocity: calculateVelocity(project),
          userId: project.userId
        }));
        
        setProjects(liveProjects);
      } else {
        throw new Error(projectsResponse.error || 'Failed to fetch projects');
      }

      // Fetch updates
      try {
        const updatesResponse = await projectsApi.getUpdates(10);
        if (updatesResponse.updates) {
          setUpdates(updatesResponse.updates.map((update: any) => ({
            id: update._id || update.id,
            projectId: update.projectId,
            projectName: update.projectName || 'Project',
            type: mapUpdateType(update.type),
            description: update.description || update.message || 'Project updated',
            timestamp: update.timestamp || update.createdAt || new Date().toISOString(),
            user: update.user || update.userName || 'Team Member'
          })));
        }
      } catch (updatesError) {
        console.error('Error fetching updates:', updatesError);
        // Continue even if updates fail
      }

    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refreshData = () => {
    setLoading(true);
    fetchData();
  };

  return {
    loading,
    error,
    projects,
    updates,
    autoRefresh,
    setAutoRefresh,
    setError,
    refreshData,
    formatTime,
    calculateDaysRemaining
  };
};
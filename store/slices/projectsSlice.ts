// store/slices/projectsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// ============ TYPES ============

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'delayed' | 'planning' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: string;
  deadline: string;
  budget?: number;
  clientName?: string;
  category: string;
  teamMembers?: string[];
  tags?: string[];
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  projectTasks?: string[];
  comments?: string[];
  projectTaskStats?: {
    total: number;
    not_started: number;
    in_progress: number;
    in_review: number;
    completed: number;
    blocked: number;
    cancelled: number;
  };
}

export interface ProjectUpdate {
  _id: string;
  projectId: string;
  projectName: string;
  type: string;
  description: string;
  userId: string;
  user: string;
  timestamp: string;
  metadata?: any;
}

export interface ProjectComment {
  _id: string;
  text: string;
  type: 'comment' | 'note' | 'mention';
  userId: string;
  userName: string;
  userAvatar?: string;
  projectId: string;
  taskId?: string;
  attachments?: any[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTask {
  _id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'in_review' | 'completed' | 'blocked' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string | null;
  estimatedHours: number;
  projectId: string;
  projectName: string;
  assignedToId?: string;
  assignedToName?: string;
  assignedToEmail?: string;
  createdById: string;
  createdByName: string;
  userId: string;
  taskType: string;
  tags: string[];
  checkpoints?: any[];
  activityLog?: any[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStatistics {
  total: number;
  not_started: number;
  in_progress: number;
  in_review: number;
  completed: number;
  blocked: number;
  cancelled: number;
}

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  status: string;
  skills?: string[];
  experience?: number;
  projectMetrics?: {
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    totalTasks: number;
    completionRate: number;
    projectWorkload: number;
    lastContribution: string | null;
  };
  performance?: number;
  performanceBreakdown?: Record<string, any>;
}

export interface ProjectTeamAnalysis {
  project: Project;
  teamAnalysis: TeamMember[];
  teamStats: {
    totalTeamMembers: number;
    activeMembers: number;
    averagePerformance: number;
    totalCompletedTasks: number;
    totalInProgressTasks: number;
    totalOverdueTasks: number;
    averageCompletionRate: number;
    workloadDistribution: Array<{
      name: string;
      workload: number;
      tasks: number;
      completionRate: number;
    }>;
  };
  recommendedMembers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    recommendationScore: number;
    skills: string[];
    experience: number;
    currentWorkload: number;
    performanceScore: number;
    categoryMatch: number;
    workloadScore: number;
  }>;
}

export interface ProjectState {
  // Projects
  projects: Project[];
  currentProject: Project | null;
  
  // Project Tasks
  projectTasks: ProjectTask[];
  currentProjectTask: ProjectTask | null;
  taskStatistics: TaskStatistics | null;
  
  // Project Comments
  projectComments: ProjectComment[];
  
  // Project Updates
  projectUpdates: ProjectUpdate[];
  
  // Project Team
  projectTeamAnalysis: ProjectTeamAnalysis | null;
  
  // Pagination
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
  
  // UI States
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  projectTasks: [],
  currentProjectTask: null,
  taskStatistics: null,
  projectComments: [],
  projectUpdates: [],
  projectTeamAnalysis: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNext: false,
    hasPrev: false,
    limit: 50,
  },
  loading: false,
  error: null,
  successMessage: null,
};

// ============ ASYNC THUNKS ============

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params: { status?: string; category?: string } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.category) queryParams.append('category', params.category);
      
      const response = await axios.get(`/api/projects?${queryParams.toString()}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch projects');
    }
  }
);

// Fetch single project by ID
export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch project');
    }
  }
);

// Create new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: Partial<Project>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/projects', projectData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create project');
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, ...updateData }: { projectId: string; [key: string]: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/projects', { projectId, ...updateData });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update project');
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/projects?id=${projectId}`);
      return { projectId, message: response.data.message };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete project');
    }
  }
);

// Create sample projects
export const createSampleProjects = createAsyncThunk(
  'projects/createSampleProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/projects/sample');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create sample projects');
    }
  }
);

// ============ PROJECT TASKS ============

// Fetch project tasks
export const fetchProjectTasks = createAsyncThunk(
  'projects/fetchProjectTasks',
  async ({ 
    projectId, 
    status, 
    priority, 
    assignedTo, 
    search,
    page = 1,
    limit = 50 
  }: { 
    projectId: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
    search?: string;
    page?: number;
    limit?: number;
  }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);
      if (priority) queryParams.append('priority', priority);
      if (assignedTo) queryParams.append('assignedTo', assignedTo);
      if (search) queryParams.append('search', search);
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      const response = await axios.get(`/api/projects/${projectId}/tasks?${queryParams.toString()}`);
      return { projectId, ...response.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch project tasks');
    }
  }
);

// Create project task
export const createProjectTask = createAsyncThunk(
  'projects/createProjectTask',
  async ({ projectId, taskData }: { projectId: string; taskData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/tasks`, taskData);
      return { projectId, task: response.data.task };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create task');
    }
  }
);

// Fetch single project task
export const fetchProjectTaskById = createAsyncThunk(
  'projects/fetchProjectTaskById',
  async ({ projectId, taskId }: { projectId: string; taskId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/tasks/${taskId}`);
      return response.data.task;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch task');
    }
  }
);

// Update project task
export const updateProjectTask = createAsyncThunk(
  'projects/updateProjectTask',
  async ({ 
    projectId, 
    taskId, 
    ...updateData 
  }: { 
    projectId: string; 
    taskId: string; 
    [key: string]: any 
  }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/projects/${projectId}/tasks/${taskId}`, updateData);
      return { projectId, task: response.data.task };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update task');
    }
  }
);

// Delete project task
export const deleteProjectTask = createAsyncThunk(
  'projects/deleteProjectTask',
  async ({ projectId, taskId }: { projectId: string; taskId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/projects/${projectId}/tasks/${taskId}`);
      return { projectId, taskId, message: response.data.message };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete task');
    }
  }
);

// ============ PROJECT COMMENTS ============

// Fetch project comments
export const fetchProjectComments = createAsyncThunk(
  'projects/fetchProjectComments',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/comments`);
      return { projectId, comments: response.data.comments };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch comments');
    }
  }
);

// Create project comment
export const createProjectComment = createAsyncThunk(
  'projects/createProjectComment',
  async ({ 
    projectId, 
    text, 
    type = 'comment', 
    taskId,
    attachments 
  }: { 
    projectId: string;
    text: string;
    type?: string;
    taskId?: string;
    attachments?: any[];
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/comments`, {
        text,
        type,
        taskId,
        attachments
      });
      return { projectId, comment: response.data.comment };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create comment');
    }
  }
);

// ============ PROJECT UPDATES ============

// Fetch project updates
export const fetchProjectUpdates = createAsyncThunk(
  'projects/fetchProjectUpdates',
  async (limit: number = 20, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/projects/updates?limit=${limit}`);
      return response.data.updates;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch project updates');
    }
  }
);

// ============ PROJECT TEAM ============

// Fetch project team analysis
export const fetchProjectTeamAnalysis = createAsyncThunk(
  'projects/fetchProjectTeamAnalysis',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/team`);
      return { projectId, data: response.data.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch team analysis');
    }
  }
);

// Assign team members to project
export const assignTeamMembers = createAsyncThunk(
  'projects/assignTeamMembers',
  async ({ 
    projectId, 
    teamMemberIds,
    action = 'assign'
  }: { 
    projectId: string;
    teamMemberIds: string[];
    action?: 'assign' | 'remove';
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/team`, {
        teamMemberIds,
        action
      });
      return { projectId, data: response.data.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to assign team members');
    }
  }
);

// Update team member role in project
export const updateTeamMemberRole = createAsyncThunk(
  'projects/updateTeamMemberRole',
  async ({ 
    projectId, 
    teamMemberId,
    role,
    responsibilities,
    isLead = false
  }: { 
    projectId: string;
    teamMemberId: string;
    role: string;
    responsibilities?: string;
    isLead?: boolean;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/projects/${projectId}/team`, {
        teamMemberId,
        role,
        responsibilities,
        isLead
      });
      return { projectId, data: response.data.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update team member role');
    }
  }
);

// ============ SLICE ============

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    clearProjectSuccess: (state) => {
      state.successMessage = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearCurrentProjectTask: (state) => {
      state.currentProjectTask = null;
    },
    clearProjectTeamAnalysis: (state) => {
      state.projectTeamAnalysis = null;
    },
    setProjectTaskPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    resetProjectsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ============ PROJECTS ============
      
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects || [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Single Project
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload.project;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload.project);
        state.successMessage = 'Project created successfully';
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p._id === action.payload.project._id);
        if (index !== -1) {
          state.projects[index] = action.payload.project;
        }
        if (state.currentProject?._id === action.payload.project._id) {
          state.currentProject = action.payload.project;
        }
        state.successMessage = 'Project updated successfully';
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p._id !== action.payload.projectId);
        if (state.currentProject?._id === action.payload.projectId) {
          state.currentProject = null;
        }
        state.successMessage = action.payload.message || 'Project deleted successfully';
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Sample Projects
      .addCase(createSampleProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSampleProjects.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally refresh projects list or add to state
        state.successMessage = action.payload.message || 'Sample projects created';
      })
      .addCase(createSampleProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ PROJECT TASKS ============

      // Fetch Project Tasks
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTasks = action.payload.tasks || [];
        state.taskStatistics = action.payload.statistics || null;
        state.pagination = {
          currentPage: action.payload.pagination?.currentPage || 1,
          totalPages: action.payload.pagination?.totalPages || 1,
          totalTasks: action.payload.pagination?.totalTasks || 0,
          hasNext: action.payload.pagination?.hasNext || false,
          hasPrev: action.payload.pagination?.hasPrev || false,
          limit: action.payload.pagination?.limit || 50,
        };
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Project Task
      .addCase(createProjectTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProjectTask.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTasks.unshift(action.payload.task);
        state.successMessage = 'Task created successfully';
      })
      .addCase(createProjectTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Single Project Task
      .addCase(fetchProjectTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProjectTask = action.payload;
      })
      .addCase(fetchProjectTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Project Task
      .addCase(updateProjectTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projectTasks.findIndex(t => t._id === action.payload.task._id);
        if (index !== -1) {
          state.projectTasks[index] = action.payload.task;
        }
        if (state.currentProjectTask?._id === action.payload.task._id) {
          state.currentProjectTask = action.payload.task;
        }
        state.successMessage = 'Task updated successfully';
      })
      .addCase(updateProjectTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Project Task
      .addCase(deleteProjectTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProjectTask.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTasks = state.projectTasks.filter(t => t._id !== action.payload.taskId);
        if (state.currentProjectTask?._id === action.payload.taskId) {
          state.currentProjectTask = null;
        }
        state.successMessage = action.payload.message || 'Task deleted successfully';
      })
      .addCase(deleteProjectTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ PROJECT COMMENTS ============

      // Fetch Project Comments
      .addCase(fetchProjectComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectComments.fulfilled, (state, action) => {
        state.loading = false;
        state.projectComments = action.payload.comments || [];
      })
      .addCase(fetchProjectComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Project Comment
      .addCase(createProjectComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProjectComment.fulfilled, (state, action) => {
        state.loading = false;
        state.projectComments.unshift(action.payload.comment);
        state.successMessage = 'Comment added successfully';
      })
      .addCase(createProjectComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ PROJECT UPDATES ============

      // Fetch Project Updates
      .addCase(fetchProjectUpdates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectUpdates.fulfilled, (state, action) => {
        state.loading = false;
        state.projectUpdates = action.payload || [];
      })
      .addCase(fetchProjectUpdates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ PROJECT TEAM ============

      // Fetch Project Team Analysis
      .addCase(fetchProjectTeamAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectTeamAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTeamAnalysis = action.payload.data;
      })
      .addCase(fetchProjectTeamAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Assign Team Members
      .addCase(assignTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally refresh team analysis or show success message
        state.successMessage = action.payload.data?.message || 'Team members updated';
      })
      .addCase(assignTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Team Member Role
      .addCase(updateTeamMemberRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeamMemberRole.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.data?.message || 'Team member role updated';
      })
      .addCase(updateTeamMemberRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearProjectError,
  clearProjectSuccess,
  clearCurrentProject,
  clearCurrentProjectTask,
  clearProjectTeamAnalysis,
  setProjectTaskPage,
  resetProjectsState,
} = projectsSlice.actions;

export default projectsSlice.reducer;
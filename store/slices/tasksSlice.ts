// store/slices/tasksSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  estimatedHours?: number;
  actualHours?: number;
  progress: number;
  category: string;
  projectId?: string;
  projectName?: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedBy?: string;
  assignedByName?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  checklist?: ChecklistItem[];
  updates?: TaskUpdate[];
}

export interface ChecklistItem {
  _id: string;
  description: string;
  isCompleted: boolean;
  order: number;
  completedBy?: string;
  completedAt?: string;
}

export interface TaskUpdate {
  _id: string;
  employeeId: string;
  employeeName: string;
  description: string;
  hoursWorked: number;
  progress: number;
  attachments?: any[];
  completedItems?: string[];
  createdAt: string;
}

export interface EmployeeTask extends Task {
  updates: TaskUpdate[];
}

export interface Employee {
  _id: string;
  name: string;
  role: string;
  department: string;
}

export interface EmployeeTaskStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface EmployeeWithTasks {
  employee: Employee;
  stats: EmployeeTaskStats;
  recentTasks: Task[];
}

export interface ManagerDashboardData {
  summary: {
    totalEmployees: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completionRate: number;
  };
  employees: EmployeeWithTasks[];
  recentActivities: TaskUpdate[];
}

export interface TaskState {
  // Regular tasks (from Task model)
  tasks: Task[];
  currentTask: Task | null;
  
  // Employee tasks (from EmployeeTask model)
  employeeTasks: EmployeeTask[];
  currentEmployeeTask: EmployeeTask | null;
  
  // Manager dashboard
  managerDashboard: ManagerDashboardData | null;
  
  // Employee-specific
  employeeTaskStats: {
    [employeeId: string]: EmployeeTaskStats;
  };
  
  // Pagination
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  
  // UI states
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  employeeTasks: [],
  currentEmployeeTask: null,
  managerDashboard: null,
  employeeTaskStats: {},
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNext: false,
    hasPrev: false,
  },
  loading: false,
  error: null,
  successMessage: null,
};

// ============ ASYNC THUNKS ============

// Fetch all tasks for a user
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: { 
    projectId?: string; 
    status?: string; 
    assignedTo?: string;
    page?: number;
    limit?: number;
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.projectId) queryParams.append('projectId', params.projectId);
      if (params.status) queryParams.append('status', params.status);
      if (params.assignedTo) queryParams.append('assignedTo', params.assignedTo);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await axios.get(`/api/tasks?${queryParams.toString()}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

// Fetch single task by ID
export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/tasks/${taskId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch task');
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Partial<Task>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/tasks', taskData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create task');
    }
  }
);

// Update a task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, ...updateData }: { taskId: string; [key: string]: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/tasks', { taskId, ...updateData });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update task');
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/tasks?id=${taskId}`);
      return { taskId, message: response.data.message };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete task');
    }
  }
);

// ============ EMPLOYEE TASK ACTIONS ============

// Fetch employee's tasks (for the logged-in employee)
export const fetchEmployeeTasks = createAsyncThunk(
  'tasks/fetchEmployeeTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/tasks/employee/current');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch employee tasks');
    }
  }
);

// Fetch tasks for a specific employee (manager view)
export const fetchEmployeeTasksById = createAsyncThunk(
  'tasks/fetchEmployeeTasksById',
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/tasks/employee/${employeeId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch employee tasks');
    }
  }
);

// Update task progress (employee update)
export const updateTaskProgress = createAsyncThunk(
  'tasks/updateTaskProgress',
  async (updateData: {
    taskId: string;
    progress: number;
    hoursWorked?: number;
    description?: string;
    attachments?: any[];
    status?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/tasks/update', updateData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update task progress');
    }
  }
);

// Assign task to employee (manager)
export const assignTask = createAsyncThunk(
  'tasks/assignTask',
  async (taskData: {
    title: string;
    description?: string;
    assignedTo: string;
    dueDate: string;
    estimatedHours?: number;
    priority?: string;
    projectId?: string;
    projectName?: string;
    category?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/tasks/assign', taskData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to assign task');
    }
  }
);

// Fetch manager dashboard data
export const fetchManagerDashboard = createAsyncThunk(
  'tasks/fetchManagerDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/tasks/manager');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch manager dashboard');
    }
  }
);

// ============ CHECKLIST ACTIONS ============

// Add checklist items to task
export const addChecklistItems = createAsyncThunk(
  'tasks/addChecklistItems',
  async ({ taskId, checklistItems }: { taskId: string; checklistItems: { description: string }[] }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/team/tasks/checklist', { taskId, checklistItems });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to add checklist items');
    }
  }
);

// Toggle checklist item completion
export const toggleChecklistItem = createAsyncThunk(
  'tasks/toggleChecklistItem',
  async ({ taskId, itemId, isCompleted }: { taskId: string; itemId: string; isCompleted: boolean }, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/team/tasks/checklist', { taskId, itemId, isCompleted });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update checklist item');
    }
  }
);

// Delete checklist item
export const deleteChecklistItem = createAsyncThunk(
  'tasks/deleteChecklistItem',
  async ({ taskId, itemId }: { taskId: string; itemId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/team/tasks/checklist?taskId=${taskId}&itemId=${itemId}`);
      return { taskId, itemId, message: response.data.message };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete checklist item');
    }
  }
);

// ============ SLICE ============

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    clearTaskSuccess: (state) => {
      state.successMessage = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearCurrentEmployeeTask: (state) => {
      state.currentEmployeeTask = null;
    },
    setTaskPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    resetTaskState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks || [];
        state.pagination = {
          currentPage: action.payload.pagination?.currentPage || 1,
          totalPages: action.payload.pagination?.totalPages || 1,
          totalTasks: action.payload.pagination?.totalTasks || 0,
          hasNext: action.payload.pagination?.hasNext || false,
          hasPrev: action.payload.pagination?.hasPrev || false,
        };
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Single Task
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
        state.successMessage = 'Task created successfully';
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?._id === action.payload._id) {
          state.currentTask = action.payload;
        }
        state.successMessage = 'Task updated successfully';
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(t => t._id !== action.payload.taskId);
        if (state.currentTask?._id === action.payload.taskId) {
          state.currentTask = null;
        }
        state.successMessage = action.payload.message || 'Task deleted successfully';
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ EMPLOYEE TASKS ============

      // Fetch Employee Tasks (Current Employee)
      .addCase(fetchEmployeeTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeTasks = action.payload.tasks || [];
      })
      .addCase(fetchEmployeeTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Employee Tasks by ID
      .addCase(fetchEmployeeTasksById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeTasksById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployeeTask = action.payload;
        if (action.payload.stats) {
          const employeeId = action.meta.arg;
          state.employeeTaskStats[employeeId] = action.payload.stats;
        }
      })
      .addCase(fetchEmployeeTasksById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Task Progress (Employee)
      .addCase(updateTaskProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskProgress.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload.task;
        const index = state.employeeTasks.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
          state.employeeTasks[index] = { ...state.employeeTasks[index], ...updatedTask };
        }
        if (state.currentEmployeeTask?._id === updatedTask._id) {
          state.currentEmployeeTask = { ...state.currentEmployeeTask, ...updatedTask };
        }
        state.successMessage = action.payload.message || 'Task updated successfully';
      })
      .addCase(updateTaskProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Assign Task
      .addCase(assignTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Task assigned successfully';
        // Optionally refresh the list or add to state
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Manager Dashboard
      .addCase(fetchManagerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.managerDashboard = action.payload;
      })
      .addCase(fetchManagerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ CHECKLIST ACTIONS ============

      // Add Checklist Items
      .addCase(addChecklistItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addChecklistItems.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload.task;
        
        // Update in tasks array
        const taskIndex = state.tasks.findIndex(t => t._id === updatedTask._id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updatedTask };
        }
        
        // Update in employee tasks array
        const empTaskIndex = state.employeeTasks.findIndex(t => t._id === updatedTask._id);
        if (empTaskIndex !== -1) {
          state.employeeTasks[empTaskIndex] = { ...state.employeeTasks[empTaskIndex], ...updatedTask };
        }
        
        // Update current task
        if (state.currentTask?._id === updatedTask._id) {
          state.currentTask = { ...state.currentTask, ...updatedTask };
        }
        
        // Update current employee task
        if (state.currentEmployeeTask?._id === updatedTask._id) {
          state.currentEmployeeTask = { ...state.currentEmployeeTask, ...updatedTask };
        }
        
        state.successMessage = action.payload.message || 'Checklist added successfully';
      })
      .addCase(addChecklistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle Checklist Item
      .addCase(toggleChecklistItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleChecklistItem.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload.task;
        
        // Update in tasks array
        const taskIndex = state.tasks.findIndex(t => t._id === updatedTask._id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updatedTask };
        }
        
        // Update in employee tasks array
        const empTaskIndex = state.employeeTasks.findIndex(t => t._id === updatedTask._id);
        if (empTaskIndex !== -1) {
          state.employeeTasks[empTaskIndex] = { ...state.employeeTasks[empTaskIndex], ...updatedTask };
        }
        
        // Update current task
        if (state.currentTask?._id === updatedTask._id) {
          state.currentTask = { ...state.currentTask, ...updatedTask };
        }
        
        // Update current employee task
        if (state.currentEmployeeTask?._id === updatedTask._id) {
          state.currentEmployeeTask = { ...state.currentEmployeeTask, ...updatedTask };
        }
        
        state.successMessage = action.payload.message || 'Checklist updated successfully';
      })
      .addCase(toggleChecklistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Checklist Item
      .addCase(deleteChecklistItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChecklistItem.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, itemId } = action.payload;
        
        // Update in tasks array
        const taskIndex = state.tasks.findIndex(t => t._id === taskId);
        if (taskIndex !== -1 && state.tasks[taskIndex].checklist) {
          state.tasks[taskIndex].checklist = state.tasks[taskIndex].checklist?.filter(
            item => item._id !== itemId
          );
        }
        
        // Update in employee tasks array
        const empTaskIndex = state.employeeTasks.findIndex(t => t._id === taskId);
        if (empTaskIndex !== -1 && state.employeeTasks[empTaskIndex].checklist) {
          state.employeeTasks[empTaskIndex].checklist = state.employeeTasks[empTaskIndex].checklist?.filter(
            item => item._id !== itemId
          );
        }
        
        // Update current task
        if (state.currentTask?._id === taskId && state.currentTask.checklist) {
          state.currentTask.checklist = state.currentTask.checklist.filter(
            item => item._id !== itemId
          );
        }
        
        // Update current employee task
        if (state.currentEmployeeTask?._id === taskId && state.currentEmployeeTask.checklist) {
          state.currentEmployeeTask.checklist = state.currentEmployeeTask.checklist.filter(
            item => item._id !== itemId
          );
        }
        
        state.successMessage = action.payload.message || 'Checklist item removed';
      })
      .addCase(deleteChecklistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearTaskError,
  clearTaskSuccess,
  clearCurrentTask,
  clearCurrentEmployeeTask,
  setTaskPage,
  resetTaskState,
} = tasksSlice.actions;

export default tasksSlice.reducer;
// store/slices/notesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// ============ TYPES ============

export interface Note {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  color: string;
  icon: string;
  isPublic: boolean;
  status: 'active' | 'archived' | 'deleted';
  passwordProtected: boolean;
  sharedWith?: Array<{
    userId: string;
    role: 'viewer' | 'editor' | 'commenter';
    addedAt: string;
  }>;
  projectId?: string;
  eventId?: string;
  taskId?: string;
  wordCount: number;
  readTime: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  readCount?: number;
  lastReadAt?: string;
}

export interface NoteStats {
  totalNotes: number;
  totalWords: number;
  avgWords: number;
  categories: Array<{ _id: string; count: number }>;
  priorities: Array<{ _id: string; count: number }>;
  statuses: Array<{ _id: string; count: number }>;
  recentActivity: Array<{
    _id: string;
    title: string;
    category: string;
    priority: string;
    updatedAt: string;
    editCount: number;
    readCount: number;
  }>;
  dailyNotes: Array<{ _id: string; count: number }>;
  topTags: Array<{ tag: string; count: number }>;
}

export interface NoteShareData {
  userIds: string[];
  role: 'viewer' | 'editor' | 'commenter';
}

export interface BulkActionData {
  noteIds: string[];
  action: 'archive' | 'delete' | 'restore' | 'changeCategory' | 'changePriority';
  data?: Record<string, any>;
}

export interface NotesState {
  // Notes
  notes: Note[];
  currentNote: Note | null;
  
  // Search & Stats
  searchResults: Note[];
  noteStats: NoteStats | null;
  
  // Shared notes
  sharedNotes: Note[];
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  
  // UI States
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  
  // Password protection
  requiresPassword: boolean;
  isPasswordValid: boolean;
}

const initialState: NotesState = {
  notes: [],
  currentNote: null,
  searchResults: [],
  noteStats: null,
  sharedNotes: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  },
  loading: false,
  error: null,
  successMessage: null,
  requiresPassword: false,
  isPasswordValid: false,
};

// ============ ASYNC THUNKS ============

// Fetch all notes
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (params: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    priority?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    shared?: boolean;
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.category) queryParams.append('category', params.category);
      if (params.tag) queryParams.append('tag', params.tag);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.shared) queryParams.append('shared', 'true');
      
      const response = await axios.get(`/api/note?${queryParams.toString()}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch notes');
    }
  }
);

// Fetch single note by ID
export const fetchNoteById = createAsyncThunk(
  'notes/fetchNoteById',
  async ({ 
    noteId, 
    password 
  }: { 
    noteId: string; 
    password?: string 
  }, { rejectWithValue }) => {
    try {
      const config: any = {};
      
      if (password) {
        config.headers = {
          'x-note-password': password
        };
      }
      
      const response = await axios.get(`/api/note/${noteId}`, config);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.requiresPassword) {
        return rejectWithValue({ requiresPassword: true, message: 'Password required' });
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch note');
    }
  }
);

// Create new note
export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData: Partial<Note>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/note', noteData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create note');
    }
  }
);

// Update note
export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ 
    noteId, 
    ...updateData 
  }: { 
    noteId: string; 
    [key: string]: any 
  }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/note?id=${noteId}`, updateData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update note');
    }
  }
);

// Delete note
export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (noteId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/note?id=${noteId}`);
      return { noteId, message: response.data.message };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete note');
    }
  }
);

// Share note
export const shareNote = createAsyncThunk(
  'notes/shareNote',
  async ({ 
    noteId, 
    shareData 
  }: { 
    noteId: string; 
    shareData: NoteShareData 
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/note/${noteId}/share`, shareData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to share note');
    }
  }
);

// Search notes
export const searchNotes = createAsyncThunk(
  'notes/searchNotes',
  async ({ 
    query, 
    limit = 10 
  }: { 
    query: string; 
    limit?: number 
  }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/note/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to search notes');
    }
  }
);

// Get note stats
export const fetchNoteStats = createAsyncThunk(
  'notes/fetchNoteStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/note/stats');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch note stats');
    }
  }
);

// Bulk actions
export const bulkNoteAction = createAsyncThunk(
  'notes/bulkNoteAction',
  async (bulkData: BulkActionData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/note/bulk', bulkData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to perform bulk action');
    }
  }
);

// Fetch shared notes
export const fetchSharedNotes = createAsyncThunk(
  'notes/fetchSharedNotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/note?shared=true');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch shared notes');
    }
  }
);

// ============ SLICE ============

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearNoteError: (state) => {
      state.error = null;
    },
    clearNoteSuccess: (state) => {
      state.successMessage = null;
    },
    clearCurrentNote: (state) => {
      state.currentNote = null;
      state.requiresPassword = false;
      state.isPasswordValid = false;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setNotePage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setRequiresPassword: (state, action: PayloadAction<boolean>) => {
      state.requiresPassword = action.payload;
    },
    setIsPasswordValid: (state, action: PayloadAction<boolean>) => {
      state.isPasswordValid = action.payload;
    },
    resetNotesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ============ FETCH NOTES ============
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.data || [];
        state.pagination = {
          page: action.payload.pagination?.page || 1,
          limit: action.payload.pagination?.limit || 20,
          total: action.payload.pagination?.total || 0,
          pages: action.payload.pagination?.pages || 1,
        };
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ FETCH NOTE BY ID ============
      .addCase(fetchNoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.requiresPassword = false;
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNote = action.payload.data;
        state.requiresPassword = false;
        state.isPasswordValid = true;
      })
      .addCase(fetchNoteById.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        
        if (payload?.requiresPassword) {
          state.requiresPassword = true;
          state.error = 'Password required';
        } else {
          state.error = payload as string;
        }
      })

      // ============ CREATE NOTE ============
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.unshift(action.payload.data);
        state.successMessage = action.payload.message || 'Note created successfully';
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ UPDATE NOTE ============
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const updatedNote = action.payload.data;
        const index = state.notes.findIndex(n => n._id === updatedNote._id);
        
        if (index !== -1) {
          state.notes[index] = updatedNote;
        }
        
        if (state.currentNote?._id === updatedNote._id) {
          state.currentNote = updatedNote;
        }
        
        state.successMessage = action.payload.message || 'Note updated successfully';
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ DELETE NOTE ============
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter(n => n._id !== action.payload.noteId);
        
        if (state.currentNote?._id === action.payload.noteId) {
          state.currentNote = null;
        }
        
        state.successMessage = action.payload.message || 'Note deleted successfully';
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ SHARE NOTE ============
      .addCase(shareNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareNote.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.data) {
          const updatedNote = action.payload.data;
          const index = state.notes.findIndex(n => n._id === updatedNote._id);
          
          if (index !== -1) {
            state.notes[index] = updatedNote;
          }
          
          if (state.currentNote?._id === updatedNote._id) {
            state.currentNote = updatedNote;
          }
        }
        
        state.successMessage = action.payload.message || 'Note shared successfully';
      })
      .addCase(shareNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ SEARCH NOTES ============
      .addCase(searchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data || [];
      })
      .addCase(searchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ FETCH NOTE STATS ============
      .addCase(fetchNoteStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoteStats.fulfilled, (state, action) => {
        state.loading = false;
        state.noteStats = action.payload.data;
      })
      .addCase(fetchNoteStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ BULK NOTE ACTION ============
      .addCase(bulkNoteAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkNoteAction.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Bulk action completed successfully';
        
        // Optionally refresh notes or handle specific actions
        // For now, we'll just show success message
      })
      .addCase(bulkNoteAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ FETCH SHARED NOTES ============
      .addCase(fetchSharedNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSharedNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.sharedNotes = action.payload.data || [];
      })
      .addCase(fetchSharedNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearNoteError,
  clearNoteSuccess,
  clearCurrentNote,
  clearSearchResults,
  setNotePage,
  setRequiresPassword,
  setIsPasswordValid,
  resetNotesState,
} = notesSlice.actions;

export default notesSlice.reducer;
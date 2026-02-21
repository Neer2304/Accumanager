// store/slices/contactSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { contactService } from '@/services/contactService';

// ============ TYPES ============

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
}

export interface ContactSubmission {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  ticketNumber: string;
  source: string;
  priority: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    pageUrl?: string;
  };
  tags?: string[];
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    ticketNumber: string;
    estimatedResponseTime: string;
    emailSent: boolean;
    savedToDatabase: boolean;
    timestamp: string;
  };
}

export interface ContactStats {
  totalSubmissions: number;
  newSubmissions: number;
  inProgressSubmissions: number;
  resolvedSubmissions: number;
  recentSubmissions: ContactSubmission[];
  submissionsByDate: Array<{ date: string; count: number }>;
  submissionsByPriority: Array<{ priority: string; count: number }>;
}

export interface ContactState {
  // Current submission
  currentSubmission: ContactSubmission | null;
  submissions: ContactSubmission[];
  
  // Form state
  formData: ContactFormData;
  formErrors: Record<string, string>;
  isFormValid: boolean;
  
  // Submission response
  lastSubmission: ContactSubmissionResponse['data'] | null;
  
  // Stats
  stats: ContactStats | null;
  
  // UI States
  loading: boolean;
  submitting: boolean;
  error: string | null;
  successMessage: string | null;
  
  // Rate limit
  remainingRequests: number;
  rateLimitReset: number | null;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
};

const initialState: ContactState = {
  currentSubmission: null,
  submissions: [],
  formData: initialFormData,
  formErrors: {},
  isFormValid: false,
  lastSubmission: null,
  stats: null,
  loading: false,
  submitting: false,
  error: null,
  successMessage: null,
  remainingRequests: 5,
  rateLimitReset: null,
};

// ============ ASYNC THUNKS ============

// Submit contact form
export const submitContactForm = createAsyncThunk(
  'contact/submitForm',
  async (formData: ContactFormData, { rejectWithValue }) => {
    try {
      const response = await contactService.submitContactForm(formData);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to submit contact form');
    }
  }
);

// Fetch contact stats (admin only)
export const fetchContactStats = createAsyncThunk(
  'contact/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await contactService.getContactStats();
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch contact stats');
    }
  }
);

// Fetch all submissions (admin only)
export const fetchSubmissions = createAsyncThunk(
  'contact/fetchSubmissions',
  async (params: { page?: number; limit?: number; status?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await contactService.getSubmissions(params);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch submissions');
    }
  }
);

// Fetch single submission (admin only)
export const fetchSubmissionById = createAsyncThunk(
  'contact/fetchSubmissionById',
  async (submissionId: string, { rejectWithValue }) => {
    try {
      const response = await contactService.getSubmissionById(submissionId);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch submission');
    }
  }
);

// Update submission status (admin only)
export const updateSubmissionStatus = createAsyncThunk(
  'contact/updateStatus',
  async ({ submissionId, status }: { submissionId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await contactService.updateSubmissionStatus(submissionId, status);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update status');
    }
  }
);

// Add note to submission (admin only)
export const addSubmissionNote = createAsyncThunk(
  'contact/addNote',
  async ({ submissionId, note }: { submissionId: string; note: string }, { rejectWithValue }) => {
    try {
      const response = await contactService.addSubmissionNote(submissionId, note);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add note');
    }
  }
);

// Delete submission (admin only)
export const deleteSubmission = createAsyncThunk(
  'contact/deleteSubmission',
  async (submissionId: string, { rejectWithValue }) => {
    try {
      const response = await contactService.deleteSubmission(submissionId);
      return { submissionId, message: response.message };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete submission');
    }
  }
);

// ============ VALIDATION FUNCTIONS ============

const validateForm = (formData: ContactFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.message?.trim()) {
    errors.message = 'Message is required';
  }
  
  if (formData.phone && !/^[0-9+\-\s]{10,15}$/.test(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  
  return errors;
};

// ============ SLICE ============

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    // Form actions
    updateFormField: (state, action: PayloadAction<{ field: keyof ContactFormData; value: string }>) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
      
      // Validate form
      const errors = validateForm(state.formData);
      state.formErrors = errors;
      state.isFormValid = Object.keys(errors).length === 0;
    },
    
    updateFormData: (state, action: PayloadAction<Partial<ContactFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
      
      // Validate form
      const errors = validateForm(state.formData);
      state.formErrors = errors;
      state.isFormValid = Object.keys(errors).length === 0;
    },
    
    resetForm: (state) => {
      state.formData = initialFormData;
      state.formErrors = {};
      state.isFormValid = false;
    },
    
    setFormErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.formErrors = action.payload;
      state.isFormValid = Object.keys(action.payload).length === 0;
    },
    
    // Rate limit actions
    updateRateLimit: (state, action: PayloadAction<{ remaining: number; resetTime: number }>) => {
      state.remainingRequests = action.payload.remaining;
      state.rateLimitReset = action.payload.resetTime;
    },
    
    decrementRateLimit: (state) => {
      if (state.remainingRequests > 0) {
        state.remainingRequests -= 1;
      }
    },
    
    // UI actions
    clearContactError: (state) => {
      state.error = null;
    },
    
    clearContactSuccess: (state) => {
      state.successMessage = null;
    },
    
    clearLastSubmission: (state) => {
      state.lastSubmission = null;
    },
    
    resetContactState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ============ SUBMIT CONTACT FORM ============
      .addCase(submitContactForm.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.submitting = false;
        state.lastSubmission = action.payload.data || null;
        state.successMessage = action.payload.message || 'Message sent successfully';
        
        // Add to submissions if it's included
        if (action.payload.submission) {
          state.submissions.unshift(action.payload.submission);
        }
        
        // Reset form on success
        state.formData = initialFormData;
        state.formErrors = {};
        state.isFormValid = false;
        
        // Decrement rate limit
        if (state.remainingRequests > 0) {
          state.remainingRequests -= 1;
        }
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })

      // ============ FETCH CONTACT STATS ============
      .addCase(fetchContactStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchContactStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ FETCH SUBMISSIONS ============
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.data?.submissions || [];
        if (action.payload.data?.stats) {
          state.stats = action.payload.data.stats;
        }
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ FETCH SUBMISSION BY ID ============
      .addCase(fetchSubmissionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubmission = action.payload.data;
      })
      .addCase(fetchSubmissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ UPDATE SUBMISSION STATUS ============
      .addCase(updateSubmissionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubmissionStatus.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in submissions array
        const updatedSubmission = action.payload.data;
        const index = state.submissions.findIndex(s => s._id === updatedSubmission._id);
        if (index !== -1) {
          state.submissions[index] = updatedSubmission;
        }
        
        // Update current submission
        if (state.currentSubmission?._id === updatedSubmission._id) {
          state.currentSubmission = updatedSubmission;
        }
        
        state.successMessage = action.payload.message || 'Status updated successfully';
      })
      .addCase(updateSubmissionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ ADD SUBMISSION NOTE ============
      .addCase(addSubmissionNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubmissionNote.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update current submission
        if (state.currentSubmission) {
          state.currentSubmission = action.payload.data;
        }
        
        state.successMessage = action.payload.message || 'Note added successfully';
      })
      .addCase(addSubmissionNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ DELETE SUBMISSION ============
      .addCase(deleteSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = state.submissions.filter(s => s._id !== action.payload.submissionId);
        
        if (state.currentSubmission?._id === action.payload.submissionId) {
          state.currentSubmission = null;
        }
        
        state.successMessage = action.payload.message || 'Submission deleted successfully';
      })
      .addCase(deleteSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ============ SELECTORS ============

export const selectContactForm = (state: { contact: ContactState }) => state.contact.formData;
export const selectContactFormErrors = (state: { contact: ContactState }) => state.contact.formErrors;
export const selectIsFormValid = (state: { contact: ContactState }) => state.contact.isFormValid;
export const selectContactSubmitting = (state: { contact: ContactState }) => state.contact.submitting;
export const selectContactError = (state: { contact: ContactState }) => state.contact.error;
export const selectContactSuccess = (state: { contact: ContactState }) => state.contact.successMessage;
export const selectLastSubmission = (state: { contact: ContactState }) => state.contact.lastSubmission;
export const selectRemainingRequests = (state: { contact: ContactState }) => state.contact.remainingRequests;
export const selectRateLimitReset = (state: { contact: ContactState }) => state.contact.rateLimitReset;
export const selectContactSubmissions = (state: { contact: ContactState }) => state.contact.submissions;
export const selectCurrentSubmission = (state: { contact: ContactState }) => state.contact.currentSubmission;
export const selectContactStats = (state: { contact: ContactState }) => state.contact.stats;
export const selectContactLoading = (state: { contact: ContactState }) => state.contact.loading;

export const {
  updateFormField,
  updateFormData,
  resetForm,
  setFormErrors,
  updateRateLimit,
  decrementRateLimit,
  clearContactError,
  clearContactSuccess,
  clearLastSubmission,
  resetContactState,
} = contactSlice.actions;

export default contactSlice.reducer;
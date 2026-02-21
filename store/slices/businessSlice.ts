// store/slices/businessSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// ============ TYPES ============

export interface Business {
  id: string;
  businessName: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  gstNumber?: string;
  phone?: string;
  email?: string;
  logo?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessState {
  // Business data
  business: Business | null;
  
  // Form state for editing
  formData: Partial<Business>;
  
  // UI States
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  
  // Status
  isNew: boolean;
  isDirty: boolean;
}

const initialState: BusinessState = {
  business: null,
  formData: {},
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
  isNew: false,
  isDirty: false,
};

// ============ ASYNC THUNKS ============

// Fetch business data
export const fetchBusiness = createAsyncThunk(
  'business/fetchBusiness',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/business');
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        // Business not found - this is okay, return empty
        return { success: true, business: null };
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch business');
    }
  }
);

// Create new business
export const createBusiness = createAsyncThunk(
  'business/createBusiness',
  async (businessData: Partial<Business>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/business', businessData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create business');
    }
  }
);

// Update business
export const updateBusiness = createAsyncThunk(
  'business/updateBusiness',
  async (businessData: Partial<Business>, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/business', businessData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update business');
    }
  }
);

// Save business (create or update based on existence)
export const saveBusiness = createAsyncThunk(
  'business/saveBusiness',
  async (businessData: Partial<Business>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { business: BusinessState };
      const hasBusiness = !!state.business.business;
      
      if (hasBusiness) {
        const response = await axios.put('/api/business', businessData);
        return response.data;
      } else {
        const response = await axios.post('/api/business', businessData);
        return response.data;
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save business');
    }
  }
);

// Upload business logo
export const uploadBusinessLogo = createAsyncThunk(
  'business/uploadLogo',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/business/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to upload logo');
    }
  }
);

// ============ SLICE ============

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    // Form actions
    updateFormField: (state, action: PayloadAction<{ field: keyof Business; value: any }>) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
      
      // Check if form is dirty (different from saved business)
      if (state.business) {
        state.isDirty = JSON.stringify(state.formData) !== JSON.stringify(state.business);
      } else {
        state.isDirty = Object.keys(state.formData).length > 0;
      }
    },
    
    updateFormData: (state, action: PayloadAction<Partial<Business>>) => {
      state.formData = { ...state.formData, ...action.payload };
      
      // Check if form is dirty
      if (state.business) {
        state.isDirty = JSON.stringify(state.formData) !== JSON.stringify(state.business);
      } else {
        state.isDirty = Object.keys(state.formData).length > 0;
      }
    },
    
    resetForm: (state) => {
      state.formData = state.business ? { ...state.business } : {};
      state.isDirty = false;
    },
    
    clearForm: (state) => {
      state.formData = {};
      state.isDirty = false;
    },
    
    // Business actions
    setBusiness: (state, action: PayloadAction<Business | null>) => {
      state.business = action.payload;
      if (action.payload) {
        state.formData = { ...action.payload };
        state.isNew = false;
      } else {
        state.formData = {};
        state.isNew = true;
      }
      state.isDirty = false;
    },
    
    // UI actions
    clearBusinessError: (state) => {
      state.error = null;
    },
    
    clearBusinessSuccess: (state) => {
      state.successMessage = null;
    },
    
    resetBusinessState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ============ FETCH BUSINESS ============
      .addCase(fetchBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusiness.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.business) {
          state.business = action.payload.business;
          state.formData = { ...action.payload.business };
          state.isNew = false;
        } else {
          state.business = null;
          state.formData = {};
          state.isNew = true;
        }
        
        state.isDirty = false;
      })
      .addCase(fetchBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ CREATE BUSINESS ============
      .addCase(createBusiness.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.saving = false;
        state.business = action.payload.business;
        state.formData = { ...action.payload.business };
        state.isNew = false;
        state.isDirty = false;
        state.successMessage = 'Business created successfully';
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })

      // ============ UPDATE BUSINESS ============
      .addCase(updateBusiness.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.saving = false;
        state.business = action.payload.business;
        state.formData = { ...action.payload.business };
        state.isNew = false;
        state.isDirty = false;
        state.successMessage = 'Business updated successfully';
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })

      // ============ SAVE BUSINESS ============
      .addCase(saveBusiness.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveBusiness.fulfilled, (state, action) => {
        state.saving = false;
        state.business = action.payload.business;
        state.formData = { ...action.payload.business };
        state.isNew = false;
        state.isDirty = false;
        state.successMessage = action.payload.business.isNew 
          ? 'Business created successfully' 
          : 'Business updated successfully';
      })
      .addCase(saveBusiness.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })

      // ============ UPLOAD LOGO ============
      .addCase(uploadBusinessLogo.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(uploadBusinessLogo.fulfilled, (state, action) => {
        state.saving = false;
        
        if (action.payload.logoUrl && state.business) {
          state.business.logo = action.payload.logoUrl;
          state.formData.logo = action.payload.logoUrl;
          state.successMessage = 'Logo uploaded successfully';
        }
      })
      .addCase(uploadBusinessLogo.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

// ============ SELECTORS ============

export const selectBusiness = (state: { business: BusinessState }) => state.business.business;
export const selectBusinessFormData = (state: { business: BusinessState }) => state.business.formData;
export const selectBusinessLoading = (state: { business: BusinessState }) => state.business.loading;
export const selectBusinessSaving = (state: { business: BusinessState }) => state.business.saving;
export const selectBusinessError = (state: { business: BusinessState }) => state.business.error;
export const selectBusinessSuccess = (state: { business: BusinessState }) => state.business.successMessage;
export const selectIsNewBusiness = (state: { business: BusinessState }) => state.business.isNew;
export const selectIsBusinessDirty = (state: { business: BusinessState }) => state.business.isDirty;

// Business field selectors
export const selectBusinessName = (state: { business: BusinessState }) => state.business.business?.businessName;
export const selectBusinessAddress = (state: { business: BusinessState }) => state.business.business?.address;
export const selectBusinessCity = (state: { business: BusinessState }) => state.business.business?.city;
export const selectBusinessState = (state: { business: BusinessState }) => state.business.business?.state;
export const selectBusinessPincode = (state: { business: BusinessState }) => state.business.business?.pincode;
export const selectBusinessCountry = (state: { business: BusinessState }) => state.business.business?.country;
export const selectBusinessGST = (state: { business: BusinessState }) => state.business.business?.gstNumber;
export const selectBusinessPhone = (state: { business: BusinessState }) => state.business.business?.phone;
export const selectBusinessEmail = (state: { business: BusinessState }) => state.business.business?.email;
export const selectBusinessLogo = (state: { business: BusinessState }) => state.business.business?.logo;

export const {
  updateFormField,
  updateFormData,
  resetForm,
  clearForm,
  setBusiness,
  clearBusinessError,
  clearBusinessSuccess,
  resetBusinessState,
} = businessSlice.actions;

export default businessSlice.reducer;
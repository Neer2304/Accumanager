// hooks/useContact.ts
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  submitContactForm,
  fetchContactStats,
  fetchSubmissions,
  fetchSubmissionById,
  updateSubmissionStatus,
  addSubmissionNote,
  deleteSubmission,
  updateFormField,
  updateFormData,
  resetForm,
  setFormErrors,
  clearContactError,
  clearContactSuccess,
  clearLastSubmission,
  selectContactForm,
  selectContactFormErrors,
  selectIsFormValid,
  selectContactSubmitting,
  selectContactError,
  selectContactSuccess,
  selectLastSubmission,
  selectRemainingRequests,
  selectRateLimitReset,
  selectContactSubmissions,
  selectCurrentSubmission,
  selectContactStats,
  selectContactLoading,
} from '@/store/slices/contactSlice';
import { contactService } from '@/services/contactService';
import { ContactFormData } from '@/store/slices/contactSlice';

interface UseContactOptions {
  autoClearSuccess?: boolean;
  successTimeout?: number;
}

export const useContact = (options: UseContactOptions = {}) => {
  const {
    autoClearSuccess = true,
    successTimeout = 5000,
  } = options;

  const dispatch = useDispatch();

  // Selectors
  const formData = useSelector(selectContactForm);
  const formErrors = useSelector(selectContactFormErrors);
  const isFormValid = useSelector(selectIsFormValid);
  const submitting = useSelector(selectContactSubmitting);
  const error = useSelector(selectContactError);
  const successMessage = useSelector(selectContactSuccess);
  const lastSubmission = useSelector(selectLastSubmission);
  const remainingRequests = useSelector(selectRemainingRequests);
  const rateLimitReset = useSelector(selectRateLimitReset);
  const submissions = useSelector(selectContactSubmissions);
  const currentSubmission = useSelector(selectCurrentSubmission);
  const stats = useSelector(selectContactStats);
  const loading = useSelector(selectContactLoading);

  // Auto-clear success message
  useEffect(() => {
    if (autoClearSuccess && successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearContactSuccess());
      }, successTimeout);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage, autoClearSuccess, successTimeout, dispatch]);

  // Form handlers
  const handleFieldChange = useCallback((field: keyof ContactFormData, value: string) => {
    dispatch(updateFormField({ field, value }));
  }, [dispatch]);

  const handleFormChange = useCallback((data: Partial<ContactFormData>) => {
    dispatch(updateFormData(data));
  }, [dispatch]);

  const handleResetForm = useCallback(() => {
    dispatch(resetForm());
  }, [dispatch]);

  const handleValidateForm = useCallback(() => {
    const errors = contactService.validateForm(formData);
    dispatch(setFormErrors(errors));
    return Object.keys(errors).length === 0;
  }, [formData, dispatch]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (!handleValidateForm()) {
      return { success: false, errors: formErrors };
    }
    
    const result = await dispatch(submitContactForm(formData) as any);
    return result.payload;
  }, [dispatch, formData, formErrors, handleValidateForm]);

  // Admin handlers
  const handleFetchStats = useCallback(() => {
    return dispatch(fetchContactStats() as any);
  }, [dispatch]);

  const handleFetchSubmissions = useCallback((params?: { page?: number; limit?: number; status?: string }) => {
    return dispatch(fetchSubmissions(params) as any);
  }, [dispatch]);

  const handleFetchSubmission = useCallback((submissionId: string) => {
    return dispatch(fetchSubmissionById(submissionId) as any);
  }, [dispatch]);

  const handleUpdateStatus = useCallback((submissionId: string, status: string) => {
    return dispatch(updateSubmissionStatus({ submissionId, status }) as any);
  }, [dispatch]);

  const handleAddNote = useCallback((submissionId: string, note: string) => {
    return dispatch(addSubmissionNote({ submissionId, note }) as any);
  }, [dispatch]);

  const handleDeleteSubmission = useCallback((submissionId: string) => {
    return dispatch(deleteSubmission(submissionId) as any);
  }, [dispatch]);

  // Clear handlers
  const handleClearError = useCallback(() => {
    dispatch(clearContactError());
  }, [dispatch]);

  const handleClearSuccess = useCallback(() => {
    dispatch(clearContactSuccess());
  }, [dispatch]);

  const handleClearLastSubmission = useCallback(() => {
    dispatch(clearLastSubmission());
  }, [dispatch]);

  // Rate limit helpers
  const canSubmit = useMemo(() => {
    return remainingRequests > 0 && !submitting && isFormValid;
  }, [remainingRequests, submitting, isFormValid]);

  const rateLimitResetTime = useMemo(() => {
    if (!rateLimitReset) return null;
    return new Date(rateLimitReset).toLocaleTimeString();
  }, [rateLimitReset]);

  const timeUntilReset = useMemo(() => {
    if (!rateLimitReset) return null;
    const now = Date.now();
    const diff = Math.max(0, rateLimitReset - now);
    return Math.ceil(diff / 1000); // seconds
  }, [rateLimitReset]);

  return {
    // Form state
    formData,
    formErrors,
    isFormValid,
    
    // UI states
    submitting,
    loading,
    error,
    successMessage,
    
    // Data
    lastSubmission,
    submissions,
    currentSubmission,
    stats,
    
    // Rate limit
    remainingRequests,
    rateLimitReset,
    rateLimitResetTime,
    timeUntilReset,
    canSubmit,
    
    // Form handlers
    handleFieldChange,
    handleFormChange,
    handleResetForm,
    handleValidateForm,
    handleSubmit,
    
    // Admin handlers
    handleFetchStats,
    handleFetchSubmissions,
    handleFetchSubmission,
    handleUpdateStatus,
    handleAddNote,
    handleDeleteSubmission,
    
    // Clear handlers
    handleClearError,
    handleClearSuccess,
    handleClearLastSubmission,
  };
};

// Specialized hooks for different use cases
export const useContactForm = () => {
  const {
    formData,
    formErrors,
    isFormValid,
    submitting,
    error,
    successMessage,
    remainingRequests,
    canSubmit,
    handleFieldChange,
    handleFormChange,
    handleResetForm,
    handleValidateForm,
    handleSubmit,
    handleClearError,
    handleClearSuccess,
  } = useContact({ autoClearSuccess: true });

  return {
    formData,
    formErrors,
    isFormValid,
    submitting,
    error,
    successMessage,
    remainingRequests,
    canSubmit,
    handleFieldChange,
    handleFormChange,
    handleResetForm,
    handleValidateForm,
    handleSubmit,
    handleClearError,
    handleClearSuccess,
  };
};

export const useContactAdmin = () => {
  const {
    loading,
    error,
    successMessage,
    submissions,
    currentSubmission,
    stats,
    handleFetchStats,
    handleFetchSubmissions,
    handleFetchSubmission,
    handleUpdateStatus,
    handleAddNote,
    handleDeleteSubmission,
    handleClearError,
    handleClearSuccess,
  } = useContact();

  return {
    loading,
    error,
    successMessage,
    submissions,
    currentSubmission,
    stats,
    fetchStats: handleFetchStats,
    fetchSubmissions: handleFetchSubmissions,
    fetchSubmission: handleFetchSubmission,
    updateStatus: handleUpdateStatus,
    addNote: handleAddNote,
    deleteSubmission: handleDeleteSubmission,
    clearError: handleClearError,
    clearSuccess: handleClearSuccess,
  };
};

export default useContact;
// // store/hooks/useProfile.ts
// import { useEffect, useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch } from '../store';
// import {
//   fetchProfile,
//   updateProfile,
//   updatePreferences,
//   changePassword,
//   uploadAvatar,
//   deleteAccount,
//   clearError,
//   clearUpdateSuccess,
//   resetProfile,
//   selectProfile,
//   selectProfileLoading,
//   selectPreferencesLoading,
//   selectProfileError,
//   selectUpdateSuccess,
//   selectUserName,
//   selectUserEmail,
//   selectUserRole,
//   selectUserPreferences,
//   selectUserBusinessInfo,
// } from '../slices/profileSlice';
// import { ProfileUpdateData, PreferencesData } from '@/services/profileService';

// interface UseProfileReturn {
//   // State
//   profile: ReturnType<typeof selectProfile>;
//   loading: boolean;
//   preferencesLoading: boolean;
//   error: string | null;
//   updateSuccess: boolean;
//   userName: string;
//   userEmail: string;
//   userRole: string;
//   userPreferences: ReturnType<typeof selectUserPreferences>;
//   userBusinessInfo: ReturnType<typeof selectUserBusinessInfo>;

//   // Actions
//   loadProfile: () => Promise<void>;
//   updateUserProfile: (data: ProfileUpdateData) => Promise<boolean>;
//   updateUserPreferences: (data: PreferencesData) => Promise<boolean>;
//   changeUserPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
//   uploadUserAvatar: (file: File) => Promise<string | null>;
//   deleteUserAccount: (password: string) => Promise<boolean>;
//   resetProfileState: () => void;
//   clearProfileError: () => void;
//   clearProfileUpdateSuccess: () => void;

//   // Helpers
//   isAdmin: boolean;
//   isManager: boolean;
//   hasBusinessInfo: boolean;
// }

// export const useProfile = (autoLoad: boolean = true): UseProfileReturn => {
//   const dispatch = useDispatch<AppDispatch>();

//   // Selectors
//   const profile = useSelector(selectProfile);
//   const loading = useSelector(selectProfileLoading);
//   const preferencesLoading = useSelector(selectPreferencesLoading);
//   const error = useSelector(selectProfileError);
//   const updateSuccess = useSelector(selectUpdateSuccess);
//   const userName = useSelector(selectUserName);
//   const userEmail = useSelector(selectUserEmail);
//   const userRole = useSelector(selectUserRole);
//   const userPreferences = useSelector(selectUserPreferences);
//   const userBusinessInfo = useSelector(selectUserBusinessInfo);

//   // Actions
//   const loadProfile = useCallback(async () => {
//     await dispatch(fetchProfile()).unwrap();
//   }, [dispatch]);

//   const updateUserProfile = useCallback(async (data: ProfileUpdateData): Promise<boolean> => {
//     try {
//       await dispatch(updateProfile(data)).unwrap();
//       return true;
//     } catch {
//       return false;
//     }
//   }, [dispatch]);

//   const updateUserPreferences = useCallback(async (data: PreferencesData): Promise<boolean> => {
//     try {
//       await dispatch(updatePreferences(data)).unwrap();
//       return true;
//     } catch {
//       return false;
//     }
//   }, [dispatch]);

//   const changeUserPassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
//     try {
//       await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
//       return true;
//     } catch {
//       return false;
//     }
//   }, [dispatch]);

//   const uploadUserAvatar = useCallback(async (file: File): Promise<string | null> => {
//     try {
//       const result = await dispatch(uploadAvatar(file)).unwrap();
//       return result.avatarUrl;
//     } catch {
//       return null;
//     }
//   }, [dispatch]);

//   const deleteUserAccount = useCallback(async (password: string): Promise<boolean> => {
//     try {
//       await dispatch(deleteAccount(password)).unwrap();
//       return true;
//     } catch {
//       return false;
//     }
//   }, [dispatch]);

//   const resetProfileState = useCallback(() => {
//     dispatch(resetProfile());
//   }, [dispatch]);

//   const clearProfileError = useCallback(() => {
//     dispatch(clearError());
//   }, [dispatch]);

//   const clearProfileUpdateSuccess = useCallback(() => {
//     dispatch(clearUpdateSuccess());
//   }, [dispatch]);

//   // Derived state
//   const isAdmin = userRole === 'admin';
//   const isManager = userRole === 'manager' || userRole === 'admin';
//   const hasBusinessInfo = !!(userBusinessInfo.businessName || userBusinessInfo.gstNumber);

//   // Auto-load profile on mount
//   useEffect(() => {
//     if (autoLoad && !profile && !loading) {
//       loadProfile();
//     }
//   }, [autoLoad, profile, loading, loadProfile]);

//   return {
//     // State
//     profile,
//     loading,
//     preferencesLoading,
//     error,
//     updateSuccess,
//     userName,
//     userEmail,
//     userRole,
//     userPreferences,
//     userBusinessInfo,

//     // Actions
//     loadProfile,
//     updateUserProfile,
//     updateUserPreferences,
//     changeUserPassword,
//     uploadUserAvatar,
//     deleteUserAccount,
//     resetProfileState,
//     clearProfileError,
//     clearProfileUpdateSuccess,

//     // Helpers
//     isAdmin,
//     isManager,
//     hasBusinessInfo,
//   };
// };
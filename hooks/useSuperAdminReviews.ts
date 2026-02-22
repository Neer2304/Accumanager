// hooks/useSuperAdminReviews.ts
import { useAdminReviews } from './useAdminReviews';

export const useSuperAdminReviews = (autoLoad: boolean = true) => {
  return useAdminReviews({ autoLoad, isSuperAdmin: true });
};
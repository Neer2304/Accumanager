// components/googlepricing/types.ts
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  originalPrice?: number;
  description: string;
  popular: boolean;
  features: {
    included: Array<{
      name: string;
    }>;
    excluded: string[];
  };
  limits: {
    customers: number;
    products: number;
    invoices: number;
    storageMB: number;
    users: number;
    supportHours: number;
  };
  savingPercentage?: number;
}

export interface PricingCardProps {
  plan: PricingPlan;
  isAuthenticated: boolean;
  onSubscribe: (planId: string) => void;
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string;
}

export interface PricingGridProps {
  plans: PricingPlan[];
  isAuthenticated: boolean;
  onSubscribe: (planId: string) => void;
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string;
}

export interface FAQ {
  question: string;
  answer: string;
}
// components/googlesecurity/types.ts
import { ReactNode } from 'react';

export interface SecurityFeature {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  category: 'infrastructure' | 'application' | 'compliance' | 'privacy';
  details: string[];
}

export interface ComplianceStandard {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'in-progress' | 'planned';
  icon: ReactNode;
}

export interface SecurityStat {
  label: string;
  value: string;
  icon: ReactNode;
}

export interface SecurityPageProps {
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string;
}
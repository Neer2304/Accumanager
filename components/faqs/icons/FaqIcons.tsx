// components/faqs/icons/FaqIcons.tsx
import React from 'react';
import {
  Help as HelpIcon,
  AccountCircle as AccountIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  TrendingUp as AnalyticsIcon,
  CalendarMonth as AttendanceIcon,
  Group as TeamIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Lightbulb as LightbulbIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

// Export individual icons
export {
  HelpIcon,
  AccountIcon,
  PaymentIcon,
  SecurityIcon,
  SettingsIcon,
  AnalyticsIcon,
  AttendanceIcon,
  TeamIcon,
  ExpandMoreIcon,
  ExpandLessIcon,
  SearchIcon,
  EmailIcon,
  PhoneIcon,
  ChatIcon,
  ScheduleIcon,
  StarIcon,
  CheckIcon,
  LightbulbIcon,
  ArrowForwardIcon,
};

// Also export as an object for backward compatibility
export const FaqIcons = {
  general: HelpIcon,
  account: AccountIcon,
  billing: PaymentIcon,
  security: SecurityIcon,
  settings: SettingsIcon,
  analytics: AnalyticsIcon,
  attendance: AttendanceIcon,
  team: TeamIcon,
  expandMore: ExpandMoreIcon,
  expandLess: ExpandLessIcon,
  search: SearchIcon,
  email: EmailIcon,
  phone: PhoneIcon,
  chat: ChatIcon,
  schedule: ScheduleIcon,
  star: StarIcon,
  check: CheckIcon,
  lightbulb: LightbulbIcon,
  arrowForward: ArrowForwardIcon,
};

export type FaqIconType = keyof typeof FaqIcons;
// components/faqs/index.ts
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
} from './icons/FaqIcons';

// Export as object for backward compatibility
export { FaqIcons } from './icons/FaqIcons';

// Export other components
export { FaqHeader } from './FaqHeader';
export { FaqCategory } from './FaqCategory';
export { FaqQuestion } from './FaqQuestion';
export { FaqSearch } from './FaqSearch';
export { FaqContactCard } from './FaqContactCard';
export { faqCategories, popularQuestions, contactInfo } from './content/FaqContent';
export type { FaqCategory as FaqCategoryType, FaqQuestion as FaqQuestionType } from './content/FaqContent';
// components/resources/index.ts
export { ResourceHeader } from './ResourceHeader';
export { ResourceSearch } from './ResourceSearch';
export { ResourceCategory } from './ResourceCategory';
export { ResourceItem } from './ResourceItem';
export { QuickHelpCards } from './QuickHelpCards';
export { CommonIssues } from './CommonIssues';
export { ContactSupport } from './ContactSupport';

// Data exports
export { resourcesData, moduleIcons, moduleColors } from './data/resourcesData';
export { quickHelpData, commonIssuesData } from './data/moduleGuides';
export { contactInfo, supportTeam } from './data/contactInfo';

// Types
export type { ResourceItem as ResourceItemType } from './data/resourcesData';
export type { ResourceCategory as ResourceCategoryType } from './data/resourcesData';
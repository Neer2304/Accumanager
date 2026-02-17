// components/googleadminvisitors/types.ts
export interface Visitor {
  _id: string;
  ipAddress: string;
  userAgent: string;
  pageUrl: string;
  referrer: string;
  timestamp: string;
  lastVisit: string;
  visitCount: number;
  pageViews: Array<{ url: string; timestamp: string; referrer: string }>;
  device: {
    type: string;
    brand: string;
    model: string;
    os: string;
    osVersion: string;
    browser: string;
    browserVersion: string;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isBot: boolean;
    screenResolution?: string;
    language?: string;
    timezone?: string;
  };
  location?: {
    country: string;
    countryCode: string;
    region: string;
    city: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    timezone: string;
    isp: string;
    organization: string;
  };
  sessionId: string;
  userId?: string;
  converted: boolean;
}

export interface VisitorsStats {
  totalVisitors: number;
  uniqueIPs: number;
  todayVisitors: number;
  activeNow: number;
  bounceRate: number;
  totalPageViews: number;
  byDevice: {
    desktop: number;
    mobile: number;
    tablet: number;
    bot: number;
    other: number;
  };
  byBrowser: Array<{ name: string; value: number }>;
  byOS: Array<{ name: string; value: number }>;
  byCountry: Array<{ country: string; visitors: number }>;
  hourlyActivity: number[];
  topPages: Array<{ url: string; visits: number }>;
  topReferrers: Array<{ referrer: string; visits: number }>;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Filters {
  range: string;
  search: string;
}

export interface HeaderProps {
  autoRefresh: boolean;
  onAutoRefreshChange: (checked: boolean) => void;
  onRefresh: () => void;
  onExport: () => void;
  onBulkDelete: () => void;
  selectedCount: number;
  loading: boolean;
  darkMode?: boolean;
  isMobile?: boolean;
}

export interface StatsProps {
  stats: VisitorsStats | null;
  darkMode?: boolean;
}

export interface FiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  darkMode?: boolean;
}

export interface TabsProps {
  selectedTab: number;
  onTabChange: (value: number) => void;
  darkMode?: boolean;
}

export interface OverviewTabProps {
  stats: VisitorsStats;
  hourlyChartData: any;
  deviceChartData: any;
  chartOptions: any;
  darkMode?: boolean;
}

export interface RealtimeTabProps {
  visitors: Visitor[];
  stats: VisitorsStats | null;
  darkMode?: boolean;
  formatDistance: (date: Date, baseDate: Date, options?: any) => string;
}

export interface GeographyTabProps {
  stats: VisitorsStats;
  darkMode?: boolean;
}

export interface DevicesTabProps {
  stats: VisitorsStats;
  chartOptions: any;
  darkMode?: boolean;
}

export interface PagesTabProps {
  stats: VisitorsStats;
  darkMode?: boolean;
}

export interface TableProps {
  visitors: Visitor[];
  selectedVisitors: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectVisitor: (id: string, checked: boolean) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, visitor: Visitor) => void;
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
  darkMode?: boolean;
  formatDistance: (date: Date, baseDate: Date, options?: any) => string;
}

export interface MenuProps {
  anchorEl: HTMLElement | null;
  selectedVisitor: Visitor | null;
  onClose: () => void;
  onViewDetails: (visitor: Visitor) => void;
  onDelete: (visitor: Visitor) => void;
  darkMode?: boolean;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}
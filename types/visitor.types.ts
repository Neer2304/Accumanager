// types/visitor.types.ts
export interface Visitor {
  _id: string
  ipAddress: string
  userAgent: string
  pageUrl: string
  referrer: string
  timestamp: string
  lastVisit: string
  visitCount: number
  pageViews: Array<{
    url: string
    timestamp: string
    referrer: string
    duration?: number
  }>
  device: {
    type: string
    brand: string
    model: string
    os: string
    osVersion: string
    browser: string
    browserVersion: string
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    isBot: boolean
    screenResolution?: string
    language?: string
    timezone?: string
  }
  location?: {
    country: string
    countryCode: string
    region: string
    city: string
    zipCode: string
    latitude: number
    longitude: number
    timezone: string
    isp: string
    organization: string
    as: string
  }
  sessionId: string
  userId?: string
  converted: boolean
  createdAt: string
  updatedAt: string
}

export interface VisitorsStats {
  totalVisitors: number
  uniqueIPs: number
  todayVisitors: number
  activeNow: number
  bounceRate: number
  totalPageViews: number
  byDevice: {
    desktop: number
    mobile: number
    tablet: number
    bot: number
    other: number
  }
  byBrowser: Array<{ name: string; value: number }>
  byOS: Array<{ name: string; value: number }>
  byCountry: Array<{ country: string; visitors: number }>
  hourlyActivity: number[]
  topPages: Array<{ url: string; visits: number }>
  topReferrers: Array<{ referrer: string; visits: number }>
}

export interface VisitorsPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface VisitorsFilters {
  range: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all'
  search: string
  page: number
  limit: number
}

export interface VisitorsState {
  visitors: Visitor[]
  stats: VisitorsStats | null
  pagination: VisitorsPagination
  filters: VisitorsFilters
  selectedVisitors: string[]
  loading: boolean
  error: string | null
  tracking: {
    sessionId: string | null
    isTracking: boolean
    currentVisitorId: string | null
  }
}

export interface TrackVisitorPayload {
  pageUrl: string
  referrer?: string
  userId?: string
  screenResolution?: string
  language?: string
  timezone?: string
}
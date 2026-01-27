/**
 * Common Words & Terminology for Accumanager
 * Centralized location for all product text content
 * Version: 1.0.0
 */

// ==================== PRODUCT INFORMATION ====================
export const PRODUCT = {
  NAME: "Accumanager" as const,
  DESCRIPTION: "Document management and system monitoring platform" as const,
  TAGLINE: "Manage, Monitor, and Optimize Your Documents" as const,
  VERSION: "1.0.0" as const,
  CODE_NAME: "Project Aurora" as const,
};

// ==================== NAVIGATION & SIDEBAR ====================
export const NAVIGATION = {
  DASHBOARD: "Dashboard",
  SYSTEM_HEALTH: "System Health",
  DOCUMENTS: "Documents",
  COLLECTIONS: "Collections",
  RECENT_FILES: "Recent Files",
  STARRED: "Starred Items",
  TRASH: "Trash",
  SETTINGS: "Settings",
  ANALYTICS: "Analytics",
  SEARCH: "Search",
  USER_MANAGEMENT: "User Management",
  AUDIT_LOG: "Audit Log",
};

// ==================== SYSTEM HEALTH ====================
export const SYSTEM_HEALTH = {
  PAGE_TITLE: "System Health",
  HEADER_TITLE: "System Health Dashboard",
  YOUR_SERVICES_STATUS: "Your Services Status",
  SYSTEM_SUMMARY: "System Summary",

  // Status Types
  STATUS: {
    HEALTHY: "healthy",
    DEGRADED: "degraded",
    DOWN: "down",
    MAINTENANCE: "maintenance",
  } as const,

  // Alert Severity
  ALERT_SEVERITY: {
    CRITICAL: "critical",
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
    INFO: "info",
  } as const,

  // Service Types
  SERVICE_TYPES: {
    API: "API",
    DATABASE: "Database",
    FILE_STORAGE: "File Storage",
    AUTH: "Authentication",
    CACHE: "Cache",
    QUEUE: "Queue",
    SEARCH: "Search",
    NOTIFICATION: "Notification",
    ANALYTICS: "Analytics",
    BACKUP: "Backup",
  } as const,

  // Stats
  TOTAL_SERVICES: "Total Services",
  HEALTHY_SERVICES: "Healthy Services",
  ACTIVE_ALERTS: "Active Alerts",
  CRITICAL_ALERTS: "Critical Alerts",

  // User Stats
  TOTAL_DOCUMENTS: "Total Documents",
  STORAGE_USAGE: "Storage Usage",
  COLLECTIONS_USED: "Collections Used",
  RECENT_ERRORS: "Recent Errors",

  // Measurements
  RESPONSE_TIME: "Response Time",
  UPTIME: "Uptime",
  LAST_CHECKED: "Last Checked",

  // Resources
  CPU: "CPU",
  MEMORY: "Memory",
  DISK: "Disk",
  USAGE: "Usage",

  // Actions
  RESOLVE_ALERT: "Resolve Alert",
  VIEW_DETAILS: "View Details",

  // Alerts
  NO_ALERTS: "No active alerts",
  ALL_ALERTS: "All Alerts",
  RESOLVED: "Resolved",
  UNRESOLVED: "Unresolved",
};

// ==================== FILE OPERATIONS ====================
export const FILE_ACTIONS = {
  CREATE_FILE: "Create File",
  CREATE_FOLDER: "Create Folder",
  RENAME: "Rename",
  DELETE: "Delete",
  DUPLICATE: "Duplicate",
  MOVE: "Move",
  COPY: "Copy",
  DOWNLOAD: "Download",
  UPLOAD: "Upload",
  PREVIEW: "Preview",
  EDIT: "Edit",
  OPEN: "Open",
  SAVE: "Save",
  SAVE_ALL: "Save All",
  CLOSE: "Close",
  CLOSE_ALL: "Close All",
  EXPORT: "Export",
  IMPORT: "Import",
};

// ==================== UI COMPONENTS ====================
export const UI = {
  // Loading States
  LOADING: "Loading...",
  SAVING: "Saving...",
  PROCESSING: "Processing...",
  CONNECTING: "Connecting...",
  SYNCING: "Syncing...",

  // Status Messages
  SUCCESS: "Success!",
  ERROR: "Error",
  WARNING: "Warning",
  INFO: "Information",
  UPDATED: "Up to date",
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",

  // Buttons & Actions
  CONFIRM: "Confirm",
  CANCEL: "Cancel",
  OK: "OK",
  CLOSE: "Close",
  BACK: "Back",
  NEXT: "Next",
  SUBMIT: "Submit",
  RESET: "Reset",
  APPLY: "Apply",
  DISCARD: "Discard",
  RETRY: "Retry",
  REFRESH: "Refresh", // Added this!
  REFRESH_DATA: "Refresh Data", // And this!

  // User Interface
  ONLINE: "Online",
  OFFLINE: "Offline",
  AUTO_REFRESH: "Auto Refresh",
  MANUAL_REFRESH: "Manual Refresh",
  LAST_UPDATED: "Last Updated",
  NO_RESULTS: "No results found",
  SELECT_ITEM: "Select an item to continue",
};

// ==================== USER & AUTH ====================
export const USER = {
  LOGIN: "Log In",
  LOGOUT: "Log Out",
  SIGNUP: "Sign Up",
  PROFILE: "Profile",
  SETTINGS: "Settings",
  ACCOUNT: "Account",
  PREFERENCES: "Preferences",
  THEME: "Theme",
  LANGUAGE: "Language",
  PASSWORD: "Password",
  EMAIL: "Email Address",
  USERNAME: "Username",
  ROLE: "Role",
  PERMISSIONS: "Permissions",
};

// ==================== MESSAGES & ALERTS ====================
export const MESSAGES = {
  // Confirmation Dialogs
  DELETE_CONFIRMATION: "Are you sure you want to delete this item?",
  UNSAVED_CHANGES: "You have unsaved changes. Continue?",
  OPERATION_SUCCESS: "Operation completed successfully",
  OPERATION_FAILED: "Operation failed. Please try again.",

  // Error Messages
  AUTH_REQUIRED: "Please log in to view system health",
  FETCH_FAILED: "Failed to fetch system health data",
  NETWORK_ERROR: "Network error. Please check your connection.",

  // Info Messages
  DRAG_DROP: "Drag and drop files here",
  MAX_FILE_SIZE: "Maximum file size: 10MB",
  STORAGE_LIMIT: "Storage Limit",
};

// ==================== METRICS & STATS ====================
export const METRICS = {
  // Time
  MILLISECONDS: "ms",
  SECONDS: "s",
  MINUTES: "min",
  HOURS: "hr",
  DAYS: "days",

  // Storage
  BYTES: "B",
  KILOBYTES: "KB",
  MEGABYTES: "MB",
  GIGABYTES: "GB",
  TERABYTES: "TB",

  // Percentages
  PERCENTAGE: "%",

  // Count
  COUNT: "count",
  ITEMS: "items",
  FILES: "files",
  DOCUMENTS: "documents",
  COLLECTIONS: "collections",
};

// ==================== THEMES & APPEARANCE ====================
export const THEMES = {
  LIGHT: "Light",
  DARK: "Dark",
  SYSTEM: "System",
};

// ==================== SEARCH & FILTER ====================
export const SEARCH = {
  PLACEHOLDER: "Search...",
  FILTER: "Filter",
  SORT: "Sort by",
  SORT_NAME: "Name",
  SORT_DATE: "Date Modified",
  SORT_SIZE: "Size",
  SORT_TYPE: "Type",
  ASCENDING: "Ascending",
  DESCENDING: "Descending",
  CLEAR_FILTERS: "Clear Filters",
  SEARCH_FILES: "Search files...",
};

// ==================== DOCUMENT MANAGEMENT ====================
export const DOCUMENTS = {
  // Types
  FOLDER: "Folder",
  TEXT: "Text File",
  PDF: "PDF Document",
  IMAGE: "Image",
  SPREADSHEET: "Spreadsheet",
  PRESENTATION: "Presentation",
  ARCHIVE: "Archive",
  UNKNOWN: "Unknown File Type",

  // Status
  UPLOADING: "Uploading...",
  PROCESSING: "Processing...",
  READY: "Ready",
  FAILED: "Failed",

  // Actions
  NEW_DOCUMENT: "New Document",
  UPLOAD_DOCUMENTS: "Upload Documents",
  ORGANIZE: "Organize",
  SHARE: "Share",
  VERSION_HISTORY: "Version History",
};

// ==================== AUTH & SECURITY ====================
export const AUTH = {
  // Page Titles
  LOGIN: "Login",
  SIGNUP: "Sign Up",
  FORGOT_PASSWORD: "Forgot Password",
  RESET_PASSWORD: "Reset Password",
  CHANGE_PASSWORD: "Change Password",
  VERIFY_OTP: "Verify OTP",
  VERIFY_IDENTITY: "Verify Identity",

  // Actions
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up",
  LOG_OUT: "Log Out",
  CONTINUE: "Continue",
  SEND_CODE: "Send Code",
  VERIFY: "Verify",
  RESEND: "Resend",

  // Form Labels
  EMAIL_ADDRESS: "Email Address",
  PHONE_NUMBER: "Phone Number",
  PASSWORD: "Password",
  CONFIRM_PASSWORD: "Confirm Password",
  CURRENT_PASSWORD: "Current Password",
  NEW_PASSWORD: "New Password",
  REMEMBER_ME: "Remember me",
  FORGOT_PASSWORD_QUESTION: "Forgot password?",

  // Messages
  OTP_SENT: "Verification code sent to",
  OTP_VERIFIED: "OTP verified successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  PASSWORD_CHANGED_SUCCESS: "Password changed successfully",
  REDIRECTING_TO_LOGIN: "Redirecting to login...",

  // Errors
  INVALID_CREDENTIALS: "Invalid email or password",
  INVALID_OTP: "Invalid OTP. Please try again.",
  OTP_EXPIRED: "OTP has expired. Please request a new one.",
  PASSWORD_MISMATCH: "Passwords do not match",
  WEAK_PASSWORD: "Password must be at least 6 characters",
  SAME_PASSWORD: "New password must be different from current password",

  // Info
  ENTER_REGISTERED_EMAIL:
    "Enter your registered email address to receive a password reset OTP",
  ENTER_OTP_SENT_TO: "Enter the 6-digit verification code sent to",
  ENTER_NEW_PASSWORD: "Enter your new password below",
  UPDATE_ACCOUNT_PASSWORD: "Update your account password",

  // Verification Methods
  EMAIL: "email",
  SMS: "sms",

  // Security
  PASSWORD_STRENGTH: "Password Strength",
  PASSWORD_REQUIREMENTS: "Password must contain:",
  SECURITY_NOTE:
    "For security reasons, please choose a strong password that you haven't used before.",

  // Requirements
  AT_LEAST_6_CHARS: "At least 6 characters",
  CONTAINS_UPPERCASE: "Contains uppercase letter",
  CONTAINS_LOWERCASE: "Contains lowercase letter",
  CONTAINS_NUMBER: "Contains number",
  CONTAINS_SPECIAL_CHAR: "Contains special character",

  // Strength Levels
  WEAK: "Weak",
  MEDIUM: "Medium",
  STRONG: "Strong",
} as const;

// ==================== EXPORT ALL ====================
export const COMMON_WORDS = {
  PRODUCT,
  NAVIGATION,
  SYSTEM_HEALTH,
  FILE_ACTIONS,
  UI,
  USER,
  MESSAGES,
  METRICS,
  THEMES,
  SEARCH,
  DOCUMENTS,
  AUTH,
} as const;

export default COMMON_WORDS;

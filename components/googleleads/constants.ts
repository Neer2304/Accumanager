import { GoogleColors, LeadStatus, LeadSource, InterestLevel } from './types';

// Google Material Design 3 Colors
export const GOOGLE_COLORS: GoogleColors = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4',
  purple: '#7c4dff'
};

// Lead Status Config
export const LEAD_STATUS: LeadStatus[] = [
  { value: "new", label: "New", color: "#4285f4", emoji: "🆕" },
  { value: "contacted", label: "Contacted", color: "#fbbc04", emoji: "📞" },
  { value: "qualified", label: "Qualified", color: "#34a853", emoji: "✅" },
  { value: "disqualified", label: "Disqualified", color: "#ea4335", emoji: "❌" },
  { value: "converted", label: "Converted", color: "#9334e6", emoji: "🎉" },
  { value: "lost", label: "Lost", color: "#80868b", emoji: "💔" }
];

// Lead Source Config
export const LEAD_SOURCES: LeadSource[] = [
  { value: "website", label: "Website", emoji: "🌐" },
  { value: "referral", label: "Referral", emoji: "🤝" },
  { value: "cold_call", label: "Cold Call", emoji: "📞" },
  { value: "social_media", label: "Social Media", emoji: "📱" },
  { value: "email_campaign", label: "Email Campaign", emoji: "📧" },
  { value: "event", label: "Event", emoji: "🎪" },
  { value: "partner", label: "Partner", emoji: "🤲" },
  { value: "other", label: "Other", emoji: "📌" }
];

// Interest Level Config
export const INTEREST_LEVELS: InterestLevel[] = [
  { value: "low", label: "Low", color: "#80868b", emoji: "😐" },
  { value: "medium", label: "Medium", color: "#fbbc04", emoji: "🙂" },
  { value: "high", label: "High", color: "#34a853", emoji: "😊" },
  { value: "very_high", label: "Very High", color: "#ea4335", emoji: "🤩" }
];

// Table column configuration
export const TABLE_COLUMNS = [
  { id: 'fullName', label: 'Lead', sortable: true },
  { id: 'contact', label: 'Contact', sortable: false },
  { id: 'source', label: 'Source', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'assignedTo', label: 'Assigned To', sortable: false },
  { id: 'budget', label: 'Budget', sortable: true },
  { id: 'score', label: 'Score', sortable: true },
  { id: 'createdAt', label: 'Created', sortable: true },
  { id: 'actions', label: 'Actions', sortable: false }
];

// Default form data
export const DEFAULT_FORM_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  source: "website",
  status: "new",
  companyId: "",
  companyName: "",
  position: "",
  budget: "",
  currency: "USD",
  interestLevel: "medium",
  assignedTo: "",
  assignedToName: "",
  notes: "",
  tags: ""
};
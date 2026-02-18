// components/googlepipelinestages/constants/index.ts
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Stop as StopIcon
} from "@mui/icons-material";

export const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4',
  purple: '#7c4dff',
  orange: '#fa903e',
  teal: '#00acc1'
};

export const STAGE_CATEGORIES = [
  { value: 'open', label: 'Open', color: GOOGLE_COLORS.blue, icon: PlayArrowIcon },
  { value: 'won', label: 'Closed Won', color: GOOGLE_COLORS.green, icon: CheckCircleIcon },
  { value: 'lost', label: 'Closed Lost', color: GOOGLE_COLORS.red, icon: StopIcon }
];

export const REQUIRED_FIELD_OPTIONS = [
  { value: 'account', label: 'Account' },
  { value: 'contact', label: 'Contact' },
  { value: 'value', label: 'Deal Value' },
  { value: 'date', label: 'Close Date' },
  { value: 'products', label: 'Products' },
  { value: 'description', label: 'Description' }
];

export const initialFormData = {
  name: "",
  probability: "10",
  color: "#4285f4",
  category: "open" as 'open' | 'won' | 'lost',
  isActive: true,
  autoAdvance: false,
  autoAdvanceDays: "",
  notifyOnEnter: false,
  notifyOnExit: false,
  notifyUsers: [] as string[],
  requiredFields: [] as string[],
  allowedStages: [] as string[],
  customFields: [] as Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select';
    required: boolean;
    options?: string[];
  }>
};
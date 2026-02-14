// app/activities/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  useMediaQuery,
  useTheme,
  alpha,
  Divider,
  Breadcrumbs,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Chip as MuiChip,
  Paper,
  Alert,
  Button,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  LinearProgress,
  Tooltip,
  Grid,
  Tab,
  Tabs,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  Collapse,
  Card,
  CardContent,
  CardActions,
  Rating,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  AvatarGroup,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Fab,
  Drawer,
  SwipeableDrawer,
  Modal,
  Backdrop,
  Fade,
  Zoom,
  Grow,
  Slide,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardHeader,
  CardMedia,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Skeleton,
  SvgIcon,
  ToggleButton,
  ToggleButtonGroup,
  ButtonGroup,
  Popover,
  Popper,
  ClickAwayListener,
  Portal,
  Container,
  AppBar,
  Toolbar,
  BottomNavigation,
  BottomNavigationAction,
  Pagination,
  PaginationItem,
  Slider,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Analytics as AnalyticsIcon,
  Flag as FlagIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccountBalance as AccountBalanceIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Note as NoteIcon,
  Call as CallIcon,
  Videocam as VideocamIcon,
  Chat as ChatIcon,
  Email as EmailOutlinedIcon,
  Task as TaskIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  History as HistoryIcon,
  Timeline as TimelineIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Assessment as AssessmentIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Feedback as FeedbackIcon,
  BugReport as BugReportIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  PriorityHigh as PriorityHighIcon,
  LowPriority as LowPriorityIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  ViewAgenda as ViewAgendaIcon,
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon,
  ViewStream as ViewStreamIcon,
  ViewColumn as ViewColumnIcon,
  ViewQuilt as ViewQuiltIcon,
  ViewSidebar as ViewSidebarIcon,
  DashboardCustomize as DashboardCustomizeIcon,
  Widgets as WidgetsIcon,
  Apps as AppsIcon,
  AppsOutage as AppsOutageIcon,
//   AppsOutlined as AppsOutlinedIcon,
  AppsRounded as AppsRoundedIcon,
  AppsTwoTone as AppsTwoToneIcon,
  Dashboard as DashboardOutlinedIcon,
  DashboardCustomize as DashboardCustomizeOutlinedIcon,
  Widgets as WidgetsOutlinedIcon,
//   Apps as AppsOutlinedIcon,
  AppsOutage as AppsOutageOutlinedIcon,
  ReportGmailerrorredRounded,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCompany } from '@/lib/companyContext';
import { companyService } from '@/services/companyService';
import { format, formatDistance, formatRelative, subDays, isToday, isTomorrow, isThisWeek, isThisMonth } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler } from 'chart.js';
import { Pie, Doughnut, Bar, Line } from 'react-chartjs-2';
import { useDropzone } from 'react-dropzone';
// import { v4 as uuidv4 } from 'uuid';
// import DOMPurify from 'dompurify';
// import { marked } from 'marked';
// import he from 'he';
// import Linkify from 'react-linkify';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { FullCalendar } from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import listPlugin from '@fullcalendar/list';
// import multiMonthPlugin from '@fullcalendar/multimonth';

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler);

// Google Material Design 3 Colors
const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4',
  purple: '#7c4dff',
  orange: '#fa903e',
  teal: '#00acc1',
  pink: '#d81b60',
  indigo: '#3949ab',
  cyan: '#00acc1',
  amber: '#ffa000',
  deepOrange: '#f4511e',
  deepPurple: '#5e35b1',
  lightBlue: '#039be5',
  lightGreen: '#7cb342',
  lime: '#c0ca33',
  brown: '#8d6e63'
};

// Activity Types Config
const ACTIVITY_TYPES = [
  { value: 'call', label: 'Call', icon: CallIcon, color: GOOGLE_COLORS.blue },
  { value: 'email', label: 'Email', icon: EmailIcon, color: GOOGLE_COLORS.purple },
  { value: 'meeting', label: 'Meeting', icon: VideocamIcon, color: GOOGLE_COLORS.green },
  { value: 'task', label: 'Task', icon: TaskIcon, color: GOOGLE_COLORS.orange },
  { value: 'note', label: 'Note', icon: NoteIcon, color: GOOGLE_COLORS.teal },
  { value: 'reminder', label: 'Reminder', icon: ReportGmailerrorredRounded, color: GOOGLE_COLORS.yellow }
];

// Activity Status Config
const ACTIVITY_STATUS = [
  { value: 'not_started', label: 'Not Started', color: GOOGLE_COLORS.grey },
  { value: 'in_progress', label: 'In Progress', color: GOOGLE_COLORS.blue },
  { value: 'completed', label: 'Completed', color: GOOGLE_COLORS.green },
  { value: 'deferred', label: 'Deferred', color: GOOGLE_COLORS.orange },
  { value: 'cancelled', label: 'Cancelled', color: GOOGLE_COLORS.red }
];

// Activity Priority Config
const ACTIVITY_PRIORITY = [
  { value: 'low', label: 'Low', color: GOOGLE_COLORS.grey, icon: LowPriorityIcon },
  { value: 'medium', label: 'Medium', color: GOOGLE_COLORS.blue, icon: TrendingFlatIcon },
  { value: 'high', label: 'High', color: GOOGLE_COLORS.orange, icon: TrendingUpIcon },
  { value: 'urgent', label: 'Urgent', color: GOOGLE_COLORS.red, icon: PriorityHighIcon }
];

// Entity Types Config
const ENTITY_TYPES = [
  { value: 'Lead', label: 'Lead', icon: PersonIcon, color: GOOGLE_COLORS.blue },
  { value: 'Contact', label: 'Contact', icon: PersonIcon, color: GOOGLE_COLORS.green },
  { value: 'Account', label: 'Account', icon: BusinessIcon, color: GOOGLE_COLORS.purple },
  { value: 'Deal', label: 'Deal', icon: AttachMoneyIcon, color: GOOGLE_COLORS.orange },
  { value: 'Project', label: 'Project', icon: AssignmentIcon, color: GOOGLE_COLORS.teal },
  { value: 'Task', label: 'Task', icon: TaskIcon, color: GOOGLE_COLORS.cyan }
];

// File Type Icons
const FILE_TYPE_ICONS: Record<string, any> = {
  'image': ImageIcon,
  'pdf': PdfIcon,
  'document': DescriptionIcon,
  'spreadsheet': DescriptionIcon,
  'presentation': DescriptionIcon,
  'video': VideocamIcon,
  'audio': CallIcon,
  'archive': FileIcon,
  'default': FileIcon
};

interface Activity {
  _id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'reminder';
  subtype?: string;
  subject: string;
  description?: string;
  relatedTo: Array<{
    model: string;
    id: string;
    name: string;
  }>;
  assignedTo?: string;
  assignedToName?: string;
  assignedBy?: string;
  assignedAt?: string;
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  completedAt?: string;
  duration?: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'deferred' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  callDetails?: {
    callType: 'inbound' | 'outbound' | 'internal';
    callDuration: number;
    callRecording?: string;
    callOutcome?: string;
    callNotes?: string;
    followUpRequired: boolean;
    followUpDate?: string;
  };
  emailDetails?: {
    from: string;
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
    attachments: Array<{
      filename: string;
      url: string;
      size: number;
      type: string;
    }>;
    isRead: boolean;
    isReplied: boolean;
    isForwarded: boolean;
    threadId?: string;
    inReplyTo?: string;
  };
  meetingDetails?: {
    location?: string;
    meetingLink?: string;
    meetingId?: string;
    password?: string;
    attendees: Array<{
      email: string;
      name: string;
      status: 'pending' | 'accepted' | 'declined' | 'tentative';
      responseDate?: string;
    }>;
    notes?: string;
    agenda?: string;
    outcome?: string;
  };
  taskDetails?: {
    estimatedHours: number;
    actualHours: number;
    billable: boolean;
    hourlyRate?: number;
    totalCost?: number;
    dependsOn?: string[];
    blockedBy?: string[];
  };
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    monthOfYear?: number;
    endDate?: string;
    count?: number;
  };
  reminders: Array<{
    type: 'email' | 'notification' | 'sms' | 'whatsapp';
    timeBefore: number;
    isSent: boolean;
    sentAt?: string;
  }>;
  tags: string[];
  attachments: Array<{
    filename: string;
    url: string;
    size: number;
    type: string;
    uploadedAt: string;
  }>;
  location?: {
    type: 'physical' | 'virtual';
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  outcome?: string;
  feedback?: string;
  rating?: number;
  createdBy: string;
  createdByName: string;
  updatedBy?: string;
  updatedByName?: string;
  sharedWith: Array<{
    userId: string;
    userName: string;
    permissions: {
      read: boolean;
      write: boolean;
    };
    sharedAt: string;
  }>;
  companyId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface AuditLog {
  _id: string;
  companyId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  action: string;
  entityType: string;
  entityId?: string;
  entityName?: string;
  changes?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  timestamp: string;
  status: 'success' | 'failure';
  errorMessage?: string;
  sessionId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

interface Attachment {
  _id: string;
  companyId: string;
  userId: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
  path: string;
  storageType: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail?: string;
  uploadedBy: string;
  uploadedByName: string;
  isPublic: boolean;
  accessLevel: 'private' | 'team' | 'company' | 'public';
  sharedWith: Array<{
    userId: string;
    userName: string;
    permissions: {
      read: boolean;
      download: boolean;
    };
    sharedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Company {
  _id: string;
  name: string;
  email: string;
  industry?: string;
  size?: string;
  userRole: string;
}

interface Member {
  memberId: string;
  userId: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: string;
  status: string;
}

interface ActivityStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  byStatus: Record<string, number>;
  upcoming: Activity[];
  recent: Activity[];
}

export default function ActivitiesPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
  const { companies, loading: companiesLoading } = useCompany();

  // State
  const [activities, setActivities] = useState<Activity[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [assignedToFilter, setAssignedToFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<{ from?: string; to?: string }>({});
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Activity>('dueDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [attachmentMenuAnchor, setAttachmentMenuAnchor] = useState<null | HTMLElement>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar' | 'timeline'>('list');
  const [activityStats, setActivityStats] = useState<ActivityStats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    byType: {},
    byPriority: {},
    byStatus: {},
    upcoming: [],
    recent: []
  });

  // Form states
  const [formData, setFormData] = useState({
    type: "task",
    subtype: "",
    subject: "",
    description: "",
    relatedTo: [] as Array<{ model: string; id: string; name: string }>,
    assignedTo: "",
    assignedToName: "",
    startDate: "",
    endDate: "",
    dueDate: "",
    status: "not_started",
    priority: "medium",
    progress: 0,
    callDetails: {
      callType: "outbound",
      callDuration: 0,
      callRecording: "",
      callOutcome: "",
      callNotes: "",
      followUpRequired: false,
      followUpDate: ""
    },
    emailDetails: {
      from: "",
      to: [] as string[],
      cc: [] as string[],
      bcc: [] as string[],
      subject: "",
      body: "",
      attachments: [],
      isRead: false,
      isReplied: false,
      isForwarded: false,
      threadId: "",
      inReplyTo: ""
    },
    meetingDetails: {
      location: "",
      meetingLink: "",
      meetingId: "",
      password: "",
      attendees: [] as Array<{ email: string; name: string; status: string }>,
      notes: "",
      agenda: "",
      outcome: ""
    },
    taskDetails: {
      estimatedHours: 0,
      actualHours: 0,
      billable: false,
      hourlyRate: 0,
      totalCost: 0,
      dependsOn: [] as string[],
      blockedBy: [] as string[]
    },
    isRecurring: false,
    recurrencePattern: {
      frequency: "daily",
      interval: 1,
      daysOfWeek: [] as number[],
      dayOfMonth: 1,
      monthOfYear: 1,
      endDate: "",
      count: 0
    },
    reminders: [] as Array<{ type: string; timeBefore: number }>,
    tags: "",
    attachments: [] as File[],
    location: {
      type: "physical",
      address: "",
      coordinates: { lat: 0, lng: 0 }
    },
    outcome: "",
    feedback: "",
    rating: 0,
    sharedWith: [] as Array<{ userId: string; userName: string; permissions: { read: boolean; write: boolean } }>
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Set first company as default when companies load
  useEffect(() => {
    if (companies && companies.length > 0 && !selectedCompanyId) {
      const firstCompany = companies[0];
      setSelectedCompanyId(firstCompany._id);
    }
  }, [companies, selectedCompanyId]);

  // Fetch data when company changes
  useEffect(() => {
    if (selectedCompanyId) {
      fetchMembers(selectedCompanyId);
      fetchLeads(selectedCompanyId);
      fetchContacts(selectedCompanyId);
      fetchAccounts(selectedCompanyId);
      fetchDeals(selectedCompanyId);
      fetchProjects(selectedCompanyId);
      fetchActivities();
      fetchAuditLogs();
      fetchAttachments();
    }
  }, [selectedCompanyId]);

  // Fetch members of selected company
  const fetchMembers = async (companyId: string) => {
    if (!companyId) return;
    
    try {
      const res = await companyService.getMembers(companyId);
      if (res.success) {
        const activeMembers = res.members?.filter((m: Member) => m.status === 'active') || [];
        setMembers(activeMembers);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  // Fetch leads
  const fetchLeads = async (companyId: string) => {
    try {
      const response = await fetch(`/api/leads?companyId=${companyId}&limit=100`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  // Fetch contacts
  const fetchContacts = async (companyId: string) => {
    try {
      const response = await fetch(`/api/contacts?companyId=${companyId}&limit=100`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Fetch accounts
  const fetchAccounts = async (companyId: string) => {
    try {
      const response = await fetch(`/api/accounts?companyId=${companyId}&limit=100`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  // Fetch deals
  const fetchDeals = async (companyId: string) => {
    try {
      const response = await fetch(`/api/deals?companyId=${companyId}&limit=100`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setDeals(data.deals || []);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  };

  // Fetch projects
  const fetchProjects = async (companyId: string) => {
    try {
      const response = await fetch(`/api/projects?companyId=${companyId}&limit=100`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Fetch activities (using the corrected API path)
  const fetchActivities = async () => {
    if (!selectedCompanyId) return;

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (assignedToFilter !== 'all') params.append('assignedTo', assignedToFilter);
      if (searchQuery) params.append('search', searchQuery);
      if (dateRangeFilter.from) params.append('fromDate', dateRangeFilter.from);
      if (dateRangeFilter.to) params.append('toDate', dateRangeFilter.to);
      params.append('limit', '100');
      params.append('page', (page + 1).toString());
      
      // Using the correct API path: activitiess (double s)
      const response = await fetch(`/api/activitiess?${params.toString()}`, {
        method: "GET",
        credentials: 'include',
        headers: { "Content-Type": "application/json" }
      });

      if (response.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch activities");
      }

      const data = await response.json();
      setActivities(data.activities || []);
      
      // Calculate statistics
      const stats = calculateStats(data.activities || []);
      setActivityStats(stats);
      
    } catch (err: any) {
      console.error('Error fetching activities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    if (!selectedCompanyId) return;

    try {
      const response = await fetch(`/api/audit-logs?companyId=${selectedCompanyId}&limit=50`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  // Fetch attachments
  const fetchAttachments = async () => {
    if (!selectedCompanyId) return;

    try {
      const response = await fetch(`/api/attachments?companyId=${selectedCompanyId}&limit=50`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAttachments(data.attachments || []);
      }
    } catch (error) {
      console.error('Error fetching attachments:', error);
    }
  };

  // Calculate activity statistics
  const calculateStats = (activities: Activity[]): ActivityStats => {
    const now = new Date();
    const stats: ActivityStats = {
      total: activities.length,
      completed: activities.filter(a => a.status === 'completed').length,
      pending: activities.filter(a => ['not_started', 'in_progress'].includes(a.status)).length,
      overdue: activities.filter(a => 
        a.dueDate && new Date(a.dueDate) < now && a.status !== 'completed'
      ).length,
      byType: {},
      byPriority: {},
      byStatus: {},
      upcoming: [],
      recent: []
    };

    activities.forEach(activity => {
      // By type
      stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1;
      
      // By priority
      stats.byPriority[activity.priority] = (stats.byPriority[activity.priority] || 0) + 1;
      
      // By status
      stats.byStatus[activity.status] = (stats.byStatus[activity.status] || 0) + 1;
    });

    // Upcoming activities (due in next 7 days)
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    stats.upcoming = activities
      .filter(a => 
        a.dueDate && 
        new Date(a.dueDate) > now && 
        new Date(a.dueDate) <= nextWeek &&
        a.status !== 'completed'
      )
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);

    // Recent activities (last 7 days)
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    stats.recent = activities
      .filter(a => new Date(a.createdAt) >= lastWeek)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return stats;
  };

  // Initial load
  useEffect(() => {
    if (selectedCompanyId) {
      fetchActivities();
    }
  }, [selectedCompanyId]);

  // Filter when filters change
  useEffect(() => {
    if (selectedCompanyId) {
      fetchActivities();
    }
  }, [typeFilter, statusFilter, priorityFilter, assignedToFilter]);

  // Search debounce
  useEffect(() => {
    if (!selectedCompanyId) return;
    
    const timer = setTimeout(() => {
      fetchActivities();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Select Changes
  const handleCompanyChange = (event: SelectChangeEvent) => {
    setSelectedCompanyId(event.target.value);
  };

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handlePriorityFilterChange = (event: SelectChangeEvent) => {
    setPriorityFilter(event.target.value);
  };

  const handleEntityTypeFilterChange = (event: SelectChangeEvent) => {
    setEntityTypeFilter(event.target.value);
  };

  const handleAssignedToFilterChange = (event: SelectChangeEvent) => {
    setAssignedToFilter(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'list' | 'grid' | 'calendar' | 'timeline') => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Form change handlers
  const handleFormTypeChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, type: event.target.value as any });
  };

  const handleFormStatusChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, status: event.target.value as any });
  };

  const handleFormPriorityChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, priority: event.target.value as any });
  };

  const handleFormAssignedToChange = (event: SelectChangeEvent) => {
    const userId = event.target.value;
    const selectedMember = members.find(m => m.userId === userId);
    setFormData({ 
      ...formData, 
      assignedTo: userId,
      assignedToName: selectedMember?.user?.name || ''
    });
  };

  const handleFormRelatedEntityChange = (event: SelectChangeEvent, model: string) => {
    const entityId = event.target.value;
    let entity: any = null;
    let entityName = '';

    switch (model) {
      case 'Lead':
        entity = leads.find(l => l._id === entityId);
        entityName = entity?.fullName || `${entity?.firstName} ${entity?.lastName}`;
        break;
      case 'Contact':
        entity = contacts.find(c => c._id === entityId);
        entityName = entity?.fullName || entity?.name;
        break;
      case 'Account':
        entity = accounts.find(a => a._id === entityId);
        entityName = entity?.name;
        break;
      case 'Deal':
        entity = deals.find(d => d._id === entityId);
        entityName = entity?.name;
        break;
      case 'Project':
        entity = projects.find(p => p._id === entityId);
        entityName = entity?.name;
        break;
    }

    if (entityId) {
      setFormData({
        ...formData,
        relatedTo: [...formData.relatedTo, { model, id: entityId, name: entityName }]
      });
    }
  };

  const handleRemoveRelatedEntity = (index: number) => {
    setFormData({
      ...formData,
      relatedTo: formData.relatedTo.filter((_, i) => i !== index)
    });
  };

  // File upload handlers
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...acceptedFiles]
    });
  }, [formData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
      'text/plain': []
    },
    maxSize: 10485760 // 10MB
  });

  // Remove attachment
  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    });
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }
    
    if (!formData.type) {
      errors.type = "Activity type is required";
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      errors.dueDate = "Due date cannot be in the past";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add activity (using the corrected API path)
  const addActivity = async () => {
    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Upload attachments first
      const uploadedAttachments = [];
      for (const file of formData.attachments) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('entityType', 'Activity');
        formData.append('companyId', selectedCompanyId);

        const uploadResponse = await fetch('/api/attachments', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          uploadedAttachments.push(uploadData.attachment);
        }
      }

      const activityData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        attachments: uploadedAttachments,
        relatedTo: formData.relatedTo,
        reminders: formData.reminders,
        sharedWith: formData.sharedWith
      };

      // Using the correct API path: activitiess (double s)
      const response = await fetch("/api/activitiess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(activityData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add activity");
      }

      const newActivity = await response.json();
      setActivities(prev => [newActivity.activity, ...prev]);
      setSuccess("Activity added successfully");
      
      // Reset form
      setAddDialogOpen(false);
      setFormData({
        type: "task",
        subtype: "",
        subject: "",
        description: "",
        relatedTo: [],
        assignedTo: "",
        assignedToName: "",
        startDate: "",
        endDate: "",
        dueDate: "",
        status: "not_started",
        priority: "medium",
        progress: 0,
        callDetails: {
          callType: "outbound",
          callDuration: 0,
          callRecording: "",
          callOutcome: "",
          callNotes: "",
          followUpRequired: false,
          followUpDate: ""
        },
        emailDetails: {
          from: "",
          to: [],
          cc: [],
          bcc: [],
          subject: "",
          body: "",
          attachments: [],
          isRead: false,
          isReplied: false,
          isForwarded: false,
          threadId: "",
          inReplyTo: ""
        },
        meetingDetails: {
          location: "",
          meetingLink: "",
          meetingId: "",
          password: "",
          attendees: [],
          notes: "",
          agenda: "",
          outcome: ""
        },
        taskDetails: {
          estimatedHours: 0,
          actualHours: 0,
          billable: false,
          hourlyRate: 0,
          totalCost: 0,
          dependsOn: [],
          blockedBy: []
        },
        isRecurring: false,
        recurrencePattern: {
          frequency: "daily",
          interval: 1,
          daysOfWeek: [],
          dayOfMonth: 1,
          monthOfYear: 1,
          endDate: "",
          count: 0
        },
        reminders: [],
        tags: "",
        attachments: [],
        location: {
          type: "physical",
          address: "",
          coordinates: { lat: 0, lng: 0 }
        },
        outcome: "",
        feedback: "",
        rating: 0,
        sharedWith: []
      });
      setValidationErrors({});
      
      // Refresh audit logs
      fetchAuditLogs();
      
    } catch (err: any) {
      console.error('Error adding activity:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update activity
  const updateActivity = async () => {
    if (!selectedActivity || !validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);

      const activityData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        relatedTo: formData.relatedTo,
        reminders: formData.reminders,
        sharedWith: formData.sharedWith
      };

      const response = await fetch(`/api/activitiess/${selectedActivity._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(activityData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update activity");
      }

      const updatedActivity = await response.json();
      setActivities(prev => prev.map(a => 
        a._id === selectedActivity._id ? updatedActivity.activity : a
      ));
      setSuccess("Activity updated successfully");
      
      setEditDialogOpen(false);
      
      // Refresh audit logs
      fetchAuditLogs();
      
    } catch (err: any) {
      console.error('Error updating activity:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete activity
  const deleteActivity = async (activityId: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/activitiess/${activityId}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (!response.ok) throw new Error("Failed to delete activity");

      setActivities(prev => prev.filter(a => a._id !== activityId));
      setDetailDialogOpen(false);
      setSuccess("Activity deleted successfully");
      
      // Refresh audit logs
      fetchAuditLogs();
      
    } catch (err: any) {
      console.error('Error deleting activity:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update activity status
  const updateStatus = async (activityId: string, newStatus: string) => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/activitiess/${activityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ 
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date() : undefined
        })
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updatedActivity = await response.json();
      
      setActivities(prev => prev.map(a => 
        a._id === activityId ? updatedActivity.activity : a
      ));
      
      if (selectedActivity?._id === activityId) {
        setSelectedActivity(updatedActivity.activity);
      }
      
      setSuccess("Status updated successfully");
      
      // Refresh audit logs
      fetchAuditLogs();
      
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update activity priority
  const updatePriority = async (activityId: string, newPriority: string) => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/activitiess/${activityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ priority: newPriority })
      });

      if (!response.ok) throw new Error("Failed to update priority");

      const updatedActivity = await response.json();
      
      setActivities(prev => prev.map(a => 
        a._id === activityId ? updatedActivity.activity : a
      ));
      
      if (selectedActivity?._id === activityId) {
        setSelectedActivity(updatedActivity.activity);
      }
      
      setSuccess("Priority updated successfully");
      
      // Refresh audit logs
      fetchAuditLogs();
      
    } catch (err: any) {
      console.error('Error updating priority:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update activity progress
  const updateProgress = async (activityId: string, newProgress: number) => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/activitiess/${activityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ 
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : undefined,
          completedAt: newProgress === 100 ? new Date() : undefined
        })
      });

      if (!response.ok) throw new Error("Failed to update progress");

      const updatedActivity = await response.json();
      
      setActivities(prev => prev.map(a => 
        a._id === activityId ? updatedActivity.activity : a
      ));
      
      if (selectedActivity?._id === activityId) {
        setSelectedActivity(updatedActivity.activity);
      }
      
      setSuccess("Progress updated successfully");
      
      // Refresh audit logs
      fetchAuditLogs();
      
    } catch (err: any) {
      console.error('Error updating progress:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Download attachment
  const downloadAttachment = async (attachment: Attachment) => {
    try {
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      setError('Failed to download attachment');
    }
  };

  // Delete attachment
  const deleteAttachment = async (attachmentId: string) => {
    if (!confirm("Are you sure you want to delete this attachment?")) return;
    
    try {
      const response = await fetch(`/api/attachments/${attachmentId}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (!response.ok) throw new Error("Failed to delete attachment");

      setAttachments(prev => prev.filter(a => a._id !== attachmentId));
      setAttachmentDialogOpen(false);
      setSuccess("Attachment deleted successfully");
      
      // Refresh audit logs
      fetchAuditLogs();
      
    } catch (err: any) {
      console.error('Error deleting attachment:', err);
      setError(err.message);
    }
  };

  // Share activity
  const shareActivity = async (activityId: string, sharedWith: Array<{ userId: string; userName: string; permissions: { read: boolean; write: boolean } }>) => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/activitiess/${activityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ sharedWith })
      });

      if (!response.ok) throw new Error("Failed to share activity");

      const updatedActivity = await response.json();
      
      setActivities(prev => prev.map(a => 
        a._id === activityId ? updatedActivity.activity : a
      ));
      
      if (selectedActivity?._id === activityId) {
        setSelectedActivity(updatedActivity.activity);
      }
      
      setSuccess("Activity shared successfully");
      setShareDialogOpen(false);
      
      // Refresh audit logs
      fetchAuditLogs();
      
    } catch (err: any) {
      console.error('Error sharing activity:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Sorting
  const handleSort = (property: keyof Activity) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedActivities = React.useMemo(() => {
    return [...activities].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      
      if (orderBy === 'dueDate' || orderBy === 'startDate' || orderBy === 'endDate' || orderBy === 'createdAt') {
        return order === 'asc' 
          ? new Date(aVal as string).getTime() - new Date(bVal as string).getTime()
          : new Date(bVal as string).getTime() - new Date(aVal as string).getTime();
      }
      
      if (orderBy === 'progress') {
        return order === 'asc' 
          ? (aVal as number || 0) - (bVal as number || 0)
          : (bVal as number || 0) - (aVal as number || 0);
      }
      
      return order === 'asc'
        ? String(aVal || '').localeCompare(String(bVal || ''))
        : String(bVal || '').localeCompare(String(aVal || ''));
    });
  }, [activities, orderBy, order]);

  // Pagination
  const paginatedActivities = sortedActivities.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get activity icon
  const getActivityIcon = (type: string) => {
    const config = ACTIVITY_TYPES.find(t => t.value === type);
    return config?.icon || AssignmentIcon;
  };

  // Get activity color
  const getActivityColor = (type: string) => {
    const config = ACTIVITY_TYPES.find(t => t.value === type);
    return config?.color || GOOGLE_COLORS.grey;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const config = ACTIVITY_STATUS.find(s => s.value === status);
    return config?.color || GOOGLE_COLORS.grey;
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    const config = ACTIVITY_PRIORITY.find(p => p.value === priority);
    return config?.color || GOOGLE_COLORS.grey;
  };

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    const config = ACTIVITY_PRIORITY.find(p => p.value === priority);
    return config?.icon || TrendingFlatIcon;
  };

  // Get file type icon
  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return FILE_TYPE_ICONS.image;
    if (fileType === 'application/pdf') return FILE_TYPE_ICONS.pdf;
    if (fileType.includes('document')) return FILE_TYPE_ICONS.document;
    if (fileType.includes('spreadsheet')) return FILE_TYPE_ICONS.spreadsheet;
    if (fileType.includes('presentation')) return FILE_TYPE_ICONS.presentation;
    if (fileType.startsWith('video/')) return FILE_TYPE_ICONS.video;
    if (fileType.startsWith('audio/')) return FILE_TYPE_ICONS.audio;
    if (fileType.includes('zip') || fileType.includes('tar') || fileType.includes('rar')) return FILE_TYPE_ICONS.archive;
    return FILE_TYPE_ICONS.default;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get days until due
  const getDaysUntilDue = (date: string) => {
    const today = new Date();
    const dueDate = new Date(date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Check if activity is overdue
  const isOverdue = (activity: Activity) => {
    return activity.dueDate && 
           new Date(activity.dueDate) < new Date() && 
           activity.status !== 'completed';
  };

  // Check if activity is due today
  const isDueToday = (activity: Activity) => {
    return activity.dueDate && isToday(new Date(activity.dueDate));
  };

  // Check if activity is due tomorrow
  const isDueTomorrow = (activity: Activity) => {
    return activity.dueDate && isTomorrow(new Date(activity.dueDate));
  };

  // Check if activity is due this week
  const isDueThisWeek = (activity: Activity) => {
    return activity.dueDate && isThisWeek(new Date(activity.dueDate));
  };

  // Get due status text
  const getDueStatus = (activity: Activity) => {
    if (activity.status === 'completed') return 'Completed';
    if (!activity.dueDate) return 'No due date';
    
    const days = getDaysUntilDue(activity.dueDate);
    
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    if (days <= 7) return `Due in ${days} days`;
    return `Due on ${format(new Date(activity.dueDate), 'MMM d, yyyy')}`;
  };

  // Get due status color
  const getDueStatusColor = (activity: Activity) => {
    if (activity.status === 'completed') return GOOGLE_COLORS.green;
    if (!activity.dueDate) return GOOGLE_COLORS.grey;
    
    const days = getDaysUntilDue(activity.dueDate);
    
    if (days < 0) return GOOGLE_COLORS.red;
    if (days === 0) return GOOGLE_COLORS.orange;
    if (days <= 3) return GOOGLE_COLORS.yellow;
    return GOOGLE_COLORS.blue;
  };

  // Loading state
  if (companiesLoading) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        bgcolor: darkMode ? '#202124' : '#f8f9fa'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} sx={{ color: GOOGLE_COLORS.blue }} />
          <Typography sx={{ mt: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Loading companies...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!selectedCompanyId && companies.length === 0) {
    return (
      <Box sx={{
        minHeight: '60vh',
        bgcolor: darkMode ? '#202124' : '#f8f9fa',
        p: 3
      }}>
        <Paper sx={{
          p: 6,
          textAlign: 'center',
          bgcolor: darkMode ? '#2d2e30' : '#fff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '24px'
        }}>
          <BusinessIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            No Companies Found
          </Typography>
          <Typography sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            You need to create a company before managing activities.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/companies/create')}
            sx={{
              bgcolor: GOOGLE_COLORS.blue,
              '&:hover': { bgcolor: '#1557b0' },
              borderRadius: '24px',
              px: 4
            }}
          >
            Create Company
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{
        bgcolor: darkMode ? '#202124' : '#f8f9fa',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: 3,
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          background: darkMode
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{
            mb: 2,
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '& a': {
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              '&:hover': { textDecoration: 'underline' }
            }
          }}>
            <Link href="/dashboard">
              <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'}>
              Activities
            </Typography>
          </Breadcrumbs>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { sm: 'center' },
            justifyContent: 'space-between',
            gap: 2
          }}>
            <Box>
              <Typography variant="h4" sx={{
                fontWeight: 400,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                color: darkMode ? '#e8eaed' : '#202124',
                letterSpacing: '-0.5px',
                mb: 1
              }}>
                Activity Management
              </Typography>
              <Typography sx={{
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontSize: '0.875rem'
              }}>
                Track and manage all your activities, tasks, and communications
              </Typography>
            </Box>

            {/* Company Selector */}
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                }
              }}
            >
              <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Select Company
              </InputLabel>
              <Select
                value={selectedCompanyId}
                label="Select Company"
                onChange={handleCompanyChange}
                startAdornment={
                  <InputAdornment position="start">
                    <BusinessIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                }
              >
                {companies.map(company => (
                  <MenuItem key={company._id} value={company._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon sx={{ fontSize: 18 }} />
                      <Box>
                        <Typography variant="body2">{company.name}</Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {/* {company.industry || 'No industry'} • {company.userRole} */}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{
          maxWidth: '1600px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: 4
        }}>
          {/* Alerts */}
          <Snackbar
            open={!!success}
            autoHideDuration={4000}
            onClose={() => setSuccess(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              severity="success"
              onClose={() => setSuccess(null)}
              sx={{
                borderRadius: '8px',
                bgcolor: darkMode ? alpha(GOOGLE_COLORS.green, 0.1) : alpha(GOOGLE_COLORS.green, 0.05),
                color: darkMode ? '#81c995' : GOOGLE_COLORS.green,
                border: `1px solid ${alpha(GOOGLE_COLORS.green, 0.2)}`,
              }}
            >
              {success}
            </Alert>
          </Snackbar>

          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{
                mb: 4,
                borderRadius: '8px',
                bgcolor: darkMode ? alpha(GOOGLE_COLORS.red, 0.1) : alpha(GOOGLE_COLORS.red, 0.05),
                color: darkMode ? '#f28b82' : GOOGLE_COLORS.red,
                border: `1px solid ${alpha(GOOGLE_COLORS.red, 0.2)}`,
              }}
            >
              {error}
            </Alert>
          )}

          {/* Stats Cards */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4
          }}>
            <Paper sx={{
              flex: '1 1 calc(20% - 16px)',
              minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 12px)', md: 'calc(20% - 13px)' },
              p: 2,
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Total Activities
              </Typography>
              <Typography variant="h5" sx={{ color: GOOGLE_COLORS.blue, fontWeight: 500, mt: 0.5 }}>
                {activityStats.total}
              </Typography>
            </Paper>

            <Paper sx={{
              flex: '1 1 calc(20% - 16px)',
              minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 12px)', md: 'calc(20% - 13px)' },
              p: 2,
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Completed
              </Typography>
              <Typography variant="h5" sx={{ color: GOOGLE_COLORS.green, fontWeight: 500, mt: 0.5 }}>
                {activityStats.completed}
              </Typography>
            </Paper>

            <Paper sx={{
              flex: '1 1 calc(20% - 16px)',
              minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 12px)', md: 'calc(20% - 13px)' },
              p: 2,
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Pending
              </Typography>
              <Typography variant="h5" sx={{ color: GOOGLE_COLORS.orange, fontWeight: 500, mt: 0.5 }}>
                {activityStats.pending}
              </Typography>
            </Paper>

            <Paper sx={{
              flex: '1 1 calc(20% - 16px)',
              minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 12px)', md: 'calc(20% - 13px)' },
              p: 2,
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Overdue
              </Typography>
              <Typography variant="h5" sx={{ color: GOOGLE_COLORS.red, fontWeight: 500, mt: 0.5 }}>
                {activityStats.overdue}
              </Typography>
            </Paper>

            <Paper sx={{
              flex: '1 1 calc(20% - 16px)',
              minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 12px)', md: 'calc(20% - 13px)' },
              p: 2,
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Completion Rate
              </Typography>
              <Typography variant="h5" sx={{ color: GOOGLE_COLORS.purple, fontWeight: 500, mt: 0.5 }}>
                {activityStats.total > 0 ? Math.round((activityStats.completed / activityStats.total) * 100) : 0}%
              </Typography>
            </Paper>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="All Activities" icon={<AssignmentIcon />} iconPosition="start" />
              <Tab label="Tasks" icon={<TaskIcon />} iconPosition="start" />
              <Tab label="Calls" icon={<CallIcon />} iconPosition="start" />
              <Tab label="Meetings" icon={<VideocamIcon />} iconPosition="start" />
              <Tab label="Emails" icon={<EmailIcon />} iconPosition="start" />
              <Tab label="Notes" icon={<NoteIcon />} iconPosition="start" />
              <Tab label="Audit Logs" icon={<HistoryIcon />} iconPosition="start" />
              <Tab label="Attachments" icon={<AttachFileIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Filters and Actions */}
          <Paper
            sx={{
              mb: 4,
              p: 2.5,
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { md: 'center' },
              gap: 2
            }}>
              {/* Search */}
              <Box sx={{ flex: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  placeholder="Search activities by subject, description, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery("")}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '24px',
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    },
                  }}
                />
                <IconButton
                  onClick={fetchActivities}
                  sx={{
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    borderRadius: '50%',
                    width: 40,
                    height: 40
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Box>

              {/* View Mode Toggle */}
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: '24px',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    '&.Mui-selected': {
                      bgcolor: GOOGLE_COLORS.blue,
                      color: '#fff',
                      '&:hover': {
                        bgcolor: '#1557b0',
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="list">
                  <Tooltip title="List View">
                    <ViewListIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="grid">
                  <Tooltip title="Grid View">
                    <ViewModuleIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="calendar">
                  <Tooltip title="Calendar View">
                    <CalendarIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="timeline">
                  <Tooltip title="Timeline View">
                    <TimelineIcon />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Filter Button */}
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setFilterDrawerOpen(true)}
                sx={{
                  borderRadius: '24px',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  whiteSpace: 'nowrap'
                }}
              >
                Filters
                {(typeFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || assignedToFilter !== 'all') && (
                  <Badge
                    color="primary"
                    variant="dot"
                    sx={{ ml: 1 }}
                  />
                )}
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddDialogOpen(true)}
                sx={{
                  borderRadius: '24px',
                  bgcolor: GOOGLE_COLORS.green,
                  '&:hover': { bgcolor: '#2d9248' },
                  px: 3,
                  whiteSpace: 'nowrap'
                }}
              >
                Add Activity
              </Button>
            </Box>

            {/* Active Filters */}
            {(typeFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || assignedToFilter !== 'all') && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                {typeFilter !== 'all' && (
                  <MuiChip
                    label={`Type: ${ACTIVITY_TYPES.find(t => t.value === typeFilter)?.label}`}
                    onDelete={() => setTypeFilter('all')}
                    size="small"
                    sx={{
                      bgcolor: alpha(getActivityColor(typeFilter), 0.1),
                      color: getActivityColor(typeFilter),
                    }}
                  />
                )}
                {statusFilter !== 'all' && (
                  <MuiChip
                    label={`Status: ${ACTIVITY_STATUS.find(s => s.value === statusFilter)?.label}`}
                    onDelete={() => setStatusFilter('all')}
                    size="small"
                    sx={{
                      bgcolor: alpha(getStatusColor(statusFilter), 0.1),
                      color: getStatusColor(statusFilter),
                    }}
                  />
                )}
                {priorityFilter !== 'all' && (
                  <MuiChip
                    label={`Priority: ${ACTIVITY_PRIORITY.find(p => p.value === priorityFilter)?.label}`}
                    onDelete={() => setPriorityFilter('all')}
                    size="small"
                    sx={{
                      bgcolor: alpha(getPriorityColor(priorityFilter), 0.1),
                      color: getPriorityColor(priorityFilter),
                    }}
                  />
                )}
                {assignedToFilter !== 'all' && (
                  <MuiChip
                    label={`Assigned to: ${members.find(m => m.userId === assignedToFilter)?.user?.name || 'Unknown'}`}
                    onDelete={() => setAssignedToFilter('all')}
                    size="small"
                  />
                )}
                <Button
                  size="small"
                  onClick={() => {
                    setTypeFilter('all');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setAssignedToFilter('all');
                    setDateRangeFilter({});
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Clear All
                </Button>
              </Box>
            )}
          </Paper>

          {/* Content based on current tab */}
          {currentTab === 0 && ( // All Activities
            <>
              {loading ? (
                <Paper sx={{
                  p: 8,
                  textAlign: 'center',
                  bgcolor: darkMode ? '#2d2e30' : '#fff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  borderRadius: '16px'
                }}>
                  <CircularProgress size={40} sx={{ color: GOOGLE_COLORS.blue }} />
                  <Typography sx={{ mt: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Loading activities...
                  </Typography>
                </Paper>
              ) : activities.length === 0 ? (
                <Paper sx={{
                  p: 8,
                  textAlign: 'center',
                  bgcolor: darkMode ? '#2d2e30' : '#fff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  borderRadius: '16px'
                }}>
                  <AssignmentIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    No Activities Found
                  </Typography>
                  <Typography sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || assignedToFilter !== 'all'
                      ? "No activities match your current filters. Try adjusting your search criteria."
                      : "Start tracking your work by adding your first activity."}
                  </Typography>
                  {!searchQuery && typeFilter === 'all' && statusFilter === 'all' && priorityFilter === 'all' && assignedToFilter === 'all' && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setAddDialogOpen(true)}
                      sx={{
                        borderRadius: '24px',
                        bgcolor: GOOGLE_COLORS.green,
                        '&:hover': { bgcolor: '#2d9248' },
                        px: 4
                      }}
                    >
                      Add Your First Activity
                    </Button>
                  )}
                </Paper>
              ) : (
                viewMode === 'list' ? (
                  <Paper sx={{
                    overflow: 'hidden',
                    bgcolor: darkMode ? '#2d2e30' : '#fff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    borderRadius: '16px'
                  }}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{
                            bgcolor: darkMode ? '#303134' : '#f8f9fa',
                            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          }}>
                            <TableCell>
                              <TableSortLabel
                                active={orderBy === 'type'}
                                direction={orderBy === 'type' ? order : 'asc'}
                                onClick={() => handleSort('type')}
                                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                              >
                                Type
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={orderBy === 'subject'}
                                direction={orderBy === 'subject' ? order : 'asc'}
                                onClick={() => handleSort('subject')}
                                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                              >
                                Subject
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>Related To</TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={orderBy === 'priority'}
                                direction={orderBy === 'priority' ? order : 'asc'}
                                onClick={() => handleSort('priority')}
                                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                              >
                                Priority
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={orderBy === 'status'}
                                direction={orderBy === 'status' ? order : 'asc'}
                                onClick={() => handleSort('status')}
                                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                              >
                                Status
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={orderBy === 'dueDate'}
                                direction={orderBy === 'dueDate' ? order : 'asc'}
                                onClick={() => handleSort('dueDate')}
                                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                              >
                                Due Date
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>Assigned To</TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={orderBy === 'progress'}
                                direction={orderBy === 'progress' ? order : 'asc'}
                                onClick={() => handleSort('progress')}
                                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                              >
                                Progress
                              </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedActivities.map((activity) => {
                            const ActivityIcon = getActivityIcon(activity.type);
                            const PriorityIcon = getPriorityIcon(activity.priority);
                            const dueStatus = getDueStatus(activity);
                            const dueColor = getDueStatusColor(activity);
                            const isItemOverdue = isOverdue(activity);
                            
                            return (
                              <TableRow
                                key={activity._id}
                                hover
                                sx={{
                                  cursor: 'pointer',
                                  '&:hover': { bgcolor: darkMode ? '#303134' : '#f8f9fa' },
                                  borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                                  bgcolor: isItemOverdue ? alpha(GOOGLE_COLORS.red, 0.05) : 'inherit'
                                }}
                                onClick={() => {
                                  setSelectedActivity(activity);
                                  setDetailDialogOpen(true);
                                }}
                              >
                                <TableCell>
                                  <Tooltip title={ACTIVITY_TYPES.find(t => t.value === activity.type)?.label}>
                                    <Avatar sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      bgcolor: alpha(getActivityColor(activity.type), 0.1),
                                      color: getActivityColor(activity.type)
                                    }}>
                                      <ActivityIcon sx={{ fontSize: 18 }} />
                                    </Avatar>
                                  </Tooltip>
                                </TableCell>
                                <TableCell>
                                  <Box>
                                    <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                      {activity.subject}
                                    </Typography>
                                    {activity.description && (
                                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                        {activity.description.substring(0, 50)}
                                        {activity.description.length > 50 && '...'}
                                      </Typography>
                                    )}
                                    {activity.tags && activity.tags.length > 0 && (
                                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                        {activity.tags.slice(0, 2).map((tag, i) => (
                                          <MuiChip
                                            key={i}
                                            label={tag}
                                            size="small"
                                            sx={{
                                              height: 18,
                                              fontSize: '0.6rem',
                                              bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                                            }}
                                          />
                                        ))}
                                      </Box>
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    {activity.relatedTo.map((related, idx) => {
                                      const EntityIcon = ENTITY_TYPES.find(e => e.value === related.model)?.icon || BusinessIcon;
                                      return (
                                        <Typography key={idx} variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                          <EntityIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                          {related.name}
                                        </Typography>
                                      );
                                    })}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <MuiChip
                                    icon={<PriorityIcon sx={{ fontSize: 14 }} />}
                                    label={ACTIVITY_PRIORITY.find(p => p.value === activity.priority)?.label}
                                    size="small"
                                    sx={{
                                      bgcolor: alpha(getPriorityColor(activity.priority), 0.1),
                                      color: getPriorityColor(activity.priority),
                                      borderColor: alpha(getPriorityColor(activity.priority), 0.3),
                                      fontWeight: 500,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <MuiChip
                                    label={ACTIVITY_STATUS.find(s => s.value === activity.status)?.label}
                                    size="small"
                                    sx={{
                                      bgcolor: alpha(getStatusColor(activity.status), 0.1),
                                      color: getStatusColor(activity.status),
                                      borderColor: alpha(getStatusColor(activity.status), 0.3),
                                      fontWeight: 500,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CalendarIcon sx={{ fontSize: 14, color: dueColor }} />
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        color: dueColor,
                                        fontWeight: isItemOverdue ? 500 : 400
                                      }}
                                    >
                                      {dueStatus}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  {activity.assignedToName ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                                        <PersonIcon sx={{ fontSize: 14, color: GOOGLE_COLORS.blue }} />
                                      </Avatar>
                                      <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                        {activity.assignedToName}
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                      Unassigned
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LinearProgress
                                      variant="determinate"
                                      value={activity.progress}
                                      sx={{
                                        width: 60,
                                        height: 4,
                                        borderRadius: 2,
                                        bgcolor: darkMode ? '#3c4043' : '#dadce0',
                                        '& .MuiLinearProgress-bar': {
                                          bgcolor: activity.status === 'completed' ? GOOGLE_COLORS.green : getActivityColor(activity.type)
                                        }
                                      }}
                                    />
                                    <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                      {activity.progress}%
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedActivity(activity);
                                        setDetailDialogOpen(true);
                                      }}
                                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                                    >
                                      <ViewIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setAnchorEl(e.currentTarget);
                                        setSelectedActivity(activity);
                                      }}
                                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                                    >
                                      <MoreIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      component="div"
                      count={sortedActivities.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={(e, p) => setPage(p)}
                      onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                      }}
                      sx={{
                        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}
                    />
                  </Paper>
                ) : viewMode === 'grid' ? (
                  <Grid container spacing={3}>
                    {paginatedActivities.map((activity) => {
                      const ActivityIcon = getActivityIcon(activity.type);
                      const PriorityIcon = getPriorityIcon(activity.priority);
                      const dueStatus = getDueStatus(activity);
                      const dueColor = getDueStatusColor(activity);
                      const isItemOverdue = isOverdue(activity);
                      
                      return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={activity._id}>
                          <Card sx={{
                            bgcolor: darkMode ? '#2d2e30' : '#fff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            borderRadius: '16px',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            '&:hover': {
                              boxShadow: 3,
                              transform: 'translateY(-2px)',
                              transition: 'all 0.2s'
                            }
                          }}>
                            {isItemOverdue && (
                              <Box sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                zIndex: 1
                              }}>
                                <Tooltip title="Overdue">
                                  <WarningIcon sx={{ color: GOOGLE_COLORS.red }} />
                                </Tooltip>
                              </Box>
                            )}
                            
                            <CardHeader
                              avatar={
                                <Avatar sx={{ 
                                  bgcolor: alpha(getActivityColor(activity.type), 0.1),
                                  color: getActivityColor(activity.type)
                                }}>
                                  <ActivityIcon />
                                </Avatar>
                              }
                              action={
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAnchorEl(e.currentTarget);
                                    setSelectedActivity(activity);
                                  }}
                                >
                                  <MoreIcon />
                                </IconButton>
                              }
                              title={
                                <Typography variant="subtitle2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
                                  {activity.subject}
                                </Typography>
                              }
                              subheader={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                  <PriorityIcon sx={{ fontSize: 14, color: getPriorityColor(activity.priority) }} />
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    {ACTIVITY_PRIORITY.find(p => p.value === activity.priority)?.label}
                                  </Typography>
                                </Box>
                              }
                            />
                            
                            <CardContent sx={{ flex: 1, pt: 0 }}>
                              {activity.description && (
                                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                                  {activity.description.substring(0, 100)}
                                  {activity.description.length > 100 && '...'}
                                </Typography>
                              )}
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                                {activity.relatedTo.map((related, idx) => {
                                  const EntityIcon = ENTITY_TYPES.find(e => e.value === related.model)?.icon || BusinessIcon;
                                  return (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <EntityIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                      <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                        {related.name}
                                      </Typography>
                                    </Box>
                                  );
                                })}
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <MuiChip
                                  label={ACTIVITY_STATUS.find(s => s.value === activity.status)?.label}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(getStatusColor(activity.status), 0.1),
                                    color: getStatusColor(activity.status),
                                  }}
                                />
                                <MuiChip
                                  label={ACTIVITY_TYPES.find(t => t.value === activity.type)?.label}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(getActivityColor(activity.type), 0.1),
                                    color: getActivityColor(activity.type),
                                  }}
                                />
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CalendarIcon sx={{ fontSize: 14, color: dueColor }} />
                                <Typography variant="caption" sx={{ color: dueColor }}>
                                  {dueStatus}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ flex: 1 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={activity.progress}
                                    sx={{
                                      height: 6,
                                      borderRadius: 3,
                                      bgcolor: darkMode ? '#3c4043' : '#dadce0',
                                      '& .MuiLinearProgress-bar': {
                                        bgcolor: activity.status === 'completed' ? GOOGLE_COLORS.green : getActivityColor(activity.type)
                                      }
                                    }}
                                  />
                                </Box>
                                <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                  {activity.progress}%
                                </Typography>
                              </Box>
                            </CardContent>
                            
                            <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {activity.assignedToName ? (
                                  <Tooltip title={activity.assignedToName}>
                                    <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                                      <PersonIcon sx={{ fontSize: 14, color: GOOGLE_COLORS.blue }} />
                                    </Avatar>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="Unassigned">
                                    <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.grey, 0.1) }}>
                                      <PersonIcon sx={{ fontSize: 14, color: GOOGLE_COLORS.grey }} />
                                    </Avatar>
                                  </Tooltip>
                                )}
                                {activity.attachments.length > 0 && (
                                  <Tooltip title={`${activity.attachments.length} attachments`}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <AttachFileIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                        {activity.attachments.length}
                                      </Typography>
                                    </Box>
                                  </Tooltip>
                                )}
                              </Box>
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedActivity(activity);
                                  setDetailDialogOpen(true);
                                }}
                                sx={{ textTransform: 'none' }}
                              >
                                View Details
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : viewMode === 'calendar' ? (
                  <Paper sx={{
                    p: 3,
                    bgcolor: darkMode ? '#2d2e30' : '#fff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    borderRadius: '16px'
                  }}>
                    <Typography variant="body1" sx={{ textAlign: 'center', color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Calendar view coming soon...
                    </Typography>
                  </Paper>
                ) : (
                  <Paper sx={{
                    p: 3,
                    bgcolor: darkMode ? '#2d2e30' : '#fff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    borderRadius: '16px'
                  }}>
                    <Typography variant="body1" sx={{ textAlign: 'center', color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Timeline view coming soon...
                    </Typography>
                  </Paper>
                )
              )}
            </>
          )}

          {currentTab === 6 && ( // Audit Logs
            <Paper sx={{
              overflow: 'hidden',
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px'
            }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Entity</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow
                        key={log._id}
                        hover
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { bgcolor: darkMode ? '#303134' : '#f8f9fa' },
                          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}
                        onClick={() => {
                          setSelectedAuditLog(log);
                          setAuditDialogOpen(true);
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                              <PersonIcon sx={{ fontSize: 14, color: GOOGLE_COLORS.blue }} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {log.userName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                {log.userRole}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <MuiChip
                            label={log.action}
                            size="small"
                            sx={{
                              bgcolor: alpha(
                                log.action === 'create' ? GOOGLE_COLORS.green :
                                log.action === 'update' ? GOOGLE_COLORS.blue :
                                log.action === 'delete' ? GOOGLE_COLORS.red :
                                GOOGLE_COLORS.grey,
                                0.1
                              ),
                              color: log.action === 'create' ? GOOGLE_COLORS.green :
                                     log.action === 'update' ? GOOGLE_COLORS.blue :
                                     log.action === 'delete' ? GOOGLE_COLORS.red :
                                     GOOGLE_COLORS.grey,
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {log.entityType}
                            </Typography>
                            {log.entityName && (
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                {log.entityName}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {log.changes && log.changes.length > 0 && (
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                {log.changes.length} field(s) changed
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {log.ipAddress}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <MuiChip
                            label={log.status}
                            size="small"
                            sx={{
                              bgcolor: alpha(
                                log.status === 'success' ? GOOGLE_COLORS.green : GOOGLE_COLORS.red,
                                0.1
                              ),
                              color: log.status === 'success' ? GOOGLE_COLORS.green : GOOGLE_COLORS.red,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {currentTab === 7 && ( // Attachments
            <Paper sx={{
              overflow: 'hidden',
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px'
            }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <TableCell>File</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Entity</TableCell>
                      <TableCell>Uploaded By</TableCell>
                      <TableCell>Uploaded At</TableCell>
                      <TableCell>Access</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attachments.map((attachment) => {
                      const FileIcon = getFileTypeIcon(attachment.fileType);
                      
                      return (
                        <TableRow
                          key={attachment._id}
                          hover
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { bgcolor: darkMode ? '#303134' : '#f8f9fa' },
                            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          }}
                          onClick={() => {
                            setSelectedAttachment(attachment);
                            setAttachmentDialogOpen(true);
                          }}
                        >
                          <TableCell>
                            {attachment.fileType.startsWith('image/') ? (
                              <Avatar
                                variant="rounded"
                                src={attachment.thumbnail || attachment.url}
                                sx={{ width: 40, height: 40 }}
                              />
                            ) : (
                              <Avatar sx={{ 
                                width: 40, 
                                height: 40,
                                bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                                color: GOOGLE_COLORS.blue
                              }}>
                                <FileIcon />
                              </Avatar>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {attachment.originalName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {formatFileSize(attachment.fileSize)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <MuiChip
                              label={attachment.fileType.split('/')[1]?.toUpperCase() || attachment.fileType}
                              size="small"
                              sx={{
                                bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                                color: GOOGLE_COLORS.blue,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {attachment.entityType}
                              </Typography>
                              {attachment.entityName && (
                                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                  {attachment.entityName}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                                <PersonIcon sx={{ fontSize: 14, color: GOOGLE_COLORS.blue }} />
                              </Avatar>
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {attachment.uploadedByName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {format(new Date(attachment.createdAt), 'MMM d, yyyy')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {attachment.isPublic ? (
                              <Tooltip title="Public">
                                <PublicIcon sx={{ color: GOOGLE_COLORS.green }} />
                              </Tooltip>
                            ) : attachment.accessLevel === 'private' ? (
                              <Tooltip title="Private">
                                <LockIcon sx={{ color: GOOGLE_COLORS.red }} />
                              </Tooltip>
                            ) : (
                              <Tooltip title={attachment.accessLevel}>
                                <LockOpenIcon sx={{ color: GOOGLE_COLORS.blue }} />
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadAttachment(attachment);
                                }}
                                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAttachmentMenuAnchor(e.currentTarget);
                                  setSelectedAttachment(attachment);
                                }}
                                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                              >
                                <MoreIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>

        {/* Add Activity Dialog */}
        <Dialog
          open={addDialogOpen}
          onClose={() => !submitting && setAddDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }
          }}
        >
          <DialogTitle sx={{
            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            px: 4,
            py: 2.5,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Add New Activity
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Create a new activity, task, or communication
                </Typography>
              </Box>
              <IconButton
                onClick={() => !submitting && setAddDialogOpen(false)}
                disabled={submitting}
                size="small"
                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Activity Type */}
              <FormControl
                fullWidth
                size="small"
                error={!!validationErrors.type}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Activity Type *</InputLabel>
                <Select
                  value={formData.type}
                  label="Activity Type *"
                  onChange={handleFormTypeChange}
                >
                  {ACTIVITY_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <type.icon sx={{ color: type.color }} />
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Subject */}
              <TextField
                fullWidth
                label="Subject *"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                error={!!validationErrors.subject}
                helperText={validationErrors.subject}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />

              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

              {/* Related Entities */}
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Link to Records
              </Typography>

              <FormControl
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Entity Type</InputLabel>
                <Select
                  value=""
                  label="Entity Type"
                  onChange={(e) => {
                    // This will trigger adding a related entity
                  }}
                >
                  {ENTITY_TYPES.map(entity => (
                    <MenuItem key={entity.value} value={entity.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <entity.icon sx={{ color: entity.color }} />
                        {entity.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Dynamic entity selection based on type */}
              {formData.relatedTo.map((related, index) => {
                const EntityIcon = ENTITY_TYPES.find(e => e.value === related.model)?.icon || BusinessIcon;
                
                return (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MuiChip
                      icon={<EntityIcon />}
                      label={related.name}
                      onDelete={() => handleRemoveRelatedEntity(index)}
                      sx={{
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}
                    />
                  </Box>
                );
              })}

              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

              {/* Assignment */}
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Assignment
              </Typography>

              <FormControl
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={formData.assignedTo}
                  label="Assign To"
                  onChange={handleFormAssignedToChange}
                >
                  <MenuItem value="">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 18 }} />
                      Unassigned
                    </Box>
                  </MenuItem>
                  {members.map(member => (
                    <MenuItem key={member.userId} value={member.userId}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                          {member.user?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{member.user?.name}</Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {member.role}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

              {/* Dates */}
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Dates
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Start Date"
                    value={formData.startDate ? new Date(formData.startDate) : null}
                    onChange={(date) => setFormData({ ...formData, startDate: date?.toISOString() || '' })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: darkMode ? '#303134' : '#fff',
                          },
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="End Date"
                    value={formData.endDate ? new Date(formData.endDate) : null}
                    onChange={(date) => setFormData({ ...formData, endDate: date?.toISOString() || '' })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: darkMode ? '#303134' : '#fff',
                          },
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DateTimePicker
                    label="Due Date"
                    value={formData.dueDate ? new Date(formData.dueDate) : null}
                    onChange={(date) => setFormData({ ...formData, dueDate: date?.toISOString() || '' })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: !!validationErrors.dueDate,
                        helperText: validationErrors.dueDate,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: darkMode ? '#303134' : '#fff',
                          },
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

              {/* Status and Priority */}
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Status & Priority
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      bgcolor: darkMode ? '#303134' : '#fff',
                    },
                  }}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={handleFormStatusChange}
                  >
                    {ACTIVITY_STATUS.map(status => (
                      <MenuItem key={status.value} value={status.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: status.color }} />
                          {status.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      bgcolor: darkMode ? '#303134' : '#fff',
                    },
                  }}
                >
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={handleFormPriorityChange}
                  >
                    {ACTIVITY_PRIORITY.map(priority => (
                      <MenuItem key={priority.value} value={priority.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <priority.icon sx={{ fontSize: 18, color: priority.color }} />
                          {priority.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Progress */}
              <Box>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 1 }}>
                  Progress ({formData.progress}%)
                </Typography>
                <Slider
                  value={formData.progress}
                  onChange={(e, val) => setFormData({ ...formData, progress: val as number })}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={100}
                  sx={{
                    color: getActivityColor(formData.type),
                    '& .MuiSlider-thumb': {
                      width: 16,
                      height: 16,
                    }
                  }}
                />
              </Box>

              {/* Type-specific fields */}
              {formData.type === 'call' && (
                <>
                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                  <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Call Details
                  </Typography>

                  <FormControl
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  >
                    <InputLabel>Call Type</InputLabel>
                    <Select
                      value={formData.callDetails.callType}
                      label="Call Type"
                      onChange={(e) => setFormData({
                        ...formData,
                        callDetails: { ...formData.callDetails, callType: e.target.value as any }
                      })}
                    >
                      <MenuItem value="inbound">Inbound</MenuItem>
                      <MenuItem value="outbound">Outbound</MenuItem>
                      <MenuItem value="internal">Internal</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Call Duration (minutes)"
                    type="number"
                    value={formData.callDetails.callDuration}
                    onChange={(e) => setFormData({
                      ...formData,
                      callDetails: { ...formData.callDetails, callDuration: parseInt(e.target.value) }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Call Outcome"
                    value={formData.callDetails.callOutcome}
                    onChange={(e) => setFormData({
                      ...formData,
                      callDetails: { ...formData.callDetails, callOutcome: e.target.value }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Call Notes"
                    multiline
                    rows={3}
                    value={formData.callDetails.callNotes}
                    onChange={(e) => setFormData({
                      ...formData,
                      callDetails: { ...formData.callDetails, callNotes: e.target.value }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.callDetails.followUpRequired}
                        onChange={(e) => setFormData({
                          ...formData,
                          callDetails: { ...formData.callDetails, followUpRequired: e.target.checked }
                        })}
                      />
                    }
                    label="Follow-up Required"
                  />

                  {formData.callDetails.followUpRequired && (
                    <DateTimePicker
                      label="Follow-up Date"
                      value={formData.callDetails.followUpDate ? new Date(formData.callDetails.followUpDate) : null}
                      onChange={(date) => setFormData({
                        ...formData,
                        callDetails: { ...formData.callDetails, followUpDate: date?.toISOString() || '' }
                      })}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              bgcolor: darkMode ? '#303134' : '#fff',
                            },
                          }
                        }
                      }}
                    />
                  )}
                </>
              )}

              {formData.type === 'meeting' && (
                <>
                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                  <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Meeting Details
                  </Typography>

                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.meetingDetails.location}
                    onChange={(e) => setFormData({
                      ...formData,
                      meetingDetails: { ...formData.meetingDetails, location: e.target.value }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Meeting Link"
                    value={formData.meetingDetails.meetingLink}
                    onChange={(e) => setFormData({
                      ...formData,
                      meetingDetails: { ...formData.meetingDetails, meetingLink: e.target.value }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Meeting ID"
                    value={formData.meetingDetails.meetingId}
                    onChange={(e) => setFormData({
                      ...formData,
                      meetingDetails: { ...formData.meetingDetails, meetingId: e.target.value }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={formData.meetingDetails.password}
                    onChange={(e) => setFormData({
                      ...formData,
                      meetingDetails: { ...formData.meetingDetails, password: e.target.value }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Agenda"
                    multiline
                    rows={3}
                    value={formData.meetingDetails.agenda}
                    onChange={(e) => setFormData({
                      ...formData,
                      meetingDetails: { ...formData.meetingDetails, agenda: e.target.value }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  {/* Attendees section would go here */}
                </>
              )}

              {formData.type === 'email' && (
                <>
                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                  <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Email Details
                  </Typography>

                  <TextField
                    fullWidth
                    label="From"
                    value={formData.emailDetails.from}
                    onChange={(e) => setFormData({
                      ...formData,
                      emailDetails: { ...formData.emailDetails, from: e.target.value }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="To (comma-separated)"
                    value={formData.emailDetails.to.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      emailDetails: { 
                        ...formData.emailDetails, 
                        to: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="CC (comma-separated)"
                    value={formData.emailDetails.cc?.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      emailDetails: { 
                        ...formData.emailDetails, 
                        cc: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="BCC (comma-separated)"
                    value={formData.emailDetails.bcc?.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      emailDetails: { 
                        ...formData.emailDetails, 
                        bcc: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email Subject"
                    value={formData.emailDetails.subject}
                    onChange={(e) => setFormData({
                      ...formData,
                      emailDetails: { ...formData.emailDetails, subject: e.target.value }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email Body"
                    multiline
                    rows={6}
                    value={formData.emailDetails.body}
                    onChange={(e) => setFormData({
                      ...formData,
                      emailDetails: { ...formData.emailDetails, body: e.target.value }
                    })}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />
                </>
              )}

              {formData.type === 'task' && (
                <>
                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                  <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Task Details
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Estimated Hours"
                      type="number"
                      value={formData.taskDetails.estimatedHours}
                      onChange={(e) => setFormData({
                        ...formData,
                        taskDetails: { ...formData.taskDetails, estimatedHours: parseInt(e.target.value) }
                      })}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: darkMode ? '#303134' : '#fff',
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Actual Hours"
                      type="number"
                      value={formData.taskDetails.actualHours}
                      onChange={(e) => setFormData({
                        ...formData,
                        taskDetails: { ...formData.taskDetails, actualHours: parseInt(e.target.value) }
                      })}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: darkMode ? '#303134' : '#fff',
                        },
                      }}
                    />
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.taskDetails.billable}
                        onChange={(e) => setFormData({
                          ...formData,
                          taskDetails: { ...formData.taskDetails, billable: e.target.checked }
                        })}
                      />
                    }
                    label="Billable"
                  />

                  {formData.taskDetails.billable && (
                    <TextField
                      fullWidth
                      label="Hourly Rate"
                      type="number"
                      value={formData.taskDetails.hourlyRate}
                      onChange={(e) => setFormData({
                        ...formData,
                        taskDetails: { ...formData.taskDetails, hourlyRate: parseInt(e.target.value) }
                      })}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: darkMode ? '#303134' : '#fff',
                        },
                      }}
                    />
                  )}
                </>
              )}

              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

              {/* Attachments */}
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Attachments
              </Typography>

              <Box
                {...getRootProps()}
                sx={{
                  border: `2px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
                  borderRadius: '12px',
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: isDragActive ? alpha(GOOGLE_COLORS.blue, 0.05) : 'transparent',
                  '&:hover': {
                    bgcolor: alpha(GOOGLE_COLORS.blue, 0.05),
                  }
                }}
              >
                <input {...getInputProps()} />
                <AttachFileIcon sx={{ fontSize: 40, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1 }} />
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Max file size: 10MB
                </Typography>
              </Box>

              {formData.attachments.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {formData.attachments.map((file, index) => {
                    const FileIcon = file.type.startsWith('image/') ? ImageIcon : AttachFileIcon;
                    
                    return (
                      <Paper key={index} sx={{
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                        borderRadius: '8px',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FileIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              {formatFileSize(file.size)}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton size="small" onClick={() => removeAttachment(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    );
                  })}
                </Box>
              )}

              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

              {/* Tags */}
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="important, follow-up, client-meeting"
                size="small"
                helperText="Enter tags separated by commas"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />

              {/* Reminders */}
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Reminders
              </Typography>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setFormData({
                    ...formData,
                    reminders: [...formData.reminders, { type: 'notification', timeBefore: 15 }]
                  });
                }}
                sx={{
                  borderRadius: '24px',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
              >
                Add Reminder
              </Button>

              {formData.reminders.map((reminder, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <Select
                      value={reminder.type}
                      onChange={(e) => {
                        const newReminders = [...formData.reminders];
                        newReminders[index].type = e.target.value;
                        setFormData({ ...formData, reminders: newReminders });
                      }}
                      sx={{
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      }}
                    >
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="notification">Notification</MenuItem>
                      <MenuItem value="sms">SMS</MenuItem>
                      <MenuItem value="whatsapp">WhatsApp</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    type="number"
                    size="small"
                    value={reminder.timeBefore}
                    onChange={(e) => {
                      const newReminders = [...formData.reminders];
                      newReminders[index].timeBefore = parseInt(e.target.value);
                      setFormData({ ...formData, reminders: newReminders });
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">min</InputAdornment>,
                    }}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: darkMode ? '#303134' : '#fff',
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        reminders: formData.reminders.filter((_, i) => i !== index)
                      });
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </DialogContent>

          <DialogActions sx={{
            p: 3,
            borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
          }}>
            <Button
              onClick={() => setAddDialogOpen(false)}
              disabled={submitting}
              sx={{
                borderRadius: '24px',
                color: darkMode ? '#9aa0a6' : '#5f6368',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={addActivity}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <AddIcon />}
              sx={{
                borderRadius: '24px',
                bgcolor: GOOGLE_COLORS.green,
                '&:hover': { bgcolor: '#2d9248' },
                px: 4
              }}
            >
              {submitting ? 'Creating...' : 'Create Activity'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Activity Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }
          }}
        >
          {selectedActivity && (
            <>
              <DialogTitle sx={{
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                px: 4,
                py: 2.5,
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {(() => {
                      const Icon = getActivityIcon(selectedActivity.type);
                      return (
                        <Avatar sx={{ 
                          bgcolor: alpha(getActivityColor(selectedActivity.type), 0.1),
                          color: getActivityColor(selectedActivity.type)
                        }}>
                          <Icon />
                        </Avatar>
                      );
                    })()}
                    <Box>
                      <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {selectedActivity.subject}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <MuiChip
                          label={ACTIVITY_TYPES.find(t => t.value === selectedActivity.type)?.label}
                          size="small"
                          sx={{
                            bgcolor: alpha(getActivityColor(selectedActivity.type), 0.1),
                            color: getActivityColor(selectedActivity.type),
                          }}
                        />
                        <MuiChip
                          label={ACTIVITY_STATUS.find(s => s.value === selectedActivity.status)?.label}
                          size="small"
                          sx={{
                            bgcolor: alpha(getStatusColor(selectedActivity.status), 0.1),
                            color: getStatusColor(selectedActivity.status),
                          }}
                        />
                        {(() => {
                          const PriorityIcon = getPriorityIcon(selectedActivity.priority);
                          return (
                            <MuiChip
                              icon={<PriorityIcon />}
                              label={ACTIVITY_PRIORITY.find(p => p.value === selectedActivity.priority)?.label}
                              size="small"
                              sx={{
                                bgcolor: alpha(getPriorityColor(selectedActivity.priority), 0.1),
                                color: getPriorityColor(selectedActivity.priority),
                              }}
                            />
                          );
                        })()}
                      </Box>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => setDetailDialogOpen(false)}
                    size="small"
                    sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>

              <DialogContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Description */}
                  {selectedActivity.description && (
                    <Paper sx={{
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 1 }}>
                        Description
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', whiteSpace: 'pre-wrap' }}>
                        {selectedActivity.description}
                      </Typography>
                    </Paper>
                  )}

                  {/* Dates */}
                  <Paper sx={{
                    p: 2,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Grid container spacing={2}>
                      {selectedActivity.startDate && (
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Start Date
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {format(new Date(selectedActivity.startDate), 'MMM d, yyyy h:mm a')}
                          </Typography>
                        </Grid>
                      )}
                      {selectedActivity.endDate && (
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            End Date
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {format(new Date(selectedActivity.endDate), 'MMM d, yyyy h:mm a')}
                          </Typography>
                        </Grid>
                      )}
                      {selectedActivity.dueDate && (
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Due Date
                          </Typography>
                          <Typography variant="body2" sx={{ color: getDueStatusColor(selectedActivity) }}>
                            {format(new Date(selectedActivity.dueDate), 'MMM d, yyyy h:mm a')}
                            {isOverdue(selectedActivity) && ' (Overdue)'}
                          </Typography>
                        </Grid>
                      )}
                      {selectedActivity.completedAt && (
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Completed At
                          </Typography>
                          <Typography variant="body2" sx={{ color: GOOGLE_COLORS.green }}>
                            {format(new Date(selectedActivity.completedAt), 'MMM d, yyyy h:mm a')}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>

                  {/* Related Entities */}
                  {selectedActivity.relatedTo && selectedActivity.relatedTo.length > 0 && (
                    <Paper sx={{
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 1 }}>
                        Related Records
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {selectedActivity.relatedTo.map((related, idx) => {
                          const EntityIcon = ENTITY_TYPES.find(e => e.value === related.model)?.icon || BusinessIcon;
                          return (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EntityIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {related.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                ({related.model})
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Paper>
                  )}

                  {/* Assignment */}
                  <Paper sx={{
                    p: 2,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 1 }}>
                      Assigned To
                    </Typography>
                    {selectedActivity.assignedToName ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                          <PersonIcon sx={{ fontSize: 18, color: GOOGLE_COLORS.blue }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {selectedActivity.assignedToName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {members.find(m => m.userId === selectedActivity.assignedTo)?.role || 'Team Member'}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Unassigned
                      </Typography>
                    )}
                  </Paper>

                  {/* Progress */}
                  <Paper sx={{
                    p: 2,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 1 }}>
                      Progress
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={selectedActivity.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: darkMode ? '#3c4043' : '#dadce0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: selectedActivity.status === 'completed' ? GOOGLE_COLORS.green : getActivityColor(selectedActivity.type)
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {selectedActivity.progress}%
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Type-specific details */}
                  {selectedActivity.type === 'call' && selectedActivity.callDetails && (
                    <Paper sx={{
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                        Call Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Call Type
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', textTransform: 'capitalize' }}>
                            {selectedActivity.callDetails.callType}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Duration
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {selectedActivity.callDetails.callDuration} minutes
                          </Typography>
                        </Grid>
                        {selectedActivity.callDetails.callOutcome && (
                          <Grid item xs={12}>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                              Outcome
                            </Typography>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {selectedActivity.callDetails.callOutcome}
                            </Typography>
                          </Grid>
                        )}
                        {selectedActivity.callDetails.callNotes && (
                          <Grid item xs={12}>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                              Notes
                            </Typography>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', whiteSpace: 'pre-wrap' }}>
                              {selectedActivity.callDetails.callNotes}
                            </Typography>
                          </Grid>
                        )}
                        {selectedActivity.callDetails.followUpRequired && (
                          <Grid item xs={12}>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                              Follow-up Required
                            </Typography>
                            {selectedActivity.callDetails.followUpDate && (
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {format(new Date(selectedActivity.callDetails.followUpDate), 'MMM d, yyyy h:mm a')}
                              </Typography>
                            )}
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  )}

                  {selectedActivity.type === 'meeting' && selectedActivity.meetingDetails && (
                    <Paper sx={{
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                        Meeting Details
                      </Typography>
                      {selectedActivity.meetingDetails.location && (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Location
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {selectedActivity.meetingDetails.location}
                          </Typography>
                        </Box>
                      )}
                      {selectedActivity.meetingDetails.meetingLink && (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Meeting Link
                          </Typography>
                          <Link href={selectedActivity.meetingDetails.meetingLink} target="_blank">
                            <Typography variant="body2" sx={{ color: GOOGLE_COLORS.blue, textDecoration: 'underline' }}>
                              {selectedActivity.meetingDetails.meetingLink}
                            </Typography>
                          </Link>
                        </Box>
                      )}
                      {selectedActivity.meetingDetails.agenda && (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Agenda
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', whiteSpace: 'pre-wrap' }}>
                            {selectedActivity.meetingDetails.agenda}
                          </Typography>
                        </Box>
                      )}
                      {selectedActivity.meetingDetails.attendees && selectedActivity.meetingDetails.attendees.length > 0 && (
                        <Box>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 0.5 }}>
                            Attendees
                          </Typography>
                          {selectedActivity.meetingDetails.attendees.map((attendee, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <PersonIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {attendee.name} ({attendee.email})
                              </Typography>
                              <MuiChip
                                label={attendee.status}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  bgcolor: alpha(
                                    attendee.status === 'accepted' ? GOOGLE_COLORS.green :
                                    attendee.status === 'declined' ? GOOGLE_COLORS.red :
                                    GOOGLE_COLORS.yellow,
                                    0.1
                                  ),
                                  color: attendee.status === 'accepted' ? GOOGLE_COLORS.green :
                                         attendee.status === 'declined' ? GOOGLE_COLORS.red :
                                         GOOGLE_COLORS.yellow,
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Paper>
                  )}

                  {selectedActivity.type === 'email' && selectedActivity.emailDetails && (
                    <Paper sx={{
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                        Email Details
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          From
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedActivity.emailDetails.from}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          To
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedActivity.emailDetails.to.join(', ')}
                        </Typography>
                      </Box>
                      {selectedActivity.emailDetails.cc && selectedActivity.emailDetails.cc.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            CC
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {selectedActivity.emailDetails.cc.join(', ')}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          Subject
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500 }}>
                          {selectedActivity.emailDetails.subject}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 0.5 }}>
                          Body
                        </Typography>
                        <Paper sx={{
                          p: 2,
                          bgcolor: darkMode ? '#202124' : '#fff',
                          borderRadius: '8px',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', whiteSpace: 'pre-wrap' }}>
                            {selectedActivity.emailDetails.body}
                          </Typography>
                        </Paper>
                      </Box>
                    </Paper>
                  )}

                  {selectedActivity.type === 'task' && selectedActivity.taskDetails && (
                    <Paper sx={{
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                        Task Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Estimated Hours
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {selectedActivity.taskDetails.estimatedHours}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Actual Hours
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {selectedActivity.taskDetails.actualHours}
                          </Typography>
                        </Grid>
                        {selectedActivity.taskDetails.billable && (
                          <>
                            <Grid item xs={6}>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                                Hourly Rate
                              </Typography>
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                ${selectedActivity.taskDetails.hourlyRate}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                                Total Cost
                              </Typography>
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                ${selectedActivity.taskDetails.totalCost}
                              </Typography>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Paper>
                  )}

                  {/* Attachments */}
                  {selectedActivity.attachments && selectedActivity.attachments.length > 0 && (
                    <Paper sx={{
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                        Attachments ({selectedActivity.attachments.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {selectedActivity.attachments.map((attachment, idx) => {
                          const FileIcon = getFileTypeIcon(attachment.type);
                          
                          return (
                            <Paper key={idx} sx={{
                              p: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              bgcolor: darkMode ? '#202124' : '#fff',
                              borderRadius: '8px',
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {attachment.type.startsWith('image/') ? (
                                  <Avatar
                                    variant="rounded"
                                    src={attachment.url}
                                    sx={{ width: 40, height: 40 }}
                                  />
                                ) : (
                                  <Avatar sx={{ 
                                    width: 40, 
                                    height: 40,
                                    bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                                    color: GOOGLE_COLORS.blue
                                  }}>
                                    <FileIcon />
                                  </Avatar>
                                )}
                                <Box>
                                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                    {attachment.filename}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    {formatFileSize(attachment.size)} • Uploaded {format(new Date(attachment.uploadedAt), 'MMM d, yyyy')}
                                  </Typography>
                                </Box>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={() => window.open(attachment.url, '_blank')}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Paper>
                          );
                        })}
                      </Box>
                    </Paper>
                  )}

                  {/* Tags */}
                  {selectedActivity.tags && selectedActivity.tags.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {selectedActivity.tags.map((tag, i) => (
                        <MuiChip
                          key={i}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                            color: darkMode ? '#e8eaed' : '#202124',
                            borderRadius: '16px',
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Timeline */}
                  <Paper sx={{
                    p: 2,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                      Timeline
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Created
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {format(new Date(selectedActivity.createdAt), 'MMM d, yyyy h:mm a')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Last Updated
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {format(new Date(selectedActivity.updatedAt), 'MMM d, yyyy h:mm a')}
                        </Typography>
                      </Box>
                      {selectedActivity.createdBy && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            Created By
                          </Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {selectedActivity.createdByName}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>

                  {/* Sharing */}
                  {selectedActivity.sharedWith && selectedActivity.sharedWith.length > 0 && (
                    <Paper sx={{
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                        Shared With
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {selectedActivity.sharedWith.map((share, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                              <PersonIcon sx={{ fontSize: 14, color: GOOGLE_COLORS.blue }} />
                            </Avatar>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {share.userName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              ({share.permissions.read ? 'Read' : ''} {share.permissions.write ? 'Write' : ''})
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  )}
                </Box>
              </DialogContent>

              <DialogActions sx={{
                p: 3,
                borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Button
                    color="error"
                    onClick={() => deleteActivity(selectedActivity._id)}
                    disabled={submitting}
                    startIcon={<DeleteIcon />}
                    sx={{
                      borderRadius: '24px',
                      color: GOOGLE_COLORS.red,
                      borderColor: alpha(GOOGLE_COLORS.red, 0.5),
                    }}
                  >
                    Delete
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={() => setShareDialogOpen(true)}
                    startIcon={<ShareIcon />}
                    sx={{
                      borderRadius: '24px',
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    Share
                  </Button>
                  <Button
                    onClick={() => setDetailDialogOpen(false)}
                    sx={{
                      borderRadius: '24px',
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setEditDialogOpen(true);
                      setDetailDialogOpen(false);
                      // Populate form with selected activity data
                      setFormData({
                        type: selectedActivity.type,
                        subtype: selectedActivity.subtype || "",
                        subject: selectedActivity.subject,
                        description: selectedActivity.description || "",
                        relatedTo: selectedActivity.relatedTo || [],
                        assignedTo: selectedActivity.assignedTo || "",
                        assignedToName: selectedActivity.assignedToName || "",
                        startDate: selectedActivity.startDate || "",
                        endDate: selectedActivity.endDate || "",
                        dueDate: selectedActivity.dueDate || "",
                        status: selectedActivity.status,
                        priority: selectedActivity.priority,
                        progress: selectedActivity.progress,
                        callDetails: selectedActivity.callDetails || {
                          callType: "outbound",
                          callDuration: 0,
                          callRecording: "",
                          callOutcome: "",
                          callNotes: "",
                          followUpRequired: false,
                          followUpDate: ""
                        },
                        emailDetails: selectedActivity.emailDetails || {
                          from: "",
                          to: [],
                          cc: [],
                          bcc: [],
                          subject: "",
                          body: "",
                          attachments: [],
                          isRead: false,
                          isReplied: false,
                          isForwarded: false,
                          threadId: "",
                          inReplyTo: ""
                        },
                        meetingDetails: selectedActivity.meetingDetails || {
                          location: "",
                          meetingLink: "",
                          meetingId: "",
                          password: "",
                          attendees: [],
                          notes: "",
                          agenda: "",
                          outcome: ""
                        },
                        taskDetails: selectedActivity.taskDetails || {
                          estimatedHours: 0,
                          actualHours: 0,
                          billable: false,
                          hourlyRate: 0,
                          totalCost: 0,
                          dependsOn: [],
                          blockedBy: []
                        },
                        isRecurring: selectedActivity.isRecurring || false,
                        recurrencePattern: selectedActivity.recurrencePattern || {
                          frequency: "daily",
                          interval: 1,
                          daysOfWeek: [],
                          dayOfMonth: 1,
                          monthOfYear: 1,
                          endDate: "",
                          count: 0
                        },
                        reminders: selectedActivity.reminders || [],
                        tags: selectedActivity.tags?.join(', ') || "",
                        attachments: [],
                        location: selectedActivity.location || {
                          type: "physical",
                          address: "",
                          coordinates: { lat: 0, lng: 0 }
                        },
                        outcome: selectedActivity.outcome || "",
                        feedback: selectedActivity.feedback || "",
                        rating: selectedActivity.rating || 0,
                        sharedWith: selectedActivity.sharedWith || []
                      });
                    }}
                    sx={{
                      borderRadius: '24px',
                      bgcolor: GOOGLE_COLORS.blue,
                      '&:hover': { bgcolor: '#1557b0' },
                    }}
                  >
                    Edit Activity
                  </Button>
                </Box>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Edit Activity Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => !submitting && setEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }
          }}
        >
          <DialogTitle sx={{
            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            px: 4,
            py: 2.5,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Edit Activity
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Update activity details
                </Typography>
              </Box>
              <IconButton
                onClick={() => !submitting && setEditDialogOpen(false)}
                disabled={submitting}
                size="small"
                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Same form fields as Add Activity Dialog */}
              {/* Activity Type (disabled in edit) */}
              <FormControl
                fullWidth
                size="small"
                disabled
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Activity Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Activity Type"
                >
                  {ACTIVITY_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <type.icon sx={{ color: type.color }} />
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Subject */}
              <TextField
                fullWidth
                label="Subject *"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                error={!!validationErrors.subject}
                helperText={validationErrors.subject}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />

              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

              {/* Related Entities */}
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Link to Records
              </Typography>

              {formData.relatedTo.map((related, index) => {
                const EntityIcon = ENTITY_TYPES.find(e => e.value === related.model)?.icon || BusinessIcon;
                
                return (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MuiChip
                      icon={<EntityIcon />}
                      label={related.name}
                      onDelete={() => handleRemoveRelatedEntity(index)}
                      sx={{
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}
                    />
                  </Box>
                );
              })}

              <FormControl
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Add Related Entity</InputLabel>
                <Select
                  value=""
                  label="Add Related Entity"
                  onChange={(e) => {
                    // This will trigger adding a related entity
                    const model = e.target.value;
                    // Show entity selection dialog
                  }}
                >
                  {ENTITY_TYPES.map(entity => (
                    <MenuItem key={entity.value} value={entity.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <entity.icon sx={{ color: entity.color }} />
                        {entity.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

              {/* Assignment */}
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Assignment
              </Typography>

              <FormControl
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={formData.assignedTo}
                  label="Assign To"
                  onChange={handleFormAssignedToChange}
                >
                  <MenuItem value="">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 18 }} />
                      Unassigned
                    </Box>
                  </MenuItem>
                  {members.map(member => (
                    <MenuItem key={member.userId} value={member.userId}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                          {member.user?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{member.user?.name}</Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {member.role}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

              {/* Dates */}
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Dates
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Start Date"
                    value={formData.startDate ? new Date(formData.startDate) : null}
                    onChange={(date) => setFormData({ ...formData, startDate: date?.toISOString() || '' })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: darkMode ? '#303134' : '#fff',
                          },
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="End Date"
                    value={formData.endDate ? new Date(formData.endDate) : null}
                    onChange={(date) => setFormData({ ...formData, endDate: date?.toISOString() || '' })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: darkMode ? '#303134' : '#fff',
                          },
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DateTimePicker
                    label="Due Date"
                    value={formData.dueDate ? new Date(formData.dueDate) : null}
                    onChange={(date) => setFormData({ ...formData, dueDate: date?.toISOString() || '' })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: !!validationErrors.dueDate,
                        helperText: validationErrors.dueDate,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: darkMode ? '#303134' : '#fff',
                          },
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

              {/* Status and Priority */}
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Status & Priority
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      bgcolor: darkMode ? '#303134' : '#fff',
                    },
                  }}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={handleFormStatusChange}
                  >
                    {ACTIVITY_STATUS.map(status => (
                      <MenuItem key={status.value} value={status.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: status.color }} />
                          {status.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      bgcolor: darkMode ? '#303134' : '#fff',
                    },
                  }}
                >
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={handleFormPriorityChange}
                  >
                    {ACTIVITY_PRIORITY.map(priority => (
                      <MenuItem key={priority.value} value={priority.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <priority.icon sx={{ fontSize: 18, color: priority.color }} />
                          {priority.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Progress */}
              <Box>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 1 }}>
                  Progress ({formData.progress}%)
                </Typography>
                <Slider
                  value={formData.progress}
                  onChange={(e, val) => setFormData({ ...formData, progress: val as number })}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={100}
                  sx={{
                    color: getActivityColor(formData.type),
                    '& .MuiSlider-thumb': {
                      width: 16,
                      height: 16,
                    }
                  }}
                />
              </Box>

              {/* Type-specific fields - same as add dialog */}
              {/* ... (rest of the type-specific fields) ... */}

              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

              {/* Tags */}
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="important, follow-up, client-meeting"
                size="small"
                helperText="Enter tags separated by commas"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{
            p: 3,
            borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
          }}>
            <Button
              onClick={() => setEditDialogOpen(false)}
              disabled={submitting}
              sx={{
                borderRadius: '24px',
                color: darkMode ? '#9aa0a6' : '#5f6368',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={updateActivity}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <EditIcon />}
              sx={{
                borderRadius: '24px',
                bgcolor: GOOGLE_COLORS.blue,
                '&:hover': { bgcolor: '#1557b0' },
                px: 4
              }}
            >
              {submitting ? 'Updating...' : 'Update Activity'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Share Dialog */}
        <Dialog
          open={shareDialogOpen}
          onClose={() => !submitting && setShareDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }
          }}
        >
          <DialogTitle sx={{
            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            px: 4,
            py: 2.5,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Share Activity
              </Typography>
              <IconButton
                onClick={() => !submitting && setShareDialogOpen(false)}
                disabled={submitting}
                size="small"
                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Share "{selectedActivity?.subject}" with team members
              </Typography>

              <FormControl
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Select Team Member</InputLabel>
                <Select
                  value=""
                  label="Select Team Member"
                  onChange={(e) => {
                    const userId = e.target.value;
                    const member = members.find(m => m.userId === userId);
                    if (member && selectedActivity) {
                      const newSharedWith = [
                        ...(selectedActivity.sharedWith || []),
                        {
                          userId: member.userId,
                          userName: member.user?.name || '',
                          permissions: { read: true, write: false },
                          sharedAt: new Date().toISOString()
                        }
                      ];
                      setSelectedActivity({
                        ...selectedActivity,
                        sharedWith: newSharedWith
                      });
                    }
                  }}
                >
                  {members
                    .filter(m => !selectedActivity?.sharedWith?.some(s => s.userId === m.userId))
                    .map(member => (
                      <MenuItem key={member.userId} value={member.userId}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                            {member.user?.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{member.user?.name}</Typography>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              {member.role}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {selectedActivity?.sharedWith && selectedActivity.sharedWith.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Shared With
                  </Typography>
                  {selectedActivity.sharedWith.map((share, idx) => (
                    <Paper key={idx} sx={{
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '12px',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                          <PersonIcon sx={{ fontSize: 16, color: GOOGLE_COLORS.blue }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {share.userName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {format(new Date(share.sharedAt), 'MMM d, yyyy')}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={share.permissions.read}
                              onChange={(e) => {
                                if (selectedActivity) {
                                  const newSharedWith = [...selectedActivity.sharedWith];
                                  newSharedWith[idx].permissions.read = e.target.checked;
                                  setSelectedActivity({
                                    ...selectedActivity,
                                    sharedWith: newSharedWith
                                  });
                                }
                              }}
                            />
                          }
                          label="Read"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={share.permissions.write}
                              onChange={(e) => {
                                if (selectedActivity) {
                                  const newSharedWith = [...selectedActivity.sharedWith];
                                  newSharedWith[idx].permissions.write = e.target.checked;
                                  setSelectedActivity({
                                    ...selectedActivity,
                                    sharedWith: newSharedWith
                                  });
                                }
                              }}
                            />
                          }
                          label="Write"
                        />
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (selectedActivity) {
                              setSelectedActivity({
                                ...selectedActivity,
                                sharedWith: selectedActivity.sharedWith.filter((_, i) => i !== idx)
                              });
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{
            p: 3,
            borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
          }}>
            <Button
              onClick={() => setShareDialogOpen(false)}
              disabled={submitting}
              sx={{
                borderRadius: '24px',
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (selectedActivity) {
                  shareActivity(selectedActivity._id, selectedActivity.sharedWith);
                }
              }}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <ShareIcon />}
              sx={{
                borderRadius: '24px',
                bgcolor: GOOGLE_COLORS.blue,
                '&:hover': { bgcolor: '#1557b0' },
              }}
            >
              {submitting ? 'Saving...' : 'Save Sharing Settings'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Audit Log Dialog */}
        <Dialog
          open={auditDialogOpen}
          onClose={() => setAuditDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }
          }}
        >
          {selectedAuditLog && (
            <>
              <DialogTitle sx={{
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                px: 4,
                py: 2.5,
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Audit Log Details
                  </Typography>
                  <IconButton
                    onClick={() => setAuditDialogOpen(false)}
                    size="small"
                    sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>

              <DialogContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Paper sx={{
                    p: 2,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          Timestamp
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {format(new Date(selectedAuditLog.timestamp), 'MMM d, yyyy HH:mm:ss')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          Status
                        </Typography>
                        <MuiChip
                          label={selectedAuditLog.status}
                          size="small"
                          sx={{
                            bgcolor: alpha(
                              selectedAuditLog.status === 'success' ? GOOGLE_COLORS.green : GOOGLE_COLORS.red,
                              0.1
                            ),
                            color: selectedAuditLog.status === 'success' ? GOOGLE_COLORS.green : GOOGLE_COLORS.red,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          User
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                            <PersonIcon sx={{ fontSize: 18, color: GOOGLE_COLORS.blue }} />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {selectedAuditLog.userName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              {selectedAuditLog.userEmail} • {selectedAuditLog.userRole}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          Action
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', textTransform: 'capitalize' }}>
                          {selectedAuditLog.action}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          Entity
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedAuditLog.entityType}
                          {selectedAuditLog.entityName && `: ${selectedAuditLog.entityName}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          IP Address
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedAuditLog.ipAddress}
                        </Typography>
                      </Grid>
                      {selectedAuditLog.userAgent && (
                        <Grid item xs={12}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            User Agent
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', wordBreak: 'break-word' }}>
                            {selectedAuditLog.userAgent}
                          </Typography>
                        </Grid>
                      )}
                      {selectedAuditLog.sessionId && (
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Session ID
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {selectedAuditLog.sessionId}
                          </Typography>
                        </Grid>
                      )}
                      {selectedAuditLog.requestId && (
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Request ID
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {selectedAuditLog.requestId}
                          </Typography>
                        </Grid>
                      )}
                      {selectedAuditLog.errorMessage && (
                        <Grid item xs={12}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Error Message
                          </Typography>
                          <Alert severity="error" sx={{ borderRadius: '8px' }}>
                            {selectedAuditLog.errorMessage}
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>

                  {selectedAuditLog.changes && selectedAuditLog.changes.length > 0 && (
                    <Paper sx={{
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                        Changes
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Field</TableCell>
                              <TableCell>Old Value</TableCell>
                              <TableCell>New Value</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedAuditLog.changes.map((change, idx) => (
                              <TableRow key={idx}>
                                <TableCell>
                                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                    {change.field}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                    {change.oldValue !== undefined ? String(change.oldValue) : 'null'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ color: GOOGLE_COLORS.green }}>
                                    {change.newValue !== undefined ? String(change.newValue) : 'null'}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  )}

                  {selectedAuditLog.metadata && Object.keys(selectedAuditLog.metadata).length > 0 && (
                    <Paper sx={{
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                        Additional Metadata
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {Object.entries(selectedAuditLog.metadata).map(([key, value]) => (
                          <Box key={key} sx={{ display: 'flex' }}>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', width: 150 }}>
                              {key}:
                            </Typography>
                            <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {String(value)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  )}
                </Box>
              </DialogContent>

              <DialogActions sx={{
                p: 3,
                borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
              }}>
                <Button
                  onClick={() => setAuditDialogOpen(false)}
                  sx={{
                    borderRadius: '24px',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Attachment Dialog */}
        <Dialog
          open={attachmentDialogOpen}
          onClose={() => setAttachmentDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }
          }}
        >
          {selectedAttachment && (
            <>
              <DialogTitle sx={{
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                px: 4,
                py: 2.5,
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Attachment Details
                  </Typography>
                  <IconButton
                    onClick={() => setAttachmentDialogOpen(false)}
                    size="small"
                    sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>

              <DialogContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Preview */}
                  {selectedAttachment.fileType.startsWith('image/') ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={selectedAttachment.url}
                        alt={selectedAttachment.originalName}
                        style={{
                          maxWidth: '100%',
                          maxHeight: 400,
                          borderRadius: '12px',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  ) : selectedAttachment.fileType === 'application/pdf' ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <PdfIcon sx={{ fontSize: 100, color: GOOGLE_COLORS.red }} />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      {getFileTypeIcon(selectedAttachment.fileType)({ sx: { fontSize: 100, color: GOOGLE_COLORS.blue } })}
                    </Box>
                  )}

                  {/* File Info */}
                  <Paper sx={{
                    p: 2,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          File Name
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedAttachment.originalName}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          File Size
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {formatFileSize(selectedAttachment.fileSize)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          File Type
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedAttachment.fileType}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          Uploaded By
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedAttachment.uploadedByName}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          Uploaded At
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {format(new Date(selectedAttachment.createdAt), 'MMM d, yyyy h:mm a')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          Entity
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedAttachment.entityType}
                          {selectedAttachment.entityName && `: ${selectedAttachment.entityName}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          Access Level
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {selectedAttachment.isPublic ? (
                            <PublicIcon sx={{ color: GOOGLE_COLORS.green }} />
                          ) : selectedAttachment.accessLevel === 'private' ? (
                            <LockIcon sx={{ color: GOOGLE_COLORS.red }} />
                          ) : (
                            <LockOpenIcon sx={{ color: GOOGLE_COLORS.blue }} />
                          )}
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', textTransform: 'capitalize' }}>
                            {selectedAttachment.accessLevel}
                            {selectedAttachment.isPublic && ' (Public)'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Shared With */}
                  {selectedAttachment.sharedWith && selectedAttachment.sharedWith.length > 0 && (
                    <Paper sx={{
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                        Shared With
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {selectedAttachment.sharedWith.map((share, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                              <PersonIcon sx={{ fontSize: 14, color: GOOGLE_COLORS.blue }} />
                            </Avatar>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {share.userName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              ({share.permissions.read ? 'Read' : ''} {share.permissions.download ? 'Download' : ''})
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  )}
                </Box>
              </DialogContent>

              <DialogActions sx={{
                p: 3,
                borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Button
                    color="error"
                    onClick={() => deleteAttachment(selectedAttachment._id)}
                    startIcon={<DeleteIcon />}
                    sx={{
                      borderRadius: '24px',
                      color: GOOGLE_COLORS.red,
                      borderColor: alpha(GOOGLE_COLORS.red, 0.5),
                    }}
                  >
                    Delete
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={() => window.open(selectedAttachment.url, '_blank')}
                    startIcon={<DownloadIcon />}
                    sx={{
                      borderRadius: '24px',
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    Download
                  </Button>
                  <Button
                    onClick={() => setAttachmentDialogOpen(false)}
                    sx={{
                      borderRadius: '24px',
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    Close
                  </Button>
                </Box>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Filter Drawer */}
        <Drawer
          anchor="right"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: 400 },
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              borderLeft: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Filters
              </Typography>
              <IconButton onClick={() => setFilterDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Type Filter */}
              <FormControl fullWidth size="small">
                <InputLabel>Activity Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Activity Type"
                  onChange={handleTypeFilterChange}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {ACTIVITY_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <type.icon sx={{ color: type.color }} />
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Status Filter */}
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  {ACTIVITY_STATUS.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: status.color }} />
                        {status.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Priority Filter */}
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={handlePriorityFilterChange}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  {ACTIVITY_PRIORITY.map(priority => (
                    <MenuItem key={priority.value} value={priority.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <priority.icon sx={{ fontSize: 18, color: priority.color }} />
                        {priority.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Assigned To Filter */}
              <FormControl fullWidth size="small">
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={assignedToFilter}
                  label="Assigned To"
                  onChange={handleAssignedToFilterChange}
                >
                  <MenuItem value="all">Everyone</MenuItem>
                  <MenuItem value="unassigned">Unassigned</MenuItem>
                  {members.map(member => (
                    <MenuItem key={member.userId} value={member.userId}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                          {member.user?.name?.charAt(0)}
                        </Avatar>
                        {member.user?.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Date Range */}
              <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Date Range
              </Typography>

              <DatePicker
                label="From Date"
                value={dateRangeFilter.from ? new Date(dateRangeFilter.from) : null}
                onChange={(date) => setDateRangeFilter({ ...dateRangeFilter, from: date?.toISOString() })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }
                  }
                }}
              />

              <DatePicker
                label="To Date"
                value={dateRangeFilter.to ? new Date(dateRangeFilter.to) : null}
                onChange={(date) => setDateRangeFilter({ ...dateRangeFilter, to: date?.toISOString() })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }
                  }
                }}
              />

              <Button
                variant="contained"
                onClick={() => {
                  setFilterDrawerOpen(false);
                  fetchActivities();
                }}
                sx={{
                  borderRadius: '24px',
                  bgcolor: GOOGLE_COLORS.blue,
                  '&:hover': { bgcolor: '#1557b0' },
                  mt: 2
                }}
              >
                Apply Filters
              </Button>

              <Button
                onClick={() => {
                  setTypeFilter('all');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setAssignedToFilter('all');
                  setDateRangeFilter({});
                }}
                sx={{
                  borderRadius: '24px',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          </Box>
        </Drawer>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '12px',
              minWidth: 200,
            }
          }}
        >
          <MenuItem
            onClick={() => {
              if (selectedActivity) {
                setDetailDialogOpen(true);
                setAnchorEl(null);
              }
            }}
          >
            <ListItemIcon>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedActivity) {
                setEditDialogOpen(true);
                setDetailDialogOpen(false);
                setAnchorEl(null);
                // Populate form with selected activity data
                setFormData({
                  type: selectedActivity.type,
                  subtype: selectedActivity.subtype || "",
                  subject: selectedActivity.subject,
                  description: selectedActivity.description || "",
                  relatedTo: selectedActivity.relatedTo || [],
                  assignedTo: selectedActivity.assignedTo || "",
                  assignedToName: selectedActivity.assignedToName || "",
                  startDate: selectedActivity.startDate || "",
                  endDate: selectedActivity.endDate || "",
                  dueDate: selectedActivity.dueDate || "",
                  status: selectedActivity.status,
                  priority: selectedActivity.priority,
                  progress: selectedActivity.progress,
                  callDetails: selectedActivity.callDetails || {
                    callType: "outbound",
                    callDuration: 0,
                    callRecording: "",
                    callOutcome: "",
                    callNotes: "",
                    followUpRequired: false,
                    followUpDate: ""
                  },
                  emailDetails: selectedActivity.emailDetails || {
                    from: "",
                    to: [],
                    cc: [],
                    bcc: [],
                    subject: "",
                    body: "",
                    attachments: [],
                    isRead: false,
                    isReplied: false,
                    isForwarded: false,
                    threadId: "",
                    inReplyTo: ""
                  },
                  meetingDetails: selectedActivity.meetingDetails || {
                    location: "",
                    meetingLink: "",
                    meetingId: "",
                    password: "",
                    attendees: [],
                    notes: "",
                    agenda: "",
                    outcome: ""
                  },
                  taskDetails: selectedActivity.taskDetails || {
                    estimatedHours: 0,
                    actualHours: 0,
                    billable: false,
                    hourlyRate: 0,
                    totalCost: 0,
                    dependsOn: [],
                    blockedBy: []
                  },
                  isRecurring: selectedActivity.isRecurring || false,
                  recurrencePattern: selectedActivity.recurrencePattern || {
                    frequency: "daily",
                    interval: 1,
                    daysOfWeek: [],
                    dayOfMonth: 1,
                    monthOfYear: 1,
                    endDate: "",
                    count: 0
                  },
                  reminders: selectedActivity.reminders || [],
                  tags: selectedActivity.tags?.join(', ') || "",
                  attachments: [],
                  location: selectedActivity.location || {
                    type: "physical",
                    address: "",
                    coordinates: { lat: 0, lng: 0 }
                  },
                  outcome: selectedActivity.outcome || "",
                  feedback: selectedActivity.feedback || "",
                  rating: selectedActivity.rating || 0,
                  sharedWith: selectedActivity.sharedWith || []
                });
              }
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedActivity) {
                setShareDialogOpen(true);
                setAnchorEl(null);
              }
            }}
          >
            <ListItemIcon>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Share</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem disabled>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Update Status
            </Typography>
          </MenuItem>
          {ACTIVITY_STATUS.map(status => (
            <MenuItem
              key={status.value}
              onClick={() => {
                if (selectedActivity) {
                  updateStatus(selectedActivity._id, status.value);
                  setAnchorEl(null);
                }
              }}
              disabled={selectedActivity?.status === status.value || submitting}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: status.color }} />
                <Typography variant="body2">{status.label}</Typography>
                {selectedActivity?.status === status.value && (
                  <CheckCircleIcon sx={{ fontSize: 16, color: GOOGLE_COLORS.green, ml: 'auto' }} />
                )}
              </Box>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem disabled>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Update Priority
            </Typography>
          </MenuItem>
          {ACTIVITY_PRIORITY.map(priority => {
            const PriorityIcon = priority.icon;
            return (
              <MenuItem
                key={priority.value}
                onClick={() => {
                  if (selectedActivity) {
                    updatePriority(selectedActivity._id, priority.value);
                    setAnchorEl(null);
                  }
                }}
                disabled={selectedActivity?.priority === priority.value || submitting}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <PriorityIcon sx={{ fontSize: 16, color: priority.color }} />
                  <Typography variant="body2">{priority.label}</Typography>
                  {selectedActivity?.priority === priority.value && (
                    <CheckCircleIcon sx={{ fontSize: 16, color: GOOGLE_COLORS.green, ml: 'auto' }} />
                  )}
                </Box>
              </MenuItem>
            );
          })}
          <Divider />
          <MenuItem
            onClick={() => {
              if (selectedActivity) {
                deleteActivity(selectedActivity._id);
                setAnchorEl(null);
              }
            }}
            sx={{ color: GOOGLE_COLORS.red }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: GOOGLE_COLORS.red }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* Attachment Menu */}
        <Menu
          anchorEl={attachmentMenuAnchor}
          open={Boolean(attachmentMenuAnchor)}
          onClose={() => setAttachmentMenuAnchor(null)}
          PaperProps={{
            sx: {
              bgcolor: darkMode ? '#2d2e30' : '#fff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '12px',
              minWidth: 150,
            }
          }}
        >
          <MenuItem
            onClick={() => {
              if (selectedAttachment) {
                downloadAttachment(selectedAttachment);
                setAttachmentMenuAnchor(null);
              }
            }}
          >
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedAttachment) {
                deleteAttachment(selectedAttachment._id);
                setAttachmentMenuAnchor(null);
              }
            }}
            sx={{ color: GOOGLE_COLORS.red }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: GOOGLE_COLORS.red }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </LocalizationProvider>
  );
}
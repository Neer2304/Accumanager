"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Badge,
  Avatar,
  AvatarGroup,
  Fab,
  CircularProgress,
  Alert,
  Grid,
  CardActions,
  CardHeader,
  Collapse,
  ListItemButton,
  ListItemAvatar,
  Fade,
  Zoom,
  Slide,
  Grow,
} from '@mui/material';
import {
  Add as AddIcon,
  VideoCall as VideoCallIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PushPin as PinIcon,
  Schedule as ScheduleIcon,
  Notes as NotesIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  CallEnd as CallEndIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon,
  Send as SendIcon,
  AccessTime as TimeIcon,
  MoreVert as MoreIcon,
  CheckCircle as CheckCircleIcon,
  Today as TodayIcon,
  EventAvailable as EventAvailableIcon,
  MeetingRoom as MeetingRoomIcon,
  Share as ShareIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MailOutline as MailOutlineIcon,
  Rocket,
  ZoomInMap,
  TrendingUp,
  LockClock,
  Lock,
  AccessTime,
  LocationOn,
  Description,
  GroupAdd,
  Email,
  Chat,
  AttachFile,
  Download,
  Print,
  Archive,
  DeleteForever,
  Refresh,
  FilterList,
  Search,
  Sort,
  MoreHoriz,
  Star,
  StarBorder,
  Share,
  CopyAll,
  QrCode,
  CalendarMonth,
  Timer,
  TimerOff,
  RecordVoiceOver,
  ClosedCaption,
  ClosedCaptionOff,
  Subtitles,
  Hearing,
  HearingDisabled,
  VolumeUp,
  VolumeOff,
  Wifi,
  WifiOff,
  SignalCellularAlt,
  SignalCellularOff,
  BatteryFull,
  BatteryAlert,
  BrightnessHigh,
  BrightnessLow,
  Contrast,
  Palette,
  Tune,
  Settings,
  Help,
  Info,
  Warning,
  Error,
  Security,
  VpnKey,
  AdminPanelSettings,
  SupervisedUserCircle,
  ManageAccounts,
  AccountCircle,
  Logout,
  Login,
  HowToReg,
  AppRegistration,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Clock, Zap, Users, Calendar, FileText, Bell, MessageSquare, FilePlus, Eye, EyeOff, Cloud, CloudOff } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dayjs from 'dayjs';

interface Meeting {
  _id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: string[];
  meetingType: 'internal' | 'client' | 'partner' | 'team';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink?: string;
  location?: string;
  agenda?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  hostEmail: string;
  recordingUrl?: string;
  transcriptUrl?: string;
  isRecording: boolean;
  allowJoinBeforeHost: boolean;
  waitingRoom: boolean;
  autoRecord: boolean;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  category: 'meeting' | 'project' | 'personal' | 'ideas' | 'todo';
  tags: string[];
  isPinned: boolean;
  meetingId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  attachments?: string[];
  color?: string;
  isEncrypted: boolean;
}

interface MeetingInvite {
  _id: string;
  meetingId: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  receiverEmail: string;
  meetingTitle: string;
  meetingLink: string;
  meetingTime: Date;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

// Authentication Check Component
function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = sessionStorage.getItem('meeting_note_auth_token');
      const email = sessionStorage.getItem('meeting_note_user');
      const timestamp = sessionStorage.getItem('meeting_note_timestamp');

      if (authToken === 'verified_access_2024' && email && timestamp) {
        // Check if session is less than 8 hours old
        const sessionAge = Date.now() - parseInt(timestamp);
        const eightHours = 8 * 60 * 60 * 1000;
        
        if (sessionAge < eightHours) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          sessionStorage.clear();
          router.push('/check/meeting-note');
        }
      } else {
        // Not authenticated
        router.push('/check/meeting-note');
      }
      setCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Lock sx={{ fontSize: 60, color: '#667eea', mb: 3 }} />
          <CircularProgress size={60} sx={{ color: '#667eea', mb: 3 }} />
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Securing Meeting Platform
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Verifying your credentials...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// Instant Meeting Dialog Component
function InstantMeetingDialog({ open, onClose, onCreateMeeting }: { 
  open: boolean; 
  onClose: () => void;
  onCreateMeeting: (meetingData: any) => Promise<boolean>;
}) {
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    participants: [] as string[],
    meetingType: 'internal' as const,
    allowJoinBeforeHost: true,
    waitingRoom: false,
    autoRecord: false,
  });

  const meetingTypes = [
    { value: 'internal', label: 'Internal Team Meeting', icon: <GroupsIcon /> },
    { value: 'client', label: 'Client Meeting', icon: <BusinessIcon /> },
    { value: 'partner', label: 'Partner Meeting', icon: <PeopleIcon /> },
    { value: 'team', label: 'Team Meeting', icon: <GroupsIcon /> },
  ];

  const handleCreateInstantMeeting = async () => {
    const meetingData = {
      ...meetingForm,
      title: meetingForm.title || 'Quick Meeting',
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toTimeString().split(' ')[0].substring(0, 5),
      status: 'ongoing' as const,
      meetingLink: `https://meet.accumanage.com/${Math.random().toString(36).substring(2, 15)}`,
      isRecording: false,
    };

    const success = await onCreateMeeting(meetingData);
    if (success) {
      onClose();
      setMeetingForm({
        title: '',
        description: '',
        participants: [],
        meetingType: 'internal',
        allowJoinBeforeHost: true,
        waitingRoom: false,
        autoRecord: false,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VideoCallIcon color="primary" />
          Start Instant Meeting
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Meeting Title"
            value={meetingForm.title}
            onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Quick sync, Team standup, Client call..."
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Description (Optional)"
            multiline
            rows={2}
            value={meetingForm.description}
            onChange={(e) => setMeetingForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of the meeting purpose..."
            variant="outlined"
          />
          
          <FormControl fullWidth variant="outlined">
            <InputLabel>Meeting Type</InputLabel>
            <Select
              value={meetingForm.meetingType}
              label="Meeting Type"
              onChange={(e) => setMeetingForm(prev => ({ ...prev, meetingType: e.target.value as any }))}
            >
              {meetingTypes.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: 'primary.main' }}>{type.icon}</Box>
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Invite Participants (Optional)"
            placeholder="email1@example.com, email2@example.com"
            onChange={(e) => setMeetingForm(prev => ({ 
              ...prev, 
              participants: e.target.value.split(',').map(p => p.trim()).filter(p => p)
            }))}
            variant="outlined"
            helperText="Separate multiple emails with commas"
          />

          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Meeting Settings
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={meetingForm.allowJoinBeforeHost}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, allowJoinBeforeHost: e.target.checked }))}
                  />
                }
                label="Allow participants to join before host"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={meetingForm.waitingRoom}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, waitingRoom: e.target.checked }))}
                  />
                }
                label="Enable waiting room"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={meetingForm.autoRecord}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, autoRecord: e.target.checked }))}
                  />
                }
                label="Auto-record meeting"
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} size="large" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button 
          onClick={handleCreateInstantMeeting} 
          variant="contained"
          startIcon={<VideoCallIcon />}
          size="large"
          sx={{ px: 3, borderRadius: 2 }}
        >
          Start Meeting
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Share Meeting Link Dialog
function ShareMeetingDialog({ 
  open, 
  onClose, 
  meetingLink,
  meetingTitle 
}: { 
  open: boolean; 
  onClose: () => void;
  meetingLink: string;
  meetingTitle: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareViaEmail = () => {
    const subject = `Join me for: ${meetingTitle}`;
    const body = `You're invited to join the meeting: ${meetingTitle}\n\nJoin here: ${meetingLink}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold">
          Share Meeting Link
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              {meetingTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Share this link with participants to join the meeting
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              value={meetingLink}
              InputProps={{
                readOnly: true,
                startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              size="small"
              variant="outlined"
            />
            <Tooltip title={copied ? "Copied!" : "Copy link"}>
              <IconButton 
                onClick={copyToClipboard} 
                color="primary"
                sx={{ 
                  border: 1, 
                  borderColor: 'primary.main',
                  borderRadius: 2 
                }}
              >
                <CopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>Close</Button>
        <Button 
          onClick={shareViaEmail}
          variant="contained"
          startIcon={<SendIcon />}
          sx={{ borderRadius: 2 }}
        >
          Share via Email
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Invite Participants Dialog
function InviteParticipantsDialog({
  open,
  onClose,
  meeting,
  onSendInvitations,
}: {
  open: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  onSendInvitations: (data: { receiverEmails: string[]; message: string }) => Promise<void>;
}) {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleAddEmail = () => {
    if (currentEmail && validateEmail(currentEmail)) {
      if (!emails.includes(currentEmail)) {
        setEmails([...emails, currentEmail]);
      }
      setCurrentEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendInvitations = async () => {
    if (emails.length === 0) {
      alert('Please add at least one email address');
      return;
    }

    setSending(true);
    try {
      await onSendInvitations({
        receiverEmails: emails,
        message,
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        onClose();
        setEmails([]);
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Failed to send invitations');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  if (!meeting) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon color="primary" />
          Invite Participants
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              {meeting.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(meeting.date).toLocaleDateString()} • {meeting.startTime} - {meeting.endTime}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Add Email Addresses
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="participant@example.com"
                variant="outlined"
                size="small"
                error={currentEmail !== '' && !validateEmail(currentEmail)}
                helperText={currentEmail !== '' && !validateEmail(currentEmail) ? 'Invalid email format' : ''}
              />
              <Button
                onClick={handleAddEmail}
                variant="contained"
                disabled={!currentEmail || !validateEmail(currentEmail)}
                sx={{ minWidth: 'auto' }}
              >
                Add
              </Button>
            </Box>
            
            {emails.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Invited participants ({emails.length}):
                </Typography>
                <Stack spacing={1}>
                  {emails.map(email => (
                    <Box
                      key={email}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">{email}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveEmail(email)}
                        sx={{ color: 'error.main' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            label="Personal Message (Optional)"
            multiline
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal message for the invite..."
            variant="outlined"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} disabled={sending} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSendInvitations}
          variant="contained"
          disabled={emails.length === 0 || sending || sent}
          startIcon={sent ? <CheckIcon /> : <SendIcon />}
          sx={{ borderRadius: 2 }}
        >
          {sending ? 'Sending...' : sent ? 'Invitations Sent!' : 'Send Invitations'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Meeting Invites Panel
function MeetingInvitesPanel({
  open,
  onClose,
  invites,
  onAcceptInvite,
  onDeclineInvite,
}: {
  open: boolean;
  onClose: () => void;
  invites: MeetingInvite[];
  onAcceptInvite: (inviteId: string) => Promise<void>;
  onDeclineInvite: (inviteId: string) => Promise<void>;
}) {
  const [expandedInvite, setExpandedInvite] = useState<string | null>(null);

  const pendingInvites = invites.filter(invite => invite.status === 'pending');
  const acceptedInvites = invites.filter(invite => invite.status === 'accepted');
  const declinedInvites = invites.filter(invite => invite.status === 'declined');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, height: '80vh' } }}
    >
      <DialogTitle sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsIcon color="primary" />
          Meeting Invitations
          {pendingInvites.length > 0 && (
            <Badge
              badgeContent={pendingInvites.length}
              color="error"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Tabs value={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab
            label={
              <Badge badgeContent={pendingInvites.length} color="error">
                Pending
              </Badge>
            }
          />
          <Tab label={`Accepted (${acceptedInvites.length})`} />
          <Tab label={`Declined (${declinedInvites.length})`} />
        </Tabs>
        
        <List sx={{ p: 0 }}>
          {pendingInvites.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <MailOutlineIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No pending invitations
              </Typography>
            </Box>
          ) : (
            pendingInvites.map(invite => (
              <ListItem
                key={invite._id}
                divider
                sx={{
                  bgcolor: !invite.read ? 'action.hover' : 'transparent',
                  transition: 'background-color 0.2s',
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="600">
                      {invite.meetingTitle}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        From: {invite.senderName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(invite.meetingTime).toLocaleString()}
                      </Typography>
                      {invite.message && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {invite.message}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CheckIcon />}
                    onClick={() => onAcceptInvite(invite._id)}
                    sx={{ borderRadius: 2 }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={() => onDeclineInvite(invite._id)}
                    sx={{ borderRadius: 2 }}
                  >
                    Decline
                  </Button>
                </Stack>
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Video Meeting Component
function VideoMeetingRoom({ open, onClose, meeting, onShareMeeting, onEndMeeting, onInviteParticipants }: { 
  open: boolean; 
  onClose: () => void; 
  meeting: Meeting | null;
  onShareMeeting: (meetingLink: string) => void;
  onEndMeeting: (meeting: Meeting) => void;
  onInviteParticipants: () => void;
}) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [participants, setParticipants] = useState(['You', 'Team Member 1', 'Team Member 2']);
  const [showParticipantsPanel, setShowParticipantsPanel] = useState(true);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; user: string; message: string; time: string }>>([]);
  const [newMessage, setNewMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      startCamera();
      // Initialize some chat messages
      setChatMessages([
        { id: 1, user: 'System', message: 'Welcome to the meeting!', time: '09:00' },
        { id: 2, user: 'You', message: 'Hello everyone!', time: '09:01' },
        { id: 3, user: 'Team Member 1', message: 'Good morning!', time: '09:02' },
      ]);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera and microphone. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }
        
        screenStream.getTracks()[0].onended = () => {
          setIsScreenSharing(false);
          startCamera();
        };
        
        setIsScreenSharing(true);
      } else {
        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
        setIsScreenSharing(false);
        startCamera();
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, you would start/stop recording here
  };

  const leaveMeeting = () => {
    stopCamera();
    onClose();
  };

  const endMeetingForAll = () => {
    if (meeting) {
      stopCamera();
      onEndMeeting(meeting);
      onClose();
    }
  };

  const handleShareMeeting = () => {
    if (meeting?.meetingLink) {
      onShareMeeting(meeting.meetingLink);
    }
  };

  const handleSendChatMessage = () => {
    if (newMessage.trim()) {
      const newChatMessage = {
        id: chatMessages.length + 1,
        user: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages([...chatMessages, newChatMessage]);
      setNewMessage('');
    }
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={leaveMeeting}
      maxWidth="xl"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          height: '95vh',
          maxHeight: '900px',
          backgroundColor: '#0f172a',
          color: 'white',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, borderBottom: 1, borderColor: 'divider', backgroundColor: '#1e293b' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {meeting?.title || 'Video Meeting'}
            </Typography>
            {isRecording && (
              <Chip
                label="Recording"
                size="small"
                sx={{
                  bgcolor: '#dc2626',
                  color: 'white',
                  fontWeight: 'bold',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Invite participants">
              <IconButton onClick={onInviteParticipants} sx={{ color: 'white' }}>
                <PersonAddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share meeting link">
              <IconButton onClick={handleShareMeeting} sx={{ color: 'white' }}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="End meeting for all">
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<CallEndIcon />}
                onClick={endMeetingForAll}
                sx={{ 
                  color: 'error.main', 
                  borderColor: 'error.main',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'error.main',
                    color: 'white'
                  }
                }}
              >
                End Meeting
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box sx={{ flex: 1, display: 'flex', p: 2, gap: 2, height: 'calc(100% - 80px)' }}>
          {/* Main Video Area */}
          <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
            <Paper
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)',
                }}
              />
              
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                }}
              >
                You {!isVideoOn && '• Camera Off'} {!isAudioOn && '• Mic Off'}
              </Box>

              {/* Recording Indicator */}
              {isRecording && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    backgroundColor: 'rgba(220, 38, 38, 0.8)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      animation: 'pulse 1s infinite',
                    }}
                  />
                  Recording
                </Box>
              )}
            </Paper>

            {/* Chat Panel */}
            {showChatPanel && (
              <Paper sx={{ 
                mt: 2, 
                flex: 1,
                backgroundColor: '#1e293b',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Box sx={{ 
                  p: 2, 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Chat
                  </Typography>
                  <IconButton size="small" onClick={() => setShowChatPanel(false)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box 
                  ref={chatContainerRef}
                  sx={{ 
                    flex: 1, 
                    p: 2, 
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  {chatMessages.map((msg) => (
                    <Box
                      key={msg.id}
                      sx={{
                        alignSelf: msg.user === 'You' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1.5,
                          backgroundColor: msg.user === 'You' ? '#667eea' : '#334155',
                          color: 'white',
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                          {msg.user} • {msg.time}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {msg.message}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                      placeholder="Type a message..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: '#475569',
                          },
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendChatMessage}
                      sx={{ minWidth: 'auto' }}
                    >
                      Send
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>

          {/* Side Panels */}
          <Box sx={{ width: 350, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Participants Panel */}
            <Card sx={{ flex: 1, backgroundColor: '#1e293b', color: 'white' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2 
                }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon />
                    Participants ({participants.length})
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<PersonAddIcon />}
                    onClick={onInviteParticipants}
                    sx={{ borderRadius: 2 }}
                  >
                    Invite
                  </Button>
                </Box>
                <Stack spacing={1}>
                  {participants.map((participant, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: index === 0 ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                      }}
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea' }}>
                        {participant.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {participant}
                      </Typography>
                      {index === 0 && (
                        <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                      )}
                      {index > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <VideocamIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                          <MicIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Meeting Info Panel */}
            <Card sx={{ backgroundColor: '#1e293b', color: 'white' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Info />
                  Meeting Info
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="#94a3b8">
                      Meeting ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
                      {meeting?._id?.substring(0, 8) || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="#94a3b8">
                      Duration
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {meeting ? `${meeting.startTime} - ${meeting.endTime}` : 'Ongoing'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="#94a3b8">
                      Settings
                    </Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {meeting?.allowJoinBeforeHost && (
                        <Chip label="Join Before Host" size="small" sx={{ bgcolor: '#334155' }} />
                      )}
                      {meeting?.waitingRoom && (
                        <Chip label="Waiting Room" size="small" sx={{ bgcolor: '#334155' }} />
                      )}
                      {meeting?.autoRecord && (
                        <Chip label="Auto-record" size="small" sx={{ bgcolor: '#334155' }} />
                      )}
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Controls */}
        <Box
          sx={{
            p: 3,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: '#1e293b',
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            <Tooltip title={isVideoOn ? "Turn off camera" : "Turn on camera"}>
              <IconButton
                onClick={toggleVideo}
                sx={{
                  backgroundColor: isVideoOn ? '#334155' : '#dc2626',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: isVideoOn ? '#475569' : '#b91c1c',
                  },
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                }}
                size="large"
              >
                {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title={isAudioOn ? "Mute microphone" : "Unmute microphone"}>
              <IconButton
                onClick={toggleAudio}
                sx={{
                  backgroundColor: isAudioOn ? '#334155' : '#dc2626',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: isAudioOn ? '#475569' : '#b91c1c',
                  },
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                }}
                size="large"
              >
                {isAudioOn ? <MicIcon /> : <MicOffIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title={isScreenSharing ? "Stop sharing" : "Share screen"}>
              <IconButton
                onClick={toggleScreenShare}
                sx={{
                  backgroundColor: isScreenSharing ? '#667eea' : '#334155',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: isScreenSharing ? '#5a67d8' : '#475569',
                  },
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                }}
                size="large"
              >
                {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title={isRecording ? "Stop recording" : "Start recording"}>
              <IconButton
                onClick={toggleRecording}
                sx={{
                  backgroundColor: isRecording ? '#dc2626' : '#334155',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: isRecording ? '#b91c1c' : '#475569',
                  },
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                }}
                size="large"
              >
                {isRecording ? <StopScreenShareIcon /> : <RecordVoiceOver />}
              </IconButton>
            </Tooltip>

            <Tooltip title={showChatPanel ? "Hide chat" : "Show chat"}>
              <IconButton
                onClick={() => setShowChatPanel(!showChatPanel)}
                sx={{
                  backgroundColor: showChatPanel ? '#667eea' : '#334155',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: showChatPanel ? '#5a67d8' : '#475569',
                  },
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                }}
                size="large"
              >
                <Chat />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              color="error"
              startIcon={<CallEndIcon />}
              onClick={endMeetingForAll}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: '#dc2626',
                '&:hover': {
                  backgroundColor: '#b91c1c',
                }
              }}
              size="large"
            >
              End Meeting
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CallEndIcon />}
              onClick={leaveMeeting}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderColor: '#475569',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white',
                }
              }}
              size="large"
            >
              Leave
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// Main Meetings Page Component
function MainMeetingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [meetingInvites, setMeetingInvites] = useState<MeetingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [videoMeetingOpen, setVideoMeetingOpen] = useState(false);
  const [instantMeetingDialogOpen, setInstantMeetingDialogOpen] = useState(false);
  const [shareMeetingDialogOpen, setShareMeetingDialogOpen] = useState(false);
  const [inviteParticipantsDialogOpen, setInviteParticipantsDialogOpen] = useState(false);
  const [meetingInvitesDialogOpen, setMeetingInvitesDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [meetingLinkToShare, setMeetingLinkToShare] = useState('');
  const [inviteForm, setInviteForm] = useState({
    receiverEmails: [] as string[],
    message: '',
  });
  const [sendingInvites, setSendingInvites] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const meetingForm = {
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    participants: [''],
    meetingType: 'internal' as const,
    location: '',
    agenda: [''],
    notes: '',
    allowJoinBeforeHost: true,
    waitingRoom: false,
    autoRecord: false,
    isRecording: false,
  };

  const noteForm = {
    title: '',
    content: '',
    category: 'personal' as const,
    tags: [] as string[],
    isPinned: false,
    meetingId: '',
    isEncrypted: false,
    color: '#ffffff',
  };

  // Get current user info
  const getUserEmail = () => {
    return sessionStorage.getItem('meeting_note_user') || 'user@example.com';
  };

  const getUserName = () => {
    const email = getUserEmail();
    return email.split('@')[0].replace(/\./g, ' ');
  };

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'internal': return 'primary';
      case 'client': return 'secondary';
      case 'partner': return 'success';
      case 'team': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'ongoing': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const fetchMeetings = async () => {
    try {
      const response = await fetch('/api/meetings', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMeetings(data);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchMeetingInvites = async () => {
    try {
      const response = await fetch('/api/meetings/invite', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMeetingInvites(data.invites || []);
      }
    } catch (error) {
      console.error('Error fetching meeting invites:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMeetings(), fetchNotes(), fetchMeetingInvites()]);
      setLoading(false);
    };
    loadData();

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchMeetings();
      fetchMeetingInvites();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleEndMeeting = async (meeting: Meeting) => {
    try {
      const response = await fetch('/api/meetings', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId: meeting._id,
          status: 'completed'
        }),
      });

      if (response.ok) {
        await fetchMeetings();
        if (selectedMeeting?._id === meeting._id) {
          setVideoMeetingOpen(false);
          setSelectedMeeting(null);
        }
      }
    } catch (error) {
      console.error('Error ending meeting:', error);
    }
  };

  const handleCreateMeeting = async (meetingData?: any) => {
    try {
      const dataToSend = meetingData || meetingForm;
      const response = await fetch('/api/meetings', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        await fetchMeetings();
        if (!meetingData) {
          setMeetingDialogOpen(false);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating meeting:', error);
      return false;
    }
  };

  const handleStartVideoMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setVideoMeetingOpen(true);
  };

  const handleStartInstantMeeting = async (meetingData: any) => {
    const success = await handleCreateMeeting(meetingData);
    if (success) {
      await fetchMeetings();
      const newMeeting = meetings.find(m => m.title === meetingData.title) || meetingData;
      setSelectedMeeting(newMeeting);
      setVideoMeetingOpen(true);
    }
    return success;
  };

  const handleShareMeeting = (meetingLink: string) => {
    setMeetingLinkToShare(meetingLink);
    setShareMeetingDialogOpen(true);
  };

  const handleSendInvitations = async (inviteData: { receiverEmails: string[]; message: string }) => {
    if (!selectedMeeting) return;

    setSendingInvites(true);
    try {
      const response = await fetch('/api/meetings/invite', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId: selectedMeeting._id,
          receiverEmails: inviteData.receiverEmails,
          meetingTitle: selectedMeeting.title,
          meetingLink: selectedMeeting.meetingLink || `https://meet.accumanage.com/${Math.random().toString(36).substring(2, 15)}`,
          meetingTime: new Date(`${selectedMeeting.date}T${selectedMeeting.startTime}`),
          message: inviteData.message,
        }),
      });

      if (response.ok) {
        setInviteSuccess(true);
        setTimeout(() => setInviteSuccess(false), 3000);
        // Update meeting with new participants
        await fetchMeetings();
      }
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Failed to send invitations');
    } finally {
      setSendingInvites(false);
    }
  };

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      const response = await fetch('/api/meetings/invite', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId, status: 'accepted' }),
      });

      if (response.ok) {
        await fetchMeetingInvites();
        // Refresh meetings to show the accepted one
        await fetchMeetings();
      }
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      const response = await fetch('/api/meetings/invite', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId, status: 'declined' }),
      });

      if (response.ok) {
        await fetchMeetingInvites();
      }
    } catch (error) {
      console.error('Error declining invite:', error);
    }
  };

  const handleCreateNote = async () => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteForm),
      });

      if (response.ok) {
        await fetchNotes();
        setNoteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/check/meeting-note');
  };

  const upcomingMeetings = meetings.filter(meeting => 
    new Date(meeting.date) >= new Date() && meeting.status === 'scheduled'
  ).slice(0, 3);

  const ongoingMeetings = meetings.filter(meeting => meeting.status === 'ongoing');
  const pinnedNotes = notes.filter(note => note.isPinned);
  const pendingInvitesCount = meetingInvites.filter(invite => invite.status === 'pending' && !invite.read).length;

  return (
    <MainLayout title="Video Meetings">
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
      }}>
        {/* Hero Section */}
        <Box sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: 4,
            p: { xs: 3, sm: 4, md: 5 },
            mb: 4,
            border: '1px solid rgba(102, 126, 234, 0.2)',
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 4 
            }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 3, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}>
                      <Rocket sx={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold">
                      Video Meetings
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title="Meeting Invitations">
                      <IconButton
                        onClick={() => setMeetingInvitesDialogOpen(true)}
                        sx={{
                          backgroundColor: 'rgba(102, 126, 234, 0.2)',
                          color: '#667eea',
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.3)',
                          },
                        }}
                      >
                        <Badge badgeContent={pendingInvitesCount} color="error">
                          <NotificationsIcon />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="User Settings">
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(102, 126, 234, 0.2)',
                          color: '#667eea',
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.3)',
                          },
                        }}
                      >
                        <AccountCircle />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Logout">
                      <IconButton
                        onClick={handleLogout}
                        sx={{
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.3)',
                          },
                        }}
                      >
                        <Logout />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ 
                  background: 'linear-gradient(90deg, #667eea, #ec4899)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}>
                  Connect. Collaborate. Create.
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
                  Professional video meetings with AI-powered features for modern teams
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<VideoCallIcon />}
                    onClick={() => setInstantMeetingDialogOpen(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Start Instant Meeting
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ScheduleIcon />}
                    onClick={() => setMeetingDialogOpen(true)}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Schedule Meeting
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PersonAddIcon />}
                    onClick={() => {
                      // Open invite dialog for the first upcoming meeting or create new
                      if (upcomingMeetings.length > 0) {
                        setSelectedMeeting(upcomingMeetings[0]);
                        setInviteParticipantsDialogOpen(true);
                      } else {
                        alert('Please schedule a meeting first');
                      }
                    }}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Invite Participants
                  </Button>
                </Box>
              </Box>
              
              {/* Stats */}
              <Box sx={{ 
                display: 'flex', 
                gap: 3,
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', md: 'flex-end' }
              }}>
                <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    mb: 2,
                    mx: 'auto',
                  }}>
                    <ZoomInMap sx={{ fontSize: 28, color: 'white' }} />
                  </Box>
                  <Typography variant="h3" fontWeight="bold">
                    {ongoingMeetings.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Live Now
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    mb: 2,
                    mx: 'auto',
                  }}>
                    <LockClock sx={{ fontSize: 28, color: 'white' }} />
                  </Box>
                  <Typography variant="h3" fontWeight="bold">
                    {upcomingMeetings.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Upcoming
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    mb: 2,
                    mx: 'auto',
                  }}>
                    <NotificationsIcon sx={{ fontSize: 28, color: 'white' }} />
                  </Box>
                  <Typography variant="h3" fontWeight="bold">
                    {pendingInvitesCount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Invitations
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Main Content */}
          <Paper sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                '& .MuiTab-root': {
                  color: '#94a3b8',
                  fontSize: '1rem',
                  fontWeight: 600,
                  py: 2,
                  '&.Mui-selected': {
                    color: '#667eea',
                  },
                },
              }}
              TabIndicatorProps={{
                style: {
                  height: 3,
                  backgroundColor: '#667eea',
                  borderRadius: 2,
                }
              }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VideoCallIcon />
                    Meetings
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotesIcon />
                    Notes
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon />
                    Calendar
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={pendingInvitesCount} color="error">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NotificationsIcon />
                      Invites
                    </Box>
                  </Badge>
                } 
              />
            </Tabs>

            {/* Meetings Tab */}
            {activeTab === 0 && (
              <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                {/* Live Meetings */}
                {ongoingMeetings.length > 0 && (
                  <Box sx={{ mb: 6 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      mb: 3,
                      color: 'white'
                    }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: '#10b981',
                        animation: 'pulse 1.5s infinite'
                      }} />
                      Live Meetings
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 3,
                      mb: 4
                    }}>
                      {ongoingMeetings.map((meeting) => (
                        <Card 
                          key={meeting._id}
                          sx={{ 
                            flex: 1,
                            minWidth: { xs: '100%', sm: 300 },
                            borderRadius: 3,
                            border: '2px solid',
                            borderColor: '#10b981',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)',
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                                  {meeting.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                                  Started at {meeting.startTime} • {meeting.participants.length} participants
                                </Typography>
                                <Chip
                                  label="LIVE"
                                  sx={{ 
                                    bgcolor: '#10b981',
                                    color: 'white',
                                    fontWeight: 'bold'
                                  }}
                                />
                              </Box>
                              <AvatarGroup max={3} sx={{ 
                                '& .MuiAvatar-root': { 
                                  width: 32, 
                                  height: 32,
                                  borderColor: '#1e293b',
                                  fontSize: 12 
                                } 
                              }}>
                                {meeting.participants.slice(0, 3).map((email, index) => (
                                  <Avatar key={index} sx={{ bgcolor: '#667eea' }}>
                                    {email.charAt(0).toUpperCase()}
                                  </Avatar>
                                ))}
                              </AvatarGroup>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Button
                                variant="contained"
                                startIcon={<VideoCallIcon />}
                                onClick={() => handleStartVideoMeeting(meeting)}
                                size="large"
                                sx={{ 
                                  flex: 1,
                                  borderRadius: 2,
                                  py: 1.5,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                  }
                                }}
                              >
                                Join Meeting
                              </Button>
                              <Button
                                variant="outlined"
                                startIcon={<PersonAddIcon />}
                                onClick={() => {
                                  setSelectedMeeting(meeting);
                                  setInviteParticipantsDialogOpen(true);
                                }}
                                size="large"
                                sx={{ 
                                  borderRadius: 2,
                                  py: 1.5,
                                  borderColor: '#667eea',
                                  color: '#667eea',
                                  '&:hover': {
                                    borderColor: '#5a67d8',
                                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                  }
                                }}
                              >
                                Invite
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 4 }} />
                  </Box>
                )}

                {/* Upcoming Meetings */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2
                  }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
                      Upcoming Meetings
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setMeetingDialogOpen(true)}
                        sx={{ 
                          borderRadius: 2,
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        Schedule Meeting
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => {
                          if (upcomingMeetings.length > 0) {
                            setSelectedMeeting(upcomingMeetings[0]);
                            setInviteParticipantsDialogOpen(true);
                          } else {
                            alert('No upcoming meetings to invite participants to');
                          }
                        }}
                        sx={{ 
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                          }
                        }}
                      >
                        Invite Participants
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4
                  }}>
                    {/* Upcoming Meetings Sidebar */}
                    <Box sx={{ flex: 1 }}>
                      <Paper sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                          color: 'white', 
                          mb: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Clock />
                          Next Meetings
                        </Typography>
                        <Stack spacing={2}>
                          {upcomingMeetings.map((meeting) => (
                            <Card 
                              key={meeting._id} 
                              variant="outlined"
                              sx={{ 
                                borderRadius: 2,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: 'transparent',
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                '&:hover': {
                                  borderColor: '#667eea',
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                }
                              }}
                              onClick={() => handleStartVideoMeeting(meeting)}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                                  {meeting.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                                  {new Date(meeting.date).toLocaleDateString()} • {meeting.startTime}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                  <Chip
                                    label={meeting.meetingType}
                                    size="small"
                                    sx={{ 
                                      bgcolor: `${getMeetingTypeColor(meeting.meetingType)}.light`,
                                      color: `${getMeetingTypeColor(meeting.meetingType)}.main`
                                    }}
                                  />
                                  <Chip
                                    label={`${meeting.participants.length} participants`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ borderColor: '#475569', color: '#94a3b8' }}
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    size="small"
                                    startIcon={<VideoCallIcon />}
                                    variant="contained"
                                    fullWidth
                                    sx={{ 
                                      borderRadius: 2,
                                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                      '&:hover': {
                                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                      }
                                    }}
                                  >
                                    Join
                                  </Button>
                                  <Button
                                    size="small"
                                    startIcon={<PersonAddIcon />}
                                    variant="outlined"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedMeeting(meeting);
                                      setInviteParticipantsDialogOpen(true);
                                    }}
                                    sx={{ 
                                      borderRadius: 2,
                                      borderColor: '#475569',
                                      color: '#94a3b8',
                                      '&:hover': {
                                        borderColor: '#667eea',
                                        color: '#667eea',
                                      }
                                    }}
                                  >
                                    Invite
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Stack>
                      </Paper>
                    </Box>

                    {/* All Meetings List */}
                    <Box sx={{ flex: 2 }}>
                      <Paper sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <ScheduleIcon color="primary" />
                          All Scheduled Meetings
                        </Typography>
                        <List sx={{ mt: 2 }}>
                          {meetings.filter(m => m.status === 'scheduled').map((meeting) => (
                            <ListItem 
                              key={meeting._id} 
                              divider
                              sx={{ 
                                py: 2,
                                borderRadius: 2,
                                mb: 1,
                                transition: 'all 0.2s',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
                              }}
                            >
                              <ListItemIcon>
                                <Box sx={{ 
                                  p: 1, 
                                  borderRadius: 2, 
                                  backgroundColor: 'rgba(102, 126, 234, 0.2)',
                                  color: '#667eea',
                                }}>
                                  <GroupsIcon />
                                </Box>
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>
                                    {meeting.title}
                                  </Typography>
                                }
                                secondary={
                                  <Box>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                      {new Date(meeting.date).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })} • {meeting.startTime} - {meeting.endTime}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                      {meeting.participants.length} participants • {meeting.location || 'Virtual Meeting'}
                                    </Typography>
                                  </Box>
                                }
                              />
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Chip
                                  label={meeting.status}
                                  size="small"
                                  sx={{ 
                                    bgcolor: `${getStatusColor(meeting.status)}.light`,
                                    color: `${getStatusColor(meeting.status)}.main`
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedMeeting(meeting);
                                    setInviteParticipantsDialogOpen(true);
                                  }}
                                  sx={{ 
                                    border: 1, 
                                    borderColor: '#475569',
                                    color: '#94a3b8',
                                    borderRadius: 2,
                                    '&:hover': {
                                      borderColor: '#667eea',
                                      color: '#667eea',
                                    }
                                  }}
                                >
                                  <PersonAddIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleStartVideoMeeting(meeting)}
                                  sx={{ 
                                    border: 1, 
                                    borderColor: '#667eea',
                                    color: '#667eea',
                                    borderRadius: 2,
                                    '&:hover': {
                                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                    }
                                  }}
                                >
                                  <VideoCallIcon />
                                </IconButton>
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Notes Tab */}
            {activeTab === 1 && (
              <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 4,
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  <Typography variant="h5" fontWeight="bold" sx={{ 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <NotesIcon color="primary" />
                    Meeting Notes
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setNoteDialogOpen(true)}
                    sx={{ 
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      }
                    }}
                  >
                    Add Note
                  </Button>
                </Box>

                {/* Pinned Notes */}
                {pinnedNotes.length > 0 && (
                  <Box sx={{ mb: 6 }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 3
                    }}>
                      <PinIcon color="warning" />
                      Pinned Notes
                    </Typography>
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 3,
                      mb: 4
                    }}>
                      {pinnedNotes.map((note) => (
                        <Card 
                          key={note._id}
                          sx={{ 
                            flex: 1,
                            minWidth: { xs: '100%', sm: 300 },
                            border: '2px solid',
                            borderColor: '#f59e0b',
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 20px 40px rgba(245, 158, 11, 0.2)',
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                              <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', flex: 1 }}>
                                {note.title}
                              </Typography>
                              <PinIcon sx={{ color: '#f59e0b' }} />
                            </Box>
                            <Typography variant="body2" sx={{ 
                              color: '#cbd5e1', 
                              mb: 3, 
                              lineHeight: 1.6,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}>
                              {note.content}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                              <Chip 
                                label={note.category} 
                                size="small" 
                                sx={{ 
                                  bgcolor: 'rgba(102, 126, 234, 0.2)',
                                  color: '#667eea'
                                }}
                              />
                              {note.tags.slice(0, 2).map(tag => (
                                <Chip 
                                  key={tag} 
                                  label={tag} 
                                  size="small"
                                  sx={{ 
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    color: '#94a3b8'
                                  }}
                                />
                              ))}
                            </Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Updated {new Date(note.updatedAt).toLocaleDateString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 4 }} />
                  </Box>
                )}

                {/* All Notes Grid */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 3 }}>
                    All Notes
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3
                  }}>
                    {notes.map((note) => (
                      <Card 
                        key={note._id}
                        variant="outlined"
                        sx={{ 
                          flex: '1 1 300px',
                          minWidth: 280,
                          maxWidth: { xs: '100%', sm: 350 },
                          borderRadius: 3,
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#667eea',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                            {note.title}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: '#94a3b8', 
                            mb: 3, 
                            lineHeight: 1.5,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}>
                            {note.content}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                            <Chip 
                              label={note.category} 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(102, 126, 234, 0.2)',
                                color: '#667eea'
                              }}
                            />
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {new Date(note.updatedAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Calendar Tab */}
            {activeTab === 2 && (
              <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Alert severity="info" sx={{ 
                  mb: 4,
                  borderRadius: 2,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#93c5fd'
                }}>
                  Calendar view is coming soon! Currently showing all meetings.
                </Alert>
                
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3
                  }}>
                    <CalendarIcon color="primary" />
                    All Meetings Overview
                  </Typography>
                  
                  <List>
                    {meetings.map((meeting) => (
                      <ListItem 
                        key={meeting._id} 
                        divider
                        sx={{ 
                          py: 2,
                          borderRadius: 2,
                          mb: 1,
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Box sx={{ 
                            p: 1, 
                            borderRadius: 2, 
                            backgroundColor: 'rgba(102, 126, 234, 0.2)',
                            color: '#667eea',
                          }}>
                            {meeting.meetingType === 'client' ? <BusinessIcon /> :
                             meeting.meetingType === 'partner' ? <PeopleIcon /> :
                             <GroupsIcon />}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>
                              {meeting.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                {new Date(meeting.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })} • {meeting.startTime} - {meeting.endTime}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {meeting.meetingType} • {meeting.participants.length} participants
                              </Typography>
                            </Box>
                          }
                        />
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            label={meeting.status}
                            size="small"
                            sx={{ 
                              bgcolor: meeting.status === 'ongoing' ? '#10b98120' :
                                       meeting.status === 'scheduled' ? '#3b82f620' :
                                       meeting.status === 'completed' ? '#6b728020' : '#ef444420',
                              color: meeting.status === 'ongoing' ? '#10b981' :
                                     meeting.status === 'scheduled' ? '#3b82f6' :
                                     meeting.status === 'completed' ? '#9ca3af' : '#ef4444'
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedMeeting(meeting);
                              setInviteParticipantsDialogOpen(true);
                            }}
                            sx={{ 
                              border: 1, 
                              borderColor: '#475569',
                              color: '#94a3b8',
                              borderRadius: 2,
                              '&:hover': {
                                borderColor: '#667eea',
                                color: '#667eea',
                              }
                            }}
                          >
                            <PersonAddIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}

            {/* Invites Tab */}
            {activeTab === 3 && (
              <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 4,
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  <Typography variant="h5" fontWeight="bold" sx={{ 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <NotificationsIcon color="primary" />
                    Meeting Invitations
                    {pendingInvitesCount > 0 && (
                      <Badge
                        badgeContent={pendingInvitesCount}
                        color="error"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={fetchMeetingInvites}
                    sx={{ 
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      }
                    }}
                  >
                    Refresh
                  </Button>
                </Box>

                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  {meetingInvites.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <MailOutlineIcon sx={{ fontSize: 60, color: '#475569', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
                        No meeting invitations
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        You don't have any meeting invitations at the moment.
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ mt: 2 }}>
                      {meetingInvites.map((invite) => (
                        <ListItem 
                          key={invite._id} 
                          divider
                          sx={{ 
                            py: 2,
                            borderRadius: 2,
                            mb: 1,
                            transition: 'all 0.2s',
                            bgcolor: !invite.read ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            }
                          }}
                        >
                          <ListItemIcon>
                            <Box sx={{ 
                              p: 1, 
                              borderRadius: 2, 
                              backgroundColor: 'rgba(102, 126, 234, 0.2)',
                              color: '#667eea',
                            }}>
                              <EmailIcon />
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>
                                  {invite.meetingTitle}
                                </Typography>
                                <Chip
                                  label={invite.status}
                                  size="small"
                                  sx={{ 
                                    bgcolor: invite.status === 'pending' ? '#f59e0b20' :
                                             invite.status === 'accepted' ? '#10b98120' :
                                             '#ef444420',
                                    color: invite.status === 'pending' ? '#f59e0b' :
                                           invite.status === 'accepted' ? '#10b981' :
                                           '#ef4444'
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                  From: {invite.senderName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                  {new Date(invite.meetingTime).toLocaleString()}
                                </Typography>
                                {invite.message && (
                                  <Typography variant="body2" sx={{ color: '#cbd5e1', mt: 1, fontStyle: 'italic' }}>
                                    "{invite.message}"
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          {invite.status === 'pending' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<CheckIcon />}
                                onClick={() => handleAcceptInvite(invite._id)}
                                sx={{ borderRadius: 2 }}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                startIcon={<CloseIcon />}
                                onClick={() => handleDeclineInvite(invite._id)}
                                sx={{ borderRadius: 2 }}
                              >
                                Decline
                              </Button>
                            </Box>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="start instant meeting"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
          }}
          onClick={() => setInstantMeetingDialogOpen(true)}
        >
          <VideoCallIcon sx={{ fontSize: 28, color: 'white' }} />
        </Fab>

        {/* Notification Badge for Invites */}
        {pendingInvitesCount > 0 && (
          <Fab
            color="secondary"
            aria-label="pending invites"
            sx={{
              position: 'fixed',
              bottom: 112,
              right: 32,
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
            }}
            onClick={() => setMeetingInvitesDialogOpen(true)}
          >
            <Badge badgeContent={pendingInvitesCount} color="error">
              <NotificationsIcon sx={{ color: 'white' }} />
            </Badge>
          </Fab>
        )}

        {/* Dialogs */}
        <InstantMeetingDialog
          open={instantMeetingDialogOpen}
          onClose={() => setInstantMeetingDialogOpen(false)}
          onCreateMeeting={handleStartInstantMeeting}
        />

        <ShareMeetingDialog
          open={shareMeetingDialogOpen}
          onClose={() => setShareMeetingDialogOpen(false)}
          meetingLink={meetingLinkToShare}
          meetingTitle={selectedMeeting?.title || 'Video Meeting'}
        />

        <InviteParticipantsDialog
          open={inviteParticipantsDialogOpen}
          onClose={() => {
            setInviteParticipantsDialogOpen(false);
            setSelectedMeeting(null);
          }}
          meeting={selectedMeeting}
          onSendInvitations={handleSendInvitations}
        />

        <MeetingInvitesPanel
          open={meetingInvitesDialogOpen}
          onClose={() => setMeetingInvitesDialogOpen(false)}
          invites={meetingInvites}
          onAcceptInvite={handleAcceptInvite}
          onDeclineInvite={handleDeclineInvite}
        />

        <VideoMeetingRoom
          open={videoMeetingOpen}
          onClose={() => {
            setVideoMeetingOpen(false);
            setSelectedMeeting(null);
          }}
          meeting={selectedMeeting}
          onShareMeeting={handleShareMeeting}
          onEndMeeting={handleEndMeeting}
          onInviteParticipants={() => {
            if (selectedMeeting) {
              setInviteParticipantsDialogOpen(true);
            }
          }}
        />

        {inviteSuccess && (
          <Alert
            severity="success"
            sx={{
              position: 'fixed',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            Invitations sent successfully!
          </Alert>
        )}
      </Box>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </MainLayout>
  );
}

// Main Export with Auth Check
export default function MeetingsNotesPage() {
  return (
    <AuthCheck>
      <MainMeetingsPage />
    </AuthCheck>
  );
}
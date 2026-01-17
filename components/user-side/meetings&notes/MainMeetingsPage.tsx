// app/components/user-side/meetings&notes/MainMeetingsPage.tsx
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
  CardActions,
  InputAdornment,
  Menu,
  Checkbox,
  Drawer,
  LinearProgress,
  CardHeader,
  CardActionArea,
  useTheme,
  useMediaQuery,
  alpha,
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
  MoreVert as MoreIcon,
  CheckCircle as CheckCircleIcon,
  Share as ShareIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Chat as ChatIcon,
  AttachFile as AttachFileIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Timer as TimerIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  Rocket as RocketIcon,
  ZoomIn as ZoomInIcon,
  Cloud as CloudIcon,
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
  Code as CodeIcon,
  Analytics as AnalyticsIcon,
  Storage as StorageIcon,
  Power as PowerIcon,
  ElectricBolt as ElectricBoltIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  SmartToy as SmartToyIcon,
  Api as ApiIcon,
  Terminal as TerminalIcon,
  DataObject as DataObjectIcon,
  DeveloperMode as DeveloperModeIcon,
  Webhook as WebhookIcon,
  QueryStats as QueryStatsIcon,
  Timeline as TimelineIcon,
  TableView as TableViewIcon,
  Dataset as DatasetIcon,
  BatteryFull as BatteryFullIcon,
  FlashOn as FlashOnIcon,
  Build as BuildIcon,
  Engineering as EngineeringIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

// Import common components
import {
  GlassCard,
  GradientButton,
  MeetingStatusChip,
  MeetingTypeChip,
  NoteCategoryChip,
  LoadingState,
  ErrorState,
  EmptyState,
  SearchBar,
  StatsCard,
} from './common';

// Import dialog components
// import {
//   InstantMeetingDialog,
//   MeetingInvitesPanel,
//   InviteParticipantsDialog,
//   ShareMeetingDialog,
//   VideoMeetingRoom,
// } from './components';

// Import types
import type { Meeting, Note, MeetingInvite } from './types';
import { InstantMeetingDialog, InviteParticipantsDialog, MeetingInvitesPanel, ShareMeetingDialog, VideoMeetingRoom } from './components';

// MainMeetingsPage component implementation
// (This is where you put your original MainMeetingsPage code)
export function MainMeetingsPage() {
  // Your original MainMeetingsPage implementation goes here
  // I'll show a template of how to use the common components:
  
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [invites, setInvites] = useState<MeetingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [instantMeetingOpen, setInstantMeetingOpen] = useState(false);
  const [invitesPanelOpen, setInvitesPanelOpen] = useState(false);
  const [inviteParticipantsOpen, setInviteParticipantsOpen] = useState(false);
  const [shareMeetingOpen, setShareMeetingOpen] = useState(false);
  const [meetingRoomOpen, setMeetingRoomOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetingLinkToShare, setMeetingLinkToShare] = useState('');
  
  // Example of using common components in the UI:
  if (loading) {
    return <LoadingState message="Loading meetings and notes..." />;
  }
  
  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
        {/* Header Section */}
        <Box sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
          {/* Stats using common StatsCard */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <StatsCard
                  title="Live Meetings"
                  value={meetings.filter(m => m.status === 'ongoing').length}
                  icon={<VideoCallIcon />}
                  color="success"
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <StatsCard
                  title="Upcoming"
                  value={meetings.filter(m => m.status === 'scheduled').length}
                  icon={<CalendarIcon />}
                //   color="info"
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <StatsCard
                  title="Total Notes"
                  value={notes.length}
                  icon={<NotesIcon />}
                  color="warning"
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <StatsCard
                  title="Pending Invites"
                  value={invites.filter(i => i.status === 'pending').length}
                  icon={<NotificationsIcon />}
                  color="error"
                />
              </Box>
            </Box>
          </Box>
          
          {/* Main Content */}
          <Paper sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'rgba(30, 41, 59, 0.8)' }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Meetings" />
              <Tab label="Notes" />
              <Tab label="Invites" />
            </Tabs>
            
            {/* Meetings Tab */}
            {activeTab === 0 && (
              <Box sx={{ p: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <SearchBar
                    placeholder="Search meetings..."
                    onChange={(value) => console.log('Search:', value)}
                  />
                </Box>
                
                {/* Example meeting item using common components */}
                {meetings.length === 0 ? (
                  <EmptyState
                    icon={<VideoCallIcon sx={{ fontSize: 60, color: 'primary.main' }} />}
                    title="No meetings scheduled"
                    description="Schedule your first meeting to get started"
                    actionLabel="Schedule Meeting"
                    onAction={() => setInstantMeetingOpen(true)}
                  />
                ) : (
                  meetings.map(meeting => (
                    <GlassCard key={meeting._id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {meeting.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <MeetingStatusChip status={meeting.status} />
                              <MeetingTypeChip type={meeting.meetingType} />
                            </Box>
                          </Box>
                          <Button
                            variant="contained"
                            startIcon={<VideoCallIcon />}
                            onClick={() => {
                              setSelectedMeeting(meeting);
                              setMeetingRoomOpen(true);
                            }}
                          >
                            Join
                          </Button>
                        </Box>
                        {/* ... rest of meeting content */}
                      </CardContent>
                    </GlassCard>
                  ))
                )}
              </Box>
            )}
            
            {/* Notes Tab */}
            {activeTab === 1 && (
              <Box sx={{ p: 4 }}>
                {notes.length === 0 ? (
                  <EmptyState
                    icon={<NotesIcon sx={{ fontSize: 60, color: 'primary.main' }} />}
                    title="No notes yet"
                    description="Create your first note to get started"
                    actionLabel="Create Note"
                    onAction={() => {/* Open create note dialog */}}
                  />
                ) : (
                  notes.map(note => (
                    <GlassCard key={note._id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <NoteCategoryChip category={note.category} />
                          {note.isPinned && <PinIcon color="warning" />}
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          {note.title}
                        </Typography>
                        {/* ... rest of note content */}
                      </CardContent>
                    </GlassCard>
                  ))
                )}
              </Box>
            )}
            
            {/* Invites Tab */}
            {activeTab === 2 && (
              <Box sx={{ p: 4 }}>
                {invites.filter(i => i.status === 'pending').length === 0 ? (
                  <EmptyState
                    icon={<EmailIcon sx={{ fontSize: 60, color: 'primary.main' }} />}
                    title="No pending invitations"
                    description="You don't have any meeting invitations at the moment"
                  />
                ) : (
                  <List>
                    {invites.filter(i => i.status === 'pending').map(invite => (
                      <ListItem key={invite._id}>
                        {/* Invite content */}
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )}
          </Paper>
        </Box>
        
        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
          onClick={() => setInstantMeetingOpen(true)}
        >
          <VideoCallIcon />
        </Fab>
        
        {/* Dialogs */}
        <InstantMeetingDialog
          open={instantMeetingOpen}
          onClose={() => setInstantMeetingOpen(false)}
          onCreateMeeting={async (meetingData) => {
            // Your create meeting logic
            return true;
          }}
        />
        
        <MeetingInvitesPanel
          open={invitesPanelOpen}
          onClose={() => setInvitesPanelOpen(false)}
          invites={invites}
          onAcceptInvite={async (inviteId) => {
            // Accept invite logic
          }}
          onDeclineInvite={async (inviteId) => {
            // Decline invite logic
          }}
        />
        
        {selectedMeeting && (
          <>
            <InviteParticipantsDialog
              open={inviteParticipantsOpen}
              onClose={() => {
                setInviteParticipantsOpen(false);
                setSelectedMeeting(null);
              }}
              meeting={selectedMeeting}
              onSendInvitations={async (data) => {
                // Send invitations logic
              }}
            />
            
            <ShareMeetingDialog
              open={shareMeetingOpen}
              onClose={() => {
                setShareMeetingOpen(false);
                setMeetingLinkToShare('');
              }}
              meetingLink={meetingLinkToShare}
              meetingTitle={selectedMeeting.title}
            />
            
            <VideoMeetingRoom
              meeting={selectedMeeting}
              open={meetingRoomOpen}
              onClose={() => {
                setMeetingRoomOpen(false);
                setSelectedMeeting(null);
              }}
              onShareMeeting={(link) => {
                setMeetingLinkToShare(link);
                setShareMeetingOpen(true);
              }}
              onEndMeeting={async (meeting) => {
                // End meeting logic
              }}
              onInviteParticipants={() => setInviteParticipantsOpen(true)}
            />
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Button,
  IconButton,
  TextField,
  Divider,
  Badge,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Tooltip,
  Stack,
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  InputAdornment,
  Fab,
  useTheme,
  alpha,
  ListItemIcon,
  Container,
  Skeleton,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  MoreVert as MoreIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Videocam as VideoCallIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Groups as GroupsIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Lock as LockIcon,
  Add as AddIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  MailOutline as MailOutlineIcon,
  Inbox as InboxIcon,
  Outbox as OutboxIcon,
  Drafts as DraftsIcon,
  LabelImportant as LabelImportantIcon,
  Link as LinkIcon,
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  PictureAsPdf as PdfIcon,
  Description as DescriptionIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useRouter } from 'next/navigation';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { format } from 'date-fns';

// Import our new components
import { Button2 } from '@/components/ui/button2';
import { Input2 } from '@/components/ui/input2';
import { Card2 } from '@/components/ui/card2';
import { Alert2 } from '@/components/ui/alert2';
import { Badge2 } from '@/components/ui/badge2';
import { CombinedIcon } from '@/components/ui/icons2';
import { MessageListSkeleton, MessageDetailSkeleton } from '@/components/ui/skeleton2';
import { MessageList } from '@/components/messages/MessageList';
import { MessageDetail } from '@/components/messages/MessageDetail';
import { MessageToolbar } from '@/components/messages/MessageToolbar';

interface Message {
  _id: string;
  type: 'meeting_invite' | 'direct_message' | 'system_notification';
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  subject: string;
  content: string;
  meetingId?: string;
  meetingTitle?: string;
  meetingLink?: string;
  meetingTime?: string;
  meetingType?: 'internal' | 'client' | 'partner' | 'team';
  status: 'pending' | 'accepted' | 'declined' | 'read' | 'unread' | 'archived' | 'deleted';
  isStarred: boolean;
  isImportant: boolean;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

function MessagesPage() {
  const router = useRouter();
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [messageMenuAnchor, setMessageMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedMessageForMenu, setSelectedMessageForMenu] = useState<Message | null>(null);
  const [composeDialogOpen, setComposeDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
    type: 'direct_message' as 'direct_message' | 'meeting_invite',
    meetingDetails: {
      title: '',
      date: '',
      time: '',
      link: '',
      type: 'internal' as 'internal' | 'client' | 'partner' | 'team',
    },
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [searchQuery, activeTab, messages]);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/messages', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        setError('Failed to load messages');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = [...messages];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(msg =>
        msg.subject.toLowerCase().includes(query) ||
        msg.content.toLowerCase().includes(query) ||
        msg.senderName.toLowerCase().includes(query) ||
        msg.senderEmail.toLowerCase().includes(query)
      );
    }

    // Filter by tab
    switch (activeTab) {
      case 0: // Inbox
        filtered = filtered.filter(msg => 
          ['pending', 'read', 'unread'].includes(msg.status) && 
          msg.type !== 'system_notification'
        );
        break;
      case 1: // Unread
        filtered = filtered.filter(msg => msg.status === 'unread');
        break;
      case 2: // Starred
        filtered = filtered.filter(msg => msg.isStarred);
        break;
      case 3: // Meeting Invites
        filtered = filtered.filter(msg => msg.type === 'meeting_invite');
        break;
      case 4: // Sent
        filtered = filtered.filter(msg => msg.senderEmail === 'currentuser@example.com');
        break;
      case 5: // Archived
        filtered = filtered.filter(msg => msg.status === 'archived');
        break;
      case 6: // Trash
        filtered = filtered.filter(msg => msg.status === 'deleted');
        break;
    }

    setFilteredMessages(filtered);
  };

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      markAsRead(message._id);
    }
  };

  const handleMessageMenuOpen = (event: React.MouseEvent<HTMLElement>, message: Message) => {
    event.stopPropagation();
    setMessageMenuAnchor(event.currentTarget);
    setSelectedMessageForMenu(message);
  };

  const handleMessageMenuClose = () => {
    setMessageMenuAnchor(null);
    setSelectedMessageForMenu(null);
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          action: 'read',
        }),
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg =>
          msg._id === messageId ? { ...msg, status: 'read' } : msg
        ));
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const toggleStar = async (messageId: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          action: 'star',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => prev.map(msg =>
          msg._id === messageId ? { ...msg, isStarred: data.data.isStarred } : msg
        ));
      }
    } catch (err) {
      console.error('Failed to toggle star:', err);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          action: 'delete',
        }),
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg =>
          msg._id === messageId ? { ...msg, status: 'deleted' } : msg
        ));
        setSuccess('Message moved to trash');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete message');
      }
    } catch (err) {
      setError('Failed to delete message');
      console.error('Error deleting message:', err);
    }
  };

  const archiveMessage = async (messageId: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          action: 'archive',
        }),
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg =>
          msg._id === messageId ? { ...msg, status: 'archived' } : msg
        ));
        setSuccess('Message archived');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to archive message');
      }
    } catch (err) {
      setError('Failed to archive message');
      console.error('Error archiving message:', err);
    }
  };

  const respondToMeetingInvite = async (messageId: string, response: 'accepted' | 'declined') => {
    try {
      const apiResponse = await fetch('/api/messages', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          action: 'respond',
          data: { response },
        }),
      });

      if (apiResponse.ok) {
        setMessages(prev => prev.map(msg =>
          msg._id === messageId ? { ...msg, status: response } : msg
        ));
        setSuccess(`Meeting invite ${response}`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to respond to meeting invite');
      }
    } catch (err) {
      setError('Failed to respond to meeting invite');
      console.error('Error responding to meeting invite:', err);
    }
  };

  const handleComposeMessage = () => {
    setComposeDialogOpen(true);
  };

  const handleSendMessage = async () => {
    if (!newMessage.to || !newMessage.subject || !newMessage.content) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const messageData: any = {
        to: newMessage.to,
        subject: newMessage.subject,
        content: newMessage.content,
        type: newMessage.type,
      };

      if (newMessage.type === 'meeting_invite') {
        messageData.meetingDetails = newMessage.meetingDetails;
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [data.data, ...prev]);
        setComposeDialogOpen(false);
        setNewMessage({
          to: '',
          subject: '',
          content: '',
          type: 'direct_message',
          meetingDetails: {
            title: '',
            date: '',
            time: '',
            link: '',
            type: 'internal',
          },
        });
        setSuccess('Message sent successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) {
        return format(date, 'HH:mm');
      } else if (diffInDays === 1) {
        return 'Yesterday';
      } else if (diffInDays < 7) {
        return format(date, 'EEEE');
      } else {
        return format(date, 'MMM d');
      }
    } catch (error) {
      return 'Invalid date';
    }
  };

  const tabs = [
    { 
      label: 'Inbox', 
      icon: <CombinedIcon name="Inbox" size={16} />, 
      count: messages.filter(m => ['read', 'unread'].includes(m.status)).length 
    },
    { 
      label: 'Unread', 
      icon: <CombinedIcon name="MarkEmailUnread" size={16} />, 
      count: messages.filter(m => m.status === 'unread').length 
    },
    { 
      label: 'Starred', 
      icon: <CombinedIcon name="Star" size={16} />, 
      count: messages.filter(m => m.isStarred).length 
    },
    { 
      label: 'Meeting Invites', 
      icon: <CombinedIcon name="Videocam" size={16} />, 
      count: messages.filter(m => m.type === 'meeting_invite').length 
    },
    { 
      label: 'Sent', 
      icon: <CombinedIcon name="Outbox" size={16} />, 
      count: messages.filter(m => m.senderEmail === 'currentuser@example.com').length 
    },
    { 
      label: 'Archived', 
      icon: <CombinedIcon name="Archive" size={16} />, 
      count: messages.filter(m => m.status === 'archived').length 
    },
    { 
      label: 'Trash', 
      icon: <CombinedIcon name="Delete" size={16} />, 
      count: messages.filter(m => m.status === 'deleted').length 
    },
  ];

  return (
    <MainLayout title="Messages">
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f8fafc',
        color: theme.palette.text.primary,
        p: { xs: 1, sm: 2, md: 3 },
      }}>
        {/* Development Warning */}
        <Alert2 
          severity="warning" 
          title="⚠️ Messaging System Under Development"
          message="This feature is currently in development. Real data integration will be available soon."
          icon={<CombinedIcon name="Construction" />}
          sx={{ mb: 3 }}
        />

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Messages
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your conversations, meeting invites, and notifications
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert2 severity="error" message={error} dismissible onDismiss={() => setError('')} sx={{ mb: 3 }} />
        )}
        {success && (
          <Alert2 severity="success" message={success} dismissible onDismiss={() => setSuccess('')} sx={{ mb: 3 }} />
        )}

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: selectedMessage ? 'row' : 'column' },
          gap: 3,
          height: { xs: 'auto', md: 'calc(100vh - 250px)' }
        }}>
          {/* Left Panel - Message List */}
          <Box sx={{ 
            flex: { md: selectedMessage ? 1 : 1 },
            minWidth: { md: selectedMessage ? 350 : 'auto' },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            {/* Toolbar */}
            <Card2>
              <MessageToolbar
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={tabs}
                onRefresh={fetchMessages}
                onCompose={handleComposeMessage}
                loading={loading}
              />
            </Card2>

            {/* Message List */}
            <MessageList
              messages={filteredMessages}
              loading={loading}
              selectedMessageId={selectedMessage?._id || null}
              onMessageClick={handleMessageClick}
              onToggleStar={toggleStar}
              onMenuOpen={handleMessageMenuOpen}
              formatDate={formatDate}
            />
          </Box>

          {/* Right Panel - Message Details */}
          {selectedMessage && (
            <Box sx={{ 
              flex: { md: 2 },
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}>
              <MessageDetail
                message={selectedMessage}
                loading={false}
                onToggleStar={toggleStar}
                onArchive={archiveMessage}
                onDelete={deleteMessage}
                onRespondToMeeting={respondToMeetingInvite}
                onReply={() => console.log('Reply to', selectedMessage._id)}
                onForward={() => console.log('Forward', selectedMessage._id)}
              />
            </Box>
          )}
        </Box>

        {/* Compose Message Dialog */}
        <Dialog
          open={composeDialogOpen}
          onClose={() => setComposeDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxHeight: '90vh',
              m: { xs: 1, sm: 2 },
            },
          }}
        >
          <DialogTitle sx={{ pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" fontWeight="bold">
              New Message
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={2}>
              <Input2
                select
                label="Message Type"
                value={newMessage.type}
                onChange={(e) => setNewMessage({ ...newMessage, type: e.target.value as any })}
                size="small"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="direct_message">Direct Message</option>
                <option value="meeting_invite">Meeting Invitation</option>
              </Input2>

              <Input2
                label="To"
                value={newMessage.to}
                onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                placeholder="email@example.com"
                required
                size="small"
                startIcon={<CombinedIcon name="Email" size={16} />}
              />

              <Input2
                label="Subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                placeholder="Enter subject..."
                required
                size="small"
              />

              {newMessage.type === 'meeting_invite' && (
                <Card2 sx={{ border: `1px solid ${theme.palette.divider}`, p: 1.5, borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Meeting Details
                  </Typography>
                  <Stack spacing={2}>
                    <Input2
                      label="Meeting Title"
                      value={newMessage.meetingDetails.title}
                      onChange={(e) => setNewMessage({
                        ...newMessage,
                        meetingDetails: { ...newMessage.meetingDetails, title: e.target.value }
                      })}
                      placeholder="Team Meeting, Client Call..."
                      size="small"
                    />
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Input2
                        label="Date"
                        type="date"
                        value={newMessage.meetingDetails.date}
                        onChange={(e) => setNewMessage({
                          ...newMessage,
                          meetingDetails: { ...newMessage.meetingDetails, date: e.target.value }
                        })}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                      />
                      <Input2
                        label="Time"
                        type="time"
                        value={newMessage.meetingDetails.time}
                        onChange={(e) => setNewMessage({
                          ...newMessage,
                          meetingDetails: { ...newMessage.meetingDetails, time: e.target.value }
                        })}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                      />
                    </Box>
                    <Input2
                      label="Meeting Link"
                      value={newMessage.meetingDetails.link}
                      onChange={(e) => setNewMessage({
                        ...newMessage,
                        meetingDetails: { ...newMessage.meetingDetails, link: e.target.value }
                      })}
                      placeholder="https://meet.accumanage.com/..."
                      size="small"
                    />
                    <Input2
                      select
                      label="Meeting Type"
                      value={newMessage.meetingDetails.type}
                      onChange={(e) => setNewMessage({
                        ...newMessage,
                        meetingDetails: { ...newMessage.meetingDetails, type: e.target.value as any }
                      })}
                      size="small"
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="internal">Internal</option>
                      <option value="client">Client</option>
                      <option value="partner">Partner</option>
                      <option value="team">Team</option>
                    </Input2>
                  </Stack>
                </Card2>
              )}

              <Input2
                label="Message"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                multiline
                rows={4}
                placeholder="Type your message here..."
                required
                size="small"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button2 
              onClick={() => setComposeDialogOpen(false)} 
              sx={{ borderRadius: 2 }}
              size="small"
              variant="outlined"
            >
              Cancel
            </Button2>
            <Button2
              onClick={handleSendMessage}
              variant="contained"
              iconLeft={<CombinedIcon name="Send" size={16} />}
              sx={{ borderRadius: 2 }}
              size="small"
            >
              Send Message
            </Button2>
          </DialogActions>
        </Dialog>

        {/* Message Context Menu */}
        <Menu
          anchorEl={messageMenuAnchor}
          open={Boolean(messageMenuAnchor)}
          onClose={handleMessageMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 180,
              boxShadow: theme.shadows[8],
            },
          }}
        >
          <MenuItem 
            onClick={() => {
              if (selectedMessageForMenu) {
                toggleStar(selectedMessageForMenu._id);
              }
              handleMessageMenuClose();
            }}
            sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {selectedMessageForMenu?.isStarred ? 
                <CombinedIcon name="StarBorder" size={16} /> : 
                <CombinedIcon name="Star" size={16} />
              }
            </ListItemIcon>
            <ListItemText 
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            >
              {selectedMessageForMenu?.isStarred ? 'Unstar' : 'Star'}
            </ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => {
              if (selectedMessageForMenu) {
                archiveMessage(selectedMessageForMenu._id);
              }
              handleMessageMenuClose();
            }}
            sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CombinedIcon name="Archive" size={16} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.875rem' }}>
              Archive
            </ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => {
              if (selectedMessageForMenu) {
                deleteMessage(selectedMessageForMenu._id);
              }
              handleMessageMenuClose();
            }}
            sx={{ 
              borderRadius: 1, 
              mx: 1, 
              my: 0.5,
              color: theme.palette.error.main,
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
              <CombinedIcon name="Delete" size={16} />
            </ListItemIcon>
            <ListItemText 
              primaryTypographyProps={{ 
                fontSize: '0.875rem',
                color: 'inherit'
              }}
            >
              Delete
            </ListItemText>
          </MenuItem>
        </Menu>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="compose message"
          onClick={handleComposeMessage}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 32 },
            right: { xs: 16, sm: 32 },
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            bgcolor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s',
            boxShadow: theme.shadows[8],
            display: { xs: selectedMessage ? 'none' : 'flex', sm: 'flex' },
          }}
        >
          <CombinedIcon name="Add" size={24} />
        </Fab>
      </Box>
    </MainLayout>
  );
}

export default MessagesPage;
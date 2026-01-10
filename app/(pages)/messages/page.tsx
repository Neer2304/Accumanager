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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <MarkEmailUnreadIcon color="primary" />;
      case 'read': return <MarkEmailReadIcon />;
      case 'pending': return <PendingIcon color="warning" />;
      case 'accepted': return <CheckCircleIcon color="success" />;
      case 'declined': return <CancelIcon color="error" />;
      default: return <MarkEmailReadIcon />;
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting_invite': return <VideoCallIcon color="primary" />;
      case 'direct_message': return <EmailIcon />;
      case 'system_notification': return <NotificationsIcon color="info" />;
      default: return <EmailIcon />;
    }
  };

  const getMeetingTypeColor = (type?: string) => {
    switch (type) {
      case 'internal': return 'primary';
      case 'client': return 'secondary';
      case 'partner': return 'success';
      case 'team': return 'warning';
      default: return 'default';
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
    { label: 'Inbox', icon: <InboxIcon />, count: messages.filter(m => ['read', 'unread'].includes(m.status)).length },
    { label: 'Unread', icon: <MarkEmailUnreadIcon />, count: messages.filter(m => m.status === 'unread').length },
    { label: 'Starred', icon: <StarIcon />, count: messages.filter(m => m.isStarred).length },
    { label: 'Meeting Invites', icon: <VideoCallIcon />, count: messages.filter(m => m.type === 'meeting_invite').length },
    { label: 'Sent', icon: <OutboxIcon />, count: messages.filter(m => m.senderEmail === 'currentuser@example.com').length },
    { label: 'Archived', icon: <ArchiveIcon />, count: messages.filter(m => m.status === 'archived').length },
    { label: 'Trash', icon: <DeleteIcon />, count: messages.filter(m => m.status === 'deleted').length },
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
        <Alert 
          severity="warning" 
          icon={<ConstructionIcon />}
          sx={{ 
            mb: 3,
            borderRadius: 2,
            border: `1px solid ${theme.palette.warning.main}`,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.1)',
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            ⚠️ Messaging System Under Development
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            This feature is currently in development. Real data integration will be available soon.
          </Typography>
        </Alert>

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
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
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
          }}>
            <Paper sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}>
              {/* Toolbar */}
              <Box sx={{ 
                p: { xs: 1.5, sm: 2 }, 
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 1, sm: 2 } }}>
                  <TextField
                    fullWidth
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={handleSearch}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f1f5f9',
                      },
                    }}
                  />
                  <Tooltip title="Filter messages">
                    <IconButton
                      onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        minWidth: 40,
                        height: 40,
                      }}
                    >
                      <FilterIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      minHeight: 48,
                      '& .MuiTab-root': {
                        minHeight: 48,
                        textTransform: 'none',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        minWidth: 'auto',
                        px: { xs: 1, sm: 2 },
                      },
                    }}
                  >
                    {tabs.map((tab, index) => (
                      <Tab
                        key={tab.label}
                        icon={React.cloneElement(tab.icon as React.ReactElement, { 
                          // fontSize: { xs: 'small', sm: 'medium' } 
                        })}
                        iconPosition="start"
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                              <Chip
                                label={tab.count}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  bgcolor: theme.palette.primary.main,
                                  color: 'white',
                                  ml: 0.5,
                                }}
                              />
                            )}
                          </Box>
                        }
                      />
                    ))}
                  </Tabs>
                </Box>
              </Box>

              {/* Message List */}
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 200 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredMessages.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <MailOutlineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No messages found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {searchQuery ? 'Try a different search' : 'Your inbox is empty'}
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {filteredMessages.map((message) => (
                      <ListItem
                        key={message._id}
                        button
                        selected={selectedMessage?._id === message._id}
                        onClick={() => handleMessageClick(message)}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          px: { xs: 1.5, sm: 2 },
                          py: 1.5,
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc',
                          },
                          '&.Mui-selected': {
                            bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.25 : 0.15),
                            },
                          },
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: theme.palette.primary.main,
                              fontSize: '0.875rem'
                            }}
                          >
                            {getMessageTypeIcon(message.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                              <Typography 
                                variant="subtitle2" 
                                fontWeight={message.status === 'unread' ? 600 : 400}
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                              >
                                {message.senderName}
                              </Typography>
                              {message.isImportant && (
                                <LabelImportantIcon fontSize="small" color="warning" sx={{ fontSize: 14 }} />
                              )}
                              {message.type === 'meeting_invite' && (
                                <Chip
                                  label={message.meetingType}
                                  size="small"
                                  sx={{ 
                                    height: 18,
                                    fontSize: '0.65rem',
                                    bgcolor: `${getMeetingTypeColor(message.meetingType)}.light`,
                                    color: `${getMeetingTypeColor(message.meetingType)}.main`,
                                    ml: 0.5,
                                  }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{
                                  fontWeight: message.status === 'unread' ? 600 : 400,
                                  mb: 0.25,
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                }}
                              >
                                {message.subject}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                }}
                              >
                                {message.content}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              {formatDate(message.createdAt)}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.25 }}>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStar(message._id);
                                }}
                                sx={{ padding: 0.5 }}
                              >
                                {message.isStarred ? (
                                  <StarIcon fontSize="small" sx={{ fontSize: 16, color: '#f59e0b' }} />
                                ) : (
                                  <StarBorderIcon fontSize="small" sx={{ fontSize: 16 }} />
                                )}
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={(e) => handleMessageMenuOpen(e, message)}
                                sx={{ padding: 0.5 }}
                              >
                                <MoreIcon fontSize="small" sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Right Panel - Message Details */}
          {selectedMessage && (
            <Box sx={{ 
              flex: { md: 2 },
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}>
              <Paper sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}>
                {/* Message Header */}
                <Box sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold" 
                        sx={{ 
                          mb: 1,
                          fontSize: { xs: '1rem', sm: '1.25rem' },
                          wordBreak: 'break-word'
                        }}
                      >
                        {selectedMessage.subject}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: theme.palette.primary.main, fontSize: '0.875rem' }}>
                            {selectedMessage.senderName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {selectedMessage.senderName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              {selectedMessage.senderEmail}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        >
                          {new Date(selectedMessage.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton onClick={() => toggleStar(selectedMessage._id)} size="small">
                        {selectedMessage.isStarred ? (
                          <StarIcon sx={{ fontSize: 20, color: '#f59e0b' }} />
                        ) : (
                          <StarBorderIcon sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>
                      <IconButton onClick={() => archiveMessage(selectedMessage._id)} size="small">
                        <ArchiveIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton onClick={() => deleteMessage(selectedMessage._id)} size="small">
                        <DeleteIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {selectedMessage.type === 'meeting_invite' && selectedMessage.meetingTitle && (
                    <Card sx={{ 
                      mt: 1.5,
                      bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f1f5f9',
                      border: `1px solid ${theme.palette.divider}`,
                    }}>
                      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight="bold" 
                          gutterBottom 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5,
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}
                        >
                          <VideoCallIcon color="primary" fontSize="small" />
                          Meeting Invitation
                        </Typography>
                        <Stack spacing={1.5}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              Meeting Title
                            </Typography>
                            <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {selectedMessage.meetingTitle}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              Date & Time
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {new Date(selectedMessage.meetingTime!).toLocaleString()}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              Meeting Link
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25, flexWrap: 'wrap' }}>
                              <LinkIcon fontSize="small" sx={{ fontSize: 14 }} />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: theme.palette.primary.main,
                                  textDecoration: 'none',
                                  '&:hover': { textDecoration: 'underline' },
                                  cursor: 'pointer',
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                  wordBreak: 'break-all',
                                }}
                                onClick={() => window.open(selectedMessage.meetingLink, '_blank')}
                              >
                                {selectedMessage.meetingLink}
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => navigator.clipboard.writeText(selectedMessage.meetingLink!)}
                                sx={{ padding: 0.25 }}
                              >
                                <CopyIcon fontSize="small" sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button
                              variant="contained"
                              startIcon={<CheckIcon />}
                              onClick={() => respondToMeetingInvite(selectedMessage._id, 'accepted')}
                              sx={{ borderRadius: 1.5, fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: 0.5 }}
                              size="small"
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<CloseIcon />}
                              onClick={() => respondToMeetingInvite(selectedMessage._id, 'declined')}
                              sx={{ borderRadius: 1.5, fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: 0.5 }}
                              size="small"
                            >
                              Decline
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<VideoCallIcon />}
                              onClick={() => window.open(selectedMessage.meetingLink, '_blank')}
                              sx={{ borderRadius: 1.5, fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: 0.5 }}
                              size="small"
                            >
                              Join
                            </Button>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  )}
                </Box>

                {/* Message Content */}
                <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2 }, overflow: 'auto' }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-wrap', 
                      lineHeight: 1.6,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {selectedMessage.content}
                  </Typography>

                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="bold" 
                        gutterBottom
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                      >
                        Attachments ({selectedMessage.attachments.length})
                      </Typography>
                      <Stack spacing={1}>
                        {selectedMessage.attachments.map((file, index) => (
                          <Paper
                            key={index}
                            sx={{
                              p: 1.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc',
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1.5,
                              flexWrap: 'wrap',
                              gap: 1,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                              {file.type === 'pdf' ? (
                                <PdfIcon color="error" sx={{ fontSize: 20 }} />
                              ) : file.type === 'powerpoint' ? (
                                <DescriptionIcon color="warning" sx={{ fontSize: 20 }} />
                              ) : (
                                <InsertDriveFileIcon sx={{ fontSize: 20 }} />
                              )}
                              <Box sx={{ minWidth: 0 }}>
                                <Typography 
                                  variant="body2" 
                                  fontWeight={600} 
                                  sx={{ 
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    wordBreak: 'break-all'
                                  }}
                                >
                                  {file.name}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                >
                                  {(file.size / 1024).toFixed(2)} KB
                                </Typography>
                              </Box>
                            </Box>
                            <Button
                              size="small"
                              startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                              onClick={() => window.open(file.url, '_blank')}
                              sx={{ 
                                borderRadius: 1,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                py: 0.5
                              }}
                            >
                              Download
                            </Button>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>

                {/* Message Actions */}
                <Box sx={{ 
                  p: { xs: 1, sm: 1.5 }, 
                  borderTop: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
                }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<ReplyIcon sx={{ fontSize: 16 }} />}
                      sx={{ 
                        borderRadius: 1.5, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        py: 0.5
                      }}
                      size="small"
                    >
                      Reply
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ForwardIcon sx={{ fontSize: 16 }} />}
                      sx={{ 
                        borderRadius: 1.5, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        py: 0.5
                      }}
                      size="small"
                    >
                      Forward
                    </Button>
                    {selectedMessage.type === 'meeting_invite' && (
                      <Button
                        variant="contained"
                        startIcon={<VideoCallIcon sx={{ fontSize: 16 }} />}
                        onClick={() => window.open(selectedMessage.meetingLink, '_blank')}
                        sx={{ 
                          borderRadius: 1.5, 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          py: 0.5
                        }}
                        size="small"
                      >
                        Join Meeting
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
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
              <TextField
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
              </TextField>

              <TextField
                label="To"
                value={newMessage.to}
                onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                placeholder="email@example.com"
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                placeholder="Enter subject..."
                required
                size="small"
              />

              {newMessage.type === 'meeting_invite' && (
                <Box sx={{ border: `1px solid ${theme.palette.divider}`, p: 1.5, borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Meeting Details
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
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
                      <TextField
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
                      <TextField
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
                    <TextField
                      label="Meeting Link"
                      value={newMessage.meetingDetails.link}
                      onChange={(e) => setNewMessage({
                        ...newMessage,
                        meetingDetails: { ...newMessage.meetingDetails, link: e.target.value }
                      })}
                      placeholder="https://meet.accumanage.com/..."
                      size="small"
                    />
                    <TextField
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
                    </TextField>
                  </Stack>
                </Box>
              )}

              <TextField
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
            <Button 
              onClick={() => setComposeDialogOpen(false)} 
              sx={{ borderRadius: 2 }}
              size="small"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              variant="contained"
              startIcon={<SendIcon />}
              sx={{ borderRadius: 2 }}
              size="small"
            >
              Send Message
            </Button>
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
              {selectedMessageForMenu?.isStarred ? <StarBorderIcon fontSize="small" /> : <StarIcon fontSize="small" />}
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
              <ArchiveIcon fontSize="small" />
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
              <DeleteIcon fontSize="small" />
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
          <AddIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
        </Fab>

        {/* Back Button for Mobile when viewing message */}
        {selectedMessage && (
          <Fab
            color="primary"
            aria-label="back to messages"
            onClick={() => setSelectedMessage(null)}
            sx={{
              position: 'fixed',
              bottom: 16,
              left: 16,
              width: 48,
              height: 48,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
              display: { xs: 'flex', sm: 'none' },
              zIndex: 1000,
            }}
          >
            {/* <ArrowBackIcon/> */}
          </Fab>
        )}
      </Box>
    </MainLayout>
  );
}

export default MessagesPage;
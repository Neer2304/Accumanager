"use client";

import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Stack,
  Paper,
  useTheme,
} from '@mui/material';
import { MessageDetailSkeleton } from '../ui/skeleton2';
import { CombinedIcon } from '../ui/icons2';
import { Button2 } from '../ui/button2';
import { Card2, CardContent2, CardActions2 } from '../ui/card2';

interface Message {
  _id: string;
  type: 'meeting_invite' | 'direct_message' | 'system_notification';
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
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

interface MessageDetailProps {
  message: Message;
  loading: boolean;
  onToggleStar: (messageId: string) => void;
  onArchive: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onRespondToMeeting: (messageId: string, response: 'accepted' | 'declined') => void;
  onReply?: () => void;
  onForward?: () => void;
}

export const MessageDetail: React.FC<MessageDetailProps> = ({
  message,
  loading,
  onToggleStar,
  onArchive,
  onDelete,
  onRespondToMeeting,
  onReply,
  onForward,
}) => {
  const theme = useTheme();

  if (loading || !message) {
    return <MessageDetailSkeleton />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'declined': return 'error';
      case 'pending': return 'warning';
      case 'read': return 'info';
      case 'unread': return 'primary';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'declined': return 'Declined';
      case 'pending': return 'Pending';
      case 'read': return 'Read';
      case 'unread': return 'Unread';
      case 'archived': return 'Archived';
      case 'deleted': return 'Deleted';
      default: return status;
    }
  };

  return (
    <Card2 sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Message Header */}
      <CardContent2>
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
              {message.subject}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: theme.palette.primary.main, fontSize: '0.875rem' }}>
                  {message.senderName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {message.senderName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    {message.senderEmail}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={getStatusText(message.status)}
                size="small"
                color={getStatusColor(message.status)}
                sx={{ height: 20, fontSize: '0.65rem' }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                {new Date(message.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              onClick={() => onToggleStar(message._id)} 
              size="small"
              sx={{ 
                color: message.isStarred ? '#f59e0b' : 'inherit',
                '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.1) }
              }}
            >
              {message.isStarred ? (
                <CombinedIcon name="Star" size={20} sx={{ color: '#f59e0b' }} />
              ) : (
                <CombinedIcon name="StarBorder" size={20} />
              )}
            </IconButton>
            <IconButton 
              onClick={() => onArchive(message._id)} 
              size="small"
              sx={{ '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.1) } }}
            >
              <CombinedIcon name="Archive" size={20} />
            </IconButton>
            <IconButton 
              onClick={() => onDelete(message._id)} 
              size="small"
              sx={{ '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) } }}
            >
              <CombinedIcon name="Delete" size={20} />
            </IconButton>
          </Box>
        </Box>

        {message.type === 'meeting_invite' && message.meetingTitle && (
          <Card2 sx={{
            mt: 1.5,
            bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f1f5f9',
            border: `1px solid ${theme.palette.divider}`,
          }}>
            <CardContent2>
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
                <CombinedIcon name="Videocam" size={20} color="primary" />
                Meeting Invitation
              </Typography>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Meeting Title
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {message.meetingTitle}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Date & Time
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {new Date(message.meetingTime!).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Meeting Type
                  </Typography>
                  <Chip
                    label={message.meetingType}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      bgcolor: `${getMeetingTypeColor(message.meetingType)}.light`,
                      color: `${getMeetingTypeColor(message.meetingType)}.main`,
                      mt: 0.5,
                    }}
                  />
                </Box>
                {message.meetingLink && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      Meeting Link
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25, flexWrap: 'wrap' }}>
                      <CombinedIcon name="Link" size={14} />
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
                        onClick={() => window.open(message.meetingLink, '_blank')}
                      >
                        {message.meetingLink}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => navigator.clipboard.writeText(message.meetingLink!)}
                        sx={{ padding: 0.25 }}
                      >
                        <CombinedIcon name="ContentCopy" size={14} />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                {message.status === 'pending' && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pt: 1 }}>
                    <Button2
                      variant="contained"
                      startIcon={<CombinedIcon name="Check" size={16} />}
                      onClick={() => onRespondToMeeting(message._id, 'accepted')}
                      sx={{ 
                        borderRadius: 1.5, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                        py: 0.5,
                        flex: 1,
                        minWidth: 100,
                      }}
                      size="small"
                    >
                      Accept
                    </Button2>
                    <Button2
                      variant="outlined"
                      color="error"
                      startIcon={<CombinedIcon name="Close" size={16} />}
                      onClick={() => onRespondToMeeting(message._id, 'declined')}
                      sx={{ 
                        borderRadius: 1.5, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                        py: 0.5,
                        flex: 1,
                        minWidth: 100,
                      }}
                      size="small"
                    >
                      Decline
                    </Button2>
                    {message.meetingLink && (
                      <Button2
                        variant="outlined"
                        startIcon={<CombinedIcon name="Videocam" size={16} />}
                        onClick={() => window.open(message.meetingLink, '_blank')}
                        sx={{ 
                          borderRadius: 1.5, 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                          py: 0.5,
                          flex: 1,
                          minWidth: 120,
                        }}
                        size="small"
                      >
                        Join Meeting
                      </Button2>
                    )}
                  </Box>
                )}
                {message.status === 'accepted' && (
                  <Box sx={{ pt: 1 }}>
                    <Chip
                      label="Accepted"
                      color="success"
                      size="small"
                      icon={<CombinedIcon name="CheckCircle" size={16} />}
                      sx={{ height: 24 }}
                    />
                  </Box>
                )}
                {message.status === 'declined' && (
                  <Box sx={{ pt: 1 }}>
                    <Chip
                      label="Declined"
                      color="error"
                      size="small"
                      icon={<CombinedIcon name="Cancel" size={16} />}
                      sx={{ height: 24 }}
                    />
                  </Box>
                )}
              </Stack>
            </CardContent2>
          </Card2>
        )}
      </CardContent2>

      {/* Message Content */}
      <CardContent2>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            mb: 3,
          }}
        >
          {message.content}
        </Typography>

        {message.attachments && message.attachments.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <CombinedIcon name="AttachFile" size={18} />
              Attachments ({message.attachments.length})
            </Typography>
            <Stack spacing={1}>
              {message.attachments.map((file, index) => (
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
                      <CombinedIcon name="PictureAsPdf" size={20} color="error" />
                    ) : file.type.includes('image') ? (
                      <CombinedIcon name="Image" size={20} color="primary" />
                    ) : file.type.includes('word') || file.type.includes('document') ? (
                      <CombinedIcon name="Description" size={20} color="info" />
                    ) : (
                      <CombinedIcon name="InsertDriveFile" size={20} />
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
                        {(file.size / 1024).toFixed(2)} KB • {file.type}
                      </Typography>
                    </Box>
                  </Box>
                  <Button2
                    size="small"
                    startIcon={<CombinedIcon name="Download" size={16} />}
                    onClick={() => window.open(file.url, '_blank')}
                    sx={{
                      borderRadius: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      py: 0.5,
                      minWidth: 100,
                    }}
                  >
                    Download
                  </Button2>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </CardContent2>

      {/* Message Actions */}
      <CardActions2 align="left">
        <Button2
          variant="outlined"
          startIcon={<CombinedIcon name="Reply" size={16} />}
          onClick={onReply}
          sx={{
            borderRadius: 1.5,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            py: 0.5,
            px: 2,
          }}
          size="small"
        >
          Reply
        </Button2>
        <Button2
          variant="outlined"
          startIcon={<CombinedIcon name="Forward" size={16} />}
          onClick={onForward}
          sx={{
            borderRadius: 1.5,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            py: 0.5,
            px: 2,
          }}
          size="small"
        >
          Forward
        </Button2>
        {message.type === 'meeting_invite' && message.meetingLink && message.status === 'accepted' && (
          <Button2
            variant="contained"
            startIcon={<CombinedIcon name="Videocam" size={16} />}
            onClick={() => window.open(message.meetingLink, '_blank')}
            sx={{
              borderRadius: 1.5,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: 0.5,
              px: 2,
            }}
            size="small"
          >
            Join Meeting
          </Button2>
        )}
      </CardActions2>
    </Card2>
  );
};

// Helper function for meeting type color
const getMeetingTypeColor = (type?: string) => {
  switch (type) {
    case 'internal': return 'primary';
    case 'client': return 'secondary';
    case 'partner': return 'success';
    case 'team': return 'warning';
    default: return 'default';
  }
};

// Helper function for alpha (transparency)
const alpha = (color: string, opacity: number) => {
  // This is a simplified version - you might want to use theme.palette.action.hover instead
  return color;
};
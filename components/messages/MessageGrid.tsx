"use client";

import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreIcon,
  Videocam as VideoIcon,
  Mail as MailIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import { Card } from '@/components/ui/Card';
import { Message } from '@/types/messages';

interface MessageGridProps {
  messages: Message[];
  loading: boolean;
  search: string;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, message: Message) => void;
  activeTab: number;
}

export const MessageGrid: React.FC<MessageGridProps> = ({
  messages,
  loading,
  search,
  onMenuOpen,
  activeTab,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return '#ea4335';
      case 'pending': return '#fbbc04';
      case 'accepted': return '#34a853';
      case 'declined': return '#ea4335';
      default: return darkMode ? '#9aa0a6' : '#5f6368';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting_invite': return <VideoIcon />;
      case 'direct_message': return <MailIcon />;
      case 'system_notification': return <NotificationIcon />;
      default: return <MailIcon />;
    }
  };

  if (loading) {
    return (
      <Card>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Loading messages...</Typography>
        </Box>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No messages found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {search ? 'Try a different search term' : 'Your inbox is empty'}
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {messages.map((message) => (
        <Card
          key={message._id}
          hover
          sx={{
            p: 2,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {/* Avatar/Icon */}
            <Avatar
              sx={{
                bgcolor: darkMode ? '#4285f4' : '#4285f4',
                color: 'white',
                width: 40,
                height: 40,
              }}
            >
              {getTypeIcon(message.type)}
            </Avatar>

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={message.status === 'unread' ? 600 : 400}
                    sx={{
                      color: darkMode ? '#e8eaed' : '#202124',
                      fontSize: '0.9rem',
                    }}
                  >
                    {message.subject}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: '0.8rem',
                      mt: 0.5,
                    }}
                  >
                    From: {message.senderName} ({message.senderEmail})
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={message.status}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getStatusColor(message.status), 0.1),
                      color: getStatusColor(message.status),
                      fontSize: '0.65rem',
                      height: '20px',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => onMenuOpen(e, message)}
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                </Box>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontSize: '0.8rem',
                  mt: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {message.content}
              </Typography>

              {/* Metadata */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {message.type === 'meeting_invite' && message.meetingType && (
                    <Chip
                      label={message.meetingType}
                      size="small"
                      sx={{
                        backgroundColor: alpha('#34a853', 0.1),
                        color: '#34a853',
                        fontSize: '0.65rem',
                        height: '20px',
                      }}
                    />
                  )}
                  {message.attachments && message.attachments.length > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: '0.7rem',
                      }}
                    >
                      📎 {message.attachments.length} file{message.attachments.length > 1 ? 's' : ''}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <IconButton size="small">
                    {message.isStarred ? (
                      <StarIcon sx={{ color: '#fbbc04', fontSize: '18px' }} />
                    ) : (
                      <StarBorderIcon sx={{ fontSize: '18px' }} />
                    )}
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: '0.7rem',
                    }}
                  >
                    {new Date(message.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
};
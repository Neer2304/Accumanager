"use client";

import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import { MessageListSkeleton } from '../ui/skeleton2';
import { CombinedIcon } from '../ui/icons2';
import { Badge2 } from '../ui/badge2';
import { Card2 } from '../ui/card2';
import { Message } from '@/types/messages';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  selectedMessageId: string | null;
  onMessageClick: (message: Message) => void;
  onToggleStar: (messageId: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, message: Message) => void;
  formatDate: (dateString: string) => string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  selectedMessageId,
  onMessageClick,
  onToggleStar,
  onMenuOpen,
  formatDate,
}) => {
  const theme = useTheme();

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting_invite': return 'Videocam';
      case 'direct_message': return 'Email';
      case 'system_notification': return 'Notifications';
      default: return 'Email';
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

  if (loading) {
    return (
      <Card2>
        <MessageListSkeleton count={5} />
      </Card2>
    );
  }

  if (messages.length === 0) {
    return (
      <Card2 sx={{ textAlign: 'center', py: 6 }}>
        <CombinedIcon name="MailOutline" size={48} sx={{ mb: 2, color: 'text.secondary' }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No messages found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your inbox is empty
        </Typography>
      </Card2>
    );
  }

  return (
    <Card2 sx={{ flex: 1, overflow: 'hidden' }}>
      <Box sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
        <List sx={{ p: 0 }}>
          {messages.map((message) => (
            <ListItem
              key={message._id}
              selected={selectedMessageId === message._id}
              onClick={() => onMessageClick(message)}
              sx={{
                cursor: 'pointer',
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
                <Badge2
                  variant="dot"
                  // color={message.status === 'unread' ? 'primary' : 'default'}
                  invisible={message.status !== 'unread'}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '0.875rem',
                    }}
                  >
                    <CombinedIcon
                      name={getMessageTypeIcon(message.type)}
                      size={16}
                      sx={{ color: 'white' }}
                    />
                  </Avatar>
                </Badge2>
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
                      <CombinedIcon name="LabelImportant" size={14} sx={{ color: '#f59e0b' }} />
                    )}
                    {message.type === 'meeting_invite' && message.meetingType && (
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
                        onToggleStar(message._id);
                      }}
                      sx={{ padding: 0.5 }}
                    >
                      {message.isStarred ? (
                        <CombinedIcon name="Star" size={16} sx={{ color: '#f59e0b' }} />
                      ) : (
                        <CombinedIcon name="StarBorder" size={16} />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => onMenuOpen(e, message)}
                      sx={{ padding: 0.5 }}
                    >
                      <CombinedIcon name="MoreVert" size={16} />
                    </IconButton>
                  </Box>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Card2>
  );
};
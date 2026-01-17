// app/components/user-side/meetings&notes/components/MeetingCard.tsx
"use client";

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  AvatarGroup,
  Avatar,
  CardContent,
  CardActions,
  Tooltip,
} from '@mui/material';
import {
  VideoCall,
  Share,
  Delete,
  Edit,
  People,
  Business,
  Groups,
  Person,
  CalendarToday,
  AccessTime,
  LocationOn,
} from '@mui/icons-material';
import { GlassCard } from '../common/GlassCard';
import { GradientButton } from '../common/GradientButton';
import { MeetingStatusChip } from '../common/MeetingStatusChip';
import { MeetingTypeChip } from '../common/MeetingTypeChip';
import type { Meeting } from '../types';

interface MeetingCardProps {
  meeting: Meeting;
  onJoin?: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
  onDelete?: (meeting: Meeting) => void;
  onShare?: (meeting: Meeting) => void;
  onInvite?: (meeting: Meeting) => void;
  compact?: boolean;
  showActions?: boolean;
}

export function MeetingCard({
  meeting,
  onJoin,
  onEdit,
  onDelete,
  onShare,
  onInvite,
  compact = false,
  showActions = true,
}: MeetingCardProps) {
  const getParticipantInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getParticipantColor = (index: number) => {
    const colors = [
      'primary.main',
      'secondary.main',
      'success.main',
      'warning.main',
      'error.main',
      'info.main',
    ];
    return colors[index % colors.length];
  };

  const formatMeetingTime = () => {
    const date = new Date(meeting.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    return `${formattedDate} • ${meeting.startTime} - ${meeting.endTime}`;
  };

  return (
    <GlassCard>
      <CardContent sx={{ p: compact ? 2 : 3 }}>
        {/* Header with status and type */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Stack direction="row" spacing={1}>
            <MeetingStatusChip status={meeting.status} />
            <MeetingTypeChip type={meeting.meetingType} />
          </Stack>
          
          {meeting.priority === 'high' && (
            <Chip
              label="High Priority"
              size="small"
              color="error"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>

        {/* Meeting Title and Description */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {meeting.title}
        </Typography>
        
        {meeting.description && !compact && (
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
            {meeting.description}
          </Typography>
        )}

        {/* Meeting Details */}
        <Stack spacing={1} sx={{ mb: compact ? 1 : 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday fontSize="small" color="action" />
            <Typography variant="body2">
              {formatMeetingTime()}
            </Typography>
          </Box>
          
          {meeting.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2">
                {meeting.location}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People fontSize="small" color="action" />
            <Typography variant="body2">
              {meeting.participants.length} participant{meeting.participants.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Stack>

        {/* Participants */}
        {!compact && meeting.participants.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Participants
            </Typography>
            <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
              {meeting.participants.slice(0, 5).map((email, index) => (
                <Tooltip key={email} title={email}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: 14,
                      bgcolor: getParticipantColor(index),
                    }}
                  >
                    {getParticipantInitials(email)}
                  </Avatar>
                </Tooltip>
              ))}
              {meeting.participants.length > 5 && (
                <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: 'grey.500' }}>
                  +{meeting.participants.length - 5}
                </Avatar>
              )}
            </AvatarGroup>
          </Box>
        )}

        {/* Tags */}
        {meeting.tags && meeting.tags.length > 0 && !compact && (
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {meeting.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
              {meeting.tags.length > 3 && (
                <Chip
                  label={`+${meeting.tags.length - 3}`}
                  size="small"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Stack>
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      {showActions && (
        <CardActions sx={{ 
          p: compact ? 1 : 2, 
          pt: 0,
          borderTop: 1, 
          borderColor: 'divider',
          justifyContent: 'space-between'
        }}>
          <Stack direction="row" spacing={compact ? 0.5 : 1}>
            {onJoin && (
              <Tooltip title="Join Meeting">
                <IconButton 
                  size="small" 
                  onClick={() => onJoin(meeting)}
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  <VideoCall fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {onShare && (
              <Tooltip title="Share Meeting">
                <IconButton 
                  size="small" 
                  onClick={() => onShare(meeting)}
                  sx={{ 
                    border: 1,
                    borderColor: 'primary.main',
                    color: 'primary.main'
                  }}
                >
                  <Share fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {onInvite && (
              <Tooltip title="Invite Participants">
                <IconButton 
                  size="small" 
                  onClick={() => onInvite(meeting)}
                  sx={{ 
                    border: 1,
                    borderColor: 'secondary.main',
                    color: 'secondary.main'
                  }}
                >
                  <People fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          <Stack direction="row" spacing={compact ? 0.5 : 1}>
            {onEdit && (
              <Tooltip title="Edit Meeting">
                <IconButton 
                  size="small" 
                  onClick={() => onEdit(meeting)}
                  sx={{ color: 'text.secondary' }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {onDelete && (
              <Tooltip title="Delete Meeting">
                <IconButton 
                  size="small" 
                  onClick={() => onDelete(meeting)}
                  sx={{ color: 'error.main' }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </CardActions>
      )}
    </GlassCard>
  );
}
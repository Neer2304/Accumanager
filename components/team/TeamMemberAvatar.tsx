import React from 'react';
import {
  Avatar,
  Badge,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';

interface TeamMemberAvatarProps {
  name: string;
  avatar?: string;
  status: 'active' | 'away' | 'offline';
  size?: number;
  showTooltip?: boolean;
  showName?: boolean;
}

export const TeamMemberAvatar: React.FC<TeamMemberAvatarProps> = ({
  name,
  avatar,
  status,
  size = 40,
  showTooltip = true,
  showName = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'away': return '#f59e0b';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const avatarContent = (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: getStatusColor(status),
          color: getStatusColor(status),
          boxShadow: `0 0 0 2px white`,
          '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: status === 'active' ? 'ripple 1.2s infinite ease-in-out' : 'none',
            border: `1px solid ${getStatusColor(status)}`,
            content: '""',
          },
        },
        '@keyframes ripple': {
          '0%': {
            transform: 'scale(.8)',
            opacity: 1,
          },
          '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
          },
        },
      }}
    >
      <Avatar
        src={avatar}
        sx={{
          width: size,
          height: size,
          bgcolor: 'primary.main',
          fontSize: size * 0.4,
        }}
      >
        {name.split(' ').map(n => n[0]).join('').toUpperCase()}
      </Avatar>
    </Badge>
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {showTooltip ? (
        <Tooltip 
          title={`${name} - ${getStatusLabel(status)}`}
          arrow
        >
          {avatarContent}
        </Tooltip>
      ) : (
        avatarContent
      )}
      {showName && (
        <Typography variant="body2" noWrap>
          {name}
        </Typography>
      )}
    </Box>
  );
};
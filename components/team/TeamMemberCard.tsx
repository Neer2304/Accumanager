import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import { Person, AccessTime } from '@mui/icons-material';

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  currentProjects: string[];
  lastActive: string;
  status: 'active' | 'away' | 'offline';
}

interface TeamMemberCardProps {
  members: TeamMember[];
  title?: string;
  showCount?: boolean;
  autoRefresh?: boolean;
  onAutoRefreshChange?: (checked: boolean) => void;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  members,
  title = 'Team Members',
  showCount = true,
  autoRefresh = false,
  onAutoRefreshChange,
}) => {
  const theme = useTheme();

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'away': return theme.palette.warning.main;
      case 'offline': return theme.palette.grey[500];
      default: return theme.palette.grey[500];
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            {title} {showCount && `(${members.length})`}
          </Typography>
        </Box>
        
        {members.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No team members found
          </Typography>
        ) : (
          <List sx={{ maxHeight: 500, overflow: 'auto' }}>
            {members.map((member, index) => (
              <React.Fragment key={member._id}>
                {index > 0 && <Divider variant="inset" component="li" />}
                <ListItem>
                  <ListItemAvatar>
                    <Avatar 
                      src={member.avatar} 
                      sx={{ 
                        bgcolor: 'primary.main',
                        width: 48,
                        height: 48
                      }}
                    >
                      {member.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {member.name}
                        </Typography>
                        <Chip
                          label={member.status}
                          size="small"
                          sx={{
                            bgcolor: alpha(getStatusColor(member.status), 0.1),
                            color: getStatusColor(member.status),
                            border: `1px solid ${alpha(getStatusColor(member.status), 0.2)}`,
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {member.role}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <AccessTime fontSize="small" sx={{ fontSize: 14 }} />
                          <Typography variant="caption" color="text.secondary">
                            Last active: {formatDate(member.lastActive)} at {formatTime(member.lastActive)}
                          </Typography>
                        </Box>
                        {member.currentProjects.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Active Projects:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {member.currentProjects.slice(0, 3).map((project, idx) => (
                                <Chip
                                  key={idx}
                                  label={project}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20 }}
                                />
                              ))}
                              {member.currentProjects.length > 3 && (
                                <Chip
                                  label={`+${member.currentProjects.length - 3} more`}
                                  size="small"
                                  sx={{ height: 20 }}
                                />
                              )}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
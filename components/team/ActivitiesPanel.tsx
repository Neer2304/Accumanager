import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh, Add } from '@mui/icons-material';
import { ActivityItem, ActivityType } from './ActivityItem';

export interface TeamActivity {
  _id: string;
  userId: string;
  userName: string;
  type: ActivityType;
  description: string;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskName?: string;
  timestamp: string;
  metadata: any;
}

interface ActivitiesPanelProps {
  activities: TeamActivity[];
  title?: string;
  maxHeight?: number;
  onRefresh?: () => void;
  loading?: boolean;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export const ActivitiesPanel: React.FC<ActivitiesPanelProps> = ({
  activities,
  title = 'Recent Activities',
  maxHeight = 500,
  onRefresh,
  loading = false,
  showAddButton = false,
  onAddClick,
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {onRefresh && (
              <Tooltip title="Refresh">
                <IconButton 
                  size="small" 
                  onClick={onRefresh} 
                  disabled={loading}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {showAddButton && onAddClick && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                onClick={onAddClick}
              >
                Add Activity
              </Button>
            )}
          </Box>
        </Box>
        
        <List sx={{ maxHeight, overflow: 'auto' }}>
          {activities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No activities yet
              </Typography>
              {showAddButton && onAddClick && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Add />}
                  onClick={onAddClick}
                  sx={{ mt: 1 }}
                >
                  Start tracking
                </Button>
              )}
            </Box>
          ) : (
            activities.map((activity) => (
              <ActivityItem
                key={activity._id}
                id={activity._id}
                userName={activity.userName}
                type={activity.type}
                description={activity.description}
                projectName={activity.projectName}
                taskName={activity.taskName}
                timestamp={activity.timestamp}
                metadata={activity.metadata}
              />
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
};
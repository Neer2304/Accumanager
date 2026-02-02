// utils/activityUtils.tsx
import React from 'react';
import {
  Task,
  TrendingUp,
  Person,
  CheckCircle,
  Videocam,
  Coffee,
  Computer,
  Phone,
  Email,
  CalendarToday,
  Group,
  Assignment,
  Notifications,
  Star,
  Build,
  Code,
  DesignServices,
  Cloud,
  Security,
  Analytics,
  Chat,
  Download,
  Upload,
  Edit,
  Delete,
  Add,
  Remove,
  Sync,
  Warning,
  Error,
  Info,
  Done,
  Schedule,
  AccessTime,
  LocationOn,
  Link,
  Attachment,
  Image,
  Description,
  Folder,
  Archive,
  Share,
  ThumbUp,
  Comment,
  Flag,
  Bookmark,
} from '@mui/icons-material';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type ActivityIconType = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string;
};

export const getActivityIcon = (type: string): React.ReactElement => {
  const iconProps = {
    color: 'primary' as const,
    fontSize: 'small' as const,
  };

  const iconMap: Record<string, ActivityIconType> = {
    // Task related
    'task_update': Task,
    'task_completed': CheckCircle,
    'task_created': Add,
    'task_deleted': Delete,
    'task_edited': Edit,
    
    // Project related
    'project_update': TrendingUp,
    'project_created': Add,
    'project_completed': Done,
    'project_archived': Archive,
    
    // Status related
    'status_change': Person,
    'login': CheckCircle,
    'logout': Remove,
    
    // Meeting related
    'meeting': Videocam,
    'meeting_created': CalendarToday,
    'meeting_updated': Edit,
    'meeting_cancelled': Remove,
    
    // Communication
    'message': Chat,
    'email': Email,
    'comment': Comment,
    'notification': Notifications,
    
    // File operations
    'file_upload': Upload,
    'file_download': Download,
    'file_edited': Edit,
    'file_deleted': Delete,
    
    // Team related
    'team_join': PersonAdd,
    'team_leave': PersonRemove,
    'role_change': Security,
    
    // Development
    'code_commit': Code,
    'deployment': Cloud,
    'build': Build,
    'test': CheckCircle,
    
    // Design
    'design_created': DesignServices,
    'design_updated': Edit,
    'design_approved': ThumbUp,
    
    // Analytics
    'report_generated': Analytics,
    'insight_created': Analytics,
    
    // System
    'system_update': Sync,
    'backup': Cloud,
    'maintenance': Build,
    
    // Approval
    'approval_granted': CheckCircle,
    'approval_denied': Error,
    'approval_requested': Notifications,
    
    // Default
    'default': Notifications,
  };

  const IconComponent = iconMap[type] || Notifications;
  
  // Special color handling for different types
  let color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'action' = 'primary';
  
  if (type.includes('completed') || type.includes('approved') || type.includes('granted')) {
    color = 'success';
  } else if (type.includes('error') || type.includes('denied') || type.includes('deleted')) {
    color = 'error';
  } else if (type.includes('warning')) {
    color = 'warning';
  } else if (type.includes('info') || type.includes('notification')) {
    color = 'info';
  } else if (type.includes('meeting') || type.includes('schedule')) {
    color = 'secondary';
  }

  return <IconComponent color={color} fontSize="small" />;
};

export const getActivityColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    'task_completed': '#4caf50',
    'task_update': '#2196f3',
    'project_update': '#9c27b0',
    'meeting': '#ff9800',
    'login': '#4caf50',
    'error': '#f44336',
    'warning': '#ff9800',
    'info': '#2196f3',
    'default': '#757575',
  };

  for (const [key, color] of Object.entries(colorMap)) {
    if (type.includes(key)) {
      return color;
    }
  }
  
  return colorMap.default;
};

export const getActivityLabel = (type: string): string => {
  const labelMap: Record<string, string> = {
    'task_update': 'Task Updated',
    'task_completed': 'Task Completed',
    'task_created': 'Task Created',
    'project_update': 'Project Updated',
    'status_change': 'Status Changed',
    'login': 'User Login',
    'meeting': 'Meeting',
    'meeting_created': 'Meeting Created',
    'message': 'Message Sent',
    'file_upload': 'File Uploaded',
    'file_download': 'File Downloaded',
    'code_commit': 'Code Committed',
    'deployment': 'Deployment',
    'design_created': 'Design Created',
    'report_generated': 'Report Generated',
    'system_update': 'System Updated',
    'approval_granted': 'Approval Granted',
    'team_join': 'Team Member Joined',
    'team_leave': 'Team Member Left',
  };

  for (const [key, label] of Object.entries(labelMap)) {
    if (type.includes(key)) {
      return label;
    }
  }
  
  return 'Activity';
};

export const getActivityPoints = (type: string): number => {
  const pointsMap: Record<string, number> = {
    'task_completed': 5,
    'project_update': 3,
    'meeting': 2,
    'code_commit': 4,
    'design_created': 3,
    'report_generated': 2,
    'file_upload': 1,
    'default': 1,
  };

  for (const [key, points] of Object.entries(pointsMap)) {
    if (type.includes(key)) {
      return points;
    }
  }
  
  return pointsMap.default;
};

// Helper function to determine if activity is important
export const isImportantActivity = (type: string): boolean => {
  const importantTypes = [
    'task_completed',
    'project_update',
    'meeting',
    'code_commit',
    'deployment',
    'system_update',
    'approval_granted',
  ];
  
  return importantTypes.some(importantType => type.includes(importantType));
};

// Helper function to get activity category
export const getActivityCategory = (type: string): string => {
  if (type.includes('task')) return 'Tasks';
  if (type.includes('project')) return 'Projects';
  if (type.includes('meeting')) return 'Meetings';
  if (type.includes('file')) return 'Files';
  if (type.includes('code')) return 'Development';
  if (type.includes('design')) return 'Design';
  if (type.includes('system')) return 'System';
  if (type.includes('login') || type.includes('logout')) return 'Authentication';
  return 'General';
};

// Note: You need to import PersonAdd and PersonRemove or use alternatives
// If you don't have these icons, you can use:
import { PersonAdd as PersonAddIcon, PersonRemove as PersonRemoveIcon } from '@mui/icons-material';

const PersonAdd = PersonAddIcon;
const PersonRemove = PersonRemoveIcon;
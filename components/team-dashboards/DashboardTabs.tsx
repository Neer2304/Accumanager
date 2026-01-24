// components/team-dashboard/DashboardTabs.tsx
import { Box, Tabs, Tab, Chip, Badge, Tooltip, useTheme, Typography } from '@mui/material';
import {
  Person,
  AssignmentTurnedIn,
  BarChart,
  Groups,
  Timeline,
  Settings,
  Notifications,
  Dashboard
} from '@mui/icons-material';
import { TabItem } from './types';

interface DashboardTabsProps {
  tabs: TabItem[];
  selectedTab: number;
  onTabChange: (value: number) => void;
  showBadges?: boolean;
  notificationCounts?: Record<number, number>;
}

export const DashboardTabs = ({
  tabs,
  selectedTab,
  onTabChange,
  showBadges = false,
  notificationCounts = {}
}: DashboardTabsProps) => {
  const theme = useTheme();

  const getTabIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'person':
      case 'people':
      case 'team':
        return <Person />;
      case 'assignment':
      case 'tasks':
      case 'assignmentturnedin':
        return <AssignmentTurnedIn />;
      case 'barchart':
      case 'analytics':
      case 'performance':
        return <BarChart />;
      case 'groups':
        return <Groups />;
      case 'timeline':
        return <Timeline />;
      case 'settings':
        return <Settings />;
      case 'notifications':
        return <Notifications />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  const getTabColor = (index: number) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.secondary.main
    ];
    return colors[index % colors.length];
  };

  return (
    <Box sx={{ 
      borderBottom: 1, 
      borderColor: 'divider', 
      mb: 4,
      position: 'relative'
    }}>
      {/* Active Tab Indicator Background */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '100%',
        width: `${100 / tabs.length}%`,
        background: `linear-gradient(90deg, ${getTabColor(selectedTab)}10 0%, transparent 100%)`,
        transform: `translateX(${selectedTab * 100}%)`,
        transition: 'transform 0.3s ease',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
      }} />
      
      <Tabs 
        value={selectedTab} 
        onChange={(_, value) => onTabChange(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
            background: `linear-gradient(90deg, ${getTabColor(selectedTab)} 0%, ${getTabColor(selectedTab)}80 100%)`,
            boxShadow: `0 2px 8px ${getTabColor(selectedTab)}40`
          },
          '& .MuiTab-root': {
            minHeight: 60,
            fontSize: '0.95rem',
            fontWeight: 500,
            textTransform: 'none',
            position: 'relative',
            '&:hover': {
              color: getTabColor(selectedTab),
              '& .tab-icon': {
                transform: 'scale(1.1)'
              }
            },
            '&.Mui-selected': {
              color: getTabColor(selectedTab),
              fontWeight: 'bold',
              '& .tab-icon': {
                transform: 'scale(1.1)',
                filter: `drop-shadow(0 2px 4px ${getTabColor(selectedTab)}40)`
              }
            }
          }
        }}
      >
        {tabs.map((tab, index) => {
          const notificationCount = notificationCounts[index] || 0;
          const isSelected = selectedTab === index;
          
          return (
            <Tab
              key={index}
              icon={
                <Tooltip title={tab.label} arrow>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    position: 'relative'
                  }}>
                    <Badge
                      badgeContent={showBadges && notificationCount > 0 ? notificationCount : 0}
                      color="error"
                      max={99}
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.6rem',
                          height: 18,
                          minWidth: 18,
                          top: -8,
                          right: -8
                        }
                      }}
                    >
                      <Box 
                        className="tab-icon"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: isSelected 
                            ? `linear-gradient(135deg, ${getTabColor(index)} 0%, ${getTabColor(index)}80 100%)`
                            : 'transparent',
                          color: isSelected ? 'white' : 'text.secondary',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {getTabIcon(tab.icon)}
                      </Box>
                    </Badge>
                    
                    {/* Version badges for specific tabs */}
                    {tab.label.includes('Overview') && (
                      <Chip
                        label="v1.0"
                        size="small"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -12,
                          fontSize: '0.55rem',
                          height: 16
                        }}
                      />
                    )}
                    
                    {tab.label.includes('Performance') && (
                      <Chip
                        label="Beta"
                        size="small"
                        color="warning"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -12,
                          fontSize: '0.55rem',
                          height: 16
                        }}
                      />
                    )}
                  </Box>
                </Tooltip>
              }
              label={
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  ml: 1
                }}>
                  {tab.label}
                  {isSelected && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: getTabColor(index),
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.3 },
                          '100%': { opacity: 1 }
                        }
                      }}
                    />
                  )}
                </Box>
              }
              iconPosition="start"
              sx={{ 
                px: 3,
                py: 1.5
              }}
            />
          );
        })}
      </Tabs>

      {/* Quick Stats Bar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: 2,
        mt: 1,
        px: 2
      }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: Just now
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label="Auto-save: ON"
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
          <Chip
            label="Live Data"
            size="small"
            color="info"
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
        </Box>
      </Box>
    </Box>
  );
};
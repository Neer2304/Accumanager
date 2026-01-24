import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface EmployeeHeaderProps {
  employee: {
    _id: string;
    name: string;
    role: string;
    department?: string;
    isActive: boolean;
  };
  refreshing: boolean;
  onRefresh: () => void;
  onMenuClick?: () => void;
  isMobile: boolean;
}

const getAvatarColor = (name: string) => {
  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  employee,
  refreshing,
  onRefresh,
  onMenuClick,
  isMobile,
}) => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
      {/* Mobile Header */}
      {isMobile && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/attendance")}
            size="small"
            sx={{ minWidth: 'auto' }}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onMenuClick && (
              <IconButton size="small" onClick={onMenuClick}>
                <MenuIcon />
              </IconButton>
            )}
            <IconButton size="small" onClick={onRefresh} disabled={refreshing}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Main Header */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between", 
        alignItems: { xs: "flex-start", sm: "center" },
        gap: { xs: 2, sm: 3 },
        mb: 3,
      }}>
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 2,
          width: { xs: '100%', sm: 'auto' }
        }}>
          {!isMobile && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/attendance")}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ flexShrink: 0 }}
            >
              Back
            </Button>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flex: 1,
          }}>
            <Avatar
              sx={{
                width: { xs: 60, sm: 70, md: 80 },
                height: { xs: 60, sm: 70, md: 80 },
                bgcolor: getAvatarColor(employee.name),
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 'bold',
                border: `3px solid ${theme.palette.background.paper}`,
                boxShadow: 2,
              }}
            >
              {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                component="h1" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {employee.name}
              </Typography>
              <Box sx={{ 
                display: "flex", 
                gap: 1, 
                flexWrap: "wrap",
                alignItems: 'center',
              }}>
                <Chip
                  label={employee.role}
                  color="primary"
                  size="small"
                  sx={{ height: 24 }}
                />
                {employee.department && (
                  <Chip
                    label={employee.department}
                    color="secondary"
                    variant="outlined"
                    size="small"
                    sx={{ height: 24 }}
                  />
                )}
                <Chip
                  label={employee.isActive ? "Active" : "Inactive"}
                  color={employee.isActive ? "success" : "default"}
                  variant="outlined"
                  size="small"
                  sx={{ height: 24 }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={onRefresh} 
                disabled={refreshing}
                size={isMobile ? "small" : "medium"}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={() => router.push(`/attendance/edit/${employee._id}`)}
              size={isMobile ? "small" : "medium"}
            >
              Edit
            </Button>
          </Box>
        )}
      </Box>

      {/* Mobile Action Buttons */}
      {isMobile && (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mb: 2 }}>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            onClick={() => router.push(`/attendance/edit/${employee._id}`)}
            size="small"
            fullWidth
          >
            Edit Profile
          </Button>
        </Box>
      )}
    </Box>
  );
};
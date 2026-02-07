import React from 'react';
import {
  Typography,
  Box,
  alpha,
} from '@mui/material';
import {
  Dataset,
  Api,
  Storage,
  Security,
  Cloud,
  NetworkCheck,
} from '@mui/icons-material';
import { StatusChip } from './StatusChip';
import { ResourceProgress } from './ResourceProgress';
import { Card } from '@/components/ui/Card';

export type ServiceType = 'database' | 'api' | 'storage' | 'authentication' | 'cache';

interface ServiceResource {
  cpu: number;
  memory: number;
  disk: number;
}

interface ServiceDetails {
  connectionState?: string;
  userDocuments?: number;
  estimatedUsage?: string;
  [key: string]: any;
}

interface ServiceCardProps {
  id: string;
  name: string;
  type: ServiceType;
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  responseTime: number;
  uptime: number;
  resources: ServiceResource;
  lastChecked: string;
  details?: ServiceDetails;
  onClick?: () => void;
  sx?: any;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  type,
  status,
  responseTime,
  uptime,
  resources,
  lastChecked,
  details,
  onClick,
  sx = {},
}) => {
  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case 'database': return <Dataset />;
      case 'api': return <Api />;
      case 'storage': return <Storage />;
      case 'authentication': return <Security />;
      case 'cache': return <Cloud />;
      default: return <NetworkCheck />;
    }
  };

  const getServiceColor = (type: ServiceType) => {
    switch (type) {
      case 'database': return '#4285f4'; // Google Blue
      case 'api': return '#34a853'; // Google Green
      case 'storage': return '#fbbc04'; // Google Yellow
      case 'authentication': return '#ea4335'; // Google Red
      case 'cache': return '#8ab4f8'; // Light Blue
      default: return '#9aa0a6'; // Gray
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#34a853'; // Green
      case 'degraded': return '#fbbc04'; // Yellow
      case 'down': return '#ea4335'; // Red
      case 'maintenance': return '#8ab4f8'; // Blue
      default: return '#9aa0a6'; // Gray
    }
  };

  const serviceColor = getServiceColor(type);
  const statusColor = getStatusColor(status);

  return (
    <Card
      hover
      onClick={onClick}
      sx={{
        height: '100%',
        backgroundColor: (theme: any) => 
          theme.palette.mode === 'dark' ? '#202124' : '#ffffff',
        border: `1px solid ${alpha(serviceColor, 0.2)}`,
        background: (theme: any) => 
          theme.palette.mode === 'dark' 
            ? `linear-gradient(135deg, ${alpha(serviceColor, 0.1)} 0%, ${alpha(serviceColor, 0.05)} 100%)`
            : `linear-gradient(135deg, ${alpha(serviceColor, 0.08)} 0%, ${alpha(serviceColor, 0.03)} 100%)`,
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': { 
          transform: onClick ? 'translateY(-4px)' : 'none', 
          boxShadow: `0 8px 24px ${alpha(serviceColor, 0.15)}`,
          borderColor: serviceColor,
        },
        ...sx,
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header with Service Icon and Status */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Box sx={{ 
            p: 1.5,
            borderRadius: '10px',
            backgroundColor: alpha(serviceColor, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: serviceColor,
          }}>
            {getServiceIcon(type)}
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              mb: 0.5,
            }}>
              <Typography 
                variant="subtitle1" 
                fontWeight={600}
                sx={{ 
                  color: (theme: any) => 
                    theme.palette.mode === 'dark' ? '#e8eaed' : '#202124',
                }}
              >
                {name}
              </Typography>
              <StatusChip 
                status={status} 
                size="small" 
                sx={{ 
                  backgroundColor: alpha(statusColor, 0.1),
                  color: statusColor,
                  borderColor: alpha(statusColor, 0.3),
                }}
              />
            </Box>
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: (theme: any) => 
                  theme.palette.mode === 'dark' ? '#9aa0a6' : '#5f6368',
                textTransform: 'capitalize',
              }}
            >
              {type}
            </Typography>
          </Box>
        </Box>

        {/* Performance Metrics */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5,
          mb: 2,
        }}>
          <Box sx={{ 
            p: 1.5,
            borderRadius: '8px',
            backgroundColor: (theme: any) => 
              theme.palette.mode === 'dark' ? '#303134' : '#f8f9fa',
            border: `1px solid ${(theme: any) => 
              theme.palette.mode === 'dark' ? '#3c4043' : '#dadce0'}`,
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: (theme: any) => 
                  theme.palette.mode === 'dark' ? '#9aa0a6' : '#5f6368',
                display: 'block',
                mb: 0.5,
              }}
            >
              Response Time
            </Typography>
            <Typography 
              variant="body2" 
              fontWeight={600}
              sx={{ 
                color: responseTime < 100 ? '#34a853' : 
                      responseTime < 300 ? '#fbbc04' : '#ea4335',
              }}
            >
              {responseTime}ms
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 1.5,
            borderRadius: '8px',
            backgroundColor: (theme: any) => 
              theme.palette.mode === 'dark' ? '#303134' : '#f8f9fa',
            border: `1px solid ${(theme: any) => 
              theme.palette.mode === 'dark' ? '#3c4043' : '#dadce0'}`,
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: (theme: any) => 
                  theme.palette.mode === 'dark' ? '#9aa0a6' : '#5f6368',
                display: 'block',
                mb: 0.5,
              }}
            >
              Uptime
            </Typography>
            <Typography 
              variant="body2" 
              fontWeight={600}
              sx={{ 
                color: uptime > 99.9 ? '#34a853' : 
                      uptime > 99.5 ? '#fbbc04' : '#ea4335',
              }}
            >
              {uptime}%
            </Typography>
          </Box>
        </Box>

        {/* Details Section */}
        {details && (
          <Box sx={{ 
            mb: 2,
            p: 1.5,
            borderRadius: '8px',
            backgroundColor: alpha(serviceColor, 0.05),
            border: `1px solid ${alpha(serviceColor, 0.1)}`,
          }}>
            {details.connectionState && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: (theme: any) => 
                    theme.palette.mode === 'dark' ? '#e8eaed' : '#202124',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                Status: <span style={{ color: serviceColor, fontWeight: 500 }}>
                  {details.connectionState}
                </span>
              </Typography>
            )}
            {details.userDocuments && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: (theme: any) => 
                    theme.palette.mode === 'dark' ? '#9aa0a6' : '#5f6368',
                  display: 'block',
                }}
              >
                Your Documents: <span style={{ fontWeight: 500 }}>{details.userDocuments}</span>
              </Typography>
            )}
            {details.estimatedUsage && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: (theme: any) => 
                    theme.palette.mode === 'dark' ? '#9aa0a6' : '#5f6368',
                  display: 'block',
                }}
              >
                Usage: <span style={{ fontWeight: 500 }}>{details.estimatedUsage}</span>
              </Typography>
            )}
          </Box>
        )}

        {/* Resource Usage */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: (theme: any) => 
                theme.palette.mode === 'dark' ? '#9aa0a6' : '#5f6368',
              display: 'block',
              mb: 1.5,
            }}
          >
            Resource Usage
          </Typography>
          <ResourceProgress label="CPU" value={resources.cpu} />
          <ResourceProgress label="Memory" value={resources.memory} />
          <ResourceProgress label="Disk" value={resources.disk} />
        </Box>

        {/* Footer */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pt: 1.5,
          borderTop: `1px solid ${(theme: any) => 
            theme.palette.mode === 'dark' ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: (theme: any) => 
                theme.palette.mode === 'dark' ? '#9aa0a6' : '#5f6368',
            }}
          >
            Last checked
          </Typography>
          <Typography 
            variant="caption" 
            fontWeight={500}
            sx={{ 
              color: (theme: any) => 
                theme.palette.mode === 'dark' ? '#e8eaed' : '#202124',
            }}
          >
            {formatDate(lastChecked)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  ListItemIcon,
  alpha,
  useTheme,
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
}) => {
  const theme = useTheme();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        background: 'background.paper',
        transition: 'all 0.3s',
        '&:hover': {
          transform: onClick ? 'translateY(-2px)' : 'none',
          boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
          cursor: onClick ? 'pointer' : 'default',
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
            {getServiceIcon(type)}
          </ListItemIcon>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
            {name}
          </Typography>
          <StatusChip status={status} size="small" />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Response Time: <strong>{responseTime}ms</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Uptime: <strong>{uptime}%</strong>
          </Typography>
          {details && (
            <>
              {details.connectionState && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Status: {details.connectionState}
                </Typography>
              )}
              {details.userDocuments && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Your Documents: {details.userDocuments}
                </Typography>
              )}
              {details.estimatedUsage && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Usage: {details.estimatedUsage}
                </Typography>
              )}
            </>
          )}
          <Typography variant="caption" color="text.secondary" display="block">
            Last checked: {formatDate(lastChecked)}
          </Typography>
        </Box>

        {/* Resource Usage */}
        <Box sx={{ mt: 2 }}>
          <ResourceProgress label="CPU" value={resources.cpu} />
          <ResourceProgress label="Memory" value={resources.memory} />
          <ResourceProgress label="Disk" value={resources.disk} />
        </Box>
      </CardContent>
    </Card>
  );
};
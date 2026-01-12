import React from 'react';
import { Chip, ChipProps } from '@mui/material';

type StatusType = 
  | 'active' 
  | 'inactive' 
  | 'draft' 
  | 'published' 
  | 'pending' 
  | 'approved' 
  | 'rejected'
  | 'warning'
  | 'error'
  | 'info'
  | 'success';

interface StatusChipProps extends ChipProps {
  status: StatusType;
  label?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({
  status,
  label,
  ...props
}) => {
  const getStatusConfig = () => {
    const config = {
      color: 'default' as ChipProps['color'],
      icon: null as React.ReactNode,
      text: '',
    };

    switch (status) {
      case 'active':
      case 'published':
      case 'approved':
      case 'success':
        config.color = 'success';
        config.text = 'Active';
        break;
      case 'inactive':
      case 'draft':
        config.color = 'default';
        config.text = 'Inactive';
        break;
      case 'pending':
        config.color = 'warning';
        config.text = 'Pending';
        break;
      case 'rejected':
      case 'error':
        config.color = 'error';
        config.text = 'Rejected';
        break;
      case 'warning':
        config.color = 'warning';
        config.text = 'Warning';
        break;
      case 'info':
        config.color = 'info';
        config.text = 'Info';
        break;
      default:
        config.color = 'default';
        config.text = 'Unknown';
    }

    return config;
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={label || config.text}
      color={config.color}
      size="small"
      sx={{
        fontWeight: 600,
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default StatusChip;
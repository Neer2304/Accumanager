import React from 'react';
import {
  TableRow,
  TableCell,
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Phone,
  Email,
  Business,
  LocationOn,
  Receipt,
  MoreVert,
} from '@mui/icons-material';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  isInterState: boolean;
  totalOrders: number;
  city?: string;
  state?: string;
  gstin?: string;
}

interface CustomerTableRowProps {
  customer: Customer;
  onMenuClick: (event: React.MouseEvent<HTMLElement>, customer: Customer) => void;
  isMobile: boolean;
  isDesktop: boolean;
}

export const CustomerTableRow: React.FC<CustomerTableRowProps> = ({
  customer,
  onMenuClick,
  isMobile,
  isDesktop,
}) => {
  const getAvatarColor = (name: string) => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <TableRow hover>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              bgcolor: getAvatarColor(customer.name),
              fontSize: isMobile ? '0.9rem' : '1rem',
              fontWeight: 'bold',
            }}
          >
            {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant={isMobile ? "body2" : "subtitle2"} fontWeight="bold" noWrap>
              {customer.name || 'N/A'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <Phone sx={{ fontSize: 12, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {customer.phone || 'N/A'}
              </Typography>
            </Box>
            {isMobile && customer.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Email sx={{ fontSize: 12, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {customer.email}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </TableCell>

      {!isMobile && (
        <TableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2">{customer.phone || 'N/A'}</Typography>
            </Box>
            {customer.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {customer.email}
                </Typography>
              </Box>
            )}
          </Box>
        </TableCell>
      )}

      <TableCell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {customer.company && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Business sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant={isMobile ? "caption" : "body2"} noWrap>
                {customer.company}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={customer.isInterState ? 'Inter-State' : 'Intra-State'}
              color={customer.isInterState ? 'primary' : 'default'}
              size="small"
              sx={{ height: 20 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Receipt sx={{ fontSize: 12, color: 'text.secondary' }} />
              <Typography variant="caption">
                {customer.totalOrders || 0} orders
              </Typography>
            </Box>
          </Box>
        </Box>
      </TableCell>

      {isDesktop && (
        <TableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2">
                {customer.city || customer.state || 'N/A'}
              </Typography>
            </Box>
            {customer.gstin && (
              <Typography variant="caption" color="text.secondary">
                GST: {customer.gstin}
              </Typography>
            )}
          </Box>
        </TableCell>
      )}

      <TableCell align="right">
        <Tooltip title="More actions">
          <IconButton
            size="small"
            onClick={(e) => onMenuClick(e, customer)}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};